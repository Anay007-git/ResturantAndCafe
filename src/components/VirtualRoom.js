import React, { useEffect, useRef, useState } from 'react';

// Enhanced VirtualRoom using Web Audio API with improved instrument feel and visuals

const NOTE_FREQUENCIES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0, B5: 987.77
};

const GUITAR_STRINGS = [
  { name: 'E4', freq: 329.63 },
  { name: 'B3', freq: 246.94 },
  { name: 'G3', freq: 196.0 },
  { name: 'D3', freq: 146.83 },
  { name: 'A2', freq: 110.0 },
  { name: 'E2', freq: 82.41 }
];

const BASS_STRINGS = [
  { name: 'G2', freq: 98.0 },
  { name: 'D2', freq: 73.42 },
  { name: 'A1', freq: 55.0 },
  { name: 'E1', freq: 41.2 }
];

const BANJO_STRINGS = [
  { name: 'D4', freq: 293.66 },
  { name: 'B3', freq: 246.94 },
  { name: 'G3', freq: 196.0 },
  { name: 'D3', freq: 146.83 },
  { name: 'G2', freq: 98.0 }
];

export default function VirtualRoom() {
  const [instrument, setInstrument] = useState('Acoustic Guitar');
  const [volume, setVolume] = useState(0.6);
  const [sustain, setSustain] = useState(false);
  const [bpm, setBpm] = useState(90);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [activeKeys, setActiveKeys] = useState({});

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const metroIntervalRef = useRef(null);

  useEffect(() => {
    // Initialize audio context on mount (will still require user gesture on some browsers to resume)
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    masterGainRef.current = audioCtxRef.current.createGain();
    masterGainRef.current.gain.value = volume;
    masterGainRef.current.connect(audioCtxRef.current.destination);

    const handleKey = (e) => {
      const keyMap = { z: 'C4', x: 'D4', c: 'E4', v: 'F4', b: 'G4', n: 'A4', m: 'B4', ',': 'C5' };
      const note = keyMap[e.key];
      if (note) {
        triggerVisual(note);
        playNote(NOTE_FREQUENCIES[note]);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = 1200;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(masterGainRef.current);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.25, now + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start(now);
      o.stop(now + 0.13);
    }, interval);
  };

  const stopMetronome = () => {
    if (metroIntervalRef.current) clearInterval(metroIntervalRef.current);
    metroIntervalRef.current = null;
  };

  const triggerVisual = (key) => {
    setActiveKeys(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setActiveKeys(prev => ({ ...prev, [key]: false })), 220);
  };

  // Waveshaper for subtle guitar distortion
  const makeDistortion = (ctx, amount = 20) => {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    const wave = ctx.createWaveShaper();
    wave.curve = curve;
    wave.oversample = '4x';
    return wave;
  };

  // Pluck-style note using short noise burst + filter + envelope for realistic texture
  const pluck = (freq, opts = {}) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.15);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = false;

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = Math.min(8000, Math.max(800, freq * 8));

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1.0, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (sustain ? 1.2 : 0.9));

    noise.connect(lp);
    lp.connect(gain);

    if (opts.distort) {
      const dist = makeDistortion(ctx, 30);
      gain.connect(dist);
      dist.connect(masterGainRef.current);
    } else {
      gain.connect(masterGainRef.current);
    }

    noise.start(now);
    noise.stop(now + 0.6);
  };

  // Richer piano tone using multiple detuned oscillators with exponential decay
  const pianoTone = (freq) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(1, now);
    master.connect(masterGainRef.current);

    const createVoice = (detune, gainValue, duration) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = freq * Math.pow(2, detune / 1200);
      g.gain.setValueAtTime(gainValue, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.connect(g);
      g.connect(master);
      o.start(now);
      o.stop(now + duration + 0.1);
    };

    createVoice(0, 0.9, sustain ? 1.5 : 1.2);
    createVoice(3, 0.25, sustain ? 1.0 : 0.9);
    createVoice(-5, 0.12, sustain ? 1.2 : 1.0);
  };

  const playNote = (freq) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    if (instrument === 'Piano') {
      pianoTone(freq);
      return;
    }

    if (instrument === 'Drums') {
      // Kick (low sine) + noise snare style depending on freq param
      const kick = ctx.createOscillator();
      const gk = ctx.createGain();
      kick.frequency.setValueAtTime(150, now);
      kick.frequency.exponentialRampToValueAtTime(50, now + 0.25);
      gk.gain.setValueAtTime(1, now);
      gk.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      kick.connect(gk);
      gk.connect(masterGainRef.current);
      kick.start(now);
      kick.stop(now + 0.5);

      const snareNoise = ctx.createBufferSource();
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / buffer.length, 1.5);
      snareNoise.buffer = buffer;
      const snareFilter = ctx.createBiquadFilter();
      snareFilter.type = 'highpass';
      snareFilter.frequency.value = 1200;
      const gn = ctx.createGain();
      gn.gain.setValueAtTime(1, now);
      gn.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      snareNoise.connect(snareFilter);
      snareFilter.connect(gn);
      gn.connect(masterGainRef.current);
      snareNoise.start(now);
      snareNoise.stop(now + 0.25);

      return;
    }

    if (instrument === 'Bass') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const bi = ctx.createBiquadFilter();
      o.type = 'sine';
      o.frequency.value = freq;
      bi.type = 'lowpass';
      bi.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(1, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + (sustain ? 2.0 : 1.2));
      o.connect(bi);
      bi.connect(g);
      g.connect(masterGainRef.current);
      o.start(now);
      o.stop(now + (sustain ? 2.1 : 1.3));
      return;
    }

    if (instrument === 'Electric Guitar') {
      // pluck + distortion + short chorus
      pluck(freq, { distort: true });
      const ctxnow = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'square';
      osc.frequency.value = freq * 1.0;
      filter.type = 'lowpass';
      filter.frequency.value = 2500;
      gain.gain.setValueAtTime(0.0001, ctxnow);
      gain.gain.exponentialRampToValueAtTime(0.6, ctxnow + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctxnow + (sustain ? 1.6 : 0.9));
      osc.connect(filter);
      filter.connect(gain);
      const dist = makeDistortion(ctx, 40);
      gain.connect(dist);
      dist.connect(masterGainRef.current);
      osc.start(ctxnow);
      osc.stop(ctxnow + (sustain ? 1.7 : 1.0));
      return;
    }

    // Default acoustic / banjo behavior: pluck with tonal filtering
    pluck(freq, { distort: instrument === 'Banjo' });
  };

  const handleStringPluck = (baseFreq, fret = 0) => {
    const freq = baseFreq * Math.pow(2, fret / 12);
    triggerVisual(`${baseFreq}-${fret}`);
    playNote(freq);
  };

  const handlePadHit = (type) => {
    triggerVisual(type);
    if (type === 'kick') playNote(120);
    if (type === 'snare') playNote(250);
    if (type === 'hihat') playNote(8000);
  };

  // UI styles
  const containerStyle = { padding: 24, maxWidth: 1100, margin: '0 auto', color: '#e7eef8', fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" };
  const panelStyle = { display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' };
  const controlCard = { background: '#0f1724', padding: 18, borderRadius: 12, border: '1px solid rgba(102,126,234,0.12)', minWidth: 260 };
  const mainCard = { flex: 1, background: 'linear-gradient(180deg,#0b1220, #0f1724)', padding: 18, borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' };

  return (
    <section id="virtual-room" style={containerStyle}>
      <h2 style={{ color: '#667eea', display: 'flex', alignItems: 'center', gap: 12 }}>🎧 Virtual Music Room</h2>
      <p style={{ color: '#9aa3c7' }}>Play realistic-feeling instruments directly in the browser. Click controls or use keyboard shortcuts (z/x/c...)</p>

      <div style={panelStyle}>
        <div style={controlCard}>
          <label style={{ display: 'block', marginBottom: 8, color: '#9fb0ff', fontWeight: 700 }}>Instrument</label>
          <select value={instrument} onChange={(e) => setInstrument(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, background: '#071029', color: '#e7eef8', border: '1px solid rgba(255,255,255,0.04)' }}>
            <option>Acoustic Guitar</option>
            <option>Electric Guitar</option>
            <option>Bass</option>
            <option>Piano</option>
            <option>Banjo</option>
            <option>Drums</option>
          </select>

          <div style={{ marginTop: 12 }}>
            <label style={{ color: '#9fb0ff', fontWeight: 700 }}>Volume</label>
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{ width: '100%' }} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" checked={sustain} onChange={() => setSustain(s => !s)} />
              <span style={{ color: '#cfe0ff', fontWeight: 600 }}>Sustain</span>
            </label>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="number" value={bpm} onChange={(e) => setBpm(Number(e.target.value || 90))} style={{ width: 70, padding: 8, borderRadius: 8, background: '#071029', color: '#e7eef8', border: '1px solid rgba(255,255,255,0.04)' }} />
              <button onClick={() => setMetronomeOn(m => !m)} style={{ padding: '8px 12px', borderRadius: 8, background: metronomeOn ? '#223' : '#112', color: metronomeOn ? '#9ff' : '#cfe0ff', border: '1px solid rgba(255,255,255,0.04)' }}>{metronomeOn ? 'Metronome On' : 'Metronome'}</button>
            </div>
          </div>

          <div style={{ marginTop: 14, color: '#9aa3c7', fontSize: 13 }}>
            Tip: For the best experience allow audio playback on first interaction. For multi-user jamming, a real-time backend is needed.
          </div>
        </div>

        <div style={mainCard}>
          {/* Piano View */}
          {instrument === 'Piano' ? (
            <div>
              <div style={{ display: 'flex', gap: 6, userSelect: 'none' }}>
                {Object.keys(NOTE_FREQUENCIES).map((k) => (
                  <button key={k} onClick={() => { triggerVisual(k); playNote(NOTE_FREQUENCIES[k]); }}
                    style={{
                      padding: '18px 14px', borderRadius: 6, background: activeKeys[k] ? '#a3b7ff' : '#fff', color: activeKeys[k] ? '#071029' : '#111', border: '1px solid #ddd', cursor: 'pointer', fontWeight: 700
                    }}>{k.replace(/[0-9]/, '')}</button>
                ))}
              </div>
            </div>
          ) : instrument === 'Drums' ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <button onClick={() => handlePadHit('kick')} style={{ padding: 20, borderRadius: 12, background: activeKeys['kick'] ? '#334' : '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>Kick</button>
                <button onClick={() => handlePadHit('snare')} style={{ padding: 20, borderRadius: 12, background: activeKeys['snare'] ? '#433' : '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>Snare</button>
                <button onClick={() => handlePadHit('hihat')} style={{ padding: 20, borderRadius: 12, background: activeKeys['hihat'] ? '#343' : '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}>Hi-hat</button>
              </div>
              <div style={{ alignSelf: 'center', color: '#9aa3c7' }}>Tap pads to play drum sounds.</div>
            </div>
          ) : (
            // Strings UI (Guitar, Bass, Banjo)
            <div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {((instrument === 'Bass') ? BASS_STRINGS : instrument === 'Banjo' ? BANJO_STRINGS : GUITAR_STRINGS).map((s) => (
                  <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 120 }}>
                    <div style={{ fontSize: 12, color: '#9aa3c7' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0, 2, 4, 5, 7, 9, 12].map((fret) => (
                        <button key={fret} onClick={() => handleStringPluck(s.freq, fret)} style={{ padding: '8px 10px', borderRadius: 8, background: activeKeys[`${s.name}-${fret}`] ? '#8ea6ff' : '#0b1220', color: '#e7eef8', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>{fret}</button>
                      ))}
                    </div>
                    <button onClick={() => handleStringPluck(s.freq, 0)} style={{ marginTop: 8, padding: '10px 14px', borderRadius: 8, background: '#19223a', color: '#dfe9ff', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>Pluck</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ color: '#9aa3c7' }}>Visual feedback highlights keys/strings when played.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume(); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#163', color: '#cfe0ff', border: 'none', cursor: 'pointer' }}>Enable Audio</button>
              <button onClick={() => { setInstrument('Acoustic Guitar'); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#0b1', color: '#071029', border: 'none', cursor: 'pointer' }}>Reset</button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, color: '#9aa3c7', fontSize: 13 }}>
        Note: This is a single-user demo. Use a proper audio engine and samples for production-quality instrument sounds.
      </div>
    </section>
  );
}
