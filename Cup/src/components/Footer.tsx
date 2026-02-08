import { Facebook, Instagram } from 'lucide-react';
import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h4 className={styles.heading}>Cup eBong Cafe</h4>
                    <p className={styles.text}>Where Great Food Meets Furry Friends.</p>
                    <p className={styles.text}>Experience the first truly pet-friendly cafe in Kolkata.</p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>Visit Us</h4>
                    <p className={styles.text}>58 E, Ground Floor</p>
                    <p className={styles.text}>Beside Byloom, Hindustan Park</p>
                    <p className={styles.text}>Kolkata, West Bengal 700029</p>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>Contact</h4>
                    <p className={styles.text}>+91 98743 66645</p>
                    <p className={styles.text}>hello@cupebong.com</p>
                    <div className={styles.social}>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.link} aria-label="Instagram">
                            <Instagram size={24} />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.link} aria-label="Facebook">
                            <Facebook size={24} />
                        </a>
                    </div>
                </div>

                <div className={styles.column}>
                    <h4 className={styles.heading}>Hours</h4>
                    <p className={styles.text}>Monday - Sunday</p>
                    <p className={styles.text}>11:00 AM - 10:30 PM</p>
                </div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <p style={{ fontSize: '0.8rem', color: '#BCAAA4' }}>&copy; {new Date().getFullYear()} Cup eBong Cafe. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
