import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StudentZone from './components/StudentZone';
import ChordLibrary from './components/ChordLibrary';
import Classes from './components/Classes';
import StudentsGallery from './components/StudentsGallery';
import DemoBooking from './components/DemoBooking';
import Contact from './components/Contact';
import FloatingChatBot from './components/FloatingChatBot';
import { preloadCriticalImages } from './utils/imageOptimization';
import './App.css';

function App() {
  useEffect(() => {
    preloadCriticalImages();
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <StudentZone />
      <ChordLibrary />
      <Classes />
      <StudentsGallery />
      <DemoBooking />
      <Contact />
      <FloatingChatBot />
    </div>
  );
}

export default App;