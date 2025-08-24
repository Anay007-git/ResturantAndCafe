import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudentZone from './components/StudentZone';
import ChordLibrary from './components/ChordLibrary';
import Classes from './components/Classes';
import StudentsGallery from './components/StudentsGallery';
import Community from './components/Community';
import MusicNotations from './components/MusicNotations';
import DemoBooking from './components/DemoBooking';
import Contact from './components/Contact';
import FloatingChatBot from './components/FloatingChatBot';
import { preloadCriticalImages } from './utils/imageOptimization';
import './App.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'system';
  });

  useEffect(() => {
    preloadCriticalImages();
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

  return (
    <div className="App">
      <Navbar theme={theme} setTheme={setTheme} />
      <Hero />
      <StudentZone />
      <ChordLibrary />
      <Classes />
      <StudentsGallery />
      <Community />
      <MusicNotations />
      <DemoBooking />
      <Contact />
      <FloatingChatBot />
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
    background: var(--bg-primary);
    color: var(--text-primary);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .section {
    background: var(--bg-primary);
    color: var(--text-primary);
  }
  
  .glass-card {
    background: var(--glass);
    border: 1px solid var(--border);
    backdrop-filter: blur(20px);
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}