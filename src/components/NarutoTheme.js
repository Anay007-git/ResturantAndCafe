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
      
      /* Professional Card Styling with SVG */
      .glass-card, .post-card {
        background: rgba(255, 107, 53, 0.1) !important;
        border: 2px solid var(--naruto-gold) !important;
        border-radius: 15px !important;
        box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2) !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .glass-card::before, .post-card::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 60px;
        height: 60px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><radialGradient id="leafGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23228b22" stop-opacity="0.4"/><stop offset="100%" stop-color="%23228b22" stop-opacity="0.1"/></radialGradient></defs><path d="M30 10 Q40 20 30 30 Q20 20 30 10" fill="url(%23leafGrad)" transform="rotate(45 30 20)"/><path d="M45 25 Q50 30 45 35 Q40 30 45 25" fill="url(%23leafGrad)" transform="rotate(-30 45 30)"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0.4;
        animation: leafFloat 4s ease-in-out infinite;
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
      
      /* Professional Naruto SVG Decorations */
      body::after {
        content: '';
        position: fixed;
        top: 0;
        right: 0;
        width: 200px;
        height: 100vh;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 800"><defs><linearGradient id="swordGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23c0c0c0" stop-opacity="0.3"/><stop offset="100%" stop-color="%23808080" stop-opacity="0.1"/></linearGradient><radialGradient id="sharingan" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ff0000" stop-opacity="0.4"/><stop offset="70%" stop-color="%23cc0000" stop-opacity="0.2"/><stop offset="100%" stop-color="%23990000" stop-opacity="0.1"/></radialGradient></defs><g opacity="0.6"><rect x="95" y="50" width="10" height="80" fill="url(%23swordGrad)" rx="5"/><circle cx="100" cy="40" r="8" fill="%23d4af37" opacity="0.4"/><circle cx="100" cy="200" r="15" fill="url(%23sharingan)"/><circle cx="100" cy="200" r="3" fill="%23000" opacity="0.8"/><rect x="95" y="350" width="10" height="60" fill="url(%23swordGrad)" rx="5" transform="rotate(45 100 380)"/><circle cx="100" cy="500" r="12" fill="url(%23sharingan)"/><circle cx="100" cy="500" r="2" fill="%23000" opacity="0.8"/><rect x="95" y="650" width="10" height="70" fill="url(%23swordGrad)" rx="5" transform="rotate(-30 100 685)"/></g></svg>');
        background-repeat: repeat-y;
        pointer-events: none;
        z-index: -1;
        opacity: 0.3;
        animation: weaponFloat 12s ease-in-out infinite;
      }
      
      @keyframes weaponFloat {
        0%, 100% { transform: rotate(90deg) translateY(0px); }
        50% { transform: rotate(90deg) translateY(-20px); }
      }
      
      /* Sharingan cursor effect */
      .glass-card:hover {
        cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="%23ff0000" stroke="%23000" stroke-width="2"/><circle cx="16" cy="16" r="3" fill="%23000"/></svg>'), auto;
      }
      
      /* Professional Modal Decorations */
      .modal-content::before {
        content: '';
        position: absolute;
        top: -15px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 30px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30"><defs><linearGradient id="crestGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23d4af37" stop-opacity="0.8"/><stop offset="100%" stop-color="%23b8860b" stop-opacity="0.6"/></linearGradient></defs><path d="M40 5 L50 15 L40 25 L30 15 Z" fill="url(%23crestGrad)"/><circle cx="40" cy="15" r="8" fill="none" stroke="%23d4af37" stroke-width="2" opacity="0.7"/><circle cx="40" cy="15" r="3" fill="%23d4af37" opacity="0.9"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        z-index: 10;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }
      
      /* Ninja scroll effect for buttons */
      .btn-primary::after, .btn-secondary::after {
        content: '📜';
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        opacity: 0.7;
      }
      
      /* Professional Post Decorations */
      .post-card::after {
        content: '';
        position: absolute;
        top: 5px;
        right: 5px;
        width: 25px;
        height: 25px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><defs><linearGradient id="kunaiGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23c0c0c0" stop-opacity="0.4"/><stop offset="100%" stop-color="%23808080" stop-opacity="0.2"/></linearGradient></defs><path d="M12 2 L20 10 L15 15 L10 10 Z" fill="url(%23kunaiGrad)"/><rect x="11" y="15" width="2" height="8" fill="url(%23kunaiGrad)"/><circle cx="12" cy="24" r="1" fill="%23d4af37" opacity="0.6"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0.3;
        transform: rotate(45deg);
        animation: kunaiGlint 3s ease-in-out infinite;
      }
      
      @keyframes kunaiGlint {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 0.6; }
      }
      
      /* Sharingan pattern background */
      .category-btn.active::before {
        content: '👁️';
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        font-size: 1rem;
        animation: sharinganPulse 2s ease-in-out infinite;
      }
      
      @keyframes sharinganPulse {
        0%, 100% { opacity: 0.5; transform: translateY(-50%) scale(1); }
        50% { opacity: 1; transform: translateY(-50%) scale(1.1); }
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