import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudentZone from './components/StudentZone';
import ChordLibrary from './components/ChordLibrary';
import Classes from './components/Classes';
import DemoBooking from './components/DemoBooking';
import Contact from './components/Contact';
import FloatingChatBot from './components/FloatingChatBot';
import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <StudentZone />
      <ChordLibrary />
      <Classes />
      <DemoBooking />
      <Contact />
      <FloatingChatBot />
    </div>
  );
}

export default App;