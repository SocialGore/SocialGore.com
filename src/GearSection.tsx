import React from 'react';

const GearSection: React.FC = () => {
  return (
    <section id="gear">
      <h2>
        <img src="/geartext.png" alt="Gear" style={{ maxWidth: '25%', height: 'auto' }} />
      </h2>
      <div className="gear-grid">
        {/* Gear Item 1 */}
        <div className="gear-item">
          <img src="/nevembp.jpg" alt="Rupert Neve Designs Portico II Master Buss Processor" />
          <div className="gear-info">
            <h3>Rupert Neve Designs Portico II</h3>
            <p>Master Buss Processor</p>
          </div>
        </div>

        {/* Gear Item 2 */}
        <div className="gear-item">
          <img src="/nevesat.jpg" alt="5059 Satellite 16 x 2+2 Summing Mixer" />
          <div className="gear-info">
            <h3>5059 Satellite 16 x 2+2 Summing Mixer</h3>
            <p>16 x 2+2 Summing Mixer</p>
          </div>
        </div>

        {/* Gear Item 3 */}
        <div className="gear-item">
          <img src="/orion.jpg" alt="Orion 32 Channels" />
          <div className="gear-info">
            <h3>Antelope Audio Orion 32+ Gen 3</h3>
            <p>32 Channels of State-of-the-Art Conversion</p>
          </div>
        </div>

        {/* Gear Item 4 */}
        <div className="gear-item">
          <img src="/phoenix.jpg" alt="Thermionic Culture Phoenix" />
          <div className="gear-info">
            <h3>Thermionic Culture Phoenix</h3>
            <p>Premium Boutique Tube Compression</p>
          </div>
        </div>

        {/* Gear Item 5 */}
        <div className="gear-item">
          <img src="/vulture.jpg" alt="Thermionic Culture Vulture" />
          <div className="gear-info">
            <h3>Thermionic Culture Vulture</h3>
            <p>Tube-Based Distortion</p>
          </div>
        </div>

        {/* Gear Item 6 */}
        <div className="gear-item">
          <img src="/api2500.jpg" alt="API 2500" />
          <div className="gear-info">
            <h3>API 2500</h3>
            <p>Legendary Stereo Compressor</p>
          </div>
        </div>

        {/* Gear Item 7 */}
        <div className="gear-item">
          <img src="/distressor.jpg" alt="Distressor" />
          <div className="gear-info">
            <h3>Distressor</h3>
            <p>Studio Staple</p>
          </div>
        </div>

        {/* Gear Item 8 */}
        <div className="gear-item">
          <img src="/1176.jpg" alt="UAD 1176" />
          <div className="gear-info">
            <h3>UAD 1176</h3>
            <p>Classic compressor</p>
          </div>
        </div>

        {/* Gear Item 9 */}
        <div className="gear-item">
          <img src="/1073LB.jpg" alt="Neve 1073LB" />
          <div className="gear-info">
            <h3>Neve 1073LB</h3>
            <p>Classic Preamp</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GearSection;
