import { Metadata } from 'next';
import Image from 'next/image';
import galleryData from '@/data/gallery.json';

export const metadata: Metadata = {
    title: 'Gallery | Cup eBong Cafe',
    description: 'View photos of our delicious pork platters, cozy cafe ambience, and our lovely pet visitors.',
};

export default function GalleryPage() {
    // Simple category filter implemented client-side if needed, but for now just showing all

    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Our Moments</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--soft-text)' }}>
                    A visual tour of the Cup eBong experience.
                </p>
                <div style={{
                    display: 'inline-block',
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    borderRadius: '50px',
                    fontWeight: '600',
                    border: '1px solid #A5D6A7'
                }}>
                    🐾 We are a Pet Friendly Cafe!
                </div>
            </div>

            <div style={{ columns: '3 300px', gap: '1rem' }}>
                {galleryData.map((item) => (
                    <div key={item.id} style={{ breakInside: 'avoid', marginBottom: '1rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                        <img
                            src={item.src}
                            alt={item.alt}
                            style={{ width: '100%', height: 'auto', display: 'block' }}
                        />
                        <div style={{ padding: '0.5rem', background: '#fff', fontSize: '0.9rem', color: '#555', textAlign: 'center' }}>
                            {item.alt}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
