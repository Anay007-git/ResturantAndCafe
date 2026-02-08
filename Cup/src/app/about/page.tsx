import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'About Us | Cup eBong Cafe',
    description: 'The story behind Kolkata\'s favorite pet-friendly cafe. Our philosophy, our team, and our love for pets.',
};

export default function AboutPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Our Story</h1>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--soft-text)' }}>
                    Born from a love for good food and great company (especially the four-legged kind).
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center', marginBottom: '5rem' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--coffee-brown)' }}>Where It All Began</h2>
                    <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
                        Cup eBong Cafe started as a small dream to create a space in Kolkata where pet owners wouldn't have to leave their best friends at home.
                        Nestled in the cultural heart of Hindustan Park, Gariahat, we wanted to blend the nostalgia of old Calcutta cafes with a modern, inclusive vibe.
                    </p>
                    <p style={{ fontSize: '1.1rem' }}>
                        Our name, "Cup eBong", is a play on words—celebrating the "cup" of joy and the "bong" (Bengali) spirit of warmth and hospitality.
                    </p>
                </div>
                <div style={{ height: '400px', backgroundColor: '#e0e0e0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <img src="/images/our-story.png" alt="Cup eBong Founders and Pets" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '4rem 2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--coffee-brown)' }}>Our Philosophy</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--forest-green)' }}>Pets First</h3>
                        <p>We aren't just pet-friendly; we are pet-passionate. From special treats to water bowls, your fur babies are VIPs here.</p>
                    </div>
                    <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Premium Quality</h3>
                        <p>We source the finest pork cuts, freshest coffee beans, and local ingredients to ensure every bite is memorable.</p>
                    </div>
                    <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--forest-green)' }}>Community</h3>
                        <p>A place for artists, students, families, and friends to gather, work, or simply unwind in a cozy setting.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
