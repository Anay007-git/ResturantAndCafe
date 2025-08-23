import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

const FloatingChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your guitar assistant. Choose a topic:", isAI: true }
  ]);
  const [input, setInput] = useState('');

  const quickOptions = [
    { text: "Basic Chords", query: "Tell me about basic guitar chords" },
    { text: "Strumming Patterns", query: "How do I practice strumming patterns?" },
    { text: "Fingerpicking", query: "Teach me fingerpicking technique" },
    { text: "Music Theory", query: "Explain basic music theory" },
    { text: "Practice Tips", query: "Give me practice tips" },
    { text: "Class Info", query: "Tell me about classes" }
  ];

  const aiResponses = {
    chord: "Start with G, C, D, Em, Am - these 5 chords can play thousands of songs! Practice switching between them slowly.",
    strum: "Try this pattern: Down-Down-Up-Up-Down-Up. Count '1-2-3-4' and keep your wrist loose.",
    finger: "Use thumb for bass strings (E,A,D) and fingers for melody (G,B,E). Start with simple patterns like thumb-index-middle-ring.",
    theory: "Guitar uses standard tuning E-A-D-G-B-E. Learn the major scale pattern: W-W-H-W-W-W-H (W=whole step, H=half step).",
    practice: "Practice 20-30 minutes daily. Use a metronome, start slow, focus on clean notes over speed. Record yourself!",
    class: "Weekend classes: Sat/Sun 9AM-1PM & 5:30PM-8PM. Contact Kaustav Mitra at +91 9836441807 or anaybis11@gmail.com",
    default: "I can help with chords, techniques, theory, and practice tips. What interests you most?"
  };

  const sendMessage = (text = input) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { text, isAI: false }]);
    setInput('');
    
    setTimeout(() => {
      const response = Object.keys(aiResponses).find(key => 
        text.toLowerCase().includes(key)
      ) || 'default';
      
      setMessages(prev => [...prev, { text: aiResponses[response], isAI: true }]);
    }, 800);
  };

  const handleQuickOption = (option) => {
    sendMessage(option.query);
  };

  return (
    <>
      <motion.div
        className="chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="floating-chat"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chat-header">
              <Bot size={20} />
              <span>Guitar Assistant</span>
            </div>
            
            <div className="chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`message ${msg.isAI ? 'ai' : 'user'}`}>
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="quick-options">
              {quickOptions.map((option, idx) => (
                <button
                  key={idx}
                  className="quick-btn"
                  onClick={() => handleQuickOption(option)}
                >
                  {option.text}
                </button>
              ))}
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
              />
              <button onClick={() => sendMessage()}>
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .chat-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
          z-index: 1000;
        }

        .floating-chat {
          position: fixed;
          bottom: 5rem;
          right: 2rem;
          width: 350px;
          height: 500px;
          background: rgba(10, 10, 10, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          z-index: 999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .chat-header {
          padding: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          font-weight: 600;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .message {
          padding: 0.8rem;
          border-radius: 12px;
          max-width: 85%;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .message.ai {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.2);
          align-self: flex-start;
          color: #e0e0e0;
        }

        .message.user {
          background: rgba(118, 75, 162, 0.2);
          align-self: flex-end;
          color: white;
        }

        .quick-options {
          padding: 0.5rem 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .quick-btn {
          background: rgba(102, 126, 234, 0.1);
          border: 1px solid rgba(102, 126, 234, 0.3);
          color: #667eea;
          padding: 0.4rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-btn:hover {
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-1px);
        }

        .chat-input {
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .chat-input input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 0.8rem;
          color: white;
          outline: none;
          font-size: 0.9rem;
        }

        .chat-input button {
          background: #667eea;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
        }

        @media (max-width: 768px) {
          .floating-chat {
            width: calc(100vw - 2rem);
            max-width: 350px;
            height: 70vh;
            max-height: 500px;
            right: 1rem;
            bottom: 4rem;
          }
          
          .chat-toggle {
            right: 1rem;
            bottom: 1rem;
            width: 50px;
            height: 50px;
          }
          
          .chat-header {
            padding: 0.8rem;
          }
          
          .chat-messages {
            padding: 0.8rem;
          }
          
          .message {
            max-width: 90%;
            padding: 0.6rem;
            font-size: 0.85rem;
          }
          
          .quick-options {
            padding: 0.5rem 0.8rem;
          }
          
          .quick-btn {
            padding: 0.3rem 0.6rem;
            font-size: 0.75rem;
          }
          
          .chat-input {
            padding: 0.8rem;
          }
          
          .chat-input input {
            padding: 0.6rem;
            font-size: 0.85rem;
          }
          
          .chat-input button {
            width: 35px;
            height: 35px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingChatBot;