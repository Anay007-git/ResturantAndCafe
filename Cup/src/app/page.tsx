import Link from 'next/link';
import { ChefHat, Globe, Clock, Sparkles } from 'lucide-react';
import styles from './page.module.css';
import menuData from '@/data/menu.json';
import reviewsData from '@/data/reviews.json';

export default function Home() {
  const featuredDishes = menuData.featured.slice(0, 4); // Show 4 for grid

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>We Serve The Taste<br />You Love 😍</h1>
          <p className={styles.heroDescription}>
            Experience Kolkata's first pet-friendly cafe where delicious food meets warm hospitality. Bring your furry friends along!
          </p>
          <div className={styles.heroButtons}>
            <Link href="/menu" className={styles.btnPrimary}>
              Explore Food
            </Link>
            <Link href="/search" className={styles.btnOutline}>
              Search
            </Link>
          </div>
        </div>

        {/* Right Side Image with floating elements */}
        <div className={styles.heroImageContainer}>
          <img
            src="/images/indian-cafe-food.png"
            alt="Delicious Kolkata Cafe Spread"
            className={styles.heroImage}
          />
          {/* Floating 'pills' simulating the reference image */}
          <div className={styles.floatingIcon} style={{ top: '10%', right: '0%' }}>🥗 Snacks</div>
          <div className={styles.floatingIcon} style={{ bottom: '20%', left: '-5%' }}>🍮 Dessert</div>
          <div className={styles.floatingIcon} style={{ bottom: '10%', right: '10%' }}>☕ Coffee</div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className={styles.popularSection}>
        <div className={styles.popularHeader}>
          <h2 className={styles.sectionTitle}>Popular Dishes</h2>
          <div className={styles.navButtons}>
            <button className={styles.navBtn}>←</button>
            <button className={styles.navBtn}>→</button>
          </div>
        </div>

        <div className={styles.grid}>
          {featuredDishes.map((dish: any) => (
            <div key={dish.id} className={styles.dishCard}>
              <div className={styles.dishImageWrapper}>
                <img
                  src={dish.image}
                  alt={dish.name}
                  className={styles.dishImage}
                />
              </div>
              <h3 className={styles.dishTitle}>{dish.name}</h3>
              <div className={styles.rating}>⭐⭐⭐⭐⭐</div>
              <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '1rem', height: '40px', overflow: 'hidden' }}>{dish.description}</p>
              <div className={styles.cardFooter}>
                <span className={styles.price}>₹{dish.price}</span>
                <button className={styles.addToCartBtn}>Add To Cart</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pet Friendly & Service Section */}
      <section className={styles.serviceSection}>
        <div style={{ position: 'relative' }}>
          {/* Pet Friendly Image */}
          <div style={{ borderRadius: '50% 50% 0 0', overflow: 'hidden', height: '400px', width: '100%', backgroundColor: '#eee' }}>
            <img src="/images/pet-friendly-indian.png" alt="Pet Friendly Cafe" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className={styles.serviceContent}>
          <h2>More Than Just Coffee <br /> We Love Pets! 🐾</h2>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
            Cup eBong is proud to be a pet-friendly haven in Kolkata. Treat yourself to our signature pork platters while your furry companions enjoy our designated pet zone and special treats.
          </p>

          <div className={styles.serviceList}>
            <div className={styles.serviceItem}><Globe size={20} color="#FDC55E" /> Online Order</div>
            <div className={styles.serviceItem}><Clock size={20} color="#FDC55E" /> Pet Menu</div>
            <div className={styles.serviceItem}><ChefHat size={20} color="#FDC55E" /> Super Chefs</div>
            <div className={styles.serviceItem}><Sparkles size={20} color="#FDC55E" /> Hygiene First</div>
          </div>

          <Link href="/policy" className={styles.btnPrimary} style={{ marginTop: '2rem', display: 'inline-block' }}>View Pet Policy</Link>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="section" style={{ paddingBottom: '4rem' }}>
        <h2 className={styles.sectionTitle} style={{ textAlign: 'center', marginBottom: '3rem' }}>What Our Customers Say</h2>
        <div className={styles.grid}>
          {reviewsData.map((review: any) => (
            <div key={review.id} className={styles.dishCard} style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img src={review.avatar} alt={review.name} style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '1rem' }} />
                <div>
                  <h4 style={{ margin: 0 }}>{review.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#888' }}>via {review.source}</span>
                </div>
              </div>
              <div className={styles.rating} style={{ marginBottom: '0.5rem' }}>{'⭐'.repeat(Math.round(review.rating))}</div>
              <p style={{ color: '#555', fontStyle: 'italic' }}>"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
