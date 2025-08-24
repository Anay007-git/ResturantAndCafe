import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudentZone from './components/StudentZone';
import ChordLibrary from './cimport React, { useState, useEffect } from 'react';
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
    --input-bg: rgba(255, 255, 255, 0.05);
    --input-border: rgba(255, 255, 255, 0.2);
    --btn-bg: rgba(255, 255, 255, 0.05);
    --btn-border: rgba(255, 255, 255, 0.1);
    --chat-bg: rgba(10, 10, 10, 0.95);
  }
  
  [data-theme="light"] {
    --bg-primary: #ffffff;
    --bg-secondary: #f8fafc;
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --accent: #667eea;
    --border: rgba(0, 0, 0, 0.1);
    --glass: rgba(0, 0, 0, 0.05);
    --input-bg: rgba(0, 0, 0, 0.05);
    --input-border: rgba(0, 0, 0, 0.2);
    --btn-bg: rgba(0, 0, 0, 0.05);
    --btn-border: rgba(0, 0, 0, 0.1);
    --chat-bg: rgba(255, 255, 255, 0.95);
  }
  
  * {
    color: inherit;
  }
  
  body {
    background: var(--bg-primary) !important;
    color: var(--text-primary) !important;
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
    color: var(--text-primary);
  }
  
  h1, h2, h3, h4, h5, h6, p, span, div, li {
    color: var(--text-primary) !important;
  }
  
  /* Chord Library fixes */
  .chord-btn {
    background: var(--btn-bg) !important;
    border: 1px solid var(--btn-border) !important;
    color: var(--text-primary) !important;
  }
  
  .finger-positions h4 {
    color: var(--text-secondary) !important;
  }
  
  .finger-positions li {
    color: var(--text-primary) !important;
  }
  
  /* Demo Booking fixes */
  .form-grid input, .form-grid select {
    background: var(--input-bg) !important;
    border: 1px solid var(--input-border) !important;
    color: var(--text-primary) !important;
  }
  
  .form-grid input::placeholder {
    color: var(--text-secondary) !important;
  }
  
  .date-btn, .slot-btn {
    background: var(--btn-bg) !important;
    border: 2px solid var(--btn-border) !important;
    color: var(--text-primary) !important;
  }
  
  .slot-time {
    color: var(--accent) !important;
  }
  
  .section-subtitle {
    color: var(--text-secondary) !important;
  }
  
  /* Contact fixes */
  .contact-link {
    color: var(--text-primary) !important;
  }
  
  .contact-card p {
    color: var(--text-secondary) !important;
  }
  
  .footer {
    background: var(--glass) !important;
    border-top: 1px solid var(--border) !important;
  }
  
  .footer-logo p, .footer-bottom p {
    color: var(--text-secondary) !important;
  }
  
  .footer-links a {
    color: var(--text-secondary) !important;
  }
  
  /* FloatingChatBot fixes */
  .floating-chat {
    background: var(--chat-bg) !important;
    border: 1px solid var(--border) !important;
  }
  
  .chat-header {
    border-bottom: 1px solid var(--border) !important;
  }
  
  .message.ai {
    color: var(--text-primary) !important;
  }
  
  .chat-input input {
    background: var(--input-bg) !important;
    border: 1px solid var(--input-border) !important;
    color: var(--text-primary) !important;
  }
  
  .chat-input input::placeholder {
    color: var(--text-secondary) !important;
  }
  
  .quick-options {
    border-top: 1px solid var(--border) !important;
  }
  
  .chat-input {
    border-top: 1px solid var(--border) !important;
  }
  
  /* StudentZone fixes */
  .stat-item {
    background: var(--btn-bg) !important;
  }
  
  .stat-label {
    color: var(--text-secondary) !important;
  }
  
  .xp-label, .xp-text {
    color: var(--text-secondary) !important;
  }
  
  .xp-progress {
    background: var(--btn-bg) !important;
  }
  
  .tab-btn {
    background: var(--btn-bg) !important;
    border: 2px solid var(--btn-border) !important;
    color: var(--text-primary) !important;
  }
  
  .task-info {
    background: var(--glass) !important;
  }
  
  .task-steps {
    background: var(--btn-bg) !important;
    border: 1px solid var(--btn-border) !important;
  }
  
  .badge-status.locked {
    background: var(--btn-bg) !important;
    color: var(--text-secondary) !important;
  }
  
  .progress-bar {
    background: var(--btn-bg) !important;
  }
  
  /* Community fixes */
  .stat-label {
    color: var(--text-secondary) !important;
  }
  
  .username {
    color: var(--text-primary) !important;
  }
  
  .category-btn {
    background: var(--btn-bg) !important;
    border: 1px solid var(--btn-border) !important;
    color: var(--text-primary) !important;
  }
  
  .vote-btn {
    color: var(--text-secondary) !important;
  }
  
  .vote-btn:hover {
    background: var(--btn-bg) !important;
  }
  
  .vote-count {
    color: var(--text-primary) !important;
  }
  
  .post-author {
    color: var(--text-primary) !important;
  }
  
  .post-time {
    color: var(--text-secondary) !important;
  }
  
  .post-content p {
    color: var(--text-primary) !important;
  }
  
  .post-actions {
    border-top: 1px solid var(--border) !important;
  }
  
  .action-btn {
    color: var(--text-secondary) !important;
  }
  
  .modal-content {
    background: var(--bg-secondary) !important;
    border: 1px solid var(--border) !important;
  }
  
  .modal-close {
    background: var(--btn-bg) !important;
    color: var(--text-secondary) !important;
  }
  
  .modal-header {
    border-bottom: 1px solid var(--border) !important;
  }
  
  .modal-header h3 {
    color: var(--text-primary) !important;
  }
  
  .modal-header p {
    color: var(--text-secondary) !important;
  }
  
  .form-group input, .form-group select, .form-group textarea {
    background: var(--input-bg) !important;
    border: 1px solid var(--input-border) !important;
    color: var(--text-primary) !important;
  }
  
  .form-group input::placeholder, .form-group textarea::placeholder {
    color: var(--text-secondary) !important;
  }
  
  .modal-footer {
    border-top: 1px solid var(--border) !important;
  }
  
  .modal-footer p {
    color: var(--text-secondary) !important;
  }
  
  .copy-code {
    background: var(--btn-bg) !important;
    border: 1px solid var(--btn-border) !important;
  }
  
  .copy-code span {
    color: var(--text-secondary) !important;
  }
  
  .verification-help {
    border-top: 1px solid var(--border) !important;
  }
  
  .help-content p {
    color: var(--text-secondary) !important;
  }
  
  .code-hint span {
    color: var(--text-secondary) !important;
  }
  
  .auto-progress p {
    color: var(--text-secondary) !important;
  }
  
  .progress-bar {
    background: var(--btn-bg) !important;
  }
`;

// Inject global styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = globalStyles;
  document.head.appendChild(styleSheet);
}