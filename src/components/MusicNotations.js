import React from 'react';
import { motion } from 'framer-motion';
import { Music, BookOpen, Play } from 'lucide-react';

const MusicNotations = () => {
  const notations = [
    {
      id: 1,
      title: 'Basic Guitar Chords',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      description: 'Essential open chords every guitarist should know',
      category: 'Chords'
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
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
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
                  <button className="learn-btn">
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
      `}</style>
    </section>
  );
};

export default MusicNotations;