import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone } from 'lucide-react';

const DemoBooking = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    instrument: 'Guitar'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('');

  const timeSlots = [
    { id: 'morning1', time: '9:00 AM - 9:30 AM', label: 'Morning Session 1' },
    { id: 'morning2', time: '9:30 AM - 10:00 AM', label: 'Morning Session 2' },
    { id: 'morning3', time: '10:00 AM - 10:30 AM', label: 'Morning Session 3' },
    { id: 'morning4', time: '10:30 AM - 11:00 AM', label: 'Morning Session 4' },
    { id: 'morning5', time: '11:00 AM - 11:30 AM', label: 'Morning Session 5' },
    { id: 'morning6', time: '11:30 AM - 12:00 PM', label: 'Morning Session 6' },
    { id: 'evening1', time: '7:00 PM - 7:30 PM', label: 'Evening Session 1' },
    { id: 'evening2', time: '7:30 PM - 8:00 PM', label: 'Evening Session 2' },
    { id: 'evening3', time: '8:00 PM - 8:30 PM', label: 'Evening Session 3' },
    { id: 'evening4', time: '8:30 PM - 9:00 PM', label: 'Evening Session 4' }
  ];

  const instruments = ['Guitar', 'Bass', 'Mandolin', 'Dotara', 'Ukulele', 'Banjo', 'Vocals', 'Drums', 'Keyboard'];

  const getNextSevenDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push({
        date: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      });
    }
    return days;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        ...formData,
        date: selectedDate,
        timeSlot: timeSlots.find(slot => slot.id === selectedSlot)?.time,
        timestamp: new Date().toISOString()
      };

      // Email service integration (using EmailJS or similar service)
      const emailData = {
        to_email: 'mitrakaustav17@gmail.com',
        cc_email: 'anaybis11@gmail.com',
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        instrument: formData.instrument,
        demo_date: new Date(selectedDate).toLocaleDateString(),
        time_slot: timeSlots.find(slot => slot.id === selectedSlot)?.time,
        booking_time: new Date().toLocaleString()
      };

      // Simulate email sending (replace with actual email service)
      console.log('Booking Data:', emailData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setBookingStatus('success');
      setFormData({ name: '', email: '', phone: '', instrument: 'Guitar' });
      setSelectedDate('');
      setSelectedSlot('');
      
    } catch (error) {
      setBookingStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="demo-booking" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2>📅 Book Your Free Demo Class</h2>
          <p className="section-subtitle">Experience our teaching style with a complimentary demo session</p>
          
          <div className="booking-container glass-card">
            {bookingStatus === 'success' && (
              <div className="success-message">
                <h3>🎉 Demo Class Booked Successfully!</h3>
                <p>We'll send you a confirmation email shortly. See you soon!</p>
              </div>
            )}
            
            {bookingStatus === 'error' && (
              <div className="error-message">
                <h3>❌ Booking Failed</h3>
                <p>Please try again or contact us directly.</p>
              </div>
            )}
            
            {bookingStatus !== 'success' && (
              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-section">
                  <h3><User size={20} /> Personal Details</h3>
                  <div className="form-grid">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                    <select
                      name="instrument"
                      value={formData.instrument}
                      onChange={handleInputChange}
                      required
                    >
                      {instruments.map(instrument => (
                        <option key={instrument} value={instrument}>{instrument}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-section">
                  <h3><Calendar size={20} /> Select Date</h3>
                  <div className="date-grid">
                    {getNextSevenDays().map(day => (
                      <button
                        key={day.date}
                        type="button"
                        className={`date-btn ${selectedDate === day.date ? 'selected' : ''}`}
                        onClick={() => setSelectedDate(day.date)}
                      >
                        {day.display}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-section">
                  <h3><Clock size={20} /> Select Time Slot (30 min sessions)</h3>
                  <div className="sessions-container">
                    <div className="session-group">
                      <h4>🌅 Morning Sessions (9:00 AM - 12:00 PM)</h4>
                      <div className="slot-grid">
                        {timeSlots.filter(slot => slot.id.startsWith('morning')).map(slot => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`slot-btn ${selectedSlot === slot.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot.id)}
                          >
                            <div className="slot-time">{slot.time}</div>
                            <div className="slot-capacity">Max 5 students</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="session-group">
                      <h4>🌆 Evening Sessions (7:00 PM - 9:00 PM)</h4>
                      <div className="slot-grid">
                        {timeSlots.filter(slot => slot.id.startsWith('evening')).map(slot => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`slot-btn ${selectedSlot === slot.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot.id)}
                          >
                            <div className="slot-time">{slot.time}</div>
                            <div className="slot-capacity">Max 5 students</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="book-btn"
                  disabled={!selectedDate || !selectedSlot || isSubmitting}
                >
                  {isSubmitting ? '📧 Booking...' : '🎸 Book Demo Class'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        h2 {
          text-align: center;
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #667eea;
        }
        .section-subtitle {
          text-align: center;
          font-size: 1.1rem;
          color: #b0b0b0;
          margin-bottom: 3rem;
        }
        .booking-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .success-message, .error-message {
          text-align: center;
          padding: 2rem;
        }
        .success-message h3 {
          color: #22c55e;
          margin-bottom: 1rem;
        }
        .error-message h3 {
          color: #ef4444;
          margin-bottom: 1rem;
        }
        .form-section {
          margin-bottom: 2rem;
        }
        .form-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #667eea;
          margin-bottom: 1rem;
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .form-grid input, .form-grid select {
          padding: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 1rem;
          outline: none;
        }
        .form-grid input::placeholder {
          color: #888;
        }
        .form-grid select {
          cursor: pointer;
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 0.8rem center;
          background-size: 1rem;
          padding-right: 2.5rem;
        }
        .form-grid select option {
          background: #1a1a2e;
          color: white;
          padding: 0.5rem;
        }
        .date-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 0.8rem;
        }
        .date-btn {
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .date-btn:hover, .date-btn.selected {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
        }
        .sessions-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .session-group h4 {
          color: #667eea;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          text-align: center;
        }
        .slot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.8rem;
        }
        .slot-btn {
          padding: 1rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        .slot-btn:hover, .slot-btn.selected {
          border-color: #667eea;
          background: rgba(102, 126, 234, 0.2);
          transform: translateY(-2px);
        }
        .slot-time {
          color: #667eea;
          font-weight: 600;
          font-size: 0.95rem;
          margin-bottom: 0.3rem;
        }
        .slot-capacity {
          font-size: 0.8rem;
          color: #22c55e;
          font-weight: 500;
        }
        .book-btn {
          width: 100%;
          padding: 1.2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        .book-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        }
        .book-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          .form-grid {
            grid-template-columns: 1fr;
          }
          .date-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .slot-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .sessions-container {
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default DemoBooking;