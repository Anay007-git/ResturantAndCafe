import { Metadata } from 'next';
import menuData from '@/data/menu.json';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Our Menu | Cup eBong Cafe',
    description: 'Explore our delicious range of Pork Platters, English Breakfast, Coffee, and more. Pet friendly dining in Kolkata.',
};

export default function MenuPage() {
    const categories = menuData.categories as Record<string, any[]>;

    return (
        <div>
            <div className={styles.menuHeader}>
                <div className="container">
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Our Menu</h1>
                    <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.2rem', opacity: 0.9 }}>
                        From hearty pork platters to delicate desserts, every dish is crafted with love.
                    </p>
                </div>
            </div>

            <div className="container section">
                {Object.entries(categories).map(([category, items]) => (
                    <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className={styles.categoryGroup}>
                        <h2 className={styles.categoryTitle}>{category}</h2>
                        <div className={styles.menuGrid}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.menuItem}>
                                    <div style={{ height: '200px', backgroundColor: '#eee', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', overflow: 'hidden' }}>
                                        {/* Using standard img tag for now as Next/Image requires width/height or fill */}
                                        <img
                                            src={item.image || "https://placehold.co/400x300?text=Cup+eBong"}
                                            alt={item.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div>
                                        <h3 className={styles.itemName}>{item.name}</h3>
                                        <p className={styles.itemDesc}>
                                            {item.description || "A delicious classic prepared fresh for you."}
                                        </p>
                                    </div>
                                    <div className={styles.itemFooter}>
                                        <span className={styles.price}>₹{item.price}</span>
                                        {/* Placeholder for 'Add to Order' button later */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                    <h3>Dietary Requirements?</h3>
                    <p>Please let our staff know if you or your pet have any allergies.</p>
                </div>
            </div>
        </div>
    );
}
