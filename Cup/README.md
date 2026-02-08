# Cup eBong Cafe Website

A modern, responsive, and SEO-optimized website for Cup eBong Cafe, Kolkata. Built with Next.js (App Router), TypeScript, and CSS Modules.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Managing Content (Admin Features)

You can update the website content by editing the JSON files in the `src/data` directory. No coding knowledge is required for these changes.

- **Menu**: Edit `src/data/menu.json` to add/remove dishes, change prices, or update descriptions.
- **Gallery**: Add new image paths to `src/data/gallery.json`.
- **Reviews**: Add customer testimonials to `src/data/reviews.json`.
- **Events**: manage upcoming events in `src/data/events.json`.

## Project Structure

- `src/app`: Contains the pages (`page.tsx`) and layout.
- `src/components`: Reusable UI components like `Navbar`, `Footer`.
- `src/styles`: (Not used, styles are collocated with components or in `globals.css`).
- `src/data`: JSON data files for dynamic content.

## Technologies Used

- **Next.js 14+**: React framework for production.
- **TypeScript**: For type safety.
- **CSS Modules**: For scoped, maintainable styling.
- **Lucide React**: For icons.

## Deployment

This project is ready to be deployed on Vercel or Netlify.
Simply push to GitHub and connect the repository.
