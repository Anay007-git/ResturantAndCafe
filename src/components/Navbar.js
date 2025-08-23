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
          <li><a href="#student-zone">Student Zone</a></li>
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
          padding: 1.2rem 0;
          transition: all 0.3s ease;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .navbar.scrolled {
          background: rgba(10, 10, 10, 0.98);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(102, 126, 234, 0.2);
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
          gap: 0.8rem;
          color: #667eea;
          font-size: 1.6rem;
          font-weight: 700;
          text-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }
        .nav-menu {
          display: flex;
          list-style: none;
          gap: 2.5rem;
        }
        .nav-menu a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
        }
        .nav-menu a:hover {
          color: #667eea;
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
        .nav-menu a::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }
        .nav-menu a:hover::after {
          width: 80%;
        }
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }
          .logo {
            font-size: 1.2rem;
          }
          .nav-menu {
            gap: 1rem;
            flex-wrap: wrap;
          }
          .nav-menu {
            gap: 1.5rem;
          }
          .nav-menu a {
            font-size: 0.9rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;