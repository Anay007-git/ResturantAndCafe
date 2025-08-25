import React from 'react';
import { motion } from 'framer-motion';
import { Music, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter, MessageCircle, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="footer-section">
            <div className="footer-logo">
              <Music size={32} />
              <h3>Presto Guitar Academy</h3>
            </div>
            <p>Transform your musical journey with expert guidance and soulful instruction from Kaustav Mitra.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={20} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#classes">Classes</a></li>
              <li><a href="#student-zone">Student Zone</a></li>
              <li><a href="#chords">Chord Library</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li><a href="#classes">Guitar Lessons</a></li>
              <li><a href="#classes">Music Theory</a></li>
              <li><a href="#classes">Song Writing</a></li>
              <li><a href="#classes">Performance Training</a></li>
              <li><a href="#classes">Online Classes</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={16} />
                <span>+91 9836441807</span>
              </div>
              <div className="contact-item">
                <Mail size={16} />
                <span>anaybis11@gmail.com</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>85, Road No. 1, H B Town<br />Sodepur, Kolkata 700110</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="footer-bottom">
          <div className="footer-divider"></div>
          <div className="footer-bottom-content">
            <p>&copy; 2024 Presto Guitar Academy. All rights reserved.</p>
            <p className="developer-credit">
              Developed by <strong>Anay Biswas</strong>
            </p>
            <div className="developer-links">
              <a href="https://wa.me/919804239301" className="dev-link whatsapp">
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
              <a href="https://www.linkedin.com/in/anay-biswas-a27573134/" target="_blank" rel="noopener noreferrer" className="dev-link linkedin">
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/Anay007-git" target="_blank" rel="noopener noreferrer" className="dev-link github">
                <Github size={16} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%);
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          border-top: 2px solid var(--border);
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer-section h3,
        .footer-section h4 {
          color: var(--accent);
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .footer-logo h3 {
          margin: 0;
          font-size: 1.5rem;
        }

        .footer-section p {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 50%;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: var(--accent);
          color: white;
          transform: translateY(-2px);
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-section ul li {
          margin-bottom: 0.8rem;
        }

        .footer-section ul li a {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .footer-section ul li a:hover {
          color: var(--accent);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          color: var(--text-secondary);
        }

        .contact-item svg {
          color: var(--accent);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
          margin-bottom: 2rem;
        }

        .footer-bottom-content {
          text-align: center;
          color: var(--text-secondary);
        }

        .footer-bottom-content p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
        }

        .developer-credit {
          font-size: 0.85rem !important;
          opacity: 0.8;
        }

        .developer-credit strong {
          color: var(--accent);
          font-weight: 600;
        }

        .developer-credit a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
        }

        .developer-credit a:hover {
          text-decoration: underline;
        }
        
        .developer-links {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.8rem;
          flex-wrap: wrap;
        }
        
        .dev-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          background: var(--glass);
          border: 1px solid var(--border);
          border-radius: 20px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .dev-link:hover {
          transform: translateY(-2px);
          text-decoration: none;
        }
        
        .dev-link.whatsapp:hover {
          background: #25d366;
          border-color: #25d366;
          color: white;
        }
        
        .dev-link.linkedin:hover {
          background: #0077b5;
          border-color: #0077b5;
          color: white;
        }
        
        .dev-link.github:hover {
          background: #333;
          border-color: #333;
          color: white;
        }

        /* Light Theme */
        [data-theme="light"] .footer {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border-top: 2px solid rgba(14, 165, 233, 0.2);
        }

        [data-theme="light"] .footer-section h3,
        [data-theme="light"] .footer-section h4 {
          color: #0ea5e9;
        }

        [data-theme="light"] .footer-section p,
        [data-theme="light"] .contact-item,
        [data-theme="light"] .footer-section ul li a,
        [data-theme="light"] .footer-bottom-content {
          color: #475569;
        }

        [data-theme="light"] .footer-section ul li a:hover {
          color: #0ea5e9;
        }

        [data-theme="light"] .social-links a {
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          color: #475569;
        }

        [data-theme="light"] .social-links a:hover {
          background: #0ea5e9;
          color: white;
        }

        [data-theme="light"] .contact-item svg {
          color: #0ea5e9;
        }

        [data-theme="light"] .footer-divider {
          background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), transparent);
        }

        [data-theme="light"] .developer-credit strong,
        [data-theme="light"] .developer-credit a {
          color: #0ea5e9;
        }
        
        [data-theme="light"] .dev-link {
          background: rgba(14, 165, 233, 0.1);
          border: 1px solid rgba(14, 165, 233, 0.2);
          color: #475569;
        }
        
        [data-theme="light"] .dev-link.github:hover {
          background: #24292e;
          border-color: #24292e;
        }

        @media (max-width: 768px) {
          .footer {
            padding: 3rem 0 2rem;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-logo {
            justify-content: center;
          }

          .social-links {
            justify-content: center;
          }

          .contact-info {
            align-items: center;
          }

          .contact-item {
            justify-content: center;
            text-align: left;
          }
          
          .developer-links {
            flex-direction: column;
            align-items: center;
            gap: 0.8rem;
          }
          
          .dev-link {
            width: 100%;
            max-width: 200px;
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;