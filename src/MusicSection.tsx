import React from 'react';

const MusicSection: React.FC = () => {
  const demoTracks = [
    {
      url: "/BrokenDreams.mp3",
      title: "Broken Dreams",
      artist: "Social Gore",
    },
  ];

  return (
    <section id="music" className="music-section">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Music</h2>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src="/Playermixedby.png" alt="Mixed by" style={{ maxWidth: '400px', marginBottom: '10px' }} />
      </div>
      <div className="audio-player-container">
        {demoTracks.map((track, index) => (
          <div key={index} className="audio-player-item">
            <h3>{track.title}</h3>
            <p>{track.artist}</p>
            <audio controls src={track.url}>
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MusicSection;