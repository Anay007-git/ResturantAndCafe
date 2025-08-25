import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, BookOpen, Play, X } from 'lucide-react';

const MusicNotations = () => {
  const [selectedNotation, setSelectedNotation] = useState(null);

  const notations = [
    {
      id: 1,
      title: 'Basic Guitar Chords',
      image: 'https://learnfingerpicking.com/wp-content/uploads/2022/10/Full-F-e1685631531658.jpg',
      description: 'Essential open chords every guitarist should know',
      category: 'Chords',
      content: {
        intro: 'Master the foundation of guitar playing with these essential open chords.',
        sections: [
          {
            title: 'Why Learn Basic Chords?',
            content: 'Open chords are the building blocks of guitar playing. They use open strings and require minimal finger stretching, making them perfect for beginners. With just 5-6 basic chords, you can play thousands of songs!'
          },
          {
            title: 'The Big 6 Chords',
            content: 'G Major, C Major, D Major, E Minor, A Minor, and F Major form the foundation. These chords appear in 80% of popular songs and provide the perfect starting point for any guitarist.'
          },
          {
            title: 'Practice Tips',
            content: 'Start with clean chord shapes, practice transitions slowly, and use a metronome. Focus on one chord at a time until muscle memory develops, then work on smooth transitions between chords.'
          }
        ]
      }
    },
    {
      id: 2,
      title: 'Music Staff Notation',
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=300&fit=crop',
      description: 'Learn to read standard music notation',
      category: 'Theory'
    },
    {
      id: 3,
      title: 'Guitar Tablature',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop',
      description: 'Understanding guitar tabs and fretboard notation',
      category: 'Tabs'
    },
    {
      id: 4,
      title: 'Chord Progressions',
      image: 'https://images.guitarguitar.co.uk/cdn/small/160/753_gg_acousticshapes_reso.jpg',
      description: 'Popular chord progressions in modern music',
      category: 'Progressions'
    }
  ];

  const instruments = [
    {
      id: 1,
      name: 'Acoustic Guitar',
      image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=400&fit=crop',
      description: 'Classic steel-string acoustic guitar'
    },
    {
      id: 2,
      name: 'Electric Guitar',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=400&fit=crop',
      description: 'Modern electric guitar for rock and blues'
    },
    {
      id: 3,
      name: 'Bass Guitar',
      image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=400&fit=crop',
      description: 'Four-string bass guitar for rhythm section'
    },
    {
      id: 4,
      name: 'Ukulele',
      image: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=400&fit=crop',
      description: 'Small four-string Hawaiian instrument'
    }
  ];

  return (
    <section className="music-notations-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="section-header">
            <h2><Music size={32} /> Music Theory & Notations</h2>
            <p>Master the fundamentals of music theory and notation</p>
          </div>

          <div className="notations-grid">
            {notations.map((notation, index) => (
              <motion.div
                key={notation.id}
                className="notation-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="notation-image">
                  <img src={notation.image} alt={notation.title} />
                  <div className="notation-overlay">
                    <Play size={24} />
                  </div>
                </div>
                <div className="notation-content">
                  <span className="notation-category">{notation.category}</span>
                  <h3>{notation.title}</h3>
                  <p>{notation.description}</p>
                  <button 
                    className="learn-btn"
                    onClick={() => setSelectedNotation(notation)}
                  >
                    <BookOpen size={16} />
                    Learn More
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="instruments-section">
            <h3>String Instruments We Teach</h3>
            <div className="instruments-grid">
              {instruments.map((instrument, index) => (
                <motion.div
                  key={instrument.id}
                  className="instrument-card glass-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="instrument-image">
                    <img src={instrument.image} alt={instrument.name} />
                  </div>
                  <div className="instrument-info">
                    <h4>{instrument.name}</h4>
                    <p>{instrument.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Learn More Modal */}
      <AnimatePresence>
        {selectedNotation && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNotation(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="modal-close" 
                onClick={() => setSelectedNotation(null)}
              >
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <img src={selectedNotation.image} alt={selectedNotation.title} />
                <div className="modal-title">
                  <span className="modal-category">{selectedNotation.category}</span>
                  <h2>{selectedNotation.title}</h2>
                  <p>{selectedNotation.content?.intro || selectedNotation.description}</p>
                </div>
              </div>
              
              <div className="modal-body">
                {selectedNotation.content?.sections?.map((section, index) => (
                  <div key={index} className="content-section">
                    <h3>{section.title}</h3>
                    <p>{section.content}</p>
                  </div>
                )) || (
                  <div className="content-section">
                    <h3>Coming Soon</h3>
                    <p>Detailed content for {selectedNotation.title} is being prepared. Check back soon for comprehensive learning materials!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .music-notations-section {
          padding: 80px 0;
          background: var(--bg-primary);
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-header h2 {
          font-size: 2.5rem;
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .section-header p {
          font-size: 1.1rem;
          color: var(--text-secondary);
        }
        
        .notations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 80px;
        }
        
        .notation-card {
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .notation-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }
        
        .notation-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .notation-card:hover .notation-image img {
          transform: scale(1.1);
        }
        
        .notation-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(102, 126, 234, 0.9);
          color: white;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .notation-card:hover .notation-overlay {
          opacity: 1;
        }
        
        .notation-content {
          padding: 24px;
        }
        
        .notation-category {
          background: var(--accent);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .notation-content h3 {
          color: var(--text-primary);
          margin: 16px 0 8px;
          font-size: 1.3rem;
        }
        
        .notation-content p {
          color: var(--text-secondary);
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .learn-btn {
          background: var(--accent);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background-color 0.3s ease;
        }
        
        .learn-btn:hover {
          background: #5a67d8;
        }
        
        .instruments-section {
          text-align: center;
        }
        
        .instruments-section h3 {
          font-size: 2rem;
          color: var(--text-primary);
          margin-bottom: 40px;
        }
        
        .instruments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .instrument-card {
          border-radius: 16px;
          overflow: hidden;
          transition: transform 0.3s ease;
        }
        
        .instrument-image {
          height: 200px;
          overflow: hidden;
        }
        
        .instrument-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .instrument-info {
          padding: 20px;
        }
        
        .instrument-info h4 {
          color: var(--text-primary);
          margin-bottom: 8px;
          font-size: 1.2rem;
        }
        
        .instrument-info p {
          color: var(--text-secondary);
          font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2rem;
          }
          
          .notations-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .instruments-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }
        
        @media (max-width: 480px) {
          .instruments-grid {
            grid-template-columns: 1fr;
          }
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: var(--bg-secondary);
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid var(--border);
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          z-index: 10;
        }
        
        .modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .modal-header {
          display: flex;
          gap: 2rem;
          padding: 2rem;
          border-bottom: 1px solid var(--border);
        }
        
        .modal-header img {
          width: 200px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
        }
        
        .modal-title {
          flex: 1;
        }
        
        .modal-category {
          background: var(--accent);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .modal-title h2 {
          color: var(--text-primary);
          margin: 16px 0 8px;
          font-size: 2rem;
        }
        
        .modal-title p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.5;
        }
        
        .modal-body {
          padding: 2rem;
        }
        
        .content-section {
          margin-bottom: 2rem;
        }
        
        .content-section h3 {
          color: var(--accent);
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }
        
        .content-section p {
          color: var(--text-secondary);
          line-height: 1.6;
          font-size: 1rem;
        }
        
        @media (max-width: 768px) {
          .modal-header {
            flex-direction: column;
            gap: 1rem;
          }
          
          .modal-header img {
            width: 100%;
            height: 200px;
          }
          
          .modal-content {
            margin: 10px;
            max-height: calc(100vh - 20px);
          }
        }
      `}</style>
    </section>
  );
};

export default MusicNotations;