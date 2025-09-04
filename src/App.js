import React, { useState, useEffect } from 'react';
import './App.css';

// Import components with error handling
let Navbar, Hero, StudentZone, ChordLibrary, Classes, StudentsGallery, Community, VirtualRoom, MusicNotations, DemoBooking, Contact, Footer, FloatingChatBot, AITutor, AudioPlayer, SEO, SmokeCanvas, LazyImage, TeachersDay, NarutoTheme, NarutoCharacters;

try {
  Navbar = require('./components/Navbar').default;
  Hero = require('./components/Hero').default;
  StudentZone = require('./components/StudentZone').default;
  ChordLibrary = require('./components/ChordLibrary').default;
  Classes = require('./components/Classes').default;
  StudentsGallery = require('./components/StudentsGallery').default;
  Community = require('./components/Community').default;
  VirtualRoom = require('./components/VirtualRoom').default;
  MusicNotations = require('./components/MusicNotations').default;
  DemoBooking = require('./components/DemoBooking').default;
  Contact = require('./components/Contact').default;
  Footer = require('./components/Footer').default;
  FloatingChatBot = require('./components/FloatingChatBot').default;
  AITutor = require('./components/AITutor').default;
  AudioPlayer = require('./components/AudioPlayer').default;
  SEO = require('./components/SEO').default;
  SmokeCanvas = require('./components/SmokeCanvas').default;
  LazyImage = require('./components/LazyImage').default;
  TeachersDay = require('./components/TeachersDay').default;
  NarutoTheme = require('./components/NarutoTheme').default;
  NarutoCharacters = require('./components/NarutoCharacters').default;
} catch (error) {
  console.error('Component import error:', error);
}

// Fallback components
const FallbackComponent = ({ name }) => (
  <div style={{ padding: '2rem', textAlign: 'center', color: '#667eea' }}>
    <h2>🎸 {name} Component Loading...</h2>
    <p>Presto Guitar Academy</p>
  </div>
);

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

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

  return (
    <div className="App">
      {NarutoTheme ? <NarutoTheme /> : null}
      {NarutoCharacters ? <NarutoCharacters /> : null}
      {TeachersDay ? <TeachersDay /> : null}
      {Navbar ? <Navbar theme={theme} setTheme={setTheme} /> : <FallbackComponent name="Navigation" />}
      {Hero ? <Hero /> : <FallbackComponent name="Hero" />}
      {StudentZone ? <StudentZone /> : <FallbackComponent name="Student Zone" />}
      {ChordLibrary ? <ChordLibrary /> : <FallbackComponent name="Chord Library" />}
      {Classes ? <Classes /> : <FallbackComponent name="Classes" />}
      {StudentsGallery ? <StudentsGallery /> : <FallbackComponent name="Gallery" />}
      {Community ? <Community /> : <FallbackComponent name="Community" />}
      {VirtualRoom ? <VirtualRoom /> : <FallbackComponent name="Virtual Room" />}
      {MusicNotations ? <MusicNotations /> : <FallbackComponent name="Music Notations" />}
      {DemoBooking ? <DemoBooking /> : <FallbackComponent name="Demo Booking" />}
      {Contact ? <Contact /> : <FallbackComponent name="Contact" />}
      {Footer ? <Footer /> : <FallbackComponent name="Footer" />}
      {FloatingChatBot ? <FloatingChatBot /> : null}
    </div>
  );
}

export default App;

// Global theme styles with Naruto theme
const globalStyles = `
  :root {
    --bg-primary: #1a1a2e;
    --bg-secondary: #16213e;
    --text-primary: #ffffff;
    --text-secondary: #d4af37;
    --accent: #ff6b35;
    --border: rgba(255, 107, 53, 0.3);
    --glass: rgba(255, 107, 53, 0.1);
    --naruto-orange: #ff6b35;
    --naruto-blue: #003d82;
    --naruto-gold: #d4af37;
    --leaf-green: #228b22;
  }
  
  [data-theme="light"] {
    --bg-primary: #fff8f0;
    --bg-secondary: #ffeaa7;
    --text-primary: #2d3436;
    --text-secondary: #636e72;
    --accent: #ff6b35;
    --border: rgba(255, 107, 53, 0.4);
    --glass: rgba(255, 107, 53, 0.15);
    --naruto-orange: #ff6b35;
    --naruto-blue: #0984e3;
    --naruto-gold: #d4af37;
    --leaf-green: #00b894;
  }
  
  [data-theme="light"] .tab-btn {
    background: rgba(102, 126, 234, 0.1) !important;
    color: #1a202c !important;
    border: 2px solid rgba(102, 126, 234, 0.3) !important;
  }
  
  [data-theme="light"] .tab-btn.active {
    background: #667eea !important;
    color: white !important;
  }
  
  [data-theme="light"] .glass-card {
    background: rgba(0, 0, 0, 0.03) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    color: #1a202c !important;
  }
  
  [data-theme="light"] h1, [data-theme="light"] h2, [data-theme="light"] h3 {
    color: #1a202c !important;
  }
  
  [data-theme="light"] p {
    color: #4a5568 !important;
  }
  
  body {
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%) !important;
    color: var(--text-primary) !important;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
  }
  
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800"><defs><radialGradient id="leaf" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23228b22" stop-opacity="0.3"/><stop offset="100%" stop-color="%23228b22" stop-opacity="0.1"/></radialGradient></defs><g opacity="0.4"><path d="M100 200 Q150 150 200 200 Q150 250 100 200" fill="url(%23leaf)" transform="rotate(45 150 200)"/><path d="M300 100 Q350 50 400 100 Q350 150 300 100" fill="url(%23leaf)" transform="rotate(-30 350 100)"/><path d="M800 300 Q850 250 900 300 Q850 350 800 300" fill="url(%23leaf)" transform="rotate(60 850 300)"/><path d="M1000 150 Q1050 100 1100 150 Q1050 200 1000 150" fill="url(%23leaf)" transform="rotate(-45 1050 150)"/><path d="M200 600 Q250 550 300 600 Q250 650 200 600" fill="url(%23leaf)" transform="rotate(30 250 600)"/><path d="M700 700 Q750 650 800 700 Q750 750 700 700" fill="url(%23leaf)" transform="rotate(-60 750 700)"/></g></svg>'),
      radial-gradient(circle at 20% 80%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 50%);
    background-size: 1200px 800px, 100% 100%, 100% 100%;
    pointer-events: none;
    z-index: -1;
    animation: leafDrift 20s ease-in-out infinite;
  }
  
  @keyframes leafDrift {
    0%, 100% { transform: translateX(0px) translateY(0px); }
    25% { transform: translateX(10px) translateY(-5px); }
    50% { transform: translateX(-5px) translateY(10px); }
    75% { transform: translateX(-10px) translateY(-5px); }
  }
  
  .App {
    min-height: 100vh;
    position: relative;
  }
  
  ::-webkit-scrollbar {
    width: 12px;
  }
  
  ::-webkit-scrollbar-track {
    background: var(--bg-secondary);
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, var(--naruto-orange), var(--naruto-gold));
    border-radius: 6px;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}