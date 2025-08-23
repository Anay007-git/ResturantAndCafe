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
              <div className="weekday-info">
                <h4>Weekday Classes Available:</h4>
                <div className="weekday-item">
                  <span>• Tuesday – from 5:30 PM onwards</span>
                </div>
                <div className="weekday-item">
                  <span>• Wednesday – from 5:30 PM onwards</span>
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
              <p>Professional musician with 10+ years of teaching experience. I specialize in lute instruments including Electric Guitar, Bass, Mandolin, Dotara, Ukulele, Banjo, and more. Additionally, I also offer lessons in Vocals, Drums, and Keyboard as add-on services.</p>
              <div className="specializations">
                <h4>Lute Instruments:</h4>
                <div className="instruments-grid">
                  <span className="instrument">🎸 Electric Guitar</span>
                  <span className="instrument">🎸 Bass</span>
                  <span className="instrument">🎵 Mandolin</span>
                  <span className="instrument">🎶 Dotara</span>
                  <span className="instrument">🎸 Ukulele</span>
                  <span className="instrument">🪕 Banjo</span>
                </div>
                <h4>Add-on Services:</h4>
                <div className="addon-services">
                  <span className="service">🎤 Vocals</span>
                  <span className="service">🥁 Drums</span>
                  <span className="service">🎹 Keyboard</span>
                </div>
              </div>
              <div className="credentials">
                <div className="credential">🎓 Music Degree</div>
                <div className="credential">🏆 Award Winner</div>
                <div className="credential">🎸 Multi-Instrument Expert</div>
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
        .weekday-info {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 10px;
          border-left: 4px solid #667eea;
        }
        .weekday-info h4 {
          color: #667eea;
          margin-bottom: 0.8rem;
          font-size: 1.1rem;
        }
        .weekday-item {
          margin-bottom: 0.5rem;
        }
        .weekday-item span {
          color: #e0e0e0;
          font-weight: 500;
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
        .specializations {
          margin-bottom: 1.5rem;
        }
        .specializations h4 {
          color: #667eea;
          margin: 1rem 0 0.5rem 0;
          font-size: 1rem;
          text-align: left;
        }
        .instruments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.5rem;
          margin-bottom: 1rem;
        }
        .instrument, .service {
          background: rgba(102, 126, 234, 0.1);
          padding: 0.4rem 0.6rem;
          border-radius: 6px;
          font-size: 0.85rem;
          text-align: center;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        .addon-services {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .service {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.2);
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