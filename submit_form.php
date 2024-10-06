<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Social Gore</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            font-family: 'Arial', sans-serif;
            color: #fff;
            background: url('background1.webp') no-repeat center center;
            background-size: cover;
            background-attachment: fixed; /* Parallax scrolling */
            scroll-behavior: smooth;
        }

        .overlay {
            background: rgba(0, 0, 0, 0.7);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        header {
            text-align: center;
            padding: 50px;
            z-index: 2;
            position: relative;
        }

        header h1 {
            font-size: 7rem;
            font-weight: 900;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin: 0;
        }

        nav {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 20px;
        }

        nav a {
            color: #bbb;
            text-decoration: none;
            font-size: 1.1rem;
            border: 2px solid #666;
            padding: 10px 20px;
            text-transform: uppercase;
            transition: all 0.3s ease;
        }

        nav a:hover {
            color: #fff;
            border-color: #fff;
        }

        .content {
            padding: 50px;
            z-index: 2;
            position: relative;
            min-height: 100vh;
        }

        .music-section, .services-section, .bio-section {
            margin-bottom: 50px;
        }

        h2 {
            font-size: 2.5rem;
            margin-bottom: 20px;
            letter-spacing: 3px;
            text-transform: uppercase;
            display: flex;
            align-items: center;
        }

        h2 img {
            width: 32px;
            height: 32px;
            margin-right: 10px;
        }

        p {
            font-size: 1rem;
            line-height: 1.6;
        }

        .button {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #444;
            color: #fff;
            text-transform: uppercase;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s ease;
        }

        .button:hover {
            background-color: #666;
        }

        footer {
            text-align: center;
            padding: 30px;
            z-index: 2;
            position: relative;
        }

        footer a {
            color: #bbb;
            margin: 0 10px;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        footer a:hover {
            color: #fff;
        }

        footer img {
            width: 32px;
            height: 32px;
            vertical-align: middle;
            margin-right: 10px;
        }

        /* Lazy loading for images */
        img {
            width: 100%;
            height: auto;
        }

        img[loading="lazy"] {
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }

        img[loading="lazy"].loaded {
            opacity: 1;
        }

        /* Custom Audio Player */
        .audio-player {
            margin: 20px 0;
            background-color: #222;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }

        .audio-player button {
            background-color: #444;
            color: #fff;
            border: none;
            padding: 10px;
            cursor: pointer;
            border-radius: 5px;
            margin-right: 10px;
        }

        .audio-player button:hover {
            background-color: #666;
        }

        /* Hover Effects */
        a:hover img {
            transform: scale(1.1);
            filter: brightness(1.2);
            transition: 0.3s ease-in-out;
        }

        /* Bio Section (Interactive) */
        .bio-section {
            padding: 50px;
            background-color: rgba(0, 0, 0, 0.8);
            border-radius: 10px;
        }

        .bio-item {
            margin-bottom: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .bio-item:hover {
            color: #ddd;
        }

        .bio-item p {
            display: none;
            margin-top: 10px;
        }

        .bio-item.active p {
            display: block;
        }

        /* Parallax and music visualizer */
        @media (max-width: 768px) {
            body {
                background-attachment: scroll;
            }

            header h1 {
                font-size: 5rem;
            }

            .content {
                padding: 20px;
            }

            form {
                width: 90%;
            }
        }
    </style>
</head>
<body>
    <div class="overlay"></div>

    <header>
        <h1>Social Gore</h1>
        <nav>
            <a href="#music">Music</a>
            <a href="#services">Services</a>
            <a href="#bio">Bio</a>
            <a href="#contact">Contact</a>
        </nav>
    </header>

    <div class="content">
        <section id="music" class="music-section">
            <h2>
                <img src="SGbars.jpeg" alt="Latest" loading="lazy"> Latest
            </h2>

            <div class="audio-player">
                <button id="play-button">Play</button>
                <span id="track-name">The Pale King</span>
                <!-- Visualizer -->
                <canvas id="visualizer" width="600" height="100"></canvas>
            </div>
        </section>

        <section id="services" class="services-section">
            <h2>
                <img src="SGbars.jpeg" alt="Audio Services" loading="lazy"> Audio Services
            </h2>
            <p>I offer a wide range of audio services specializing in post-metal, noise rock, and sludge. Whether you need mixing, mastering, or sound design, I provide professional services tailored to your needs. Contact me for more details on specific packages.</p>
            <a href="mailto:matt@socialgore.com" class="button">Contact for Services</a>
        </section>

        <!-- Interactive Biography Section -->
        <section id="bio" class="bio-section">
            <h2>
                <img src="SGbars.jpeg" alt="Biography" loading="lazy"> Biography
            </h2>

            <div class="bio-item">
                <h3>Influences</h3>
                <p>My sound is heavily influenced by bands like Neurosis, Isis, and Swans. I blend post-metal with elements of sludge and noise rock for a unique sonic experience.</p>
            </div>

            <div class="bio-item">
                <h3>Journey</h3>
                <p>I've been immersed in music for over a decade, starting as a DIY musician before moving into professional audio services. My journey has taken me through countless projects and collaborations, shaping my unique style.</p>
            </div>

            <div class="bio-item">
                <h3>Gear</h3>
                <p>I use a mix of analog and digital gear, including modular synthesizers, vintage pedals, and high-end DAWs like Pro Tools and Ableton Live.</p>
            </div>
        </section>
    </div>

    <footer>
        <p>Connect:</p>
        <a href="https://socialgore.bandcamp.com" target="_blank">
            <img src="bandcamp.png" alt="Bandcamp">
        </a>
        <a href="#" target="_blank">
            <img src="spotify.png" alt="Spotify">
        </a>
        |
        <a href="mailto:matt@socialgore.com">Email</a>
    </footer>

    <script>
        // Lazy loading for images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.onload = () => img.classList.add('loaded');
        });

        // Bio section interactivity
        const bioItems = document.querySelectorAll('.bio-item');
        bioItems.forEach(item => {
            item.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        });

        // Custom audio player functionality
        const audioPlayer = document.createElement('audio');
        audioPlayer.src = 'your-track-url.mp3'; // Add your track URL here
        const playButton = document.getElementById('play-button');
        playButton.addEventListener('click', () => {
            if (audioPlayer.paused) {
                audioPlayer.play();
                playButton.innerText = 'Pause';
            } else {
                audioPlayer.pause();
                playButton.innerText = 'Play';
            }
        });

        // Music visualizer
        const canvas = document.getElementById('visualizer');
        const ctx = canvas.getContext('2d');
        const analyser = new (window.AudioContext || window.webkitAudioContext)().createAnalyser();

        const source = new (window.AudioContext || window.webkitAudioContext)().createMediaElementSource(audioPlayer);
        source.connect(analyser);
        analyser.connect(new (window.AudioContext || window.webkitAudioContext)().destination);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        function drawVisualizer() {
            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#222';
            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                x += barWidth + 1;
            }
        }

        drawVisualizer();
    </script>
</body>
</html>
