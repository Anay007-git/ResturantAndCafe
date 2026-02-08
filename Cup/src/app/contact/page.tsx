import { Metadata } from 'next';
import { MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Contact Us | Cup eBong Cafe',
    description: 'Get in touch for table reservations, pet parties, or feedback. Located at Hindustan Park, Gariahat, Kolkata.',
};

export default function ContactPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Find Us</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--soft-text)' }}>
                    Whether for a quick coffee or a long chat, we're always happy to see you.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Address</h2>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        58 E, Ground Floor, beside Byloom,<br />
                        Hindustan Park, Gariahat,<br />
                        Kolkata, West Bengal 700029
                    </p>
                    <a href="https://maps.google.com/?q=Cup+eBong+Cafe" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--forest-green)', fontWeight: 'bold' }}>
                        Get Directions →
                    </a>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Call Us</h2>
                    <p style={{ fontSize: '1.1rem' }}>
                        <a href="tel:+919874366645" style={{ textDecoration: 'underline' }}>+91 98743 66645</a>
                    </p>
                    <p style={{ marginTop: '0.5rem' }}>
                        <a
                            href="https://wa.me/919874366645?text=Hello%20Cup%20eBong,%20I%20would%20like%20to%20reserve%20a%20table"
                            className="btn btn-secondary"
                            style={{ padding: '0.5rem 1rem', marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            <MessageCircle size={20} />
                            Chat on WhatsApp
                        </a>
                    </p>

                    <h2 style={{ fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Working Hours</h2>
                    <p style={{ fontSize: '1.1rem' }}>
                        Open Daily: 11:00 AM - 10:30 PM
                    </p>
                </div>

                <div style={{ minHeight: '400px', backgroundColor: '#e0e0e0', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    {/* Embedding Google Maps Iframe */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3685.242738986289!2d88.36389131534066!3d22.51862798520864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276d337f769cd%3A0x6969696969696969!2sHindustan%20Park%2C%20Gariahat%2C%20Kolkata%2C%20West%20Bengal%20700029!5e0!3m2!1sen!2sin!4v1678123456789!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Cup eBong Cafe Map"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
