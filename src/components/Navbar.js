import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-container">
        <div className="logo">
          <Music size={32} />
          <span>Presto Guitar Academy</span>
        </div>
        <ul className="nav-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#ai-tutor">AI Tutor</a></li>
          <li><a href="#chords">Chords</a></li>
          <li><a href="#classes">Classes</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          padding: 1rem 0;
          transition: all 0.3s ease;
          background: rgba(10, 10, 10, 0.8);
          backdrop-filter: blur(10px);
        }
        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.95);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }
        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-size: 1.5rem;
          font-weight: 700;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2rem;
        }
        .nav-menu a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .nav-menu a:hover {
          color: #667eea;
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;