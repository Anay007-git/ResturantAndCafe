import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles } from 'lucide-react';
import LazyImage from './LazyImage';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h1>Master Guitar with <span className="gradient-text">Heart & Precision</span></h1>
          <p>Transform your musical journey with expert guidance and soulful instruction from Kaustav Mitra</p>
          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.button 
              className="btn-primary" 
              onClick={() => document.getElementById('classes').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={20} />
              Start Learning
            </motion.button>
            <motion.button 
              className="btn-secondary" 
              onClick={() => document.getElementById('student-zone').scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles size={20} />
              Student Zone
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="hero-image"
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          <LazyImage src="/images/hero-guitar.jpg" alt="Professional Guitar" />
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
        [data-theme="light"] .hero {
          background: radial-gradient(circle at 20% 80%, #0ea5e9 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, #0284c7 0%, transparent 50%),
                      #ffffff !important;
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
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 1.5rem;
          color: #ffffff;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          letter-spacing: -0.5px;
        }
        p {
          font-size: 1.3rem;
          color: #e0e0e0;
          margin-bottom: 2rem;
          line-height: 1.6;
          font-weight: 500;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
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
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .btn-primary, .btn-secondary {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .btn-primary:hover, .btn-secondary:hover {
          animation: none;
          transform: translateY(-3px) scale(1.05);
        }
        @media (max-width: 768px) {
          .hero {
            padding: 120px 1rem 0;
            min-height: calc(100vh - 120px);
          }
        }
        @media (min-width: 769px) {
          .hero {
            padding-top: 120px;
          }
        }
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 2rem;
          }
          h1 {
            font-size: 2.5rem;
            line-height: 1.3;
            font-weight: 800;
          }
          .gradient-text {
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            display: inline;
          }
          p {
            font-size: 1.1rem;
            font-weight: 500;
          }
          [data-theme="light"] h1 {
            color: #0f172a !important;
            text-shadow: 0 2px 8px rgba(14, 165, 233, 0.3) !important;
            font-weight: 900 !important;
          }
          [data-theme="light"] p {
            color: #1e293b !important;
            text-shadow: none !important;
            font-weight: 600 !important;
          }
          .hero-buttons {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          .btn-primary, .btn-secondary {
            width: 100%;
            max-width: 250px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;