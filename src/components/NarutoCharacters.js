import React from 'react';

const NarutoCharacters = () => {
  return (
    <style jsx global>{`
      /* Naruto Character SVG Backgrounds */
      
      /* Iruka Sensei - Emotional Foundation */
      .glass-card:nth-child(1)::after {
        content: '';
        position: absolute;
        top: -20px;
        left: -20px;
        width: 100px;
        height: 100px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="irukaGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ff6b35" stop-opacity="0.3"/><stop offset="100%" stop-color="%23ff6b35" stop-opacity="0.1"/></radialGradient><linearGradient id="leafBand" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%23228b22" stop-opacity="0.6"/><stop offset="100%" stop-color="%2332cd32" stop-opacity="0.4"/></linearGradient></defs><circle cx="50" cy="50" r="35" fill="url(%23irukaGrad)" stroke="%23d4af37" stroke-width="2" opacity="0.7"/><rect x="20" y="45" width="60" height="8" fill="url(%23leafBand)" rx="4"/><circle cx="35" cy="35" r="3" fill="%23000" opacity="0.8"/><circle cx="65" cy="35" r="3" fill="%23000" opacity="0.8"/><path d="M40 60 Q50 70 60 60" stroke="%23000" stroke-width="2" fill="none" opacity="0.6"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0;
        animation: irukaAppear 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes irukaAppear {
        0%, 70% { opacity: 0; transform: scale(0.8) rotate(-10deg); }
        80%, 90% { opacity: 0.6; transform: scale(1) rotate(0deg); }
        100% { opacity: 0; transform: scale(0.8) rotate(10deg); }
      }
      
      /* Kakashi Sensei - Tactical/Teamwork */
      .post-card:nth-child(2n)::before {
        content: '';
        position: absolute;
        top: -15px;
        right: -15px;
        width: 80px;
        height: 80px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><defs><radialGradient id="kakashiGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%233b82f6" stop-opacity="0.4"/><stop offset="100%" stop-color="%233b82f6" stop-opacity="0.1"/></radialGradient><radialGradient id="sharinganGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ff0000" stop-opacity="0.8"/><stop offset="70%" stop-color="%23cc0000" stop-opacity="0.4"/><stop offset="100%" stop-color="%23990000" stop-opacity="0.2"/></radialGradient></defs><circle cx="40" cy="40" r="30" fill="url(%23kakashiGrad)" stroke="%23c0c0c0" stroke-width="2"/><rect x="15" y="35" width="50" height="10" fill="%23000" opacity="0.6"/><circle cx="25" cy="30" r="4" fill="%23000" opacity="0.7"/><circle cx="55" cy="30" r="8" fill="url(%23sharinganGrad)"/><circle cx="55" cy="30" r="3" fill="%23000"/><path d="M52 27 L58 27 M52 33 L58 33 M55 24 L55 36" stroke="%23000" stroke-width="1" opacity="0.8"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0;
        animation: kakashiSharingan 4s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes kakashiSharingan {
        0%, 60% { opacity: 0; transform: scale(0.7) rotate(0deg); }
        70%, 85% { opacity: 0.7; transform: scale(1) rotate(360deg); }
        100% { opacity: 0; transform: scale(0.7) rotate(720deg); }
      }
      
      /* Jiraiya Sensei - Power & Skills */
      .modal-content::after {
        content: '';
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        width: 120px;
        height: 120px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><radialGradient id="jiraiyaGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23f59e0b" stop-opacity="0.5"/><stop offset="100%" stop-color="%23f59e0b" stop-opacity="0.1"/></radialGradient><linearGradient id="sageGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff6b35" stop-opacity="0.6"/><stop offset="100%" stop-color="%23d4af37" stop-opacity="0.4"/></linearGradient></defs><circle cx="60" cy="60" r="45" fill="url(%23jiraiyaGrad)" stroke="%23d4af37" stroke-width="3"/><path d="M30 45 Q60 25 90 45" fill="none" stroke="url(%23sageGrad)" stroke-width="4"/><path d="M30 75 Q60 95 90 75" fill="none" stroke="url(%23sageGrad)" stroke-width="4"/><circle cx="45" cy="50" r="4" fill="%23000" opacity="0.8"/><circle cx="75" cy="50" r="4" fill="%23000" opacity="0.8"/><path d="M50 70 Q60 80 70 70" stroke="%23000" stroke-width="3" fill="none"/><circle cx="60" cy="35" r="8" fill="%23ff0000" opacity="0.3"/><text x="60" y="40" text-anchor="middle" font-size="8" fill="%23ff0000" opacity="0.7">油</text></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0;
        animation: jiraiyaSage 5s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
      }
      
      @keyframes jiraiyaSage {
        0%, 50% { opacity: 0; transform: translateX(-50%) scale(0.6) rotateY(0deg); }
        60%, 80% { opacity: 0.6; transform: translateX(-50%) scale(1) rotateY(180deg); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.6) rotateY(360deg); }
      }
      
      /* Hagoromo Sensei - Wisdom & Legacy */
      body::before {
        content: '';
        position: fixed;
        top: 10%;
        left: 5%;
        width: 150px;
        height: 150px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150"><defs><radialGradient id="hagoromoGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%238b5cf6" stop-opacity="0.4"/><stop offset="100%" stop-color="%238b5cf6" stop-opacity="0.1"/></radialGradient><linearGradient id="rinnegan" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%239333ea" stop-opacity="0.8"/><stop offset="100%" stop-color="%236b21a8" stop-opacity="0.6"/></linearGradient></defs><circle cx="75" cy="75" r="60" fill="url(%23hagoromoGrad)" stroke="%23d4af37" stroke-width="4"/><circle cx="75" cy="75" r="45" fill="none" stroke="url(%23rinnegan)" stroke-width="2"/><circle cx="75" cy="75" r="30" fill="none" stroke="url(%23rinnegan)" stroke-width="2"/><circle cx="75" cy="75" r="15" fill="none" stroke="url(%23rinnegan)" stroke-width="2"/><circle cx="75" cy="60" r="3" fill="%239333ea"/><circle cx="60" cy="75" r="3" fill="%239333ea"/><circle cx="90" cy="75" r="3" fill="%239333ea"/><circle cx="75" cy="90" r="3" fill="%239333ea"/><circle cx="65" cy="65" r="2" fill="%239333ea"/><circle cx="85" cy="65" r="2" fill="%239333ea"/><circle cx="65" cy="85" r="2" fill="%239333ea"/><circle cx="85" cy="85" r="2" fill="%239333ea"/><path d="M75 30 L75 120 M30 75 L120 75" stroke="%23d4af37" stroke-width="1" opacity="0.5"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0;
        animation: hagoromoWisdom 8s ease-in-out infinite;
        pointer-events: none;
        z-index: -1;
      }
      
      @keyframes hagoromoWisdom {
        0%, 40% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        50%, 70% { opacity: 0.4; transform: scale(1) rotate(180deg); }
        80%, 90% { opacity: 0.6; transform: scale(1.1) rotate(270deg); }
        100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
      }
      
      /* Kurama - Nine Tails Power */
      .btn-primary:hover::after {
        content: '';
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 60px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60"><defs><radialGradient id="kuramaGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ff4500" stop-opacity="0.7"/><stop offset="100%" stop-color="%23ff6b35" stop-opacity="0.3"/></radialGradient></defs><ellipse cx="50" cy="30" rx="40" ry="25" fill="url(%23kuramaGrad)"/><path d="M20 20 Q30 10 40 20" fill="%23ff4500" opacity="0.6"/><path d="M60 20 Q70 10 80 20" fill="%23ff4500" opacity="0.6"/><path d="M15 25 Q25 15 35 25" fill="%23ff4500" opacity="0.5"/><path d="M65 25 Q75 15 85 25" fill="%23ff4500" opacity="0.5"/><path d="M10 30 Q20 20 30 30" fill="%23ff4500" opacity="0.4"/><path d="M70 30 Q80 20 90 30" fill="%23ff4500" opacity="0.4"/><circle cx="35" cy="25" r="2" fill="%23ff0000" opacity="0.8"/><circle cx="65" cy="25" r="2" fill="%23ff0000" opacity="0.8"/><path d="M40 35 Q50 40 60 35" stroke="%23000" stroke-width="1" fill="none" opacity="0.6"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        animation: kuramaPower 2s ease-in-out;
        pointer-events: none;
        z-index: 10;
      }
      
      @keyframes kuramaPower {
        0% { opacity: 0; transform: translateX(-50%) scale(0.5) rotateX(0deg); }
        50% { opacity: 0.8; transform: translateX(-50%) scale(1.2) rotateX(180deg); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.5) rotateX(360deg); }
      }
      
      /* Killer B - Rap & Rhythm */
      .category-btn.active::after {
        content: '';
        position: absolute;
        top: -25px;
        right: -25px;
        width: 70px;
        height: 70px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 70"><defs><linearGradient id="beeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23fbbf24" stop-opacity="0.6"/><stop offset="100%" stop-color="%23f59e0b" stop-opacity="0.3"/></linearGradient></defs><circle cx="35" cy="35" r="30" fill="url(%23beeGrad)" stroke="%23d4af37" stroke-width="2"/><rect x="20" y="25" width="30" height="4" fill="%23000" opacity="0.7"/><rect x="20" y="35" width="30" height="4" fill="%23000" opacity="0.7"/><rect x="20" y="45" width="30" height="4" fill="%23000" opacity="0.7"/><circle cx="25" cy="20" r="3" fill="%23000" opacity="0.8"/><circle cx="45" cy="20" r="3" fill="%23000" opacity="0.8"/><path d="M25 55 Q35 60 45 55" stroke="%23000" stroke-width="2" fill="none"/><text x="35" y="15" text-anchor="middle" font-size="6" fill="%23d4af37" font-weight="bold">B</text></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        opacity: 0;
        animation: killerBRap 3s ease-in-out infinite;
        pointer-events: none;
        z-index: 5;
      }
      
      @keyframes killerBRap {
        0%, 60% { opacity: 0; transform: scale(0.7) rotate(0deg); }
        70%, 85% { opacity: 0.7; transform: scale(1) rotate(360deg); }
        100% { opacity: 0; transform: scale(0.7) rotate(0deg); }
      }
      
      /* Fukasaku - Sage Training */
      .sensei-card:hover::before {
        content: '';
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        width: 60px;
        height: 60px;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><defs><radialGradient id="fukasaku" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%2322c55e" stop-opacity="0.6"/><stop offset="100%" stop-color="%2316a34a" stop-opacity="0.2"/></radialGradient></defs><ellipse cx="30" cy="40" rx="25" ry="15" fill="url(%23fukasaku)"/><circle cx="20" cy="25" r="8" fill="%23fbbf24" opacity="0.7"/><circle cx="40" cy="25" r="8" fill="%23fbbf24" opacity="0.7"/><circle cx="20" cy="25" r="3" fill="%23000"/><circle cx="40" cy="25" r="3" fill="%23000"/><path d="M25 35 Q30 40 35 35" stroke="%23000" stroke-width="2" fill="none"/><path d="M15 20 Q20 15 25 20" fill="%2322c55e" opacity="0.5"/><path d="M35 20 Q40 15 45 20" fill="%2322c55e" opacity="0.5"/></svg>');
        background-size: contain;
        background-repeat: no-repeat;
        animation: fukasakuWisdom 2s ease-in-out;
        pointer-events: none;
        z-index: 10;
      }
      
      @keyframes fukasakuWisdom {
        0% { opacity: 0; transform: translateX(-50%) scale(0.6) rotateY(0deg); }
        50% { opacity: 0.8; transform: translateX(-50%) scale(1) rotateY(180deg); }
        100% { opacity: 0; transform: translateX(-50%) scale(0.6) rotateY(360deg); }
      }
      
      /* Professional Transitions */
      .glass-card, .post-card, .modal-content, .sensei-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .glass-card:hover, .post-card:hover {
        transform: translateY(-8px) scale(1.02);
        box-shadow: 0 20px 40px rgba(255, 107, 53, 0.3);
      }
      
      /* Scroll-triggered animations */
      @keyframes scrollReveal {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      
      .glass-card {
        animation: scrollReveal 0.6s ease-out forwards;
      }
      
      .post-card:nth-child(odd) {
        animation: scrollReveal 0.8s ease-out forwards;
      }
      
      .post-card:nth-child(even) {
        animation: scrollReveal 1s ease-out forwards;
      }
    `}</style>
  );
};

export default NarutoCharacters;