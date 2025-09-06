import React, { useEffect } from 'react';

const Header: React.FC = () => {
  useEffect(() => {
    const mainLogoContainer = document.getElementById('main-logo-container');
    const siteHeader = document.getElementById('site-header');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        if (mainLogoContainer) mainLogoContainer.style.opacity = '0';
        if (siteHeader) siteHeader.classList.add('scrolled');
      } else {
        if (mainLogoContainer) mainLogoContainer.style.opacity = '1';
        if (siteHeader) siteHeader.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div id="main-logo-container">
        <img src="/sgtextlogo.png" alt="Social Gore Logo" />
      </div>

      <header id="site-header">
        <div className="logo-container">
          <img src="/sgtextlogo.png" alt="Social Gore Logo" className="logo" />
        </div>
        <nav className="main-nav">
          <a href="#music">Music</a>
          <a href="#services">Services</a>
          <a href="#gear">Gear</a>
          <a href="/store.html">Store</a> {/* Note: This will be a React route later */}
          <a href="#contact">Contact</a>
        </nav>
      </header>
    </>
  );
};

export default Header;
