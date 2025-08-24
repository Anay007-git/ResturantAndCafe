import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music2, Play } from 'lucide-react';
import { playChordSound } from './AudioPlayer';

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
          transition={{ duration: 0.6 }}
        >
          <h2><Music2 size={40} /> Chord Library</h2>
          <div className="chord-selector">
            {Object.keys(chords).map(chord => (
              <button
                key={chord}
                className={`chord-btn ${selectedChord === chord ? 'active' : ''}`}
                onClick={() => setSelectedChord(chord)}
              >
                {chord}
              </button>
            ))}
          </div>
          <div className="chord-display glass-card">
            <div className="chord-info">
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
              <button className="play-btn" onClick={() => playChordSound(selectedChord)}>
                <Play size={16} />
                Play Chord
              </button>
            </div>
            <div className="chord-image">
              <img src={chords[selectedChord].image} alt={chords[selectedChord].name} />
            </div>
          </div>
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
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          align-items: center;
        }
        .chord-info h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: #667eea;
        }
        .difficulty {
          padding: 0.3rem 1rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
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
        }
        .finger-positions h4 {
          margin-bottom: 0.5rem;
          color: #b0b0b0;
        }
        .finger-positions ul {
          list-style: none;
        }
        .finger-positions li {
          padding: 0.3rem 0;
          color: #d0d0d0;
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
        .chord-image img {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 15px;
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