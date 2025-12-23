import { Metadata } from 'next';
import ReviewFeed from '@/components/reviews/ReviewFeed';

export const metadata: Metadata = {
  title: 'Customer Stories | CMUK Reviews',
  description: 'See what our community is saying about our custom prints and apparel.',
};

export default function AllReviewsPage() {
  return (
    <main className="bg-white min-h-screen">
      <ReviewFeed />
    </main>
  );
}