import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, BookOpen } from 'lucide-react';

const TeachersDay = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {showBanner && (
        <motion.div
          className="teachers-day-banner"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="naruto-bg">
            <div className="banner-content">
              <div className="sensei-tribute">
                <motion.div 
                  className="naruto-leaf"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  🍃
                </motion.div>
                <h2>🎌 Teacher's Day Tribute 🎌</h2>
                <p className="naruto-quote">"A teacher affects eternity; they can never tell where their influence stops."</p>
                <div className="sensei-message">
                  <BookOpen size={20} />
                  <span>Dedicated to all the senseis who guide us on our path to mastery</span>
                </div>
              </div>
              <button 
                className="close-banner"
                onClick={() => setShowBanner(false)}
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        .teachers-day-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          background: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff6b35 100%);
          border-bottom: 4px solid #d4af37;
          box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
        }

        .naruto-bg {
          background: 
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
          position: relative;
          overflow: hidden;
        }

        .naruto-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 10px,
              rgba(255, 255, 255, 0.05) 10px,
              rgba(255, 255, 255, 0.05) 20px
            );
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% { transform: translateX(-20px); }
          100% { transform: translateX(20px); }
        }

        .banner-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          position: relative;
          z-index: 2;
        }

        .sensei-tribute {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .naruto-leaf {
          font-size: 2rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }

        .sensei-tribute h2 {
          color: #fff;
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          margin: 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }

        .naruto-quote {
          color: rgba(255, 255, 255, 0.95);
          font-style: italic;
          margin: 0.3rem 0;
          font-size: 0.9rem;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .sensei-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          background: rgba(255, 255, 255, 0.15);
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .close-banner {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: #fff;
          font-size: 1.5rem;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-banner:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .banner-content {
            padding: 0.8rem 1rem;
            flex-direction: column;
            gap: 0.8rem;
          }

          .sensei-tribute {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .sensei-tribute h2 {
            font-size: 1.2rem;
          }

          .naruto-quote {
            font-size: 0.8rem;
          }

          .sensei-message {
            font-size: 0.75rem;
            padding: 0.3rem 0.6rem;
          }

          .close-banner {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
          }
        }

        /* Add body padding when banner is shown */
        body {
          padding-top: ${showBanner ? '120px' : '0'} !important;
          transition: padding-top 0.3s ease;
        }

        @media (max-width: 768px) {
          body {
            padding-top: ${showBanner ? '140px' : '0'} !important;
          }
        }
      `}</style>
    </>
  );
};

export default TeachersDay;