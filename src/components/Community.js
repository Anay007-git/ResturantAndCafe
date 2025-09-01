import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ArrowUp, ArrowDown, MessageCircle, Share2, Plus, Mail, Shield, Award, Clock, Tag, X } from 'lucide-react';
import { sendOTP, generateOTP, validateEmail, validateOTP } from '../utils/emailService';
import { apiService } from '../utils/apiService';
import SEO from './SEO';

const Community = () => {
  // Page SEO
  const meta = {
    title: 'Presto Guitar Community — Connect, Share, Learn',
    description: 'Join the Presto Guitar Community to ask doubts, share solutions, and connect with fellow guitarists. Participate in discussions and get feedback from experienced players.',
    url: 'https://www.prestoguitaracademy.com/#community',
    image: '/images/community-og.jpg'
  };

  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [recoveryData, setRecoveryData] = useState(null);
  const [showRecoveryCodeDisplay, setShowRecoveryCodeDisplay] = useState(false);
  const [showRecoveryCodeInput, setShowRecoveryCodeInput] = useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState('');
  const [inputRecoveryCode, setInputRecoveryCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [showOTPDisplay, setShowOTPDisplay] = useState(false);
  const [displayedOTP, setDisplayedOTP] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' });
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [otpCode, setOtpCode] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [votes, setVotes] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState({});
  
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'GuitarMaster92',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GuitarMaster92',
      time: '2h ago',
      category: 'Doubt',
      title: 'Struggling with F chord transition - Need help!',
      content: 'I\'ve been practicing for weeks but still can\'t get smooth transitions from C to F chord. My fingers keep muting strings. Any tips from experienced players?',
      upvotes: 24,
      downvotes: 2,
      comments: 12,
      tags: ['beginner', 'chords', 'technique'],
      userBadge: 'Beginner',
      verified: true
    },
    {
      id: 2,
      author: 'StrumQueen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StrumQueen',
      time: '4h ago',
      category: 'Solution',
      title: 'How I mastered barre chords in 30 days',
      content: 'After struggling with barre chords for months, I found a practice routine that worked:\n\n1. Start with partial barre (2-3 strings)\n2. Practice 5 minutes daily\n3. Focus on thumb position\n4. Use lighter gauge strings initially\n\nNow I can play F, Bm, and other barre chords cleanly!',
      upvotes: 67,
      downvotes: 1,
      comments: 23,
      tags: ['technique', 'practice', 'barre-chords'],
      userBadge: 'Expert',
      verified: true
    },
    {
      id: 3,
      author: 'BluesLover88',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BluesLover88',
      time: '6h ago',
      category: 'Confession',
      title: 'I\'ve been playing for 5 years and still can\'t play Wonderwall properly',
      content: 'Everyone expects me to know it since I play guitar, but I never actually learned it properly. The strumming pattern always trips me up. Anyone else have songs they "should" know but don\'t?',
      upvotes: 156,
      downvotes: 8,
      comments: 45,
      tags: ['confession', 'strumming', 'popular-songs'],
      userBadge: 'Intermediate',
      verified: false
    }
  ]);
  
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Doubt', tags: '' });

  const categories = ['All', 'Doubt', 'Solution', 'Confession'];

  const handleSignUp = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password')
    };
    
    // Validate email format
    if (!validateEmail(userData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Validate username
    if (userData.username.length < 3) {
      alert('Username must be at least 3 characters long');
      return;
    }
    
    try {
      // Check username availability
      if (await apiService.checkUsername(userData.username)) {
        alert('Username not available. Please choose a different username.');
        return;
      }
      
      // Check email availability
      if (await apiService.checkEmail(userData.email)) {
        alert('Email already registered. Please sign in instead.');
        return;
      }
    } catch (error) {
      console.log('Validation check failed, proceeding with signup');
    }
    
    setSignUpData(userData);
    const otp = generateOTP();
    setGeneratedOTP(otp);
    
    console.log(`📧 Generated OTP: ${otp} for ${userData.email}`);
    
    // Try to send OTP via EmailJS, but always show OTP on screen
    try {
      await sendOTP(userData.email, otp);
    } catch (error) {
      console.log('Email service not available, showing OTP on screen');
    }
    
    // Always show OTP on screen for demo
    setDisplayedOTP(otp);
    setShowSignUp(false);
    setShowOTPDisplay(true);
    
    // Auto-proceed to verification after 3 seconds
    setTimeout(() => {
      setShowOTPDisplay(false);
      setShowOTPVerification(true);
    }, 3000);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    if (!forgotEmail.trim()) {
      alert('Please enter your email address.');
      return;
    }
    
    try {
      const result = await apiService.recoverPassword(forgotEmail.trim());
      
      if (result.error) {
        alert(`❌ ${result.error || 'Recovery failed. Please try again.'}`);
      } else {
        setRecoveryData(result);
        setRecoveryCode(result.token);
        setShowForgotPassword(false);
        setShowRecoveryCodeDisplay(true);
        
        // Auto-proceed to input after 3 seconds
        setTimeout(() => {
          setShowRecoveryCodeDisplay(false);
          setShowRecoveryCodeInput(true);
        }, 3000);
      }
    } catch (error) {
      console.error('Recovery error:', error);
      alert('❌ Network error. Please check your connection and try again.');
    }
  };
  
  const handleRecoveryCodeSubmit = (e) => {
    e.preventDefault();
    
    if (inputRecoveryCode === recoveryCode) {
      setShowRecoveryCodeInput(false);
      setShowNewPasswordModal(true);
    } else {
      alert('❌ Invalid recovery code. Please try again.');
    }
  };
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('❌ Passwords do not match. Please try again.');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('❌ Password must be at least 6 characters long.');
      return;
    }
    
    try {
      const result = await apiService.resetPassword(forgotEmail, recoveryCode, newPassword);
      
      if (result.error) {
        alert(`❌ ${result.error}`);
      } else {
        alert(`✅ Password reset successful!\nUsername: ${recoveryData.username}\nYou can now sign in with your new password.`);
        setShowNewPasswordModal(false);
        setNewPassword('');
        setConfirmPassword('');
        setInputRecoveryCode('');
        setRecoveryCode('');
        setRecoveryData(null);
        setForgotEmail('');
        setShowSignIn(true);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('❌ Network error. Please check your connection and try again.');
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password')
    };
    
    // Validate email format
    if (!validateEmail(loginData.email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    try {
      const user = await apiService.login(loginData);
      if (user.error) {
        alert('❌ Invalid email or password. Please try again or sign up.');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        setIsSignedUp(true);
        setShowSignIn(false);
        alert(`✅ Welcome back, ${user.username}!`);
      }
    } catch (error) {
      alert('❌ Login failed. Please try again.');
    }
  };
  
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    
    // Validate OTP format
    if (!validateOTP(otpCode)) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    
    if (otpCode === generatedOTP) {
      const newUser = {
        username: signUpData.username,
        email: signUpData.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${signUpData.username}`,
        badge: 'Newbie',
        verified: true
      };
      
      // Register user with backend
      const result = await apiService.register(signUpData);
      if (result.error) {
        alert('❌ Registration failed. Please try again.');
      } else {
        localStorage.setItem('currentUser', JSON.stringify(result));
        setCurrentUser(result);
        setIsSignedUp(true);
        setShowOTPVerification(false);
        setOtpCode('');
        alert(`✅ Welcome to Presto Guitar Community, ${signUpData.username}!`);
      }
    } else {
      alert('❌ Invalid OTP. Please check your email and try again.');
    }
  };

  const handleNewPost = async (e) => {
    e.preventDefault();
    const postData = {
      author: currentUser.username,
      authorId: currentUser.id,
      avatar: currentUser.avatar,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      tags: newPost.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      userBadge: currentUser.badge
    };
    
    try {
      const newPostResponse = await apiService.createPost(postData);
      // Add new post to current posts immediately
      setPosts(prevPosts => [newPostResponse, ...prevPosts]);
      setNewPost({ title: '', content: '', category: 'Doubt', tags: '' });
      setShowNewPost(false);
      alert('✅ Post published successfully!');
    } catch (error) {
      alert('Failed to create post. Please try again.');
    }
  };
  
  const handleVote = async (postId, voteType) => {
    if (!currentUser) {
      alert('Please sign up to vote on posts!');
      return;
    }
    
    try {
      await apiService.vote(postId, voteType, currentUser.id);
      // Refresh posts to show updated vote counts
      const updatedPosts = await apiService.getPosts();
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };
  
  const getVoteCount = (post) => {
    return post.upvotes - post.downvotes;
  };
  
  const handleComment = async (postId) => {
    if (!currentUser) {
      alert('Please sign up to comment on posts!');
      return;
    }
    
    if (!newComment.trim()) return;
    
    try {
      await apiService.addComment(postId, newComment, currentUser.id, currentUser.username);
      setNewComment('');
      // Refresh comments for this post
      const comments = await apiService.getComments(postId);
      setPostComments(prev => ({ ...prev, [postId]: comments }));
      // Update comment count immediately in posts
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id == postId 
            ? { ...post, comments: comments.length }
            : post
        )
      );
      alert('✅ Comment added successfully!');
    } catch (error) {
      console.error('Comment failed:', error);
    }
  };
  
  const toggleComments = async (postId) => {
    const isShowing = showComments[postId];
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
    
    if (!isShowing && !postComments[postId]) {
      try {
        const comments = await apiService.getComments(postId);
        setPostComments(prev => ({ ...prev, [postId]: comments }));
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load posts from backend
        const apiPosts = await apiService.getPosts();
        console.log('Loaded posts from API:', apiPosts);
        if (apiPosts && apiPosts.length > 0) {
          setPosts(apiPosts);
        }
      } catch (error) {
        console.log('Failed to load posts from server:', error);
      }
      
      // Check if user is already logged in
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setIsSignedUp(true);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setVotes({});
    }
  }, [currentUser]);

  return (
    <section id="community" className="section">
      <SEO title={meta.title} description={meta.description} url={meta.url} image={meta.image} />
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="community-header" style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1f2a44', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}><Users size={32} /> Presto Guitar Community</h2>
            <p style={{ color: '#6b7280' }}>Share doubts, solutions, and confessions with fellow guitarists</p>
          </div>

          {!isSignedUp ? (
            <div className="community-cta glass-card">
              <h3>🎸 Join Our Guitar Community</h3>
              <p>Connect with guitarists worldwide. Share your journey, get help, and help others.</p>
              <div className="community-stats">
                <div className="stat">
                  <span className="stat-number">12.5k</span>
                  <span className="stat-label">Members</span>
                </div>
                <div className="stat">
                  <span className="stat-number">2.1k</span>
                  <span className="stat-label">Online</span>
                </div>
                <div className="stat">
                  <span className="stat-number">80+</span>
                  <span className="stat-label">Daily Posts</span>
                </div>
              </div>
              <div className="auth-buttons">
                <button className="btn-primary" onClick={() => setShowSignUp(true)}>
                  <Mail size={20} />
                  Join Community
                </button>
                <button className="btn-secondary" onClick={() => setShowSignIn(true)}>
                  <Shield size={20} />
                  Sign In
                </button>
              </div>
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
                  <span className={`user-badge ${currentUser.badge.toLowerCase()}`}>
                    <Award size={12} />
                    {currentUser.badge}
                  </span>
                </div>
              </div>
              <div className="user-actions">
                <button className="btn-primary" onClick={() => setShowNewPost(true)}>
                  <Plus size={20} />
                  Create Post
                </button>
                <button className="btn-logout" onClick={() => {
                  localStorage.removeItem('currentUser');
                  setCurrentUser(null);
                  setIsSignedUp(false);
                  setVotes({});
                }}>
                  Logout
                </button>
              </div>
            </div>
          )}

          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="community-posts">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                className="post-card glass-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="post-voting">
                  <button 
                    className={`vote-btn ${votes[post.id] === 'up' ? 'active upvote' : ''}`}
                    onClick={() => handleVote(post.id, 'up')}
                  >
                    <ArrowUp size={20} />
                  </button>
                  <span className="vote-count">{getVoteCount(post)}</span>
                  <button 
                    className={`vote-btn ${votes[post.id] === 'down' ? 'active downvote' : ''}`}
                    onClick={() => handleVote(post.id, 'down')}
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
                    <button 
                      className="action-btn"
                      onClick={() => toggleComments(post.id)}
                    >
                      <MessageCircle size={18} />
                      {post.comments} Comments
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => navigator.share ? navigator.share({title: post.title, text: post.content}) : alert('Sharing feature coming soon!')}
                    >
                      <Share2 size={18} />
                      Share
                    </button>
                  </div>
                  
                  {showComments[post.id] && (
                    <div className="comments-section">
                      <div className="comments-list">
                        {(postComments[post.id] || []).map(comment => (
                          <div key={comment.id} className="comment-item">
                            <strong>{comment.username}:</strong>
                            <span>{comment.content}</span>
                            <small>{new Date(comment.timestamp).toLocaleString()}</small>
                          </div>
                        ))}
                      </div>
                      {currentUser && (
                        <div className="comment-form">
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <button onClick={() => handleComment(post.id)}>Post</button>
                        </div>
                      )}
                    </div>
                  )}
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
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowSignUp(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  <Users size={32} />
                </div>
                <h3>Join Presto Guitar Community</h3>
                <p>Connect with guitarists worldwide and share your musical journey</p>
              </div>
              
              <form onSubmit={handleSignUp} className="signup-form">
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="Choose a unique username" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Create a secure password" 
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Mail size={18} />
                  Create Account
                </button>
              </form>
              
              <div className="modal-footer">
                <p>Already have an account? <button type="button" className="link-btn" onClick={() => { setShowSignUp(false); setShowSignIn(true); }}>Sign In</button></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign In Modal */}
      <AnimatePresence>
        {showSignIn && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSignIn(false)}
          >
            <motion.div
              className="modal-content signin-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowSignIn(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  <Shield size={32} />
                </div>
                <h3>Welcome Back</h3>
                <p>Sign in to your Presto Guitar Community account</p>
              </div>
              
              <form onSubmit={handleSignIn} className="signin-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter your password" 
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Shield size={18} />
                  Sign In
                </button>
              </form>
              
              <div className="modal-footer">
                <p>Don't have an account? <button type="button" className="link-btn" onClick={() => { setShowSignIn(false); setShowSignUp(true); }}>Join Community</button></p>
                <p><button type="button" className="link-btn" onClick={() => { setShowSignIn(false); setShowForgotPassword(true); }}>Forgot Password?</button></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowForgotPassword(false)}
          >
            <motion.div
              className="modal-content forgot-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowForgotPassword(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  <Mail size={32} />
                </div>
                <h3>Recover Account</h3>
                <p>Enter your email to get your username and recovery code</p>
              </div>
              
              <form onSubmit={handleForgotPassword} className="signin-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="your.email@example.com" 
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Mail size={18} />
                  Get Recovery Code
                </button>
              </form>
              
              <div className="modal-footer">
                <p>Remember your password? <button type="button" className="link-btn" onClick={() => { setShowForgotPassword(false); setShowSignIn(true); }}>Sign In</button></p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recovery Code Display Modal */}
      <AnimatePresence>
        {showRecoveryCodeDisplay && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content recovery-display-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              <div className="modal-header">
                <div className="modal-icon success">
                  <Mail size={32} />
                </div>
                <h3>Recovery Code Generated</h3>
                <p>Your account recovery code for <strong>{forgotEmail}</strong></p>
              </div>
              
              <div className="recovery-display-section">
                <div className="recovery-label">Your Recovery Code</div>
                <div className="recovery-code-container">
                  {recoveryCode.split('').map((digit, index) => (
                    <motion.div 
                      key={index} 
                      className="recovery-digit"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
                
                <div className="recovery-copy-section">
                  <div className="copy-code">
                    <span>Code: </span>
                    <code>{recoveryCode}</code>
                  </div>
                  <div className="recovery-info">
                    <p><strong>Username:</strong> {recoveryData?.username}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <div className="auto-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p>Auto-proceeding in 3 seconds...</p>
                </div>
                <button 
                  className="btn-submit"
                  onClick={() => {
                    setShowRecoveryCodeDisplay(false);
                    setShowRecoveryCodeInput(true);
                  }}
                >
                  Continue Now
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Recovery Code Input Modal */}
      <AnimatePresence>
        {showRecoveryCodeInput && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content recovery-input-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              <button className="modal-close" onClick={() => setShowRecoveryCodeInput(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon verify">
                  <Mail size={32} />
                </div>
                <h3>Enter Recovery Code</h3>
                <p>Enter the recovery code to verify your account</p>
                <div className="email-display">{forgotEmail}</div>
              </div>
              
              <form onSubmit={handleRecoveryCodeSubmit} className="verification-form">
                <div className="form-group">
                  <label>Recovery Code</label>
                  <input 
                    type="text" 
                    placeholder="000000"
                    value={inputRecoveryCode}
                    onChange={(e) => setInputRecoveryCode(e.target.value)}
                    maxLength="6"
                    className="recovery-input"
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Mail size={18} />
                  Verify Recovery Code
                </button>
              </form>
              
              <div className="verification-help">
                <div className="help-section">
                  <div className="help-icon">💡</div>
                  <div className="help-content">
                    <p>Need help? The code was displayed on the previous screen</p>
                    <div className="code-hint">
                      <span>Your code: </span>
                      <code>{recoveryCode}</code>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New Password Modal */}
      <AnimatePresence>
        {showNewPasswordModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content password-reset-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              <button className="modal-close" onClick={() => setShowNewPasswordModal(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon success">
                  <Shield size={32} />
                </div>
                <h3>Set New Password</h3>
                <p>Create a new secure password for your account</p>
                <div className="email-display">{recoveryData?.username}</div>
              </div>
              
              <form onSubmit={handlePasswordReset} className="password-reset-form">
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength="6"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength="6"
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Shield size={18} />
                  Reset Password
                </button>
              </form>
              
              <div className="modal-footer">
                <p>Password must be at least 6 characters long</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* OTP Display Modal */}
      <AnimatePresence>
        {showOTPDisplay && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-content otp-display-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              <div className="modal-header">
                <div className="modal-icon success">
                  <Shield size={32} />
                </div>
                <h3>Verification Code Generated</h3>
                <p>Your secure access code for <strong>{signUpData.email}</strong></p>
              </div>
              
              <div className="otp-display-section">
                <div className="otp-label">Your Verification Code</div>
                <div className="otp-code-container">
                  {displayedOTP.split('').map((digit, index) => (
                    <motion.div 
                      key={index} 
                      className="otp-digit"
                      initial={{ scale: 0, rotate: 180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                </div>
                
                <div className="otp-copy-section">
                  <div className="copy-code">
                    <span>Code: </span>
                    <code>{displayedOTP}</code>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <div className="auto-progress">
                  <div className="progress-bar">
                    <div className="progress-fill"></div>
                  </div>
                  <p>Auto-proceeding in 3 seconds...</p>
                </div>
                <button 
                  className="btn-submit"
                  onClick={() => {
                    setShowOTPDisplay(false);
                    setShowOTPVerification(true);
                  }}
                >
                  Continue Now
                </button>
              </div>
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
              className="modal-content otp-verification-modal"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
            >
              <div className="modal-header">
                <div className="modal-icon verify">
                  <Shield size={32} />
                </div>
                <h3>Verify Your Account</h3>
                <p>Enter the verification code for</p>
                <div className="email-display">{signUpData.email}</div>
              </div>
              
              <form onSubmit={handleOTPVerification} className="verification-form">
                <div className="form-group">
                  <label>Verification Code</label>
                  <input 
                    type="text" 
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    className="otp-input"
                    required 
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Shield size={18} />
                  Verify & Join Community
                </button>
              </form>
              
              <div className="verification-help">
                <div className="help-section">
                  <div className="help-icon">💡</div>
                  <div className="help-content">
                    <p>Need help? The code was displayed on the previous screen</p>
                    <div className="code-hint">
                      <span>Your code: </span>
                      <code>{displayedOTP}</code>
                    </div>
                  </div>
                </div>
              </div>
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
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowNewPost(false)}>
                <X size={20} />
              </button>
              
              <div className="modal-header">
                <div className="modal-icon">
                  <Plus size={32} />
                </div>
                <h3>Create New Post</h3>
                <p>Share your guitar knowledge with the community</p>
              </div>
              
              <form onSubmit={handleNewPost} className="post-form">
                <div className="form-group">
                  <label>Post Category</label>
                  <select 
                    value={newPost.category} 
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="category-select"
                  >
                    <option value="Doubt">🤔 Doubt - Ask for help</option>
                    <option value="Solution">💡 Solution - Share knowledge</option>
                    <option value="Confession">💭 Confession - Share experiences</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Post Title</label>
                  <input 
                    type="text" 
                    placeholder="What's your post about?" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Content</label>
                  <textarea 
                    placeholder="Share your thoughts, questions, or experiences..." 
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    required
                    rows="6"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label>Tags (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="beginner, chords, practice (comma separated)" 
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                  />
                </div>
                
                <button type="submit" className="btn-submit">
                  <Plus size={18} />
                  Create Post
                </button>
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
          font-size: 2.2rem;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: #1f2a44;
          font-family: 'Playfair Display', Georgia, serif;
        }
        
        .community-cta {
          text-align: center;
          padding: 2.2rem 1.6rem;
          margin-bottom: 2.6rem;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 10px 28px rgba(15,20,30,0.04);
        }
        
        .community-cta h3 {
          color: #667eea;
          margin-bottom: 1rem;
          font-size: 1.8rem;
        }
        
        .community-stats {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin: 1.5rem 0;
        }
        
        .auth-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        
        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }
        
        .user-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }
        
        .btn-logout {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 0.8rem 1.5rem;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: #ef4444;
        }
        
        .link-btn {
          background: none;
          border: none;
          color: var(--accent);
          cursor: pointer;
          text-decoration: underline;
          font-weight: 600;
        }
        
        .link-btn:hover {
          color: #5a67d8;
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
        }
        
        .user-badge.newbie { background: rgba(156, 163, 175, 0.2); color: #9ca3af; }
        .user-badge.beginner { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .user-badge.intermediate { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
        .user-badge.expert { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        
        .category-filter {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        
        .category-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 1rem 2rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .category-btn:hover, .category-btn.active {
          background: #667eea;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        [data-theme="light"] .category-btn {
          background: rgba(14, 165, 233, 0.1) !important;
          border: 2px solid rgba(14, 165, 233, 0.3) !important;
          color: #0f172a !important;
          font-weight: 700 !important;
        }
        
        [data-theme="light"] .category-btn:hover,
        [data-theme="light"] .category-btn.active {
          background: #0ea5e9 !important;
          border-color: #0ea5e9 !important;
          color: white !important;
          box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4) !important;
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
          transition: transform 180ms ease, box-shadow 220ms ease;
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 10px 30px rgba(15,20,30,0.04);
        }
        
        .post-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(15,20,30,0.06);
          border-left-color: #c69c4a;
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
        
        .vote-btn.active.upvote {
          color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }
        
        .vote-btn.active.downvote {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
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
        
        .post-category.doubt { background: rgba(239, 68, 68, 0.2); color: #ef4444; }
        .post-category.solution { background: rgba(34, 197, 94, 0.2); color: #22c55e; }
        .post-category.confession { background: rgba(168, 85, 247, 0.2); color: #a855f7; }
        
        .post-content h3 {
          color: #1f2a44;
          margin-bottom: 1rem;
          font-family: 'Playfair Display', Georgia, serif;
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
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        
        .modal-content {
          background: var(--bg-secondary);
          border-radius: 20px;
          width: 100%;
          max-width: 500px;
          max-height: calc(100vh - 40px);
          border: 2px solid var(--accent);
          position: relative;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          overflow-y: auto;
          margin: auto;
          display: flex;
          flex-direction: column;
        }
        
        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: #999;
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          z-index: 10;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-close:hover {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
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
        
        .modal-header {
          text-align: center;
          padding: 3rem 2.5rem 2rem;
          border-bottom: 2px solid var(--border);
          background: linear-gradient(135deg, var(--accent) 0%, rgba(102, 126, 234, 0.8) 100%);
          border-radius: 20px 20px 0 0;
        }
        
        .modal-icon {
          width: 64px;
          height: 64px;
          margin: 0 auto 20px;
          background: #667eea;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }
        
        .modal-icon.success {
          background: #22c55e;
        }
        
        .modal-icon.verify {
          background: #f59e0b;
        }
        
        .modal-header h3 {
          color: white;
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 12px;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .modal-header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 400;
        }
        
        .signup-form, .verification-form {
          padding: 2.5rem;
          background: var(--bg-primary);
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          color: var(--accent);
          font-weight: 600;
          margin-bottom: 10px;
          font-size: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .form-group input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid var(--border);
          border-radius: 12px;
          background: var(--glass);
          color: var(--text-primary);
          font-size: 16px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        
        .form-group input:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }
        
        .form-group input::placeholder {
          color: var(--text-secondary);
          font-weight: 400;
        }
        
        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, var(--accent) 0%, #5a67d8 100%);
          color: white;
          border: none;
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 17px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 24px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .btn-submit:hover {
          background: linear-gradient(135deg, #5a67d8 0%, #4c51bf 100%);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        .btn-submit:active {
          transform: translateY(-1px);
        }
        
        .modal-footer {
          padding: 24px 40px;
          border-top: 2px solid var(--border);
          text-align: center;
          background: var(--glass);
          border-radius: 0 0 20px 20px;
        }
        
        .modal-footer p {
          color: var(--text-secondary);
          font-size: 13px;
          margin: 0;
          font-weight: 500;
        }
        
        .otp-display-section {
          padding: 32px;
          text-align: center;
        }
        
        .otp-label {
          color: #667eea;
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 24px;
        }
        
        .otp-code-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
        }
        
        .otp-digit {
          width: 48px;
          height: 48px;
          background: #22c55e;
          color: white;
          font-size: 24px;
          font-weight: 600;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
        }
        
        .otp-copy-section {
          margin-top: 24px;
        }
        
        .copy-code {
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        
        .copy-code span {
          color: #999;
          font-size: 14px;
        }
        
        .copy-code code {
          background: rgba(102, 126, 234, 0.2);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 16px;
          font-weight: 600;
        }
        
        .auto-progress {
          margin-bottom: 20px;
        }
        
        .progress-bar {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 12px;
        }
        
        .progress-fill {
          height: 100%;
          background: #22c55e;
          width: 0;
          animation: progress 3s linear forwards;
        }
        
        @keyframes progress {
          to { width: 100%; }
        }
        
        .auto-progress p {
          color: #999;
          font-size: 14px;
          margin: 0;
        }
        
        .verification-help {
          padding: 20px 32px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .help-section {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
        }
        
        .help-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        
        .help-content p {
          color: #999;
          margin: 0 0 8px;
          font-size: 14px;
        }
        
        .code-hint {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .code-hint span {
          color: #999;
          font-size: 14px;
        }
        
        .code-hint code {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: monospace;
          font-weight: 600;
          font-size: 14px;
        }
        
        .email-display {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 500;
          margin-top: 12px;
          font-size: 14px;
        }
        
        .otp-input {
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 8px;
          font-family: monospace;
        }
        
        .recovery-input {
          text-align: center;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 8px;
          font-family: monospace;
        }
        
        .recovery-display-modal {
          text-align: center;
          max-width: 600px;
        }
        
        .recovery-display-section {
          padding: 32px;
          text-align: center;
        }
        
        .recovery-label {
          color: #22c55e;
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 24px;
        }
        
        .recovery-code-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 24px 0;
        }
        
        .recovery-digit {
          width: 48px;
          height: 48px;
          background: #22c55e;
          color: white;
          font-size: 24px;
          font-weight: 600;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
        }
        
        .recovery-copy-section {
          margin-top: 24px;
        }
        
        .recovery-info {
          margin-top: 16px;
          padding: 12px;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }
        
        .recovery-info p {
          margin: 0;
          color: #22c55e;
          font-size: 14px;
        }
        
        .recovery-info strong {
          color: #16a34a;
        }
        
        .password-reset-form {
          padding: 32px;
        }
        
        .password-reset-modal {
          max-width: 500px;
        }
        
        .post-form {
          padding: 32px;
        }
        
        .category-select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
          appearance: none;
          background-image: url('data:image/svg+xml;utf8,<svg fill="white" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>');
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 20px;
          padding-right: 40px;
        }
        
        [data-theme="light"] .category-select {
          background: #ffffff !important;
          border: 2px solid #0ea5e9 !important;
          color: #0f172a !important;
          background-image: url('data:image/svg+xml;utf8,<svg fill="%230ea5e9" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/></svg>') !important;
        }
        
        [data-theme="light"] .category-select:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
        }
        
        [data-theme="light"] .category-select option {
          background: #ffffff !important;
          color: #0f172a !important;
        }
        
        .category-select:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .category-select option {
          background: #1a1a2e;
          color: white;
          padding: 12px;
        }
        
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 16px;
          transition: border-color 0.2s ease;
          box-sizing: border-box;
          resize: vertical;
          min-height: 120px;
          font-family: inherit;
          line-height: 1.5;
        }
        
        [data-theme="light"] .form-group textarea {
          background: #ffffff !important;
          border: 2px solid #0ea5e9 !important;
          color: #0f172a !important;
        }
        
        [data-theme="light"] .form-group textarea:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
        }
        
        [data-theme="light"] .form-group textarea::placeholder {
          color: #64748b !important;
        }
        
        [data-theme="light"] .recovery-label {
          color: #16a34a !important;
        }
        
        [data-theme="light"] .recovery-digit {
          background: #16a34a !important;
        }
        
        [data-theme="light"] .recovery-info {
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.3) !important;
        }
        
        [data-theme="light"] .recovery-info p {
          color: #16a34a !important;
        }
        
        [data-theme="light"] .recovery-info strong {
          color: #15803d !important;
        }
        
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }
        
        .form-group textarea::placeholder {
          color: #999;
        }
        
        .otp-note {
          font-size: 0.8rem;
          color: #8e8e8e;
          margin-top: 1rem;
        }
        
        .email-note {
          font-size: 0.9rem;
          color: #667eea;
          margin: 0.5rem 0;
          font-weight: 500;
        }
        
        .otp-display-modal {
          text-align: center;
          max-width: 600px;
        }
        
        .otp-display-header h3 {
          color: #22c55e;
          margin-bottom: 1rem;
        }
        
        .otp-code-container {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 2rem 0;
        }
        
        .otp-digit {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          font-size: 2rem;
          font-weight: 700;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .otp-copy-text {
          font-size: 1.1rem;
          color: #667eea;
          margin: 1rem 0;
          padding: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .otp-display-footer {
          margin-top: 2rem;
        }
        
        .otp-display-footer p {
          color: #8e8e8e;
          margin-bottom: 1rem;
        }
        
        .otp-hint {
          margin-top: 1.5rem;
          padding: 1rem;
          background: rgba(34, 197, 94, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }
        
        .otp-hint p {
          margin: 0.5rem 0;
          color: #22c55e;
        }
        
        .otp-reminder {
          font-weight: 600;
        }
        
        .code-reminder {
          background: rgba(102, 126, 234, 0.2);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 1.1rem;
        }
        
        .modal-content h3 {
          color: #667eea;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .comments-section {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .comments-list {
          margin-bottom: 1rem;
        }
        
        .comment-item {
          padding: 0.8rem;
          margin-bottom: 0.5rem;
          background: #faf9f8;
          border-radius: 8px;
          border-left: 3px solid #c69c4a;
        }
        
        .comment-item strong {
          color: #667eea;
          margin-right: 0.5rem;
        }
        
        .comment-item span {
          color: #e0e0e0;
        }
        
        .comment-item small {
          display: block;
          color: #8e8e8e;
          margin-top: 0.3rem;
          font-size: 0.8rem;
        }
        
        .comment-form {
          display: flex;
          gap: 0.5rem;
        }
        
        .comment-form input {
          flex: 1;
          padding: 0.8rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .comment-form button {
          background: #667eea;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 20px;
          cursor: pointer;
          font-weight: 600;
        }
        
        .comment-form button:hover {
          background: #5a67d8;
        }
        
        /* Light Theme Styles */
        [data-theme="light"] .btn-secondary {
          background: rgba(14, 165, 233, 0.1) !important;
          color: #0f172a !important;
          border: 2px solid rgba(14, 165, 233, 0.3) !important;
        }
        
        [data-theme="light"] .btn-secondary:hover {
          background: rgba(14, 165, 233, 0.2) !important;
          border-color: #0ea5e9 !important;
          color: #0f172a !important;
        }
        
        [data-theme="light"] .community-cta {
          background: rgba(14, 165, 233, 0.05) !important;
          border: 1px solid rgba(14, 165, 233, 0.2) !important;
        }
        
        [data-theme="light"] .community-cta h3 {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .community-cta p {
          color: #475569 !important;
        }
        
        [data-theme="light"] .stat-number {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .stat-label {
          color: #64748b !important;
        }
        
        [data-theme="light"] .user-dashboard {
          background: rgba(14, 165, 233, 0.05) !important;
          border: 1px solid rgba(14, 165, 233, 0.2) !important;
        }
        
        [data-theme="light"] .username {
          color: #0f172a !important;
        }
        
        [data-theme="light"] .btn-logout {
          background: rgba(239, 68, 68, 0.1) !important;
          color: #dc2626 !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
        }
        
        [data-theme="light"] .btn-logout:hover {
          background: rgba(239, 68, 68, 0.2) !important;
          border-color: #dc2626 !important;
        }
        
        [data-theme="light"] .post-card {
          background: rgba(14, 165, 233, 0.03) !important;
          border: 1px solid rgba(14, 165, 233, 0.1) !important;
        }
        
        [data-theme="light"] .post-card:hover {
          border-left-color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .post-author {
          color: #0f172a !important;
        }
        
        [data-theme="light"] .post-content h3 {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .post-content p {
          color: #475569 !important;
        }
        
        [data-theme="light"] .vote-count {
          color: #0f172a !important;
        }
        
        [data-theme="light"] .post-time {
          color: #64748b !important;
        }
        
        [data-theme="light"] .action-btn {
          color: #64748b !important;
        }
        
        [data-theme="light"] .action-btn:hover {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .link-btn {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .link-btn:hover {
          color: #0284c7 !important;
        }
        
        [data-theme="light"] .comments-section {
          background: rgba(14, 165, 233, 0.05) !important;
          border-top: 1px solid rgba(14, 165, 233, 0.2) !important;
        }
        
        [data-theme="light"] .comment-item {
          background: #fff !important;
          border-left: 3px solid #c69c4a !important;
        }
        
        [data-theme="light"] .comment-item strong {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .comment-item span {
          color: #475569 !important;
        }
        
        [data-theme="light"] .comment-item small {
          color: #64748b !important;
        }
        
        [data-theme="light"] .comment-form input {
          background: #ffffff !important;
          border: 1px solid rgba(14, 165, 233, 0.3) !important;
          color: #0f172a !important;
        }
        
        [data-theme="light"] .comment-form button {
          background: #0ea5e9 !important;
        }
        
        [data-theme="light"] .comment-form button:hover {
          background: #0284c7 !important;
        }

        /* Light Theme Modal Overrides */
        [data-theme="light"] .modal-content {
          background: #ffffff !important;
          border: 2px solid #0ea5e9 !important;
          box-shadow: 0 25px 50px rgba(14, 165, 233, 0.3) !important;
        }
        
        [data-theme="light"] .modal-header {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
        }
        
        [data-theme="light"] .signup-form,
        [data-theme="light"] .verification-form {
          background: #f8fafc !important;
        }
        
        [data-theme="light"] .form-group label {
          color: #0ea5e9 !important;
        }
        
        [data-theme="light"] .form-group input {
          background: #ffffff !important;
          border: 2px solid #cbd5e1 !important;
          color: #0f172a !important;
        }
        
        [data-theme="light"] .form-group input:focus {
          border-color: #0ea5e9 !important;
          background: rgba(14, 165, 233, 0.05) !important;
          box-shadow: 0 8px 25px rgba(14, 165, 233, 0.2) !important;
        }
        
        [data-theme="light"] .form-group input::placeholder {
          color: #64748b !important;
        }
        
        [data-theme="light"] .modal-content input,
        .modal-content select,
        .modal-content textarea {
          background: #ffffff !important;
          border: 2px solid #0ea5e9 !important;
          color: #0f172a !important;
        }
        
        [data-theme="light"] .modal-content input:focus,
        [data-theme="light"] .modal-content select:focus,
        [data-theme="light"] .modal-content textarea:focus {
          border-color: #0284c7 !important;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1) !important;
        }
        
        [data-theme="light"] .modal-content input::placeholder,
        [data-theme="light"] .modal-content textarea::placeholder {
          color: #64748b !important;
        }
        
        [data-theme="light"] .btn-submit {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%) !important;
        }
        
        [data-theme="light"] .btn-submit:hover {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
          box-shadow: 0 10px 30px rgba(14, 165, 233, 0.4) !important;
        }
        
        [data-theme="light"] .modal-footer {
          background: rgba(14, 165, 233, 0.05) !important;
        }
        
        [data-theme="light"] .modal-footer p {
          color: #475569 !important;
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
        
        /* Desktop Modal Styles */
        @media (min-width: 769px) {
          .modal-overlay {
            padding: 40px;
          }
          
          .modal-content {
            max-width: 600px;
            min-height: auto;
            max-height: calc(100vh - 80px);
          }
          
          .modal-header {
            padding: 60px 50px 40px;
            flex-shrink: 0;
          }
          
          .modal-icon {
            width: 100px;
            height: 100px;
            margin-bottom: 30px;
          }
          
          .modal-header h3 {
            font-size: 32px;
            margin-bottom: 16px;
            line-height: 1.2;
          }
          
          .modal-header p {
            font-size: 18px;
            line-height: 1.4;
          }
          
          .signup-form, .verification-form {
            padding: 50px;
            flex: 1;
            overflow-y: auto;
          }
          
          .otp-display-section {
            padding: 50px;
            flex: 1;
          }
          
          .otp-digit {
            width: 80px;
            height: 80px;
            font-size: 40px;
          }
          
          .otp-code-container {
            gap: 20px;
            margin: 40px 0;
          }
          
          .form-group {
            margin-bottom: 30px;
          }
          
          .form-group label {
            font-size: 16px;
            margin-bottom: 12px;
          }
          
          .form-group input {
            padding: 20px 24px;
            font-size: 18px;
          }
          
          .btn-submit {
            padding: 20px 40px;
            font-size: 20px;
            margin-top: 30px;
          }
          
          .modal-footer {
            padding: 30px 50px;
            flex-shrink: 0;
          }
          
          .verification-help {
            padding: 30px 50px;
            flex-shrink: 0;
          }
          
          .email-display {
            padding: 12px 24px;
            font-size: 16px;
            margin-top: 16px;
          }
          
          .copy-code {
            padding: 16px 24px;
          }
          
          .copy-code span {
            font-size: 16px;
          }
          
          .copy-code code {
            font-size: 20px;
            padding: 6px 12px;
          }
          
          .otp-input {
            font-size: 28px;
            letter-spacing: 12px;
            padding: 24px;
          }
          
          .help-content p {
            font-size: 16px;
          }
          
          .code-hint span {
            font-size: 16px;
          }
          
          .code-hint code {
            font-size: 16px;
          }
          
          .post-form {
            padding: 50px;
          }
          
          .category-select {
            padding: 16px 20px;
            font-size: 18px;
            padding-right: 50px;
            background-size: 24px;
          }
          
          .form-group textarea {
            padding: 20px 24px;
            font-size: 18px;
            min-height: 150px;
          }
        }
        
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .post-card {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          
          .post-voting {
            flex-direction: row;
            justify-content: center;
            order: 2;
            margin-top: 1rem;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          
          .post-main {
            order: 1;
            width: 100%;
          }
          
          .post-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.8rem;
          }
          
          .post-meta {
            width: 100%;
          }
          
          .author-info {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .post-category {
            align-self: flex-start;
            margin-top: 0.5rem;
          }
          
          .post-content {
            margin-top: 1rem;
          }
          
          .post-tags {
            flex-wrap: wrap;
            gap: 0.3rem;
          }
          
          .tag {
            font-size: 0.7rem;
            padding: 0.2rem 0.5rem;
          }
          
          .post-actions {
            flex-direction: column;
            gap: 0.8rem;
            align-items: flex-start;
          }
          
          .action-btn {
            font-size: 0.9rem;
          }
          
          .community-stats {
            gap: 1.5rem;
          }
          
          .user-dashboard {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
          
          .auth-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .user-actions {
            flex-direction: column;
            width: 100%;
          }
          
          .category-select {
            background-size: 18px;
            padding-right: 35px;
          }
          
          .form-group textarea {
            min-height: 100px;
          }
          
          .community-posts {
            gap: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Community;