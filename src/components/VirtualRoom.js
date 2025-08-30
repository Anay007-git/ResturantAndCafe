import React, { useEffect, useRef, useState } from 'react';

// GarageBand-like VirtualRoom: piano (white/black keys), guitar fretboard, drum pads,
// ADSR controls, effects (reverb, distortion), and a waveform visualizer.

const KEY_ORDER = [
  'C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4',
  'C5','C#5','D5','D#5','E5'
];

const NOTE_FREQ = {
  C4:261.63, 'C#4':277.18, D4:293.66, 'D#4':311.13, E4:329.63, F4:349.23, 'F#4':369.99,
  G4:392.0, 'G#4':415.3, A4:440.0, 'A#4':466.16, B4:493.88, C5:523.25, 'C#5':554.37, D5:587.33, 'D#5':622.25, E5:659.25
};

const GUITAR_STRINGS = [
  { name: 'E4', freq: 329.63 },
  { name: 'B3', freq: 246.94 },
  { name: 'G3', freq: 196.0 },
  { name: 'D3', freq: 146.83 },
  { name: 'A2', freq: 110.0 },
  { name: 'E2', freq: 82.41 }
];

const DRUM_PADS = [
  { id: 'kick', label: 'Kick' },
  { id: 'snare', label: 'Snare' },
  { id: 'hihat', label: 'Hi-Hat' },
  { id: 'tom', label: 'Tom' },
  { id: 'ride', label: 'Ride' },
  { id: 'clap', label: 'Clap' }
];

