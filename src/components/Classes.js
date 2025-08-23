import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Star } from 'lucide-react';

const Classes = () => {
  return (
    <section id="classes" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Class Schedule & Instructor</h2>
          <div className="classes-grid">
            <div className="schedule-card glass-card">
              <h3><Calendar size={24} /> Weekend Classes</h3>
              <div className="schedule-details">
                <div className="schedule-item">
                  <Calendar size={20} />
                  <span>Saturday & Sunday</span>
                </div>
                <div className="schedule-item">
                  <Clock size={20} />
                  <span>Morning: 9:00 AM - 1:00 PM</span>
                </div>
                <div className="schedule-item">
                  <Clock size={20} />
                  <span>Evening: 5:30 PM - 8:00 PM</span>
                </div>
              </div>
              <div className="features">
                <div className="feature">✓ Small Group Sessions</div>
                <div className="feature">✓ Personalized Learning</div>
                <div className="feature">✓ All Skill Levels</div>
                <div className="feature">✓ Performance Opportunities</div>
              </div>
            </div>
            
            <div className="instructor-card glass-card">
              <div className="instructor-image">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face" alt="Kaustav Mitra" />
              </div>
              <h3><User size={24} /> Kaustav Mitra</h3>
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />
                ))}
                <span>Expert Instructor</span>
              </div>
              <p>Professional guitarist with 10+ years of teaching experience. Specializes in acoustic, electric, and classical guitar across multiple genres including rock, blues, jazz, and Indian classical music.</p>
              <div className="credentials">
                <div className="credential">🎓 Music Degree</div>
                <div className="credential">🏆 Award Winner</div>
                <div className="credential">🎸 Multi-Genre Expert</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <style jsx>{`
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #667eea;
        }
        .classes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .schedule-card h3, .instructor-card h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #667eea;
          font-size: 1.5rem;
        }
        .schedule-details {
          margin-bottom: 2rem;
        }
        .schedule-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.8rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .features {
          display: grid;
          gap: 0.5rem;
        }
        .feature {
          color: #22c55e;
          font-weight: 500;
        }
        .instructor-image {
          text-align: center;
          margin-bottom: 1rem;
        }
        .instructor-image img {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #667eea;
        }
        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          justify-content: center;
        }
        .rating span {
          color: #fbbf24;
          font-weight: 600;
        }
        .instructor-card p {
          text-align: center;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          color: #b0b0b0;
        }
        .credentials {
          display: grid;
          gap: 0.5rem;
        }
        .credential {
          text-align: center;
          padding: 0.5rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .classes-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          
          .schedule-card, .instructor-card {
            padding: 1.5rem;
          }
          
          .schedule-card h3, .instructor-card h3 {
            font-size: 1.3rem;
          }
          
          .instructor-image img {
            width: 100px;
            height: 100px;
          }
          
          .credentials {
            gap: 0.3rem;
          }
          
          .credential {
            font-size: 0.8rem;
            padding: 0.4rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Classes;