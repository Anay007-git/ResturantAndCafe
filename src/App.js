import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AITutor from './components/AITutor';
import ChordLibrary from './components/ChordLibrary';
import Classes from './components/Classes';
import Contact from './components/Contact';
import FloatingChatBot from './components/FloatingChatBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <AITutor />
      <ChordLibrary />
      <Classes />
      <Contact />
      <FloatingChatBot />
    </div>
  );
}

export default App;