import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX, Repeat, ListMusic, Flag, Scissors, Upload, Music2, Gauge, TimerReset } from "lucide-react";

/**
 * CustomAudioPlayer
 * -------------------------------------------------------
 * A production-ready, highly customizable audio player built with React + Web Audio API.
 *
 * Highlights
 * - Waveform seek bar rendered via Canvas (decoded with WebAudio, independent of playback)
 * - Playlist with metadata (title, artist, artwork)
 * - Chapters (click markers to jump)
 * - A/B loop (set in/out points, loop between)
 * - Variable speed (0.5x - 2.0x, pitch preserved by default)
 * - Keyboard shortcuts (Space/←/→, [ and ] for A/B in/out, L loop, M mute)
 * - Media Session API integration (OS-level media keys, lock screen artwork)
 * - Optional simple 3-band EQ (bass/mid/treble)
 * - Persist volume/speed/loop state in localStorage
 * - Accessible (labels, focus styles, large hit targets)
 *
 * Usage
 * <CustomAudioPlayer
 *    tracks=[{
 *      url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a6f.mp3?filename=ambient-12345.mp3",
 *      title: "Ambient Example",
 *      artist: "Sample Artist",
 *      artwork: "https://picsum.photos/seed/ambient/400/400",
 *      chapters: [ { time: 0, label: "Intro" }, { time: 32.5, label: "Theme" }, { time: 64.2, label: "Break" } ]
 *    }]
 * />
 *
 * Notes
 * - Audio files must be served with CORS headers to allow decoding/drawing the waveform.
 * - If decoding fails, the player gracefully falls back to a standard progress bar.
 */

// -------- Types --------
export type Chapter = { time: number; label: string };
export type Track = {
  url: string;
  title: string;
  artist?: string;
  artwork?: string;
  chapters?: Chapter[];
};

export type CustomAudioPlayerProps = {
  tracks?: Track[];
  autoPlay?: boolean;
  theme?: "dark" | "light";
};

// -------- Utilities --------
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
const fmtTime = (sec: number) => {
  if (!isFinite(sec)) return "0:00";
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(sec / 60);
  return `${m}:${s}`;
};

const useLocalStorage = <T,>(key: string, initial: T) => {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState] as const;
};

