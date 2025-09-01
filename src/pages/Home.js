import React from 'react';
import SEO from '../components/SEO';
import SmokeCanvas from '../components/SmokeCanvas';

const Home = () => {
  return (
    <>
      <SEO
        title="Presto Guitar Academy — Learn Guitar, Fast & Fun"
        description="Presto Guitar Academy offers professional guitar lessons for all ages and levels. Book a free demo and start learning today."
        url="https://www.prestoguitaracademy.com/"
        image="/images/og-image.jpg"
      />

      <main>
        <header style={{
          padding: '6rem 1rem 3rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundImage: `linear-gradient(180deg, rgba(247,246,244,0.95), rgba(247,246,244,0.5)), url('/images/bg-music.svg'), url('/images/bg-guitar.svg')`,
          backgroundRepeat: 'repeat-x, no-repeat, no-repeat',
          backgroundPosition: 'center 30px, right 20px',
          backgroundSize: 'auto, 60%, 45%'
        }}>
          {/* Smoke overlay, animated guitar glow and canvas-based particles */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', left: '-10%', top: '5%', width: '60%', height: '60%', background: 'radial-gradient(closest-side, rgba(198,156,74,0.08), transparent 40%)', transform: 'rotate(-12deg)', filter: 'blur(18px)', animation: 'sway 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', right: '2%', bottom: '2%', width: '30%', height: '40%', background: 'radial-gradient(closest-side, rgba(110,160,255,0.06), transparent 40%)', filter: 'blur(28px)', animation: 'float 9s ease-in-out infinite' }} />
            <svg style={{ position: 'absolute', left: '20%', bottom: '10%', width: '60%', height: '60%', opacity: 0.06 }} viewBox='0 0 800 400' xmlns='http://www.w3.org/2000/svg'>
              <g fill='none' stroke='rgba(31,42,68,0.06)' strokeWidth='2'>
                <path d='M140 260c20-30 60-40 90-30s50 30 80 30 60-10 90-30 80-20 120 0 60 50 40 80-80 40-120 40-80-10-120-10-80 10-120-10-80-60-70-90z' />
              </g>
            </svg>
            <SmokeCanvas intensity={0.85} color={'rgba(198,156,74,0.12)'} speed={1} />
          </div>
          <style>{`@keyframes sway { 0%{transform:rotate(-12deg) translateX(0);}50%{transform:rotate(-10deg) translateX(6%);}100%{transform:rotate(-12deg) translateX(0);} } @keyframes float {0%{transform:translateY(0);}50%{transform:translateY(-6%);}100%{transform:translateY(0);} }`}</style>
          
          <h1 style={{ fontSize: '3rem', color: '#1f2a44', fontFamily: "'Playfair Display', Georgia, serif", marginBottom: 8 }}>Presto Guitar Academy</h1>
          <p style={{ maxWidth: 900, margin: '0.6rem auto', color: '#6b7280', fontSize: '1.05rem' }}>Master guitar with expert instructors, structured courses, and an active community. Acoustic, electric, bass — lessons for all levels.</p>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <a href="#demo-booking" style={{ display: 'inline-block', padding: '12px 22px', background: '#c69c4a', color: '#fff', borderRadius: 10, fontWeight: 700, boxShadow: '0 12px 30px rgba(198,156,74,0.12)', textDecoration: 'none' }}>Book Free Demo</a>
            <a href="#community" style={{ display: 'inline-block', padding: '12px 22px', background: 'transparent', color: '#1f2a44', borderRadius: 10, fontWeight: 700, border: '1px solid rgba(31,42,68,0.06)', textDecoration: 'none' }}>Join Community</a>
          </div>
        </header>

        <section id="features" style={{ padding: '3rem 1rem', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ color: '#1f2a44', fontFamily: "'Playfair Display', Georgia, serif" }}>Why Presto?</h2>
          <div style={{ display: 'flex', gap: 16, marginTop: 18, flexWrap: 'wrap' }}>
            <div style={{ background: '#fff', padding: 18, borderRadius: 12, flex: '1 1 260px', boxShadow: '0 10px 30px rgba(15,20,30,0.04)', border: '1px solid rgba(15,20,30,0.02)' }}>
              <h3 style={{ marginTop: 0, color: '#1f2a44', fontFamily: "'Playfair Display', Georgia, serif" }}>Experienced Instructors</h3>
              <p style={{ color: '#6b7280' }}>Learn from pros with years of teaching and performance experience.</p>
            </div>
            <div style={{ background: '#fff', padding: 18, borderRadius: 12, flex: '1 1 260px', boxShadow: '0 10px 30px rgba(15,20,30,0.04)', border: '1px solid rgba(15,20,30,0.02)' }}>
              <h3 style={{ marginTop: 0, color: '#1f2a44', fontFamily: "'Playfair Display', Georgia, serif" }}>Structured Curriculum</h3>
              <p style={{ color: '#6b7280' }}>Clear learning paths for beginners to advanced players.</p>
            </div>
            <div style={{ background: '#fff', padding: 18, borderRadius: 12, flex: '1 1 260px', boxShadow: '0 10px 30px rgba(15,20,30,0.04)', border: '1px solid rgba(15,20,30,0.02)' }}>
              <h3 style={{ marginTop: 0, color: '#1f2a44', fontFamily: "'Playfair Display', Georgia, serif" }}>Community & Resources</h3>
              <p style={{ color: '#6b7280' }}>Practice tools, community support, and weekly workshops.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
