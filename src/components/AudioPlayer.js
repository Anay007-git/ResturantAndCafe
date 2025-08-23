// Audio utility for chord sounds
export const playChordSound = (chordName) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
  const chordFrequencies = {
    G: [196, 247, 294, 392, 494, 588],
    C: [131, 165, 196, 262, 330, 392],
    D: [147, 185, 220, 294, 370, 440],
    Em: [82, 123, 165, 220, 247, 330],
    Am: [110, 131, 165, 220, 262, 330],
    F: [87, 110, 131, 175, 220, 262]
  };
  
  const frequencies = chordFrequencies[chordName] || chordFrequencies.G;
  
  frequencies.forEach((freq, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.5);
    
    oscillator.start(audioContext.currentTime + index * 0.05);
    oscillator.stop(audioContext.currentTime + 1.5);
  });
};