import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Zap, Star, Trophy, Headphones } from 'lucide-react';

const StudentZone = () => {
  const [activeTab, setActiveTab] = useState('achievements');
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [taskProgress, setTaskProgress] = useState({});
  const [showTask, setShowTask] = useState(null);

  const achievements = [
    { 
      icon: <Music size={24} />, 
      title: "First Chord Master", 
      desc: "Nailed your first chord!", 
      color: "#22c55e",
      task: "Hold a G major chord for 10 seconds",
      steps: ["Place finger 3 on 6th string, 3rd fret", "Place finger 2 on 5th string, 2nd fret", "Place finger 4 on 1st string, 3rd fret", "Strum all strings"]
    },
    { 
      icon: <Music size={24} />, 
      title: "Song Slayer", 
      desc: "Played your first complete song!", 
      color: "#f59e0b",
      task: "Play 'Wonderwall' chorus (G-D-Em-C)",
      steps: ["Practice G to D transition", "Practice D to Em transition", "Practice Em to C transition", "Play full progression 4 times"]
    },
    { 
      icon: <Zap size={24} />, 
      title: "Speed Demon", 
      desc: "Lightning fast chord changes!", 
      color: "#ef4444",
      task: "Change between G and C in under 2 seconds",
      steps: ["Practice G chord shape", "Practice C chord shape", "Switch slowly 10 times", "Increase speed gradually"]
    },
    { 
      icon: <Star size={24} />, 
      title: "Practice Warrior", 
      desc: "7 days straight practice!", 
      color: "#8b5cf6",
      task: "Practice guitar for 20 minutes daily for 7 days",
      steps: ["Day 1: Basic chords", "Day 2: Strumming patterns", "Day 3: Chord transitions", "Days 4-7: Song practice"]
    }
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

  const startTask = (index) => {
    setShowTask(index);
  };

  const completeStep = (achievementIndex, stepIndex) => {
    const key = `${achievementIndex}-${stepIndex}`;
    setTaskProgress(prev => ({ ...prev, [key]: true }));
  };

  const unlockAchievement = (index) => {
    const achievement = achievements[index];
    const allStepsCompleted = achievement.steps.every((_, stepIndex) => 
      taskProgress[`${index}-${stepIndex}`]
    );
    
    if (allStepsCompleted && !unlockedAchievements.includes(index)) {
      setUnlockedAchievements([...unlockedAchievements, index]);
      setShowTask(null);
    }
  };

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
                    <div className="task-info">
                      <strong>Task:</strong> {achievement.task}
                    </div>
                    {showTask === idx && (
                      <div className="task-steps">
                        <h4>Complete these steps:</h4>
                        {achievement.steps.map((step, stepIdx) => (
                          <div key={stepIdx} className="step-item">
                            <input 
                              type="checkbox" 
                              checked={taskProgress[`${idx}-${stepIdx}`] || false}
                              onChange={() => completeStep(idx, stepIdx)}
                            />
                            <span className={taskProgress[`${idx}-${stepIdx}`] ? 'completed' : ''}>
                              {step}
                            </span>
                          </div>
                        ))}
                        <button 
                          className="complete-btn"
                          onClick={() => unlockAchievement(idx)}
                          disabled={!achievement.steps.every((_, stepIndex) => taskProgress[`${idx}-${stepIndex}`])}
                        >
                          Complete Achievement
                        </button>
                      </div>
                    )}
                    <div 
                      className={`unlock-btn ${unlockedAchievements.includes(idx) ? 'unlocked' : ''}`}
                      onClick={() => unlockedAchievements.includes(idx) ? null : startTask(idx)}
                    >
                      {unlockedAchievements.includes(idx) ? '✅ Unlocked!' : '🎯 Start Task'}
                    </div>
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
      
      <style>{`
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
          transition: all 0.3s ease;
        }
        
        .unlock-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
        }
        
        .unlock-btn.unlocked {
          background: linear-gradient(45deg, #22c55e, #16a34a);
          cursor: default;
        }
        
        .unlock-btn.unlocked:hover {
          transform: none;
          box-shadow: none;
        }
        
        .task-info {
          margin: 1rem 0;
          padding: 0.8rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        
        .task-steps {
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .task-steps h4 {
          margin-bottom: 1rem;
          color: #667eea;
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
          padding: 0.5rem;
          border-radius: 5px;
          transition: background 0.2s ease;
        }
        
        .step-item:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        
        .step-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
        
        .step-item span.completed {
          text-decoration: line-through;
          color: #22c55e;
        }
        
        .complete-btn {
          background: linear-gradient(45deg, #22c55e, #16a34a);
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 20px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 1rem;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .complete-btn:disabled {
          background: #666;
          cursor: not-allowed;
          opacity: 0.5;
        }
        
        .complete-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(34, 197, 94, 0.3);
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