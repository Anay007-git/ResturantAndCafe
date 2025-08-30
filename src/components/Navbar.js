import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Menu, X, Sun, Moon, Monitor } from 'lucide-react';

const Navbar = ({ theme, setTheme }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setShowThemeMenu(false);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light': return <Sun size={20} />;
      case 'dark': return <Moon size={20} />;
      default: return <Monitor size={20} />;
    }
  };

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
          <div className="logo-text">
            <span>Presto Guitar Academy</span>
            <a href="tel:+919836441807" className="phone-link">
              📞 +91 9836441807
            </a>
          </div>
        </div>
        <div className="nav-right">
          <div className="theme-switcher">
            <button 
              className="theme-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              aria-label="Change theme"
            >
              {getThemeIcon()}
            </button>
            <AnimatePresence>
              {showThemeMenu && (
                <motion.div
                  className="theme-menu"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <button onClick={() => handleThemeChange('light')}><Sun size={16} /> Light</button>
                  <button onClick={() => handleThemeChange('dark')}><Moon size={16} /> Dark</button>
                  <button onClick={() => handleThemeChange('system')}><Monitor size={16} /> System</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.ul
              className="nav-menu mobile-open"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <li><a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a></li>
              <li><a href="#student-zone" onClick={() => setMobileMenuOpen(false)}>Student Zone</a></li>
              <li><a href="#chords" onClick={() => setMobileMenuOpen(false)}>Chords</a></li>
              <li><a href="#classes" onClick={() => setMobileMenuOpen(false)}>Classes</a></li>
              <li><a href="#gallery" onClick={() => setMobileMenuOpen(false)}>Gallery</a></li>
              <li><a href="#community" onClick={() => setMobileMenuOpen(false)}>Community</a></li>
              <li><a href="#demo-booking" onClick={() => setMobileMenuOpen(false)}>Book Demo</a></li>
              <li><a href="#contact" onClick={() => setMobileMenuOpen(false)}>Contact</a></li>
            </motion.ul>
          )}
        </AnimatePresence>
        <ul className="nav-menu desktop-menu">
          <li><a href="#home">Home</a></li>
          <li><a href="#student-zone">Student Zone</a></li>
          <li><a href="#chords">Chords</a></li>
          <li><a href="#classes">Classes</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#community">Community</a></li>
          <li><a href="#demo-booking">Book Demo</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </div>
      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          padding: 0.8rem 0;
          background: var(--bg-secondary);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(102, 126, 234, 0.12);
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          transition: background 0.3s, box-shadow 0.3s;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
        }
        .navbar.scrolled {
          background: var(--bg-primary);
          box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
          border-bottom: 1px solid var(--accent);
        }
        .nav-container {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1.5rem;
          width: 100%;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          color: var(--accent);
          font-size: 1.4rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
        }
        .logo-text {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .logo-text span {
          font-size: 1.08rem;
          font-weight: 600;
          color: var(--accent);
          letter-spacing: 0.5px;
        }
        .phone-link {
          color: var(--accent);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.85rem;
          padding: 0.18rem 0.6rem;
          border-radius: 8px;
          background: rgba(102, 126, 234, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.18);
          transition: background 0.2s, border 0.2s, box-shadow 0.2s;
          white-space: nowrap;
          align-self: flex-start;
        }
        .phone-link:hover {
          background: rgba(102, 126, 234, 0.18);
          border-color: var(--accent);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .theme-switcher {
          position: relative;
        }
        .theme-btn {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 6px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          font-size: 1.1rem;
        }
        .theme-btn:hover {
          background: rgba(102, 126, 234, 0.10);
        }
        .theme-menu {
          position: absolute;
          top: 110%;
          right: 0;
          background: var(--bg-secondary);
          border: 1px solid rgba(102, 126, 234, 0.12);
          border-radius: 8px;
          padding: 0.4rem 0.2rem;
          min-width: 120px;
          box-shadow: 0 2px 12px rgba(102, 126, 234, 0.10);
          z-index: 1001;
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
        }
        .theme-menu button {
          width: 100%;
          background: none;
          border: none;
          color: var(--text-primary);
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.98rem;
          transition: background 0.18s, color 0.18s;
        }
        .theme-menu button:hover {
          background: rgba(102, 126, 234, 0.14);
          color: var(--accent);
        }
        .hamburger {
          display: none;
          color: var(--accent);
          cursor: pointer;
          padding: 0.4rem;
          border-radius: 6px;
          transition: background 0.2s;
        }
        .hamburger:hover {
          background: rgba(102, 126, 234, 0.10);
        }
        .nav-menu {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .desktop-menu {
          display: flex;
          gap: 0.1rem;
          align-items: center;
        }
        .nav-menu a {
          color: var(--text-primary);
          text-decoration: none;
          font-weight: 500;
          font-size: 1.02rem;
          padding: 0.7rem 1.2rem;
          border-radius: 6px;
          transition: background 0.2s, color 0.2s;
          position: relative;
          white-space: nowrap;
          border-right: 1px solid rgba(102, 126, 234, 0.08);
          letter-spacing: 0.2px;
        }
        .nav-menu li:last-child a {
          border-right: none;
        }
        .nav-menu a:hover {
          color: var(--accent);
          background: rgba(102, 126, 234, 0.08);
        }
        .nav-menu a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          transition: width 0.2s;
        }
        .nav-menu a:hover::after {
          width: 100%;
        }
        @media (max-width: 1200px) {
          .desktop-menu {
            display: none;
          }
          .hamburger {
            display: block;
          }
        }
        @media (max-width: 900px) {
          .nav-container {
            padding: 0 0.7rem;
          }
          .phone-link {
            display: none;
          }
        }
        @media (max-width: 700px) {
          .logo {
            font-size: 1.1rem;
          }
          .logo-text span {
            font-size: 0.95rem;
          }
          .nav-menu.mobile-open {
            position: fixed;
            top: 64px;
            right: 0;
            width: 100%;
            max-width: 320px;
            height: calc(100vh - 64px);
            background: var(--bg-primary);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 1.2rem 0;
            border-left: 1px solid rgba(102, 126, 234, 0.10);
            box-shadow: -8px 0 24px rgba(102, 126, 234, 0.10);
            z-index: 999;
          }
          .nav-menu.mobile-open li {
            width: 100%;
          }
          .nav-menu.mobile-open a {
            font-size: 1.05rem;
            font-weight: 500;
            padding: 1rem 1.5rem;
            text-align: left;
            border-radius: 0;
            border-right: none;
            border-bottom: 1px solid rgba(102, 126, 234, 0.07);
            background: transparent;
            margin: 0;
            display: block;
            width: 100%;
            box-sizing: border-box;
            transition: background 0.2s, color 0.2s, padding 0.2s;
          }
          .nav-menu.mobile-open li:last-child a {
            border-bottom: none;
          }
          .nav-menu.mobile-open a:hover {
            background: rgba(102, 126, 234, 0.12);
            color: var(--accent);
            padding-left: calc(1.5rem + 4px);
          }
          .nav-menu.mobile-open a::after {
            display: none;
          }
          .theme-menu {
            right: 0;
            top: 110%;
          }
        }
        @media (max-width: 480px) {
          .nav-container {
            padding: 0 0.3rem;
          }
          .logo {
            font-size: 0.95rem;
          }
          .logo-text span {
            font-size: 0.85rem;
          }
          .nav-menu.mobile-open {
            width: 100%;
            max-width: none;
            padding: 1rem 0;
          }
          .nav-menu.mobile-open a {
            padding: 0.8rem 1rem;
            font-size: 0.98rem;
          }
          .nav-menu.mobile-open a:hover {
            padding-left: calc(1rem + 4px);
          }
        }
        :root {
          --bg-primary: #f8f9fa;
          --bg-secondary: #ffffff;
          --text-primary: #22223b;
          --text-secondary: #4a4e69;
          --accent: #667eea;
        }
        [data-theme="dark"] {
          --bg-primary: #18181b;
          --bg-secondary: #232336;
          --text-primary: #f8f9fa;
          --text-secondary: #b0b0b0;
          --accent: #667eea;
        }
        [data-theme="dark"] .navbar {
          background: var(--bg-secondary);
          border-bottom: 1px solid rgba(102, 126, 234, 0.12);
        }
        [data-theme="dark"] .navbar.scrolled {
          background: var(--bg-primary);
          box-shadow: 0 4px 24px rgba(102, 126, 234, 0.10);
        }
        [data-theme="dark"] .nav-menu a {
          color: var(--text-primary);
        }
        [data-theme="dark"] .theme-menu {
          background: var(--bg-secondary);
          border: 1px solid rgba(102, 126, 234, 0.12);
        }
        [data-theme="dark"] .theme-menu button {
          color: var(--text-primary);
        }
        [data-theme="dark"] .nav-menu.mobile-open {
          background: var(--bg-primary);
          border-left: 1px solid rgba(102, 126, 234, 0.10);
        }
        [data-theme="dark"] .nav-menu.mobile-open a {
          border-bottom: 1px solid rgba(102, 126, 234, 0.07);
        }
        [data-theme="dark"] .nav-menu.mobile-open a:hover {
          background: rgba(102, 126, 234, 0.12);
          color: var(--accent);
        }
        [data-theme="dark"] .nav-menu a {
          border-right: 1px solid rgba(102, 126, 234, 0.08);
        }
        [data-theme="dark"] .phone-link {
          background: rgba(102, 126, 234, 0.08);
          border: 1px solid rgba(102, 126, 234, 0.18);
          color: var(--accent);
        }
        [data-theme="dark"] .phone-link:hover {
          background: rgba(102, 126, 234, 0.18);
          border-color: var(--accent);
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.10);
        }
        /* Mobile menu backdrop */
        @media (max-width: 700px) {
          .nav-menu.mobile-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(102, 126, 234, 0.08);
            z-index: -1;
          }
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;