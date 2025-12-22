import Image from 'next/image';
import Link from 'next/link';

const CATEGORIES = [
  { name: 'Apparel', img: '/assets/Thumnails/Apparel Thumbnail.png', href: '/apparel' },
  { name: 'Stickers', img: '/assets/Thumnails/Stickers Thumbnail.png', href: '/products?category=stickers' },
  { name: 'Party', img: '/assets/Thumnails/Party Thumbnail.png', href: '/party-occasions' },
];

export default function CategoryShowcase() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CATEGORIES.map((cat) => (
          <Link key={cat.name} href={cat.href} className="group relative aspect-[4/5] rounded-4xl overflow-hidden bg-brand-light">
            <Image 
              src={cat.img} 
              alt={cat.name} 
              fill 
              className="object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <h3 className="text-white text-3xl font-black italic uppercase tracking-tighter">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}