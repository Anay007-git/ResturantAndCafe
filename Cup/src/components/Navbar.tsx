"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag } from 'lucide-react';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = [
    { href: '/about', label: 'About Us' },
    { href: '/menu', label: 'Menu' },
    { href: '/gallery', label: 'Gallery' }, // Replaced 'Reviews' with Gallery for now
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo Section */}
        <Link href="/" className={styles.logo}>
          <span>Cup eBong</span> {/* Simplified name */}
        </Link>

        {/* Desktop Navigation */}
        <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.link}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {/* Mobile Buttons if needed inside menu */}
        </nav>

        {/* Action Buttons (Reserve, Cart) */}
        <div className={styles.actions} style={{ display: isOpen ? 'none' : 'flex' }}>
          <button className={styles.cartBtn} aria-label="Cart">
            <ShoppingBag size={20} color="#333" />
          </button>
          <Link href="/contact" className={styles.reserveBtn}>
            Reserve Table
          </Link>

          {/* Mobile Menu Toggle */}
          <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu" style={{ display: 'none' }}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Toggle Logic Needs Refinement for layout matching */}
        <button className={styles.mobileMenuBtn} onClick={toggleMenu} aria-label="Toggle menu" style={{ display: 'block', marginLeft: '1rem' }}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
