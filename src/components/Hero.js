import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>Master Guitar with <span className="gradient-text">AI-Powered</span> Learning</h1>
          <p>Transform your musical journey with personalized AI assistance and expert instruction from Kaustav Mitra</p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => document.getElementById('classes').scrollIntoView({ behavior: 'smooth' })}>
              <Play size={20} />
              Start Learning
            </button>
            <button className="btn-secondary" onClick={() => document.getElementById('student-zone').scrollIntoView({ behavior: 'smooth' })}>
              <Sparkles size={20} />
              Student Zone
            </button>
          </div>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop" alt="Professional Guitar" />
        </motion.div>
      </div>
      <style jsx>{`
        .hero {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 0 2rem;
          background: radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%),
                      #0a0a0a;
        }
        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        h1 {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }
        p {
          font-size: 1.2rem;
          color: #b0b0b0;
          margin-bottom: 2rem;
          line-height: 1.6;
        }
        .hero-buttons {
          display: flex;
          gap: 1rem;
        }
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .btn-secondary:hover {
          background: #667eea;
          color: white;
        }
        .hero-image img {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;