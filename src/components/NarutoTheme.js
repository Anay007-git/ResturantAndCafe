import React from 'react';

const NarutoTheme = () => {
  return (
    <style jsx global>{`
      /* Naruto Theme Global Overrides */
      
      /* Button Styling */
      .btn-primary, .btn-secondary, .btn-submit {
        background: linear-gradient(135deg, var(--naruto-orange) 0%, var(--naruto-gold) 100%) !important;
        border: 2px solid var(--naruto-gold) !important;
        color: #fff !important;
        font-weight: 700 !important;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .btn-primary::before, .btn-secondary::before, .btn-submit::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        transition: left 0.5s;
      }
      
      .btn-primary:hover::before, .btn-secondary:hover::before, .btn-submit:hover::before {
        left: 100%;
      }
      
      /* Card Styling */
      .glass-card, .post-card {
        background: rgba(255, 107, 53, 0.1) !important;
        border: 2px solid var(--naruto-gold) !important;
        border-radius: 15px !important;
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2) !important;
        position: relative !important;
      }
      
      .glass-card::before, .post-card::before {
        content: '🍃';
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 1.2rem;
        opacity: 0.3;
        animation: leafFloat 3s ease-in-out infinite;
      }
      
      @keyframes leafFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-5px) rotate(5deg); }
      }
      
      /* Headings */
      h1, h2, h3, h4, h5, h6 {
        color: var(--naruto-orange) !important;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3) !important;
        position: relative !important;
      }
      
      /* Navigation */
      .navbar {
        background: linear-gradient(135deg, var(--naruto-blue) 0%, var(--bg-secondary) 100%) !important;
        border-bottom: 3px solid var(--naruto-gold) !important;
      }
      
      /* Form Elements */
      input, textarea, select {
        border: 2px solid var(--naruto-gold) !important;
        background: rgba(255, 107, 53, 0.05) !important;
        color: var(--text-primary) !important;
      }
      
      input:focus, textarea:focus, select:focus {
        border-color: var(--naruto-orange) !important;
        box-shadow: 0 0 10px rgba(255, 107, 53, 0.3) !important;
      }
      
      /* Category Buttons */
      .category-btn {
        background: linear-gradient(135deg, var(--naruto-blue) 0%, var(--bg-secondary) 100%) !important;
        border: 2px solid var(--naruto-gold) !important;
        color: var(--naruto-gold) !important;
        font-weight: 700 !important;
      }
      
      .category-btn:hover, .category-btn.active {
        background: linear-gradient(135deg, var(--naruto-orange) 0%, var(--naruto-gold) 100%) !important;
        color: #fff !important;
        transform: translateY(-3px) !important;
        box-shadow: 0 8px 20px rgba(255, 107, 53, 0.4) !important;
      }
      
      /* Post Categories */
      .post-category.doubt { 
        background: rgba(255, 107, 53, 0.2) !important; 
        color: var(--naruto-orange) !important; 
        border: 1px solid var(--naruto-orange) !important;
      }
      .post-category.solution { 
        background: rgba(34, 197, 94, 0.2) !important; 
        color: var(--leaf-green) !important; 
        border: 1px solid var(--leaf-green) !important;
      }
      .post-category.confession { 
        background: rgba(212, 175, 55, 0.2) !important; 
        color: var(--naruto-gold) !important; 
        border: 1px solid var(--naruto-gold) !important;
      }
      
      /* User Badges */
      .user-badge.newbie { 
        background: rgba(156, 163, 175, 0.2) !important; 
        color: #9ca3af !important; 
        border: 1px solid #9ca3af !important;
      }
      .user-badge.beginner { 
        background: rgba(34, 197, 94, 0.2) !important; 
        color: var(--leaf-green) !important; 
        border: 1px solid var(--leaf-green) !important;
      }
      .user-badge.intermediate { 
        background: rgba(255, 107, 53, 0.2) !important; 
        color: var(--naruto-orange) !important; 
        border: 1px solid var(--naruto-orange) !important;
      }
      .user-badge.expert { 
        background: rgba(212, 175, 55, 0.2) !important; 
        color: var(--naruto-gold) !important; 
        border: 1px solid var(--naruto-gold) !important;
      }
      
      /* Tags */
      .tag {
        background: rgba(255, 107, 53, 0.15) !important;
        color: var(--naruto-orange) !important;
        border: 1px solid var(--naruto-orange) !important;
        border-radius: 20px !important;
      }
      
      /* Modal Styling */
      .modal-content {
        background: linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%) !important;
        border: 3px solid var(--naruto-gold) !important;
        box-shadow: 0 25px 50px rgba(255, 107, 53, 0.3) !important;
      }
      
      .modal-header {
        background: linear-gradient(135deg, var(--naruto-orange) 0%, var(--naruto-gold) 100%) !important;
      }
      
      /* Scrollbar for modal content */
      .modal-content::-webkit-scrollbar {
        width: 8px;
      }
      
      .modal-content::-webkit-scrollbar-thumb {
        background: var(--naruto-gold);
        border-radius: 4px;
      }
      
      /* Vote buttons */
      .vote-btn.active.upvote {
        color: var(--leaf-green) !important;
        background: rgba(34, 197, 94, 0.2) !important;
      }
      
      .vote-btn.active.downvote {
        color: var(--naruto-orange) !important;
        background: rgba(255, 107, 53, 0.2) !important;
      }
      
      /* Comments */
      .comment-item {
        background: rgba(255, 107, 53, 0.05) !important;
        border-left: 3px solid var(--naruto-gold) !important;
      }
      
      /* Progress bars */
      .progress-fill {
        background: linear-gradient(90deg, var(--naruto-orange), var(--naruto-gold)) !important;
      }
      
      /* OTP digits */
      .otp-digit, .recovery-digit {
        background: linear-gradient(135deg, var(--naruto-orange), var(--naruto-gold)) !important;
      }
      
      /* Floating elements animation */
      @keyframes narutoFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(2deg); }
        50% { transform: translateY(-5px) rotate(-2deg); }
        75% { transform: translateY(-15px) rotate(1deg); }
      }
      
      /* Add floating animation to certain elements */
      .glass-card:hover {
        animation: narutoFloat 2s ease-in-out infinite;
      }
      
      /* Ninja-themed text colors */
      .stat-number {
        color: var(--naruto-orange) !important;
        font-weight: 800 !important;
      }
      
      .stat-label {
        color: var(--naruto-gold) !important;
        font-weight: 600 !important;
      }
      
      /* Special effects for Teacher's Day */
      .teachers-day-special {
        position: relative;
        overflow: hidden;
      }
      
      .teachers-day-special::after {
        content: '🍃 🎌 🍃';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        opacity: 0.1;
        pointer-events: none;
        animation: rotate 10s linear infinite;
      }
      
      @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
    `}</style>
  );
};

export default NarutoTheme;