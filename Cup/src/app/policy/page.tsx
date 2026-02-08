import { Metadata } from 'next';
import { CheckCircle, AlertTriangle, Droplet } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Pet Policy | Cup eBong Cafe',
    description: 'Our rules to ensure a safe and enjoyable experience for all pets and humans at Cup eBong Cafe.',
};

export default function PolicyPage() {
    return (
        <div className="container section">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--coffee-brown)' }}>Pet Policy</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', color: 'var(--soft-text)' }}>
                    To make sure everyone has a "paw-some" time, please follow these simple rules.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div style={{ border: '2px solid var(--forest-green)', padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fff' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--forest-green)' }}>
                        <CheckCircle color="var(--forest-green)" /> Allowed
                    </h2>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.8 }}>
                        <li>Letting pets sit on designated furniture (please check with staff)</li>
                        <li>Bringing your pet's favorite toy</li>
                        <li>Asking for fresh water bowls (always free!)</li>
                        <li>Making new furry friends (with owner's permission)</li>
                    </ul>
                </div>

                <div style={{ border: '2px solid #D32F2F', padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fff' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: '#D32F2F' }}>
                        <AlertTriangle color="#D32F2F" /> Not Allowed
                    </h2>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.8 }}>
                        <li>Aggressive behavior towards other pets or humans</li>
                        <li>Excessive barking that disturbs other guests</li>
                        <li>Feeding human food to pets without checking ingredients</li>
                        <li>Leaving pets unattended at the table</li>
                    </ul>
                </div>

                <div style={{ border: '2px solid var(--coffee-brown)', padding: '2rem', borderRadius: 'var(--radius-lg)', backgroundColor: '#fff' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--coffee-brown)' }}>
                        <Droplet color="var(--coffee-brown)" /> Hygiene & Care
                    </h2>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, lineHeight: 1.8 }}>
                        <li>Please ensure your pet is up to date on vaccinations.</li>
                        <li>If an "accident" happens, please inform our staff immediately for cleanup.</li>
                        <li>We recommend keeping pets on a leash if the cafe is crowded.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
