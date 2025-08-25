import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Play } from 'lucide-react';
import { playChordSound } from './AudioPlayer';
import LazyImage from './LazyImage';

const ChordLibrary = () => {
  const [selectedChord, setSelectedChord] = useState('G');

  const chords = {
    G: {
      name: 'G Major',
      fingers: ['3rd fret 6th string', '2nd fret 5th string', '3rd fret 1st string'],
      image: '/images/chords/g-major.jpg',
      difficulty: 'Beginner'
    },
    C: {
      name: 'C Major',
      fingers: ['1st fret 2nd string', '2nd fret 4th string', '3rd fret 5th string'],
      image: '/images/chords/c-major.jpg',
      difficulty: 'Beginner'
    },
    D: {
      name: 'D Major',
      fingers: ['2nd fret 1st string', '2nd fret 3rd string', '3rd fret 2nd string'],
      image: '/images/chords/d-major.jpg',
      difficulty: 'Beginner'
    },
    Em: {
      name: 'E Minor',
      fingers: ['2nd fret 5th string', '2nd fret 4th string'],
      image: '/images/chords/e-minor.jpg',
      difficulty: 'Beginner'
    },
    Am: {
      name: 'A Minor',
      fingers: ['1st fret 2nd string', '2nd fret 4th string', '2nd fret 3rd string'],
      image: '/images/chords/a-minor.jpg',
      difficulty: 'Beginner'
    },
    F: {
      name: 'F Major (Barre)',
      fingers: ['Barre 1st fret all strings', '3rd fret 5th string', '3rd fret 4th string'],
      image: '/images/chords/f-major.jpg',
      difficulty: 'Intermediate'
    }
  };

  return (
    <section id="chords" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2><Music2 size={40} /> Chord Library</h2>
          <div className="chord-selector">
            {Object.keys(chords).map((chord, index) => (
              <motion.button
                key={chord}
                className={`chord-btn ${selectedChord === chord ? 'active' : ''}`}
                onClick={() => setSelectedChord(chord)}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: true }}
              >
                {chord}
              </motion.button>
            ))}
          </div>
          <motion.div 
            className="chord-display glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <motion.div 
              className="chord-info"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h3>{chords[selectedChord].name}</h3>
              <span className={`difficulty ${chords[selectedChord].difficulty.toLowerCase()}`}>
                {chords[selectedChord].difficulty}
              </span>
              <div className="finger-positions">
                <h4>Finger Positions:</h4>
                <ul>
                  {chords[selectedChord].fingers.map((finger, idx) => (
                    <li key={idx}>{finger}</li>
                  ))}
                </ul>
              </div>
              <motion.button 
                className="play-btn" 
                onClick={() => playChordSound(selectedChord)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={16} />
                Play Chord
              </motion.button>
            </motion.div>
            <motion.div 
              className="chord-image"
              initial={{ opacity: 0, x: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.02, rotate: 1 }}
            >
              <LazyImage src={chords[selectedChord].image} alt={chords[selectedChord].name} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      <style jsx>{`
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #667eea;
        }
        .chord-selector {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .chord-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }
        .chord-btn:hover, .chord-btn.active {
          background: #667eea;
          border-color: #667eea;
        }
        .chord-display {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: stretch;
          height: 450px;
        }
        .chord-info h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #667eea;
          font-weight: 800;
        }
        .difficulty {
          padding: 0.5rem 1.2rem;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .difficulty.beginner {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        .difficulty.intermediate {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }
        .finger-positions {
          margin: 1.5rem 0;
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .finger-positions h4 {
          margin-bottom: 1rem;
          color: #667eea;
          font-size: 1.2rem;
          font-weight: 700;
        }
        .finger-positions ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .finger-positions li {
          padding: 0.8rem 0;
          color: #ffffff;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
          font-size: 1rem;
        }
        .finger-positions li:last-child {
          border-bottom: none;
        }
        .finger-positions li:before {
          content: '👆';
          margin-right: 0.8rem;
        }
        .play-btn {
          background: #22c55e;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 25px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .play-btn:hover {
          background: #16a34a;
          transform: translateY(-2px);
        }
        .play-btn:active {
          transform: translateY(0);
        }
        .chord-image {
          position: relative;
          overflow: hidden;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        .chord-info {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .chord-image {
          height: 100%;
        }
        .chord-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          transition: transform 0.3s ease;
        }
        .chord-image:hover img {
          transform: scale(1.05);
        }
        [data-theme="light"] h2 {
          color: #1a202c !important;
        }
        [data-theme="light"] .chord-btn {
          background: rgba(102, 126, 234, 0.1) !important;
          color: #1a202c !important;
          border: 2px solid rgba(102, 126, 234, 0.3) !important;
        }
        [data-theme="light"] .chord-btn.active {
          background: #667eea !important;
          color: white !important;
        }
        [data-theme="light"] .chord-info {
          background: rgba(255, 255, 255, 0.8) !important;
          color: #1a202c !important;
        }
        [data-theme="light"] .chord-info h3 {
          color: #0f172a !important;
          font-weight: 800 !important;
        }
        [data-theme="light"] .chord-info p {
          color: #1e293b !important;
          font-weight: 600 !important;
        }
        [data-theme="light"] .finger-positions h4 {
          color: #0ea5e9 !important;
          font-weight: 700 !important;
        }
        [data-theme="light"] .finger-positions li {
          color: #0f172a !important;
          font-weight: 600 !important;
        }
        [data-theme="light"] .finger-positions {
          background: rgba(14, 165, 233, 0.05) !important;
          border: 1px solid rgba(14, 165, 233, 0.2) !important;
        }
        [data-theme="light"] .chord-modal {
          background: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid #0ea5e9 !important;
          box-shadow: 0 20px 40px rgba(14, 165, 233, 0.2) !important;
        }
        [data-theme="light"] .chord-modal h3 {
          color: #0f172a !important;
          border-bottom: 2px solid #0ea5e9 !important;
        }
        [data-theme="light"] .chord-modal p {
          color: #334155 !important;
        }
        [data-theme="light"] .chord-modal .chord-details {
          background: #f8fafc !important;
          border: 1px solid #cbd5e1 !important;
        }
        [data-theme="light"] .close-btn {
          background: #ef4444 !important;
          color: white !important;
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .chord-selector {
            gap: 0.8rem;
            margin-bottom: 1.5rem;
          }
          
          .chord-btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.9rem;
          }
          
          .chord-display {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .chord-info h3 {
            font-size: 1.5rem;
          }
          
          .finger-positions {
            margin: 1rem 0;
          }
          
          .play-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default ChordLibrary;