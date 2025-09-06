import React, { useEffect } from 'react';

const Header: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) { // Adjust this threshold as needed
        document.body.classList.add('scrolled');
      } else {
        document.body.classList.remove('scrolled');
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
