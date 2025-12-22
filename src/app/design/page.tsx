import { Metadata } from 'next';
import DesignPipeline from '@/components/design/DesignPipeline';

export const metadata: Metadata = {
  title: 'Design Studio | CMUK Custom Apparel',
  description: 'Create your custom 3D apparel drafts in our interactive studio.',
};

export default function DesignPage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <DesignPipeline />
    </div>
  );
}