import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Get In Touch</h2>
          <div className="contact-grid">
            <div className="contact-card glass-card">
              <Phone size={40} />
              <h3>Call or WhatsApp</h3>
              <a href="tel:9836441807" className="contact-link">
                +91 9836441807
              </a>
              <p>Available during class hours and by appointment</p>
            </div>
            
            <div className="contact-card glass-card">
              <Mail size={40} />
              <h3>Email</h3>
              <a href="mailto:anaybis11@gmail.com" className="contact-link">
                anaybis11@gmail.com
              </a>
              <p>Get detailed information about courses and enrollment</p>
            </div>
            
            <div className="contact-card glass-card">
              <MessageCircle size={40} />
              <h3>Quick Chat</h3>
              <a href="https://wa.me/919836441807" className="contact-link whatsapp">
                WhatsApp Now
              </a>
              <p>Instant responses for quick questions</p>
            </div>
            
            <div className="contact-card glass-card">
              <MapPin size={40} />
              <h3>Location</h3>
              <div className="contact-link">
                85, Road No. 1, H B Town<br/>
                Sodepur, Kolkata 700110
              </div>
              <p>Professional music studio with modern equipment</p>
            </div>
          </div>
          
          <div className="cta-section">
            <h3>Ready to Start Your Guitar Journey?</h3>
            <p>Join hundreds of students who have transformed their musical abilities</p>
            <div className="cta-buttons">
              <a href="tel:9836441807" className="btn-primary">
                <Phone size={20} />
                Call Now
              </a>
              <a href="https://wa.me/919836441807" className="btn-secondary whatsapp-btn">
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
          </div>
        </motion.div>
      </div>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <span>Presto Guitar Academy</span>
              <p>Transforming musical dreams into reality</p>
            </div>
            <div className="footer-links">
              <a href="#home">Home</a>
              <a href="#student-zone">Student Zone</a>
              <a href="#chords">Chords</a>
              <a href="#classes">Classes</a>
              <a href="#community">Community</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Presto Guitar Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <style jsx>{`
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #667eea;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }
        .contact-card {
          text-align: center;
          padding: 2rem;
          transition: transform 0.3s ease;
        }
        .contact-card:hover {
          transform: translateY(-5px);
        }
        .contact-card svg {
          color: #667eea;
          margin-bottom: 1rem;
        }
        .contact-card h3 {
          margin-bottom: 1rem;
          color: #667eea;
        }
        .contact-link {
          display: block;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
          transition: color 0.3s ease;
        }
        .contact-link:hover {
          color: #667eea;
        }
        .contact-link.whatsapp {
          background: #25d366;
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          display: inline-block;
        }
        .contact-card p {
          color: #b0b0b0;
          font-size: 0.9rem;
        }
        .cta-section {
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 20px;
          margin-bottom: 4rem;
        }
        .cta-section h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #667eea;
        }
        .cta-section p {
          color: #b0b0b0;
          margin-bottom: 2rem;
        }
        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .whatsapp-btn {
          background: #25d366 !important;
          border-color: #25d366 !important;
        }
        .whatsapp-btn:hover {
          background: #128c7e !important;
        }
        .footer {
          background: rgba(0, 0, 0, 0.5);
          padding: 3rem 0 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .footer-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-logo span {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }
        .footer-logo p {
          color: #b0b0b0;
          margin-top: 0.5rem;
        }
        .footer-links {
          display: flex;
          gap: 2rem;
          justify-content: flex-end;
          align-items: center;
        }
        .footer-links a {
          color: #b0b0b0;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: #667eea;
        }
        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #b0b0b0;
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .contact-card {
            padding: 1.5rem;
          }
          
          .contact-card i {
            font-size: 1.5rem;
          }
          
          .cta-section {
            padding: 2rem 1rem;
            margin-bottom: 3rem;
          }
          
          .cta-section h3 {
            font-size: 1.5rem;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .btn-primary, .whatsapp-btn {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1.5rem;
          }
          
          .footer-links {
            justify-content: center;
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;