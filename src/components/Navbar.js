import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Menu, X, Sun, Moon, Monitor } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.setAttribute('data-theme', systemTheme);
      } else {
        root.setAttribute('data-theme', theme);
      }
    };
    
    applyTheme();
    localStorage.setItem('theme', theme);
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

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
          <span>Presto Guitar Academy</span>
        </div>
        
        <div className="nav-right">
          <div className="theme-switcher">
            <button 
              className="theme-btn"
              onClick={() => setShowThemeMenu(!showThemeMenu)}
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
                  <button onClick={() => handleThemeChange('light')}>
                    <Sun size={16} /> Light
                  </button>
                  <button onClick={() => handleThemeChange('dark')}>
                    <Moon size={16} /> Dark
                  </button>
                  <button onClick={() => handleThemeChange('system')}>
                    <Monitor size={16} /> System
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
          position: relative;
        }
        
        .nav-right {
          display: flex;
          align-items: center;
          gap: 1rem;
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
          list-style: none;
        }
        
        .desktop-menu {
          display: flex;
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
        .theme-switcher {
          position: relative;
        }
        
        .theme-btn {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
        }
        
        .theme-btn:hover {
          background: rgba(102, 126, 234, 0.1);
        }
        
        .theme-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.5rem;
          margin-top: 0.5rem;
          min-width: 120px;
          z-index: 1001;
        }
        
        .theme-menu button {
          width: 100%;
          background: none;
          border: none;
          color: white;
          padding: 0.5rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s ease;
        }
        
        .theme-menu button:hover {
          background: rgba(102, 126, 234, 0.2);
        }
        
        .hamburger {
          display: none;
          color: #667eea;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }
        
        .hamburger:hover {
          background: rgba(102, 126, 234, 0.1);
        }
        @media (max-width: 768px) {
          .nav-container {
            padding: 0 1rem;
          }
          
          .logo {
            font-size: 1.2rem;
          }
          
          .logo span {
            display: none;
          }
          
          .desktop-menu {
            display: none;
          }
          
          .hamburger {
            display: block;
          }
          
          .nav-menu.mobile-open {
            position: fixed;
            top: 80px;
            right: 0;
            width: 280px;
            height: calc(100vh - 80px);
            background: rgba(10, 10, 10, 0.98);
            backdrop-filter: blur(20px);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 2rem 1rem;
            gap: 1rem;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
          }
          
          .nav-menu.mobile-open a {
            font-size: 1.1rem;
            padding: 1rem 1.5rem;
            text-align: left;
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(255, 255, 255, 0.05);
          }
          
          .nav-menu.mobile-open a:hover {
            background: rgba(102, 126, 234, 0.2);
            border-color: rgba(102, 126, 234, 0.3);
            transform: translateX(5px);
          }
          
          .theme-menu {
            right: 0;
            top: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .nav-menu.mobile-open {
            width: 100%;
          }
        }
        
        /* Theme Variables */
        :root {
          --bg-primary: #0a0a0a;
          --bg-secondary: rgba(10, 10, 10, 0.95);
          --text-primary: #ffffff;
          --text-secondary: #b0b0b0;
          --accent: #667eea;
        }
        
        [data-theme="light"] {
          --bg-primary: #ffffff;
          --bg-secondary: rgba(255, 255, 255, 0.95);
          --text-primary: #1a1a1a;
          --text-secondary: #666666;
          --accent: #667eea;
        }
        
        [data-theme="light"] .navbar {
          background: rgba(255, 255, 255, 0.95);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="light"] .navbar.scrolled {
          background: rgba(255, 255, 255, 0.98);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="light"] .nav-menu a {
          color: #1a1a1a;
        }
        
        [data-theme="light"] .theme-menu {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        [data-theme="light"] .theme-menu button {
          color: #1a1a1a;
        }
        
        [data-theme="light"] .nav-menu.mobile-open {
          background: rgba(255, 255, 255, 0.98);
          border-left: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;