// -------- Component --------
export default function CustomAudioPlayer({ tracks = [], autoPlay = false, theme = "dark" }: CustomAudioPlayerProps) {
  const [index, setIndex] = useState(0);
  const track = tracks[index];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [seeking, setSeeking] = useState(false);

  const [volume, setVolume] = useLocalStorage<number>("cap:volume", 0.9);
  const [muted, setMuted] = useLocalStorage<boolean>("cap:muted", false);
  const [rate, setRate] = useLocalStorage<number>("cap:rate", 1.0);

  const [loopAB, setLoopAB] = useLocalStorage<{ a: number | null; b: number | null; enabled: boolean }>("cap:loopAB", { a: null, b: null, enabled: false });

  const [peaks, setPeaks] = useState<Float32Array | null>(null);
  const [audioCtx, setAudioCtx] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<MediaElementAudioSourceNode | null>(null);
  const [eqNodes, setEqNodes] = useState<{ low: BiquadFilterNode; mid: BiquadFilterNode; high: BiquadFilterNode } | null>(null);
  const [eqGains, setEqGains] = useLocalStorage<{ low: number; mid: number; high: number }>("cap:eq", { low: 0, mid: 0, high: 0 });

  // Create AudioContext graph lazily
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const src = ctx.createMediaElementSource(audio);

    // EQ: three band shelves/peaks
    const low = ctx.createBiquadFilter();
    low.type = "lowshelf"; low.frequency.value = 120; low.gain.value = eqGains.low;

    const mid = ctx.createBiquadFilter();
    mid.type = "peaking"; mid.frequency.value = 1000; mid.Q.value = 1.0; mid.gain.value = eqGains.mid;

    const high = ctx.createBiquadFilter();
    high.type = "highshelf"; high.frequency.value = 6000; high.gain.value = eqGains.high;

    src.connect(low); low.connect(mid); mid.connect(high); high.connect(ctx.destination);

    setAudioCtx(ctx);
    setSourceNode(src);
    setEqNodes({ low, mid, high });

    return () => {
      try { src.disconnect(); low.disconnect(); mid.disconnect(); high.disconnect(); ctx.close(); } catch {}
      setAudioCtx(null); setSourceNode(null); setEqNodes(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.url]);

  // Update EQ gains when changed
  useEffect(() => {
    if (!eqNodes) return;
    eqNodes.low.gain.value = eqGains.low;
    eqNodes.mid.gain.value = eqGains.mid;
    eqNodes.high.gain.value = eqGains.high;
  }, [eqNodes, eqGains]);

  // Load metadata & handle ready state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoadedMeta = () => {
      setDuration(audio.duration || 0);
      setIsReady(true);
      audio.playbackRate = rate;
      audio.muted = muted; audio.volume = volume;
      if (autoPlay) audio.play().catch(() => {});
    };
    const onTime = () => setCurrent(audio.currentTime);
    const onEnd = () => {
      // If loop A/B is enabled, restart at A
      if (loopAB.enabled && loopAB.a != null) {
        audio.currentTime = loopAB.a;
        audio.play().catch(() => {});
        return;
      }
      // Otherwise advance playlist
      if (index < tracks.length - 1) setIndex(i => i + 1);
      else audio.currentTime = 0;
    };

    audio.addEventListener("loadedmetadata", onLoadedMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [autoPlay, index, loopAB, muted, rate, tracks.length, volume]);

  // Loop A/B enforcement during playback
  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    if (!loopAB.enabled || loopAB.a == null || loopAB.b == null) return;
    const id = window.setInterval(() => {
      if (audio.currentTime > loopAB.b!) {
        audio.currentTime = loopAB.a!;
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [loopAB]);

  // Decode waveform peaks (off main playback path)
  useEffect(() => {
    let cancelled = false;
    async function decode() {
      try {
        const resp = await fetch(track.url, { mode: "cors" });
        const arr = await resp.arrayBuffer();
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buf = await ctx.decodeAudioData(arr.slice(0));
        // Downsample to fixed number of bars
        const bars = 500; // visual resolution
        const chan = buf.numberOfChannels > 1 ? mixdown(buf) : buf.getChannelData(0);
        const block = Math.floor(chan.length / bars);
        const out = new Float32Array(bars);
        for (let i = 0; i < bars; i++) {
          let sum = 0; let peak = 0;
          for (let j = 0; j < block; j++) {
            const v = Math.abs(chan[i * block + j]);
            if (v > peak) peak = v;
            sum += v;
          }
          out[i] = Math.max(peak, sum / block);
        }
        await ctx.close();
        if (!cancelled) setPeaks(out);
      } catch (e) {
        if (!cancelled) setPeaks(null);
      }
    }
    decode();
    return () => { cancelled = true; };
  }, [track.url]);

  function mixdown(buf: AudioBuffer) {
    const out = new Float32Array(buf.length);
    const tmp = new Float32Array(buf.length);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) {
      buf.copyFromChannel(tmp, ch);
      for (let i = 0; i < tmp.length; i++) out[i] += tmp[i];
    }
    for (let i = 0; i < out.length; i++) out[i] /= buf.numberOfChannels;
    return out;
  }

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth * dpr;
    const height = canvas.clientHeight * dpr;
    canvas.width = width; canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = theme === "dark" ? "#0b0f16" : "#f3f4f6";
    ctx.fillRect(0, 0, width, height);

    const pad = 6 * dpr;
    const mid = height / 2;

    // Guides for chapters
    if (track.chapters && duration) {
      ctx.strokeStyle = theme === "dark" ? "#334155" : "#cbd5e1";
      ctx.lineWidth = 1 * dpr;
      track.chapters.forEach(ch => {
        const x = ((ch.time / duration) * (width - pad * 2)) + pad;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      });
    }

    // Waveform bars
    const bars = peaks?.length || 0;
    if (bars && peaks) {
      const barW = (width - pad * 2) / bars;
      for (let i = 0; i < bars; i++) {
        const amp = peaks[i];
        const h = Math.max(2, amp * (height * 0.9));
        const x = pad + i * barW;
        const y = mid - h / 2;

        // Played portion vs not-yet-played
        const playedRatio = duration ? current / duration : 0;
        const playedX = pad + playedRatio * (width - pad * 2);

        ctx.fillStyle = x <= playedX ? (theme === "dark" ? "#60a5fa" : "#2563eb") : (theme === "dark" ? "#1f2937" : "#94a3b8");
        ctx.fillRect(x, y, Math.max(1, barW * 0.9), h);
      }
    } else {
      // Fallback progress track
      ctx.fillStyle = theme === "dark" ? "#1f2937" : "#94a3b8";
      const x0 = pad, x1 = width - pad, y = mid - 3, h = 6;
      ctx.fillRect(x0, y, x1 - x0, h);
      const played = duration ? current / duration : 0;
      ctx.fillStyle = theme === "dark" ? "#60a5fa" : "#2563eb";
      ctx.fillRect(x0, y, (x1 - x0) * played, h);
    }

    // A/B loop region shading
    if (loopAB.enabled && (loopAB.a != null || loopAB.b != null) && duration) {
      ctx.fillStyle = theme === "dark" ? "rgba(96,165,250,0.15)" : "rgba(37,99,235,0.15)";
      const ax = loopAB.a != null ? pad + (loopAB.a / duration) * (width - pad * 2) : pad;
      const bx = loopAB.b != null ? pad + (loopAB.b / duration) * (width - pad * 2) : width - pad;
      ctx.fillRect(ax, 0, bx - ax, height);
    }

    // Playhead
    if (duration) {
      const x = pad + (current / duration) * (width - pad * 2);
      ctx.strokeStyle = theme === "dark" ? "#93c5fd" : "#1d4ed8";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
  }, [peaks, current, duration, theme, track.chapters, loopAB]);

  // Seek by clicking/dragging on canvas
  function posToTime(clientX: number) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = clamp(clientX - rect.left, 0, rect.width);
    const pad = 6;
    const t = ((x - pad) / (rect.width - pad * 2)) * duration;
    return clamp(t, 0, duration);
  }

  const onCanvasDown = (e: React.MouseEvent) => {
    if (!duration) return;
    setSeeking(true);
    const t = posToTime(e.clientX);
    if (audioRef.current) audioRef.current.currentTime = t;
  };
  const onCanvasMove = (e: React.MouseEvent) => {
    if (!seeking || !duration) return;
    const t = posToTime(e.clientX);
    if (audioRef.current) audioRef.current.currentTime = t;
  };
  const onCanvasUp = () => setSeeking(false);

  // Media Session API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !track) return;
    navigator.mediaSession.metadata = new window.MediaMetadata({
      title: track.title,
      artist: track.artist || "",
      artwork: track.artwork ? [{ src: track.artwork, sizes: "512x512", type: "image/png" }] : undefined as any,
    });
    navigator.mediaSession.setActionHandler?.("previoustrack", () => setIndex(i => Math.max(0, i - 1)));
    navigator.mediaSession.setActionHandler?.("nexttrack", () => setIndex(i => Math.min(tracks.length - 1, i + 1)));
    navigator.mediaSession.setActionHandler?.("play", () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler?.("pause", () => audioRef.current?.pause());
  }, [track, tracks.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const inInput = el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || (el as HTMLElement).isContentEditable);
      if (inInput) return;

      if (e.code === "Space") { e.preventDefault(); togglePlay(); }
      if (e.key === "ArrowLeft") seekRel(-5);
      if (e.key === "ArrowRight") seekRel(5);
      if (e.key.toLowerCase() === "m") setMuted(m => !m);
      if (e.key.toLowerCase() === "l") setLoopAB(prev => ({ ...prev, enabled: !prev.enabled }));
      if (e.key === "[") setLoopPoint("a");
      if (e.key === "]") setLoopPoint("b");
      if (e.key.toLowerCase() === "+") setRate(r => clamp(Number((r + 0.1).toFixed(2)), 0.5, 2));
      if (e.key.toLowerCase() === "-") setRate(r => clamp(Number((r - 0.1).toFixed(2)), 0.5, 2));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function togglePlay() {
    const audio = audioRef.current; if (!audio) return;
    if (audio.paused) { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
    else { audio.pause(); setIsPlaying(false); }
  }
  function seekRel(delta: number) {
    const audio = audioRef.current; if (!audio) return;
    audio.currentTime = clamp(audio.currentTime + delta, 0, duration || 0);
  }
  function setLoopPoint(which: "a" | "b") {
    const t = current;
    setLoopAB(prev => ({ ...prev, [which]: t }));
  }
  function clearLoop() {
    setLoopAB({ a: null, b: null, enabled: false });
  }

  // Track change handlers
  function next() { setIndex(i => Math.min(tracks.length - 1, i + 1)); }
  function prev() { setIndex(i => Math.max(0, i - 1)); }

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => { audio.removeEventListener("play", onPlay); audio.removeEventListener("pause", onPause); };
  }, []);

  // Apply audio element props upon changes
  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    audio.volume = volume; audio.muted = muted; audio.playbackRate = rate; (audio as any).preservesPitch = true;
  }, [volume, muted, rate]);

  // Derived UI state
  const loopLabel = useMemo(() => {
    const a = loopAB.a != null ? fmtTime(loopAB.a) : "--";
    const b = loopAB.b != null ? fmtTime(loopAB.b) : "--";
    return `${a} → ${b}`;
  }, [loopAB]);

  const themeCls = theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  if (!tracks || tracks.length === 0) {
    return (
      <div className={`w-full max-w-3xl mx-auto ${themeCls} rounded-2xl shadow-xl overflow-hidden border ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
        <div className="p-6 text-sm">
          <p className="font-semibold mb-2">No tracks provided</p>
          <p className="opacity-80">Pass a <code>tracks</code> array with at least one item: {'{ url, title, artist?, artwork?, chapters? }'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-3xl mx-auto ${themeCls} rounded-2xl shadow-xl overflow-hidden border ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
      {/* Header / Artwork */}
      <div className="flex items-center gap-4 p-4">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
          {track?.artwork ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.artwork} alt="artwork" className="w-full h-full object-cover" />
          ) : (
            <Music2 className="w-8 h-8 opacity-60" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-semibold truncate">{track?.title || "Untitled"}</div>
          <div className="text-sm opacity-70 truncate">{track?.artist || ""}</div>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs opacity-80">
          <Gauge className="w-4 h-4" /> <span>{rate.toFixed(2)}×</span>
        </div>
      </div>

      {/* Waveform / Seek */}
      <div className="px-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            onMouseDown={onCanvasDown}
            onMouseMove={onCanvasMove}
            onMouseUp={onCanvasUp}
            onMouseLeave={onCanvasUp}
            className="w-full h-28 rounded-xl cursor-pointer select-none"
            aria-label="Waveform seek bar"
          />
          {/* Chapter buttons (overlay) */}
          {track?.chapters && duration > 0 && (
            <div className="absolute inset-0 pointer-events-none">
              {track.chapters.map((ch, i) => (
                <button
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-1 py-0.5 rounded bg-black/30 text-[10px] pointer-events-auto"
                  style={{ left: `${(ch.time / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (audioRef.current) audioRef.current.currentTime = ch.time;
                  }}
                  title={`Jump to ${ch.label}`}
                >{ch.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transport */}
      <div className="p-4 flex items-center gap-3">
        <button onClick={prev} className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700" aria-label="Previous">
          <SkipBack className="w-5 h-5" />
        </button>
        <button onClick={togglePlay} className="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow">
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button onClick={next} className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700" aria-label="Next">
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="ml-2 text-sm tabular-nums opacity-80">{fmtTime(current)} / {fmtTime(duration)}</div>

        {/* Seek +/- */}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => seekRel(-5)} className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700" aria-label="Back 5s">-5s</button>
          <button onClick={() => seekRel(5)} className="px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700" aria-label="Forward 5s">+5s</button>
        </div>
      </div>

      {/* Controls Row */}
      <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Volume */}
        <div className="flex items-center gap-3">
          <button onClick={() => setMuted(m => !m)} className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700" aria-label="Mute">
            {muted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-blue-500"
            aria-label="Volume"
          />
        </div>

        {/* Speed */}
        <div className="flex items-center gap-3">
          <button onClick={() => setRate(r => clamp(Number((r - 0.1).toFixed(2)), 0.5, 2))} className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700">–</button>
          <div className="w-16 text-center tabular-nums">{rate.toFixed(2)}×</div>
          <button onClick={() => setRate(r => clamp(Number((r + 0.1).toFixed(2)), 0.5, 2))} className="px-3 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-700">+</button>
        </div>

        {/* Loop A/B */}
        <div className="flex items-center gap-3">
          <button onClick={() => setLoopAB(prev => ({ ...prev, enabled: !prev.enabled }))} className={`p-2 rounded-lg ${loopAB.enabled ? "bg-blue-600 text-white" : "bg-slate-800/60 hover:bg-slate-700"}`} title="Toggle A/B Loop">
            <Repeat className="w-5 h-5" />
          </button>
          <button onClick={() => setLoopPoint("a")} className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700" title="Set Loop In (A)"><Flag className="w-5 h-5" /></button>
          <button onClick={() => setLoopPoint("b")} className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700" title="Set Loop Out (B)"><Scissors className="w-5 h-5" /></button>
          <button onClick={clearLoop} className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700" title="Clear Loop"><TimerReset className="w-5 h-5" /></button>
          <div className="text-sm opacity-80">{loopLabel}</div>
        </div>

        {/* Simple 3-band EQ */}
        <div className="grid grid-cols-3 gap-3 items-center">
          {(["low","mid","high"] as const).map((band) => (
            <div key={band} className="flex flex-col">
              <label className="text-xs mb-1 capitalize">{band}</label>
              <input
                type="range"
                min={-12}
                max={12}
                step={0.5}
                value={eqGains[band]}
                onChange={(e) => setEqGains(g => ({ ...g, [band]: Number(e.target.value) }))}
                className="accent-blue-500"
                aria-label={`${band} EQ`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Playlist */}
      <div className={`${theme === "dark" ? "bg-slate-950/40" : "bg-slate-50"} border-t ${theme === "dark" ? "border-slate-800" : "border-slate-200"}`}>
        <div className="p-3 flex items-center gap-2 text-sm opacity-80"><ListMusic className="w-4 h-4" /> Playlist</div>
        <ul className="divide-y divide-slate-800/40">
          {tracks.map((t, i) => (
            <li key={i} className={`p-3 flex items-center gap-3 cursor-pointer ${i === index ? (theme === "dark" ? "bg-slate-800/60" : "bg-blue-50") : "hover:bg-slate-800/40"}`}
                onClick={() => setIndex(i)}>
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
                {t.artwork ? <img src={t.artwork} alt="art" className="w-full h-full object-cover" /> : <Music2 className="w-5 h-5 opacity-60" />}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{t.title}</div>
                <div className="text-xs opacity-70 truncate">{t.artist || t.url}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={track?.url || ""} preload="metadata" />

      {/* Footer: Shortcuts & Help */}
      <div className="p-3 text-xs opacity-70">
        <p className="mb-1">Shortcuts: Space (Play/Pause), ←/→ (±5s), M (Mute), L (A/B Loop), [ / ] (Set A / B), + / – (Speed)</p>
      </div>
    </div>
  );
}
