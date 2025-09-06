import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="contact-section">
      <h2>Contact</h2>
      <form action="https://formspree.io/f/xblazejz" method="POST">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows={5} required></textarea>
        </div>
        <button type="submit">Send</button>
      </form>
    </section>
  );
};

export default ContactSection;
