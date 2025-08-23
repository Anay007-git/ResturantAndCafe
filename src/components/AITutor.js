import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, MessageCircle } from 'lucide-react';

const AITutor = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI guitar tutor. Ask me about chords, techniques, or theory!", isAI: true }
  ]);
  const [input, setInput] = useState('');

  const aiResponses = {
    chord: "Try the G-C-D progression! It's used in thousands of songs. Place your fingers gently and practice switching slowly.",
    technique: "For fingerpicking, use your thumb for bass notes (E,A,D strings) and fingers for melody (G,B,E strings). Start with a simple pattern.",
    theory: "The guitar uses standard tuning: E-A-D-G-B-E. Remember 'Eddie Ate Dynamite, Good Bye Eddie'!",
    practice: "Practice 20-30 minutes daily. Use a metronome, start slow, and focus on clean notes over speed.",
    default: "I can help with chords, techniques, music theory, and practice tips. What would you like to learn?"
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isAI: false }]);
    
    setTimeout(() => {
      const response = Object.keys(aiResponses).find(key => 
        input.toLowerCase().includes(key)
      ) || 'default';
      
      setMessages(prev => [...prev, { text: aiResponses[response], isAI: true }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <section id="ai-tutor" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2><Bot size={40} /> AI Guitar Tutor</h2>
          <div className="ai-chat glass-card">
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  className={`message ${msg.isAI ? 'ai-message' : 'user-message'}`}
                  initial={{ opacity: 0, x: msg.isAI ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg.isAI && <MessageCircle size={16} />}
                  <span>{msg.text}</span>
                </motion.div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about chords, techniques, theory..."
              />
              <button onClick={sendMessage}>
                <Send size={20} />
              </button>
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
        .ai-chat {
          max-width: 800px;
          margin: 0 auto;
          height: 500px;
          display: flex;
          flex-direction: column;
        }
        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .message {
          max-width: 80%;
          padding: 1rem;
          border-radius: 15px;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .ai-message {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          align-self: flex-start;
        }
        .user-message {
          background: rgba(118, 75, 162, 0.2);
          align-self: flex-end;
          justify-content: flex-end;
        }
        .chat-input {
          display: flex;
          padding: 1rem;
          gap: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        .chat-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 25px;
          padding: 1rem;
          color: white;
          outline: none;
        }
        .chat-input button {
          background: #667eea;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }
      `}</style>
    </section>
  );
};

export default AITutor;