export default function VirtualRoom() {
  const [instrument, setInstrument] = useState('Acoustic Guitar');
  const [volume, setVolume] = useState(0.8);
  const [adsr, setAdsr] = useState({ attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.6 });
  const [reverbOn, setReverbOn] = useState(true);
  const [distortionOn, setDistortionOn] = useState(false);
  const [active, setActive] = useState({});

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const convolverRef = useRef(null);
  const distortionRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    // initialize audio
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;

    masterGainRef.current = ctx.createGain();
    masterGainRef.current.gain.value = volume;

    analyserRef.current = ctx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    // convolver (simple impulse)
    convolverRef.current = ctx.createConvolver();
    convolverRef.current.buffer = createReverbImpulse(ctx, 2.5);

    // distortion node
    distortionRef.current = ctx.createWaveShaper();
    distortionRef.current.curve = makeDistortionCurve(400);
    distortionRef.current.oversample = '4x';

    // routing: source -> effects -> analyser -> master -> destination
    // we'll dynamically connect sources to effects when playing notes
    masterGainRef.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);

    drawVisualizer();

    return () => {
      stopVisualizer();
      if (animRef.current) cancelAnimationFrame(animRef.current);
      try { ctx.close(); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    // update reverb connect/disconnect
    // We handle in play path per-source for simplicity
  }, [reverbOn, distortionOn]);

  // --- Audio helpers ---
  const createReverbImpulse = (ctx, seconds = 2) => {
    const rate = ctx.sampleRate;
    const length = rate * seconds;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let i = 0; i < 2; i++) {
      const channel = impulse.getChannelData(i);
      for (let j = 0; j < length; j++) {
        channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
      }
    }
    return impulse;
  };

  const makeDistortionCurve = (amount = 400) => {
    const k = typeof amount === 'number' ? amount : 50;
    const n = 44100;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  };

  const connectEffectChain = (sourceNode) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return sourceNode;
    // source -> distortion? -> convolver? -> masterGain
    if (distortionOn) {
      sourceNode.connect(distortionRef.current);
      if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current);
    } else {
      if (reverbOn) sourceNode.connect(convolverRef.current); else sourceNode.connect(masterGainRef.current);
    }

    // convolver output -> master
    convolverRef.current.disconnect();
    convolverRef.current.connect(masterGainRef.current);

    // ensure master -> analyser -> destination already connected
    return sourceNode;
  };

  const triggerVisual = (key) => {
    setActive(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setActive(prev => ({ ...prev, [key]: false })), 220);
  };

  // Pluck function for strings
  const pluckString = (freq) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const now = ctx.currentTime;

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);

    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;

    const band = ctx.createBiquadFilter();
    band.type = 'bandpass';
    band.frequency.value = freq * 1.5;
    band.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    const A = Math.max(0.001, adsr.attack);
    const D = Math.max(0.001, adsr.decay);
    const S = Math.max(0, adsr.sustain);
    const R = Math.max(0.01, adsr.release);

    gain.gain.exponentialRampToValueAtTime(1.0, now + A);
    gain.gain.exponentialRampToValueAtTime(S, now + A + D);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + A + D + R);

    noiseSrc.connect(band);
    band.connect(gain);

    // connect through effects
    if (distortionOn) {
      band.connect(distortionRef.current);
      if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current);
    } else {
      if (reverbOn) band.connect(convolverRef.current); else band.connect(masterGainRef.current);
    }

    // ensure convolver -> master
    convolverRef.current.disconnect();
    convolverRef.current.connect(masterGainRef.current);

    noiseSrc.start(now);
    noiseSrc.stop(now + 1.2);
  };

  const playPiano = (freq) => {
    const ctx = audioCtxRef.current; if (!ctx) return;
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();

    osc1.type = 'triangle'; osc2.type = 'sine';
    osc1.frequency.value = freq; osc2.frequency.value = freq * 1.002;

    const A = Math.max(0.001, adsr.attack);
    const D = Math.max(0.001, adsr.decay);
    const S = Math.max(0, adsr.sustain);
    const R = Math.max(0.01, adsr.release);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(1.0, now + A);
    g.gain.exponentialRampToValueAtTime(S, now + A + D);
    g.gain.exponentialRampToValueAtTime(0.0001, now + A + D + R);

    osc1.connect(g); osc2.connect(g);
    // effects
    if (distortionOn) { g.connect(distortionRef.current); if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); }
    else { if (reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); }

    convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current);

    osc1.start(now); osc2.start(now);
    osc1.stop(now + A + D + R + 0.05);
    osc2.stop(now + A + D + R + 0.05);
  };

  const playDrum = (type) => {
    const ctx = audioCtxRef.current; if (!ctx) return; const now = ctx.currentTime;
    if (type === 'kick') {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(150, now); o.frequency.exponentialRampToValueAtTime(50, now + 0.4);
      g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      o.connect(g); if (distortionOn) { g.connect(distortionRef.current); if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); } else { if (reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); }
      convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current);
      o.start(now); o.stop(now + 0.5);
    } else {
      // snare/others: noise burst
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate); const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 1.5);
      const src = ctx.createBufferSource(); src.buffer = buffer; const f = ctx.createBiquadFilter();
      if (type === 'snare') { f.type = 'highpass'; f.frequency.value = 1200; }
      else { f.type = 'bandpass'; f.frequency.value = 4000; }
      const g = ctx.createGain(); g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      src.connect(f); f.connect(g);
      if (distortionOn) { g.connect(distortionRef.current); if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); } else { if (reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); }
      convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current);
      src.start(now); src.stop(now + 0.25);
    }
  };

  // --- Visualizer ---
  const drawVisualizer = () => {
    const canvas = canvasRef.current; const analyser = analyserRef.current; const ctx = audioCtxRef.current;
    if (!canvas || !analyser || !ctx) return;
    const c = canvas.getContext('2d');
    const bufferLength = analyser.fftSize; const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      c.fillStyle = '#071029'; c.fillRect(0, 0, canvas.width, canvas.height);
      c.lineWidth = 2; c.strokeStyle = '#6ea0ff'; c.beginPath();
      const sliceWidth = canvas.width * 1.0 / bufferLength; let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; const y = v * canvas.height / 2;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        x += sliceWidth;
      }
      c.lineTo(canvas.width, canvas.height / 2); c.stroke();
    };
    draw();
  };

  const stopVisualizer = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
  };

  // UI actions
  const onPianoKey = (key) => {
    triggerVisual(key);
    playPiano(NOTE_FREQ[key]);
  };

  const onStringPluck = (freq, id) => {
    triggerVisual(id);
    pluckString(freq);
  };

  const onPadHit = (id) => { triggerVisual(id); playDrum(id); };

  // --- styles ---
  const styles = {
    wrapper: { padding: 20, maxWidth: 1200, margin: '0 auto', color: '#e6f0ff', fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" },
    top: { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    controls: { display: 'flex', gap: 12, alignItems: 'center' },
    panel: { display: 'flex', gap: 16, marginTop: 18, alignItems: 'flex-start', flexWrap: 'wrap' },
    card: { background: '#071026', padding: 16, borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }
  };

  return (
    <section id="virtual-room" style={styles.wrapper}>
      <div style={styles.top}>
        <div>
          <h2 style={{ margin: 0, color: '#7fa1ff' }}>🎛️ Virtual Studio</h2>
          <div style={{ color: '#9fb0d9' }}>GarageBand-like instruments: piano, guitar, drums. Visualizer and effects included.</div>
        </div>

        <div style={styles.controls}>
          <select value={instrument} onChange={e => setInstrument(e.target.value)} style={{ padding: 8, borderRadius: 8, background: '#0b1422', color: '#e6f0ff' }}>
            <option>Acoustic Guitar</option>
            <option>Electric Guitar</option>
            <option>Bass</option>
            <option>Piano</option>
            <option>Banjo</option>
            <option>Drums</option>
          </select>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Volume
            <input type="range" min="0" max="1" step="0.01" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} />
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Reverb
            <input type="checkbox" checked={reverbOn} onChange={() => setReverbOn(r => !r)} />
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            Distortion
            <input type="checkbox" checked={distortionOn} onChange={() => setDistortionOn(d => !d)} />
          </label>
        </div>
      </div>

      <div style={styles.panel}>
        <div style={{ ...styles.card, minWidth: 280 }}>
          <div style={{ fontWeight: 700, color: '#9fb0ff' }}>ADSR</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: 8, marginTop: 8 }}>
            <label style={{ color: '#9fb0ff' }}>Attack</label>
            <input type="range" min="0.001" max="1" step="0.001" value={adsr.attack} onChange={e => setAdsr(a => ({ ...a, attack: parseFloat(e.target.value) }))} />
            <label style={{ color: '#9fb0ff' }}>Decay</label>
            <input type="range" min="0.001" max="2" step="0.01" value={adsr.decay} onChange={e => setAdsr(a => ({ ...a, decay: parseFloat(e.target.value) }))} />
            <label style={{ color: '#9fb0ff' }}>Sustain</label>
            <input type="range" min="0" max="1" step="0.01" value={adsr.sustain} onChange={e => setAdsr(a => ({ ...a, sustain: parseFloat(e.target.value) }))} />
            <label style={{ color: '#9fb0ff' }}>Release</label>
            <input type="range" min="0.01" max="3" step="0.01" value={adsr.release} onChange={e => setAdsr(a => ({ ...a, release: parseFloat(e.target.value) }))} />
          </div>

          <div style={{ marginTop: 12 }}>
            <canvas ref={canvasRef} width={240} height={80} style={{ width: '100%', borderRadius: 6, background: '#071026' }} />
          </div>
        </div>

        <div style={{ ...styles.card, flex: 1, minWidth: 520 }}>
          {/* Piano */}
          {instrument === 'Piano' ? (
            <div>
              <div style={{ display: 'flex', gap: 2, userSelect: 'none' }}>
                {KEY_ORDER.map(k => {
                  const isBlack = k.includes('#');
                  return (
                    <button
                      key={k}
                      onMouseDown={() => { triggerVisual(k); playPiano(NOTE_FREQ[k]); }}
                      style={{
                        padding: isBlack ? '14px 8px' : '20px 12px',
                        background: active[k] ? (isBlack ? '#1f2b44' : '#a8c0ff') : (isBlack ? '#111' : '#fff'),
                        color: isBlack ? '#fff' : '#071029',
                        border: '1px solid #333',
                        borderRadius: 6,
                        boxShadow: isBlack ? 'inset 0 -4px rgba(0,0,0,0.4)' : '0 4px 10px rgba(0,0,0,0.12)'
                      }}
                    >{k.replace(/[0-9]/, '')}</button>
                  );
                })}
              </div>
            </div>
          ) : instrument === 'Drums' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {DRUM_PADS.map(p => (
                <button key={p.id} onClick={() => onPadHit(p.id)} style={{ padding: 24, borderRadius: 10, background: active[p.id] ? '#334455' : '#0b1422', color: '#e6f0ff', fontWeight: 700 }}>
                  {p.label}
                </button>
              ))}
            </div>
          ) : (
            // Guitar / Bass / Banjo fretboard
            <div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {GUITAR_STRINGS.map((s, idx) => (
                  <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ fontSize: 12, color: '#9fb0ff' }}>{s.name}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {[0,2,4,5,7,9,12].map(f => (
                        <button key={f} onClick={() => onStringPluck(s.freq * Math.pow(2, f/12), `${s.name}-${f}`)}
                          style={{ padding: 8, borderRadius: 8, background: active[`${s.name}-${f}`] ? '#8ea6ff' : '#071026', color: '#e6f0ff', border: '1px solid rgba(255,255,255,0.04)' }}>{f}</button>
                      ))}
                    </div>
                    <button onClick={() => onStringPluck(s.freq, `${s.name}-pluck`)} style={{ padding: '8px 12px', borderRadius: 8, background: '#0e2036', color: '#e6f0ff' }}>Pluck</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: '#9fb0d9' }}>Visual instrumentation with improved envelopes & effects.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume(); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#163', color: '#cfe0ff' }}>Enable Audio</button>
              <button onClick={() => { setInstrument('Acoustic Guitar'); setAdsr({ attack:0.01,decay:0.2,sustain:0.5,release:0.6 }); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#0b1', color: '#071029' }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
