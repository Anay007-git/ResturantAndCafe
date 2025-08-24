import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, MessageSquare, Plus, Heart, MessageCircle, Share2, User, Clock, Tag } from 'lucide-react';

const Community = () => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'GuitarMaster92',
      avatar: '/images/gallery/tutor_profile.jpg',
      time: '2h ago',
      category: 'Question',
      title: 'Help with F chord transition',
      content: 'I\'m struggling with the transition from C to F chord. Any tips for smooth changes?',
      likes: 12,
      comments: 8,
      tags: ['beginner', 'chords', 'help']
    },
    {
      id: 2,
      author: 'StrumQueen',
      avatar: '/images/gallery/tutor_profile.jpg',
      time: '4h ago',
      category: 'Knowledge',
      title: 'Essential strumming patterns for beginners',
      content: 'Here are 5 strumming patterns every beginner should master: D-D-U-U-D-U, D-D-U-D-U...',
      likes: 24,
      comments: 15,
      tags: ['strumming', 'beginner', 'tutorial']
    },
    {
      id: 3,
      author: 'RockStar_Dev',
      avatar: '/images/gallery/tutor_profile.jpg',
      time: '6h ago',
      category: 'Discussion',
      title: 'Best guitar for intermediate players?',
      content: 'Looking to upgrade from my starter guitar. Budget around $500. Any recommendations?',
      likes: 18,
      comments: 22,
      tags: ['gear', 'intermediate', 'advice']
    }
  ]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'Question', tags: '' });

  const handleSignUp = (e) => {
    e.preventDefault();
    setIsSignedUp(true);
    setShowSignUp(false);
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    const post = {
      id: posts.length + 1,
      author: 'You',
      avatar: '/images/gallery/tutor_profile.jpg',
      time: 'now',
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      likes: 0,
      comments: 0,
      tags: newPost.tags.split(',').map(tag => tag.trim())
    };
    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '', category: 'Question', tags: '' });
    setShowNewPost(false);
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
            <p>Connect, learn, and share with fellow guitar enthusiasts</p>
          </div>

          {!isSignedUp ? (
            <div className="community-cta glass-card">
              <h3>Join Our Guitar Community! 🎸</h3>
              <p>Share your knowledge, ask questions, and connect with guitarists worldwide</p>
              <button className="btn-primary" onClick={() => setShowSignUp(true)}>
                <Users size={20} />
                Join Community
              </button>
            </div>
          ) : (
            <div className="community-actions">
              <button className="btn-primary" onClick={() => setShowNewPost(true)}>
                <Plus size={20} />
                New Post
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
                <div className="post-header">
                  <img src={post.avatar} alt={post.author} className="post-avatar" />
                  <div className="post-meta">
                    <span className="post-author">{post.author}</span>
                    <span className="post-time"><Clock size={14} /> {post.time}</span>
                  </div>
                  <span className={`post-category ${post.category.toLowerCase()}`}>
                    {post.category}
                  </span>
                </div>
                
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  
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
                    <Heart size={18} />
                    {post.likes}
                  </button>
                  <button className="action-btn">
                    <MessageCircle size={18} />
                    {post.comments}
                  </button>
                  <button className="action-btn">
                    <Share2 size={18} />
                    Share
                  </button>
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
              <h3>Join Guitar Community</h3>
              <form onSubmit={handleSignUp}>
                <input type="text" placeholder="Username" required />
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" className="btn-primary">Sign Up</button>
              </form>
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
        }
        
        .community-actions {
          text-align: center;
          margin-bottom: 3rem;
        }
        
        .community-posts {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .post-card {
          padding: 2rem;
        }
        
        .post-header {
          display: flex;
          align-items: center;
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
        }
        
        .post-author {
          font-weight: 600;
          color: white;
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
            padding: 1.5rem;
          }
          
          .post-header {
            flex-wrap: wrap;
            gap: 0.8rem;
          }
          
          .post-actions {
            gap: 1rem;
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