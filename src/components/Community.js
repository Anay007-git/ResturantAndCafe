import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Plus, Heart, MessageCircle, Share2, User, Clock, Tag, ArrowUp, ArrowDown, Award, Shield } from 'lucide-react';
import { sendOTP, generateOTP } from '../utils/emailService';

const Community = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'GuitarMaster92',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuitarMaster92',
      time: '2h ago',
      category: 'Question',
      title: 'Help with F chord transition',
      content: 'I\'m struggling with the transition from C to F chord. Any tips for smooth changes? I\'ve been practicing for weeks but still can\'t get it smooth.',
      upvotes: 12,
      downvotes: 1,
      comments: 8,
      tags: ['beginner', 'chords', 'help'],
      userBadge: 'Beginner',
      verified: true
    },
    {
      id: 2,
      author: 'StrumQueen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrumQueen',
      time: '4h ago',
      category: 'Knowledge',
      title: 'Essential strumming patterns for beginners',
      content: 'Here are 5 strumming patterns every beginner should master:\n\n1. D-D-U-U-D-U (Down-Down-Up-Up-Down-Up)\n2. D-D-U-D-U (Classic folk pattern)\n3. D-U-X-U-D-U (X = muted strum)\n\nPractice these slowly first!',
      upvotes: 45,
      downvotes: 2,
      comments: 15,
      tags: ['strumming', 'beginner', 'tutorial'],
      userBadge: 'Expert',
      verified: true
    },
    {
      id: 3,
      author: 'RockStar_Dev',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RockStar_Dev',
      time: '6h ago',
      category: 'Discussion',
      title: 'Best guitar for intermediate players under $500?',
      content: 'Looking to upgrade from my starter Yamaha F310. Budget is around $500. Considering Fender CD-60S or Epiphone DR-100. Any recommendations from the community?',
      upvotes: 18,
      downvotes: 0,
      comments: 22,
      tags: ['gear', 'intermediate', 'advice'],
      userBadge: 'Intermediate',
      verified: false
    }
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Question', tags: '' });

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password')
    };
    
    setSignUpData(userData);
    const otp = generateOTP();
    setGeneratedOTP(otp);
    
    const emailSent = await sendOTP(userData.email, otp);
    if (emailSent) {
      setShowSignUp(false);
      setShowOTPVerification(true);
    } else {
      alert('Failed to send verification email. Please try again.');
    }
  };
  
  const handleOTPVerification = (e) => {
    e.preventDefault();
    if (otpCode === generatedOTP) {
      setCurrentUser({
        username: signUpData.username,
        email: signUpData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signUpData.username}`,
        badge: 'Newbie',
        verified: true
      });
      setIsSignedUp(true);
      setShowOTPVerification(false);
      setOtpCode('');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      author: currentUser.username,
      avatar: currentUser.avatar,
      time: 'now',
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      userBadge: currentUser.badge,
      verified: currentUser.verified
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'Question', tags: '' });
    setShowNewPost(false);
  };
  
  const handleVote = (postId, voteType) => {
    setVotes(prev => ({
      ...prev,
      [postId]: voteType
    }));
  };
  
  const getVoteCount = (post) => {
    const userVote = votes[post.id];
    let upvotes = post.upvotes;
    let downvotes = post.downvotes;
    
    if (userVote === 'up') upvotes += 1;
    if (userVote === 'down') downvotes += 1;
    
    return upvotes - downvotes;
  };

  return (
    <section id="community" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="community-header">
            <h2><Users size={32} /> Guitar Community</h2>
            <p>Connect with 10,000+ guitarists worldwide</p>
          </div>

          {!isSignedUp ? (
            <div className="community-cta glass-card">
              <h3>🎸 Join Presto Guitar Community</h3>
              <p>Connect with guitarists worldwide. Share knowledge, get help, and grow together.</p>
              <div className="community-stats">
                <div className="stat">
                  <span className="stat-number">10.2k</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat">
                  <span className="stat-number">1.5k</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Daily Posts</span>
                </div>
              </div>
              <button className="btn-primary" onClick={() => setShowSignUp(true)}>
                <Users size={20} />
                Join Community
              </button>
            </div>
          ) : (
            <div className="user-dashboard glass-card">
              <div className="user-info">
                <img src={currentUser.avatar} alt={currentUser.username} className="user-avatar" />
                <div className="user-details">
                  <span className="username">
                    {currentUser.username}
                    {currentUser.verified && <Shield size={16} className="verified-badge" />}
                  </span>
                  <span className="user-badge">{currentUser.badge}</span>
                </div>
              </div>
              <button className="btn-primary" onClick={() => setShowNewPost(true)}>
                <Plus size={20} />
                Create Post
              </button>
            </div>
          )}

          <div className="community-posts">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="post-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="post-voting">
                  <button 
                    className={`vote-btn ${votes[post.id] === 'up' ? 'active' : ''}`}
                    onClick={() => handleVote(post.id, votes[post.id] === 'up' ? null : 'up')}
                  >
                    <ArrowUp size={20} />
                  </button>
                  <span className="vote-count">{getVoteCount(post)}</span>
                  <button 
                    className={`vote-btn ${votes[post.id] === 'down' ? 'active' : ''}`}
                    onClick={() => handleVote(post.id, votes[post.id] === 'down' ? null : 'down')}
                  >
                    <ArrowDown size={20} />
                  </button>
                </div>
                
                <div className="post-main">
                  <div className="post-header">
                    <img src={post.avatar} alt={post.author} className="post-avatar" />
                    <div className="post-meta">
                      <div className="author-info">
                        <span className="post-author">
                          {post.author}
                          {post.verified && <Shield size={14} className="verified-badge" />}
                        </span>
                        <span className={`user-badge ${post.userBadge.toLowerCase()}`}>
                          <Award size={12} />
                          {post.userBadge}
                        </span>
                      </div>
                      <span className="post-time"><Clock size={14} /> {post.time}</span>
                    </div>
                    <span className={`post-category ${post.category.toLowerCase()}`}>
                      {post.category}
                    </span>
                  </div>
                  
                  <div className="post-content">
                    <h3>{post.title}</h3>
                    <p>{post.content.split('\n').map((line, i) => (
                      <span key={i}>{line}<br /></span>
                    ))}</p>
                    
                    <div className="post-tags">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                          <Tag size={12} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="post-actions">
                    <button className="action-btn">
                      <MessageCircle size={18} />
                      {post.comments} Comments
                    </button>
                    <button className="action-btn">
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sign Up Modal */}
      <AnimatePresence>
        {showSignUp && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSignUp(false)}
          >
            <motion.div
              className="modal-content signup-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🎸 Join Presto Guitar Community</h3>
              <p>Create your account and start connecting with fellow guitarists</p>
              <form onSubmit={handleSignUp}>
                <input type="text" name="username" placeholder="Choose a username" required />
                <input type="email" name="email" placeholder="Your email address" required />
                <input type="password" name="password" placeholder="Create a password" required />
                <button type="submit" className="btn-primary">Send Verification Code</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOTPVerification && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content otp-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h3>📧 Verify Your Email</h3>
              <p>We've sent a 6-digit code to <strong>{signUpData.email}</strong></p>
              <form onSubmit={handleOTPVerification}>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit code" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  maxLength="6"
                  required 
                />
                <button type="submit" className="btn-primary">Verify & Join</button>
              </form>
              <p className="otp-note">Didn't receive the code? Check your spam folder or try again.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Post Modal */}
      <AnimatePresence>
        {showNewPost && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewPost(false)}
          >
            <motion.div
              className="modal-content post-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Create New Post</h3>
              <form onSubmit={handleNewPost}>
                <select 
                  value={newPost.category} 
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                >
                  <option value="Question">Question</option>
                  <option value="Knowledge">Knowledge</option>
                  <option value="Discussion">Discussion</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Post title" 
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  required 
                />
                <textarea 
                  placeholder="Share your thoughts..." 
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  required
                ></textarea>
                <input 
                  type="text" 
                  placeholder="Tags (comma separated)" 
                  value={newPost.tags}
                  onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                />
                <button type="submit" className="btn-primary">Post</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .community-header {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #667eea;
        }
        
        .community-header p {
          font-size: 1.1rem;
          color: #b0b0b0;
        }
        
        .community-cta {
          text-align: center;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
        }
        
        .community-cta h3 {
          color: #667eea;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        
        .community-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin: 2rem 0;
        }
        
        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
        }
        
        .stat-label {
          font-size: 0.9rem;
          color: #8e8e8e;
        }
        
        .user-dashboard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          margin-bottom: 3rem;
        }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .user-avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        
        .user-details {
          display: flex;
          flex-direction: column;
        }
        
        .username {
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .verified-badge {
          color: #22c55e;
        }
        
        .user-badge {
          font-size: 0.8rem;
          padding: 0.2rem 0.6rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 0.3rem;
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
        }
        
        .community-posts {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .post-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-left: 3px solid transparent;
          transition: border-color 0.3s ease;
        }
        
        .post-card:hover {
          border-left-color: #667eea;
        }
        
        .post-voting {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 40px;
        }
        
        .vote-btn {
          background: none;
          border: none;
          color: #8e8e8e;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .vote-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .vote-btn.active {
          color: #667eea;
        }
        
        .vote-count {
          font-weight: 600;
          color: white;
          font-size: 0.9rem;
        }
        
        .post-main {
          flex: 1;
        }
        
        .post-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .post-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .post-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        
        .post-author {
          font-weight: 600;
          color: white;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .post-time {
          font-size: 0.8rem;
          color: #8e8e8e;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .post-category {
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        
        .post-category.question {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .post-category.knowledge {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
        
        .post-category.discussion {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }
        
        .post-content h3 {
          color: #667eea;
          margin-bottom: 1rem;
        }
        
        .post-content p {
          color: #d0d0d0;
          line-height: 1.6;
          margin-bottom: 1rem;
        }
        
        .post-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        
        .tag {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 0.3rem 0.6rem;
          border-radius: 12px;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        
        .post-actions {
          display: flex;
          gap: 2rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .action-btn {
          background: none;
          border: none;
          color: #8e8e8e;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.3s ease;
        }
        
        .action-btn:hover {
          color: #667eea;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: #1a1a1a;
          padding: 2rem;
          border-radius: 15px;
          width: 90%;
          max-width: 500px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .otp-modal {
          text-align: center;
        }
        
        .otp-modal input {
          text-align: center;
          font-size: 1.2rem;
          letter-spacing: 0.5rem;
          font-weight: 600;
        }
        
        .otp-note {
          font-size: 0.8rem;
          color: #8e8e8e;
          margin-top: 1rem;
        }
        
        .modal-content h3 {
          color: #667eea;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .modal-content form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .modal-content input,
        .modal-content select,
        .modal-content textarea {
          padding: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .modal-content textarea {
          min-height: 120px;
          resize: vertical;
        }
        
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .post-card {
            padding: 1rem;
            flex-direction: column;
          }
          
          .post-voting {
            flex-direction: row;
            justify-content: center;
            order: 2;
            margin-top: 1rem;
          }
          
          .community-stats {
            gap: 1.5rem;
          }
          
          .user-dashboard {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .modal-content {
            width: 95%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Community;