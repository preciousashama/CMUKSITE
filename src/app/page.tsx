import { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import BubbleReviews from '@/components/home/BubbleReviews';
import NewsletterPopup from '@/components/home/NewsletterPopup';

export const metadata: Metadata = {
  title: 'CMUK | Premium Custom Prints & Apparel',
  description: 'High-quality custom apparel, stickers, and party supplies.',
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white">
      <Hero />
      <CategoryShowcase />
      <BubbleReviews />
      <NewsletterPopup />
    </main>
  );
}