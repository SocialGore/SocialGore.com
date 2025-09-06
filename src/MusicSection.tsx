import React from 'react';
import CustomAudioPlayer from './CustomAudioPlayer';

const MusicSection: React.FC = () => {
  const demoTracks = [
    {
      url: "/BrokenDreams.mp3",
      title: "Broken Dreams",
      artist: "Social Gore",
      artwork: "",
      chapters: []
    },
  ];

  return (
    <section id="music" className="music-section">
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>Music</h2>
      <div style={{textAlign: 'center', marginBottom: '20px'}}>
        <img src="/Playermixedby.png" alt="Mixed by" style={{maxWidth: '400px', marginBottom: '10px'}} />
      </div>
      <CustomAudioPlayer tracks={demoTracks} autoPlay={false} theme="dark" />
    </section>
  );
};

export default MusicSection;
