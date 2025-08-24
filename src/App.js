import React, { useState, useEffect } from 'react';
import './App.css';

// Import components with error handling
let Navbar, Hero, StudentZone, ChordLibrary, Classes, StudentsGallery, Community, MusicNotations, DemoBooking, Contact, FloatingChatBot;

try {
  Navbar = require('./components/Navbar').default;
  Hero = require('./components/Hero').default;
  StudentZone = require('./components/StudentZone').default;
  ChordLibrary = require('./components/ChordLibrary').default;
  Classes = require('./components/Classes').default;
  StudentsGallery = require('./components/StudentsGallery').default;
  Community = require('./components/Community').default;
  MusicNotations = require('./components/MusicNotations').default;
  DemoBooking = require('./components/DemoBooking').default;
  Contact = require('./components/Contact').default;
  FloatingChatBot = require('./components/FloatingChatBot').default;
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
      {Navbar ? <Navbar theme={theme} setTheme={setTheme} /> : <FallbackComponent name="Navigation" />}
      {Hero ? <Hero /> : <FallbackComponent name="Hero" />}
      {StudentZone ? <StudentZone /> : <FallbackComponent name="Student Zone" />}
      {ChordLibrary ? <ChordLibrary /> : <FallbackComponent name="Chord Library" />}
      {Classes ? <Classes /> : <FallbackComponent name="Classes" />}
      {StudentsGallery ? <StudentsGallery /> : <FallbackComponent name="Gallery" />}
      {Community ? <Community /> : <FallbackComponent name="Community" />}
      {MusicNotations ? <MusicNotations /> : <FallbackComponent name="Music Notations" />}
      {DemoBooking ? <DemoBooking /> : <FallbackComponent name="Demo Booking" />}
      {Contact ? <Contact /> : <FallbackComponent name="Contact" />}
      {FloatingChatBot ? <FloatingChatBot /> : null}
    </div>
  );
}

export default App;

// Global theme styles
const globalStyles = `
  :root {
    --bg-primary: #0a0a0a;
    --bg-secondary: #1a1a2e;
    --text-primary: #ffffff;
    --text-secondary: #b0b0b0;
    --accent: #667eea;
    --border: rgba(255, 255, 255, 0.1);
    --glass: rgba(255, 255, 255, 0.05);
  }
  
  [data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --accent: #667eea;
    --border: rgba(0, 0, 0, 0.1);
    --glass: rgba(0, 0, 0, 0.05);
  }
  
  body {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
    transition: background-color 0.3s ease, color 0.3s ease;
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  }
  
  .App {
    min-height: 100vh;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}