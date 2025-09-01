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
        <header style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#667eea' }}>Presto Guitar Academy</h1>
          <p style={{ maxWidth: 800, margin: '1rem auto', color: '#475569' }}>Professional guitar lessons, personalized coaching, and a thriving community. Learn acoustic, electric, bass and more.</p>
          <a href="#demo-booking" style={{ display: 'inline-block', marginTop: 16, padding: '12px 20px', background: '#667eea', color: '#fff', borderRadius: 8 }}>Book Free Demo</a>
        </header>

        <section id="features" style={{ padding: '2rem 1rem', maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ color: '#0f172a' }}>Why Presto?</h2>
          <ul>
            <li>Experienced instructors</li>
            <li>Structured curriculum for all ages</li>
            <li>Interactive community and practice resources</li>
          </ul>
        </section>
      </main>
    </>
  );
};

export default Home;
