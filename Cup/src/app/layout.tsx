import type { Metadata } from 'next';
import { Outfit, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cup eBong Cafe | Pet Friendly Cafe in Kolkata',
  description: 'Where Great Food Meets Furry Friends. Enjoy premium pork dishes, coffee, and a cozy ambience with your pets at Hindustan Park, Kolkata.',
  keywords: ['Pet Friendly Cafe Kolkata', 'Best PORK Cafe Kolkata', 'Cup eBong Cafe', 'Cafe in Gariahat'],
  openGraph: {
    title: 'Cup eBong Cafe - Kolkata',
    description: 'The ultimate pet-friendly cafe experience in Kolkata.',
    url: 'https://cupebongcafe.com', // Placeholder
    siteName: 'Cup eBong Cafe',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning={true}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CafeOrCoffeeShop",
              "name": "Cup eBong Cafe",
              "image": "https://cupebongcafe.com/images/logo.png", // Placeholder
              "url": "https://cupebongcafe.com",
              "telephone": "+919874366645",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "58 E, Ground Floor, beside Byloom, Hindustan Park, Gariahat",
                "addressLocality": "Kolkata",
                "addressRegion": "West Bengal",
                "postalCode": "700029",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 22.51862798520864,
                "longitude": 88.36389131534066
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "11:00",
                "closes": "22:30"
              },
              "menu": "https://cupebongcafe.com/menu",
              "servesCuisine": "Cafe, Continental, Pork",
              "priceRange": "₹₹",
              "acceptsReservations": "True"
            })
          }}
        />
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
