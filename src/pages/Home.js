import React from 'react';
import SEO from '../components/SEO';

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
        <header style={{ padding: '6rem 1rem 3rem', textAlign: 'center', background: 'linear-gradient(180deg, #faf7f2 0%, transparent 60%)' }}>
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
