import React, { useEffect, useRef, useState } from 'react';

// Lightweight virtual music room using Web Audio API
// Instruments: Acoustic Guitar, Electric Guitar, Bass, Piano, Drums, Banjo

const NOTE_FREQUENCIES = {
  // A small piano range from C4 (261.63) to B5
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77
};

const GUITAR_STRINGS = [ // standard tuning E A D G B E (from low to high)
  { name: 'E2', freq: 82.41 }, // low E (we'll play higher octave variants for demo)
  { name: 'A2', freq: 110.00 },
  { name: 'D3', freq: 146.83 },
  { name: 'G3', freq: 196.00 },
  { name: 'B3', freq: 246.94 },
  { name: 'E4', freq: 329.63 }
];

const BASS_STRINGS = [
  { name: 'E1', freq: 41.20 },
  { name: 'A1', freq: 55.00 },
  { name: 'D2', freq: 73.42 },
  { name: 'G2', freq: 98.0 }
];

const BANJO_STRINGS = [
  { name: 'G4', freq: 392.0 },
  { name: 'D3', freq: 146.83 },
  { name: 'G3', freq: 196.0 },
  { name: 'B3', freq: 246.94 },
  { name: 'D4', freq: 293.66 }
];

const VirtualRoom = () => {
  const [instrument, setInstrument] = useState('Acoustic Guitar');
  const [volume, setVolume] = useState(0.6);
  const [sustain, setSustain] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const metroIntervalRef = useRef(null);

  useEffect(() => {
    // Initialize AudioContext lazily (on user interaction ideally)
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    masterGainRef.current = audioCtxRef.current.createGain();
    masterGainRef.current.gain.value = volume;
    masterGainRef.current.connect(audioCtxRef.current.destination);

    const handleKey = (e) => {
      // Map some keys to notes for quick play (z-m row)
      const keyMap = {
        z: 'C4', x: 'D4', c: 'E4', v: 'F4', b: 'G4', n: 'A4', m: 'B4',
        ',': 'C5', '.': 'D5', '/': 'E5'
      };
      const note = keyMap[e.key];
      if (note) playNote(NOTE_FREQUENCIES[note]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    if (metronomeOn) startMetronome();
    else stopMetronome();
    return () => stopMetronome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metronomeOn, bpm]);

  const startMetronome = () => {
    stopMetronome();
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const interval = (60 / bpm) * 1000;
    metroIntervalRef.current = setInterval(() => {
      // short click sound
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 1000;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(masterGainRef.current);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.3, now + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start(now);
      o.stop(now + 0.13);
    }, interval);
  };

  const stopMetronome = () => {
    if (metroIntervalRef.current) clearInterval(metroIntervalRef.current);
    metroIntervalRef.current = null;
  };

  const playNote = (freq, opts = {}) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    // Simple voices for instrument types
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    gain.connect(masterGainRef.current);

    if (instrument === 'Drums') {
      // Kick-like tone for demo
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(freq || 100, now);
      o.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      o.connect(gain);
      gain.gain.setValueAtTime(1, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (sustain ? 1.2 : 0.35));
      o.start(now);
      o.stop(now + 0.5);
      return;
    }

    // For string instruments use short pluck-ish envelope
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    // Wavechoice per instrument
    switch (instrument) {
      case 'Acoustic Guitar':
        osc.type = 'triangle';
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        break;
      case 'Electric Guitar':
        osc.type = 'square';
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        break;
      case 'Bass':
        osc.type = 'sine';
        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        break;
      case 'Banjo':
        osc.type = 'triangle';
        filter.type = 'highpass';
        filter.frequency.value = 400;
        break;
      case 'Piano':
      default:
        osc.type = 'sawtooth';
        filter.type = 'lowpass';
        filter.frequency.value = 4000;
        break;
    }

    osc.frequency.value = freq || 440;
    osc.connect(filter);
    filter.connect(gain);

    const attack = 0.003;
    const decay = 0.2;
    const sustainLevel = sustain ? 0.7 : 0.0;
    const release = sustain ? 0.8 : 0.4;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1.0, now + attack);
    gain.gain.exponentialRampToValueAtTime(sustainLevel, now + attack + decay);

    osc.start(now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay + release + 0.001);
    osc.stop(now + attack + decay + release + 0.05);
  };

  const handleStringPluck = (baseFreq, fret = 0) => {
    // semitone multiplier
    const freq = baseFreq * Math.pow(2, fret / 12);
    playNote(freq);
  };

  const handlePadHit = (type) => {
    if (type === 'kick') playNote(120, { drum: true });
    if (type === 'snare') playNote(250, { drum: true });
    if (type === 'hihat') playNote(8000, { drum: true });
  };

  return (
    <section id="virtual-room" style={{ padding: '2rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: 12 }}>🎧 Virtual Music Room</h2>
        <p style={{ color: '#9aa3c7' }}>Select instrument and play using on-screen controls or keyboard (z/x/c..). This is a lightweight demo using the Web Audio API.</p>

        <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Instrument:
            <select value={instrument} onChange={(e) => setInstrument(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8 }}>
              <option>Acoustic Guitar</option>
              <option>Electric Guitar</option>
              <option>Bass</option>
              <option>Piano</option>
              <option>Banjo</option>
              <option>Drums</option>
            </select>
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Volume:
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} />
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Sustain:
            <input type="checkbox" checked={sustain} onChange={() => setSustain(s => !s)} />
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Metronome BPM:
            <input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value || 90))} style={{ width: 80 }} />
          </label>

          <button onClick={() => setMetronomeOn(m => !m)} style={{ padding: '8px 12px', borderRadius: 8 }}>{metronomeOn ? 'Stop Metronome' : 'Start Metronome'}</button>
        </div>

        <div style={{ marginTop: 24 }}>
          {instrument === 'Piano' ? (
            <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', userSelect: 'none' }}>
              {Object.keys(NOTE_FREQUENCIES).map((k) => (
                <button key={k} onClick={() => playNote(NOTE_FREQUENCIES[k])} style={{ padding: '18px 12px', borderRadius: 6, background: '#fff', color: '#111', border: '1px solid #ddd', cursor: 'pointer', fontWeight: 700 }}>{k.replace(/[0-9]/, '')}</button>
              ))}
            </div>
          ) : instrument === 'Drums' ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handlePadHit('kick')} style={{ padding: 20, borderRadius: 12, background: '#111', color: '#fff' }}>Kick</button>
              <button onClick={() => handlePadHit('snare')} style={{ padding: 20, borderRadius: 12, background: '#222', color: '#fff' }}>Snare</button>
              <button onClick={() => handlePadHit('hihat')} style={{ padding: 20, borderRadius: 12, background: '#333', color: '#fff' }}>Hi-hat</button>
            </div>
          ) : ( // Strings UI for guitar/bass/banjo
            <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {((instrument === 'Bass') ? BASS_STRINGS : instrument === 'Banjo' ? BANJO_STRINGS : GUITAR_STRINGS).map((s, i) => (
                  <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, color: '#9aa3c7' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 2, 4, 5, 7].map(fret => (
                        <button key={fret} onClick={() => handleStringPluck(s.freq, fret)} style={{ padding: '10px 12px', borderRadius: 8, background: '#1b1f33', color: '#fff', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>{fret}</button>
                      ))}
                    </div>
                    <button onClick={() => handleStringPluck(s.freq, 0)} style={{ marginTop: 8, padding: '8px 10px', borderRadius: 8, background: '#2b3658', color: '#fff' }}>Pluck</button>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 8, color: '#9aa3c7' }}>Tip: Use the fret buttons to change pitch (semitones). Click Pluck to strum the open string.</div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 28, color: '#9aa3c7', fontSize: 13 }}>
          This is a demo feature. For multi-user jam rooms, real-time networking (WebRTC) and server-side session handling are required.
        </div>
      </div>
    </section>
  );
};

export default VirtualRoom;
