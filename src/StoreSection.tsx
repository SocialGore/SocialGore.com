import React, { useEffect } from 'react';

const StoreSection: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://gumroad.com/js/gumroad.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="store" className="store-section">
      <h2>Store</h2>

      <div className="gumroad-embed-container">
        {/* Replace the following line with your Gumroad embed code */}
        <div className="gumroad-product-embed" data-gumroad-product-id="<your-product-id>" data-gumroad-single-product="true">
          <a href="https://gumroad.com/l/<your-product-id>">Loading...</a>
        </div>
      </div>
    </section>
  );
};

export default StoreSection;