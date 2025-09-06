import React, { useEffect } from 'react';
import './index.css'; // Assuming index.css contains global styles including body/html
import MusicSection from './MusicSection';
import ServicesSection from './ServicesSection';
import GearSection from './GearSection';
import ContactSection from './ContactSection';
import StoreSection from './StoreSection';
import Header from './Header';

function App() {
  useEffect(() => {
    // Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500); // Match CSS transition duration
    }

    // Background video (if needed, ensure it's in public folder or handled by Vite)
    // This part might need adjustment based on how you want to handle the video in React
    const backgroundVideo = document.getElementById('background-video') as HTMLVideoElement;
    if (backgroundVideo) {
      backgroundVideo.play().catch(error => {
        console.error("Autoplay prevented:", error);
      });
    }
  }, []);

  return (
    <>
      <div id="preloader">
        <div className="loader"></div>
      </div>
      <video autoPlay loop muted playsInline id="background-video">
        <source src="/background_video_cropped.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="overlay"></div>

      <Header />

      {/* Main content will go here */}
      <div className="content">
        <MusicSection />
        <ServicesSection />
        <GearSection />
        <ContactSection />
        <StoreSection />
      </div>

      <footer>
        <p>Connect:</p>
        <a href="https://socialgore.bandcamp.com" target="_blank">
          <img src="/bandcamp.png" alt="Bandcamp" />
        </a>
        <a href="#" target="_blank">
          <img src="/spotify.png" alt="Spotify" />
        </a>
      </footer>
    </>
  );
}

export default App;
