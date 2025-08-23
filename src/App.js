import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AITutor from './components/AITutor';
import ChordLibrary from './components/ChordLibrary';
import Classes from './components/Classes';
import Contact from './components/Contact';
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
    </div>
  );
}

export default App;