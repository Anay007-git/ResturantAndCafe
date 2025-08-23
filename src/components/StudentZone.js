import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Star, Trophy, Headphones, Guitar } from 'lucide-react';

const StudentZone = () => {
  const [activeTab, setActiveTab] = useState('achievements');

  const achievements = [
    { icon: <Guitar size={24} />, title: "First Chord Master", desc: "Nailed your first chord!", color: "#22c55e" },
    { icon: <Music size={24} />, title: "Song Slayer", desc: "Played your first complete song!", color: "#f59e0b" },
    { icon: <Zap size={24} />, title: "Speed Demon", desc: "Lightning fast chord changes!", color: "#ef4444" },
    { icon: <Star size={24} />, title: "Practice Warrior", desc: "7 days straight practice!", color: "#8b5cf6" }
  ];

  const funFacts = [
    "🎸 The guitar has over 4,000 years of history!",
    "🤘 Air guitar championships are a real thing!",
    "🎵 Your brain literally grows when you learn guitar!",
    "⚡ Electric guitars were invented in the 1930s!",
    "🌟 Playing guitar can reduce stress by 68%!"
  ];

  const motivationalQuotes = [
    "Every expert was once a beginner! 🚀",
    "Your fingers will thank you later! 💪",
    "Rock stars aren't born, they're made! ⭐",
    "One chord at a time, one song at a time! 🎵",
    "Your guitar journey starts with a single strum! 🎸"
  ];

  return (
    <section id="student-zone" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>🎸 Student Zone - Where Guitar Dreams Come Alive! 🌟</h2>
          
          <div className="zone-tabs">
            <button 
              className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
              onClick={() => setActiveTab('achievements')}
            >
              <Trophy size={20} />
              Achievements
            </button>
            <button 
              className={`tab-btn ${activeTab === 'facts' ? 'active' : ''}`}
              onClick={() => setActiveTab('facts')}
            >
              <Zap size={20} />
              Fun Facts
            </button>
            <button 
              className={`tab-btn ${activeTab === 'motivation' ? 'active' : ''}`}
              onClick={() => setActiveTab('motivation')}
            >
              <Star size={20} />
              Daily Motivation
            </button>
          </div>

          <div className="zone-content">
            {activeTab === 'achievements' && (
              <motion.div 
                className="achievements-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {achievements.map((achievement, idx) => (
                  <motion.div
                    key={idx}
                    className="achievement-card glass-card"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    style={{ borderLeft: `4px solid ${achievement.color}` }}
                  >
                    <div className="achievement-icon" style={{ color: achievement.color }}>
                      {achievement.icon}
                    </div>
                    <h3>{achievement.title}</h3>
                    <p>{achievement.desc}</p>
                    <div className="unlock-btn">🔓 Unlock This!</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'facts' && (
              <motion.div 
                className="fun-facts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {funFacts.map((fact, idx) => (
                  <motion.div
                    key={idx}
                    className="fact-card glass-card"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
                    <Headphones size={20} />
                    <span>{fact}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'motivation' && (
              <motion.div 
                className="motivation-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="daily-quote glass-card">
                  <h3>🌅 Today's Guitar Motivation</h3>
                  <p className="quote">{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</p>
                </div>
                <div className="progress-tracker glass-card">
                  <h3>🎯 Your Progress</h3>
                  <div className="progress-item">
                    <span>Chords Learned</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '60%' }}></div>
                    </div>
                    <span>3/5</span>
                  </div>
                  <div className="progress-item">
                    <span>Songs Mastered</span>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: '40%' }}></div>
                    </div>
                    <span>2/5</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      <style jsx>{`
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .zone-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        
        .tab-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }
        
        .tab-btn:hover, .tab-btn.active {
          background: linear-gradient(45deg, #667eea, #764ba2);
          border-color: #667eea;
          transform: translateY(-2px);
        }
        
        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }
        
        .achievement-card {
          text-align: center;
          padding: 2rem;
          transition: all 0.3s ease;
        }
        
        .achievement-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }
        
        .achievement-card h3 {
          color: #667eea;
          margin-bottom: 0.5rem;
        }
        
        .unlock-btn {
          background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 15px;
          margin-top: 1rem;
          font-weight: 600;
          cursor: pointer;
        }
        
        .fun-facts {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .fact-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }
        
        .fact-card span {
          font-size: 1.1rem;
        }
        
        .motivation-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .daily-quote {
          text-align: center;
          padding: 2rem;
        }
        
        .quote {
          font-size: 1.3rem;
          color: #4ecdc4;
          font-style: italic;
          margin-top: 1rem;
        }
        
        .progress-tracker h3 {
          color: #667eea;
          margin-bottom: 1.5rem;
        }
        
        .progress-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .progress-bar {
          flex: 1;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(45deg, #22c55e, #4ecdc4);
          transition: width 0.5s ease;
        }
        
        @media (max-width: 768px) {
          .zone-tabs {
            flex-direction: column;
            align-items: center;
          }
          
          .achievements-grid {
            grid-template-columns: 1fr;
          }
          
          .motivation-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default StudentZone;