import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageCircle, Share, X, ChevronLeft, ChevronRight } from 'lucide-react';
import LazyImage from './LazyImage';

const StudentsGallery = () => {
  const [selectedPost, setSelectedPost] = useState(null);
  const [likes, setLikes] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const posts = [
    { 
      id: 1,
      src: '/images/gallery/AM.jpg', 
      caption: 'Mastering the A Minor chord! 🎸 #GuitarProgress #PrestoAcademy',
      username: 'guitar_student_1',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 24,
      comments: 5,
      timeAgo: '2h'
    },
    { 
      id: 2,
      src: '/images/gallery/c.jpg', 
      caption: 'C Major chord looking clean! Practice makes perfect 🎵',
      username: 'music_lover_22',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 31,
      comments: 8,
      timeAgo: '4h'
    },
    { 
      id: 3,
      src: '/images/gallery/D.jpg', 
      caption: 'D Major breakthrough moment! Thanks @kaustav_mitra 🙌',
      username: 'rockstar_in_making',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 18,
      comments: 3,
      timeAgo: '6h'
    },
    { 
      id: 4,
      src: '/images/gallery/e.jpg', 
      caption: 'E Minor vibes 🎶 Love this chord progression!',
      username: 'chord_master',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 42,
      comments: 12,
      timeAgo: '8h'
    },
    { 
      id: 5,
      src: '/images/gallery/F.jpg', 
      caption: 'Finally nailed the F Major barre chord! 💪 #Achievement',
      username: 'guitar_warrior',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 67,
      comments: 15,
      timeAgo: '12h'
    },
    { 
      id: 6,
      src: '/images/gallery/G.jpg', 
      caption: 'G Major sounds so good! Ready for my first song 🎸✨',
      username: 'melody_maker',
      avatar: '/images/gallery/tutor_profile.jpg',
      likes: 29,
      comments: 7,
      timeAgo: '1d'
    }
  ];

  const toggleLike = (postId) => {
    setLikes(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const openModal = (post, index) => {
    setSelectedPost(post);
    setCurrentImageIndex(index);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % posts.length);
    setSelectedPost(posts[(currentImageIndex + 1) % posts.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + posts.length) % posts.length);
    setSelectedPost(posts[(currentImageIndex - 1 + posts.length) % posts.length]);
  };

  return (
    <section id="gallery" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="instagram-header">
            <h2><Users size={32} /> Students Gallery</h2>
            <p className="gallery-subtitle">📸 Share your guitar journey with #PrestoAcademy</p>
          </div>
          
          <div className="instagram-grid">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                className="instagram-post"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => openModal(post, index)}
              >
                <div className="post-image">
                  <LazyImage src={post.src} alt={post.caption} />
                  <div className="post-overlay">
                    <div className="post-stats">
                      <span><Heart size={20} /> {post.likes + (likes[post.id] ? 1 : 0)}</span>
                      <span><MessageCircle size={20} /> {post.comments}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="gallery-cta">
            <p>🎸 Tag us in your guitar posts! #PrestoGuitarAcademy 🌟</p>
          </div>
        </motion.div>
      </div>

      {/* Instagram-style Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={closeModal}>
                <X size={24} />
              </button>
              
              <button className="modal-nav prev" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              
              <button className="modal-nav next" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
              
              <div className="modal-image">
                <LazyImage src={selectedPost.src} alt={selectedPost.caption} />
              </div>
              
              <div className="modal-sidebar">
                <div className="post-header">
                  <LazyImage src={selectedPost.avatar} alt={selectedPost.username} className="avatar" />
                  <div className="user-info">
                    <span className="username">{selectedPost.username}</span>
                    <span className="time">{selectedPost.timeAgo}</span>
                  </div>
                </div>
                
                <div className="post-caption">
                  <p>{selectedPost.caption}</p>
                </div>
                
                <div className="post-actions">
                  <button 
                    className={`action-btn ${likes[selectedPost.id] ? 'liked' : ''}`}
                    onClick={() => toggleLike(selectedPost.id)}
                  >
                    <Heart size={24} fill={likes[selectedPost.id] ? '#ff3040' : 'none'} />
                  </button>
                  <button className="action-btn">
                    <MessageCircle size={24} />
                  </button>
                  <button className="action-btn">
                    <Share size={24} />
                  </button>
                </div>
                
                <div className="post-likes">
                  <span>{selectedPost.likes + (likes[selectedPost.id] ? 1 : 0)} likes</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .instagram-header {
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
        
        .gallery-subtitle {
          font-size: 1.1rem;
          color: #b0b0b0;
          margin: 0;
        }
        
        .instagram-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          margin-bottom: 3rem;
        }
        
        .instagram-post {
          aspect-ratio: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }
        
        .post-image {
          width: 100%;
          height: 100%;
          position: relative;
        }
        
        .post-image .lazy-image-container {
          width: 100%;
          height: 100%;
        }
        
        .post-image .lazy-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease, opacity 0.3s ease, filter 0.3s ease;
        }
        
        .post-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .instagram-post:hover .post-overlay {
          opacity: 1;
        }
        
        .post-stats {
          display: flex;
          gap: 2rem;
          color: white;
          font-weight: 600;
        }
        
        .post-stats span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .gallery-cta {
          text-align: center;
          padding: 2rem;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
          border-radius: 20px;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .gallery-cta p {
          font-size: 1.2rem;
          color: #667eea;
          margin: 0;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          display: flex;
          max-width: 90vw;
          max-height: 90vh;
          background: #1a1a1a;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        
        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 0.5rem;
          border-radius: 50%;
          cursor: pointer;
          z-index: 1001;
          transition: background 0.3s ease;
        }
        
        .modal-close:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: white;
          padding: 1rem;
          border-radius: 50%;
          cursor: pointer;
          z-index: 1001;
          transition: background 0.3s ease;
        }
        
        .modal-nav:hover {
          background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-nav.prev {
          left: 1rem;
        }
        
        .modal-nav.next {
          right: 25rem;
        }
        
        .modal-image {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-image .lazy-image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }
        
        .modal-image .lazy-image {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
        }
        
        .modal-sidebar {
          width: 350px;
          background: #262626;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }
        
        .post-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #404040;
        }
        
        .avatar.lazy-image-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
        }
        
        .avatar .lazy-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
        }
        
        .username {
          font-weight: 600;
          color: white;
        }
        
        .time {
          font-size: 0.8rem;
          color: #8e8e8e;
        }
        
        .post-caption {
          flex: 1;
          margin-bottom: 1rem;
        }
        
        .post-caption p {
          color: white;
          line-height: 1.5;
          margin: 0;
        }
        
        .post-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #404040;
        }
        
        .action-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.3s ease;
        }
        
        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .action-btn.liked {
          color: #ff3040;
        }
        
        .post-likes {
          color: white;
          font-weight: 600;
        }
        
        @media (max-width: 768px) {
          h2 {
            font-size: 2rem;
          }
          
          .instagram-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2px;
          }
          
          .modal-content {
            flex-direction: column;
            max-width: 95vw;
            max-height: 95vh;
          }
          
          .modal-sidebar {
            width: 100%;
            max-height: 40vh;
            overflow-y: auto;
          }
          
          .modal-nav.next {
            right: 1rem;
          }
          
          .gallery-cta {
            padding: 1.5rem;
          }
          
          .gallery-cta p {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default StudentsGallery;