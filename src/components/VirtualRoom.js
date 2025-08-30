import React, { useEffect, useRef, useState } from 'react';

// GarageBand-like VirtualRoom with metronome, responsive UI, and light-theme support

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
  const [bpm, setBpm] = useState(90);
  const [metronomeOn, setMetronomeOn] = useState(false);

  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const analyserRef = useRef(null);
  const convolverRef = useRef(null);
  const distortionRef = useRef(null);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const metroRef = useRef(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;

    masterGainRef.current = ctx.createGain();
    masterGainRef.current.gain.value = volume;

    analyserRef.current = ctx.createAnalyser();
    analyserRef.current.fftSize = 2048;

    convolverRef.current = ctx.createConvolver();
    convolverRef.current.buffer = createReverbImpulse(ctx, 2.2);

    distortionRef.current = ctx.createWaveShaper();
    distortionRef.current.curve = makeDistortionCurve(300);
    distortionRef.current.oversample = '4x';

    masterGainRef.current.connect(analyserRef.current);
    analyserRef.current.connect(ctx.destination);

    drawVisualizer();

    return () => {
      stopVisualizer();
      stopMetronome();
      try { ctx.close(); } catch (e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (masterGainRef.current) masterGainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    if (metronomeOn) startMetronome(); else stopMetronome();
    return () => stopMetronome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metronomeOn, bpm]);

  const createReverbImpulse = (ctx, seconds = 2) => {
    const rate = ctx.sampleRate; const length = rate * seconds; const impulse = ctx.createBuffer(2, length, rate);
    for (let i = 0; i < 2; i++) { const channel = impulse.getChannelData(i); for (let j = 0; j < length; j++) channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j/length, 2); }
    return impulse;
  };

  const makeDistortionCurve = (amount = 400) => {
    const k = typeof amount === 'number' ? amount : 50; const n = 44100; const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) { const x = (i * 2) / n - 1; curve[i] = ((3 + k) * x * 20 * Math.PI / 180) / (Math.PI + k * Math.abs(x)); }
    return curve;
  };

  const triggerVisual = (key) => {
    setActive(prev => ({ ...prev, [key]: true }));
    setTimeout(() => setActive(prev => ({ ...prev, [key]: false })), 220);
  };

  // Metronome
  const startMetronome = () => {
    stopMetronome();
    const ctx = audioCtxRef.current; if (!ctx) return;
    const interval = (60 / Math.max(30, bpm)) * 1000;
    metroRef.current = setInterval(() => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'square'; o.frequency.value = 1000; g.gain.value = 0.0001; o.connect(g); g.connect(masterGainRef.current);
      const now = ctx.currentTime; g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(0.35, now + 0.001); g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.start(now); o.stop(now + 0.13);
    }, interval);
  };

  const stopMetronome = () => { if (metroRef.current) { clearInterval(metroRef.current); metroRef.current = null; } };

  // Instruments
  const pluckString = (freq) => {
    const ctx = audioCtxRef.current; if (!ctx) return; const now = ctx.currentTime;
    const buffer = ctx.createBuffer(1, ctx.sampleRate*0.2, ctx.sampleRate); const data = buffer.getChannelData(0); for (let i=0;i<data.length;i++) data[i] = (Math.random()*2-1)*Math.pow(1-i/data.length,1.5);
    const src = ctx.createBufferSource(); src.buffer = buffer; const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value = freq*1.5; bp.Q.value = 1.5; const g = ctx.createGain();
    const A = Math.max(0.001, adsr.attack); const D = Math.max(0.001, adsr.decay); const S = Math.max(0, adsr.sustain); const R = Math.max(0.01, adsr.release);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(1.0, now + A); g.gain.exponentialRampToValueAtTime(S, now + A + D); g.gain.exponentialRampToValueAtTime(0.0001, now + A + D + (sustain?1.5:R));
    src.connect(bp); bp.connect(g);
    if (distortionOn) { g.connect(distortionRef.current); if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); }
    else { if (reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); }
    convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current);
    src.start(now); src.stop(now + 1.2);
  };

  const playPiano = (freq) => {
    const ctx = audioCtxRef.current; if (!ctx) return; const now = ctx.currentTime;
    const o1 = ctx.createOscillator(); const o2 = ctx.createOscillator(); const g = ctx.createGain();
    o1.type = 'triangle'; o2.type = 'sine'; o1.frequency.value = freq; o2.frequency.value = freq*1.002;
    const A = Math.max(0.001, adsr.attack); const D = Math.max(0.001, adsr.decay); const S = Math.max(0, adsr.sustain); const R = Math.max(0.01, adsr.release);
    g.gain.setValueAtTime(0.0001, now); g.gain.exponentialRampToValueAtTime(1.0, now + A); g.gain.exponentialRampToValueAtTime(S, now + A + D); g.gain.exponentialRampToValueAtTime(0.0001, now + A + D + (sustain?1.5:R));
    o1.connect(g); o2.connect(g);
    if (distortionOn) { g.connect(distortionRef.current); if (reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); }
    else { if (reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); }
    convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current);
    o1.start(now); o2.start(now); o1.stop(now + A + D + (sustain?1.5:R) + 0.05); o2.stop(now + A + D + (sustain?1.5:R) + 0.05);
  };

  const playDrum = (id) => {
    const ctx = audioCtxRef.current; if (!ctx) return; const now = ctx.currentTime;
    if (id === 'kick') { const o = ctx.createOscillator(); const g = ctx.createGain(); o.type='sine'; o.frequency.setValueAtTime(150, now); o.frequency.exponentialRampToValueAtTime(50, now+0.4); g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.0001, now+0.5); o.connect(g); if(distortionOn){g.connect(distortionRef.current); if(reverbOn)distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current);} else { if(reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current);} convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current); o.start(now); o.stop(now+0.5); }
    else { const buffer = ctx.createBuffer(1, ctx.sampleRate*0.2, ctx.sampleRate); const data = buffer.getChannelData(0); for(let i=0;i<data.length;i++) data[i] = (Math.random()*2-1)*Math.pow(1-i/data.length,1.5); const src = ctx.createBufferSource(); src.buffer = buffer; const f = ctx.createBiquadFilter(); if(id==='snare'){ f.type='highpass'; f.frequency.value=1200; } else { f.type='bandpass'; f.frequency.value=4000; } const g = ctx.createGain(); g.gain.setValueAtTime(1, now); g.gain.exponentialRampToValueAtTime(0.0001, now+0.25); src.connect(f); f.connect(g); if(distortionOn){ g.connect(distortionRef.current); if(reverbOn) distortionRef.current.connect(convolverRef.current); else distortionRef.current.connect(masterGainRef.current); } else { if(reverbOn) g.connect(convolverRef.current); else g.connect(masterGainRef.current); } convolverRef.current.disconnect(); convolverRef.current.connect(masterGainRef.current); src.start(now); src.stop(now+0.25); }
  };

  // Visualizer
  const drawVisualizer = () => {
    const canvas = canvasRef.current; const analyser = analyserRef.current; const ctx = audioCtxRef.current; if (!canvas || !analyser || !ctx) return;
    const c = canvas.getContext('2d'); const bufferLength = analyser.fftSize; const dataArray = new Uint8Array(bufferLength);
    const draw = () => {
      animRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);
      c.fillStyle = 'var(--vr-bg, #071029)'; c.fillRect(0, 0, canvas.width, canvas.height);
      c.lineWidth = 2; c.strokeStyle = 'var(--vr-accent, #6ea0ff)'; c.beginPath();
      const sliceWidth = canvas.width / bufferLength; let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; const y = v * canvas.height / 2;
        if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        x += sliceWidth;
      }
      c.lineTo(canvas.width, canvas.height/2); c.stroke();
    };
    draw();
  };

  const stopVisualizer = () => { if (animRef.current) cancelAnimationFrame(animRef.current); };

  // UI handlers
  const onPianoKey = (key) => { triggerVisual(key); playPiano(NOTE_FREQ[key]); };
  const onStringPluck = (freq, id) => { triggerVisual(id); pluckString(freq); };
  const onPadHit = (id) => { triggerVisual(id); playDrum(id); };

  // Styles and responsive classes
  const styles = {
    wrapper: { padding: 16, maxWidth: 1200, margin: '0 auto', color: 'var(--vr-text, #e6f0ff)', fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto" },
    top: { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    controls: { display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
    panel: { display: 'flex', gap: 16, marginTop: 14, alignItems: 'flex-start', flexWrap: 'wrap' },
    card: { background: 'var(--vr-panel, #071026)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.04)' }
  };

  return (
    <section id="virtual-room" className="vr-wrapper" style={styles.wrapper}>
      <style>{`
        :root {
          --vr-bg: #071029;
          --vr-panel: #071026;
          --vr-text: #e6f0ff;
          --vr-accent: #6ea0ff;
        }
        [data-theme="light"] {
          --vr-bg: #f8fafc;
          --vr-panel: #ffffff;
          --vr-text: #0b1220;
          --vr-accent: #0ea5e9;
        }
        .vr-top { display:flex; justify-content:space-between; gap:12px; align-items:center; flex-wrap:wrap; }
        .vr-controls { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
        .vr-panel { display:flex; gap:16px; margin-top:14px; align-items:flex-start; flex-wrap:wrap; }
        .vr-card { background: var(--vr-panel); padding:12px; border-radius:10px; border:1px solid rgba(0,0,0,0.06); }
        .vr-main { flex:1; min-width:300px; }
        .vr-canvas { width:100%; height:80px; border-radius:6px; background: var(--vr-bg); }
        .vr-pad { padding:18px; border-radius:8px; background:transparent; color:var(--vr-text); font-weight:700; border:1px solid rgba(255,255,255,0.04); }
        @media (max-width: 760px) {
          .vr-panel { flex-direction:column; }
          .vr-controls { width:100%; justify-content:flex-start; }
          .vr-card { width:100% !important; }
          .piano-key { flex: 1 0 auto; min-width: 36px; }
        }
      `}</style>

      <div className="vr-top" style={styles.top}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--vr-accent)' }}>🎛️ Virtual Studio</h2>
          <div style={{ color: 'var(--vr-text)', opacity: 0.9 }}>GarageBand-like instruments: piano, guitar, drums. Visualizer and effects included.</div>
        </div>

        <div className="vr-controls" style={styles.controls}>
          <select value={instrument} onChange={e => setInstrument(e.target.value)} style={{ padding: 8, borderRadius: 8, background: 'var(--vr-bg)', color: 'var(--vr-text)' }}>
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

          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={reverbOn} onChange={() => setReverbOn(r => !r)} />
            <span style={{ color: 'var(--vr-text)' }}>Reverb</span>
          </label>

          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={distortionOn} onChange={() => setDistortionOn(d => !d)} />
            <span style={{ color: 'var(--vr-text)' }}>Distortion</span>
          </label>

          <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            BPM
            <input type="number" value={bpm} onChange={e => setBpm(Number(e.target.value || 90))} style={{ width: 80, padding: 6, borderRadius: 6 }} />
          </label>

          <button onClick={() => setMetronomeOn(m => !m)} style={{ padding: '8px 12px', borderRadius: 8, background: metronomeOn ? 'rgba(110,160,255,0.18)' : 'transparent', color: 'var(--vr-text)', border: '1px solid rgba(255,255,255,0.04)' }}>{metronomeOn ? 'Metronome On' : 'Metronome'}</button>
        </div>
      </div>

      <div className="vr-panel" style={styles.panel}>
        <div className="vr-card" style={{ minWidth: 280 }}>
          <div style={{ fontWeight: 700, color: 'var(--vr-accent)' }}>ADSR</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginTop: 8 }}>
            <div><label style={{ color: 'var(--vr-accent)' }}>Attack</label><input type="range" min="0.001" max="1" step="0.001" value={adsr.attack} onChange={e => setAdsr(a => ({ ...a, attack: parseFloat(e.target.value) }))} style={{ width: '100%' }} /></div>
            <div><label style={{ color: 'var(--vr-accent)' }}>Decay</label><input type="range" min="0.001" max="2" step="0.01" value={adsr.decay} onChange={e => setAdsr(a => ({ ...a, decay: parseFloat(e.target.value) }))} style={{ width: '100%' }} /></div>
            <div><label style={{ color: 'var(--vr-accent)' }}>Sustain</label><input type="range" min="0" max="1" step="0.01" value={adsr.sustain} onChange={e => setAdsr(a => ({ ...a, sustain: parseFloat(e.target.value) }))} style={{ width: '100%' }} /></div>
            <div><label style={{ color: 'var(--vr-accent)' }}>Release</label><input type="range" min="0.01" max="3" step="0.01" value={adsr.release} onChange={e => setAdsr(a => ({ ...a, release: parseFloat(e.target.value) }))} style={{ width: '100%' }} /></div>
          </div>

          <div style={{ marginTop: 12 }}>
            <canvas ref={canvasRef} className="vr-canvas" width={400} height={80} />
          </div>
        </div>

        <div className="vr-card vr-main" style={{ minWidth: 520 }}>
          {instrument === 'Piano' ? (
            <div style={{ display: 'flex', gap: 4, userSelect: 'none', overflowX: 'auto' }}>
              {KEY_ORDER.map(k => {
                const isBlack = k.includes('#');
                return (
                  <button key={k} className={`piano-key`} onMouseDown={() => onPianoKey(k)} style={{
                    padding: isBlack ? '12px 8px' : '18px 12px',
                    background: active[k] ? (isBlack ? '#1f2b44' : 'var(--vr-accent)') : (isBlack ? '#111' : '#fff'),
                    color: isBlack ? '#fff' : '#071029', border: '1px solid #333', borderRadius: 6, minWidth: 36
                  }}>{k.replace(/[0-9]/, '')}</button>
                );
              })}
            </div>
          ) : instrument === 'Drums' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              {DRUM_PADS.map(p => (
                <button key={p.id} className="vr-pad" onClick={() => onPadHit(p.id)} style={{ padding: 20, borderRadius: 8 }}>{p.label}</button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {GUITAR_STRINGS.map(s => (
                <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--vr-accent)' }}>{s.name}</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[0,2,4,5,7,9,12].map(f => (
                      <button key={f} onClick={() => onStringPluck(s.freq * Math.pow(2, f/12), `${s.name}-${f}`)} style={{ padding: 8, borderRadius: 8, background: active[`${s.name}-${f}`] ? '#8ea6ff' : 'transparent', color: 'var(--vr-text)', border: '1px solid rgba(255,255,255,0.04)' }}>{f}</button>
                    ))}
                  </div>
                  <button onClick={() => onStringPluck(s.freq, `${s.name}-pluck`)} style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', color: 'var(--vr-text)' }}>Pluck</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ color: 'var(--vr-text)' }}>Visual instrumentation with improved envelopes & effects.</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume(); }} style={{ padding: '8px 12px', borderRadius: 8 }}>Enable Audio</button>
              <button onClick={() => { setInstrument('Acoustic Guitar'); setAdsr({ attack:0.01,decay:0.2,sustain:0.5,release:0.6 }); }} style={{ padding: '8px 12px', borderRadius: 8 }}>Reset</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
