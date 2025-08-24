import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import emailjs from '@emailjs/browser';

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
  const [bookedSlots, setBookedSlots] = useState({});

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

  const getSlotKey = (date, slotId) => `${date}-${slotId}`;
  
  const getRemainingSlots = (date, slotId) => {
    const slotKey = getSlotKey(date, slotId);
    const booked = bookedSlots[slotKey] || 0;
    return Math.max(0, 5 - booked);
  };
  
  const isSlotFull = (date, slotId) => {
    return getRemainingSlots(date, slotId) === 0;
  };
  
  const isSlotPast = (date, slotId) => {
    const now = new Date();
    const today = new Date().toISOString().split('T')[0];
    
    // If not today, allow booking
    if (date !== today) return false;
    
    // Get slot time
    const slot = timeSlots.find(s => s.id === slotId);
    if (!slot) return true;
    
    const [startTime] = slot.time.split(' - ');
    const [hour, minute] = startTime.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1, 3);
    const amPm = startTime.includes('PM') ? 'PM' : 'AM';
    
    let hour24 = parseInt(hour);
    if (amPm === 'PM' && hour24 !== 12) hour24 += 12;
    if (amPm === 'AM' && hour24 === 12) hour24 = 0;
    
    const slotDateTime = new Date();
    slotDateTime.setHours(hour24, parseInt(minute), 0, 0);
    
    return now >= slotDateTime;
  };
  
  const isSlotDisabled = (date, slotId) => {
    return isSlotFull(date, slotId) || isSlotPast(date, slotId);
  };

  const createGoogleCalendarLink = (date, timeSlot) => {
    const selectedDateTime = new Date(date);
    const [startTime] = timeSlot.split(' - ');
    
    // Parse start time
    const [startHour, startMinute] = startTime.match(/(\d+):(\d+)\s*(AM|PM)/).slice(1, 3);
    const startAmPm = startTime.includes('PM') ? 'PM' : 'AM';
    let startHour24 = parseInt(startHour);
    if (startAmPm === 'PM' && startHour24 !== 12) startHour24 += 12;
    if (startAmPm === 'AM' && startHour24 === 12) startHour24 = 0;
    
    selectedDateTime.setHours(startHour24, parseInt(startMinute), 0, 0);
    const startISO = selectedDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    // Add 30 minutes for end time
    const endDateTime = new Date(selectedDateTime.getTime() + 30 * 60000);
    const endISO = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const title = encodeURIComponent(`Guitar Demo Class - ${formData.instrument}`);
    const details = encodeURIComponent(`Demo class with ${formData.name}\nInstrument: ${formData.instrument}\nContact: ${formData.phone}\nEmail: ${formData.email}`);
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startISO}/${endISO}&details=${details}&location=Presto Guitar Academy, 85 Road No. 1, H B Town, Sodepur, Kolkata 700110`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const selectedTimeSlot = timeSlots.find(slot => slot.id === selectedSlot);
      const bookingDate = new Date(selectedDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // EmailJS configuration
      emailjs.init('-x6pionKVpG71eDz4'); // Replace with your EmailJS public key
      
      const emailParams = {
        to_name: 'Kaustav Mitra',
        to_email: 'mitrakaustav17@gmail.com',
        cc_email: 'anaybis11@gmail.com',
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        instrument: formData.instrument,
        demo_date: bookingDate,
        time_slot: selectedTimeSlot?.time,
        booking_time: new Date().toLocaleString(),
        calendar_link: createGoogleCalendarLink(selectedDate, selectedTimeSlot?.time)
      };

      // Send email using EmailJS
      await emailjs.send(
        'service_gkueejb', // Replace with your EmailJS service ID
        'template_dfxgdcd', // Replace with your EmailJS template ID
        emailParams
      );
      
      // Update booked slots count
      const slotKey = getSlotKey(selectedDate, selectedSlot);
      setBookedSlots(prev => ({
        ...prev,
        [slotKey]: (prev[slotKey] || 0) + 1
      }));
      
      // Open Google Calendar for instructor
      const calendarLink = createGoogleCalendarLink(selectedDate, selectedTimeSlot?.time);
      window.open(calendarLink, '_blank');
      
      setBookingStatus('success');
      setFormData({ name: '', email: '', phone: '', instrument: 'Guitar' });
      setSelectedDate('');
      setSelectedSlot('');
      
    } catch (error) {
      console.error('Booking error:', error);
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
                <p>✅ Confirmation email sent to instructor<br/>
                📅 Google Calendar event created<br/>
                📧 You'll receive a confirmation email shortly</p>
                <button 
                  className="btn-primary" 
                  onClick={() => setBookingStatus('')}
                  style={{ marginTop: '1rem' }}
                >
                  Book Another Class
                </button>
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
                        {timeSlots.filter(slot => slot.id.startsWith('morning')).map(slot => {
                          const remaining = getRemainingSlots(selectedDate, slot.id);
                          const isFull = isSlotFull(selectedDate, slot.id);
                          const isPast = isSlotPast(selectedDate, slot.id);
                          const isDisabled = isSlotDisabled(selectedDate, slot.id);
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              className={`slot-btn ${selectedSlot === slot.id ? 'selected' : ''} ${isFull ? 'full' : ''} ${isPast ? 'past' : ''}`}
                              onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                              disabled={isDisabled}
                            >
                              <div className="slot-time">{slot.time}</div>
                              <div className={`slot-capacity ${isFull ? 'full' : isPast ? 'past' : remaining <= 2 ? 'low' : ''}`}>
                                {isPast ? '⏰ Past' : isFull ? '❌ Full' : `${remaining} spots left`}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className="session-group">
                      <h4>🌆 Evening Sessions (7:00 PM - 9:00 PM)</h4>
                      <div className="slot-grid">
                        {timeSlots.filter(slot => slot.id.startsWith('evening')).map(slot => {
                          const remaining = getRemainingSlots(selectedDate, slot.id);
                          const isFull = isSlotFull(selectedDate, slot.id);
                          const isPast = isSlotPast(selectedDate, slot.id);
                          const isDisabled = isSlotDisabled(selectedDate, slot.id);
                          return (
                            <button
                              key={slot.id}
                              type="button"
                              className={`slot-btn ${selectedSlot === slot.id ? 'selected' : ''} ${isFull ? 'full' : ''} ${isPast ? 'past' : ''}`}
                              onClick={() => !isDisabled && setSelectedSlot(slot.id)}
                              disabled={isDisabled}
                            >
                              <div className="slot-time">{slot.time}</div>
                              <div className={`slot-capacity ${isFull ? 'full' : isPast ? 'past' : remaining <= 2 ? 'low' : ''}`}>
                                {isPast ? '⏰ Past' : isFull ? '❌ Full' : `${remaining} spots left`}
                              </div>
                            </button>
                          );
                        })}
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
        .slot-capacity.low {
          color: #f59e0b;
        }
        .slot-capacity.full {
          color: #ef4444;
        }
        .slot-btn.full {
          opacity: 0.5;
          cursor: not-allowed;
          border-color: #ef4444;
        }
        .slot-btn.full:hover {
          transform: none;
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
        .slot-capacity.past {
          color: #6b7280;
        }
        .slot-btn.past {
          opacity: 0.4;
          cursor: not-allowed;
          border-color: #6b7280;
        }
        .slot-btn.past:hover {
          transform: none;
          border-color: #6b7280;
          background: rgba(107, 114, 128, 0.1);
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