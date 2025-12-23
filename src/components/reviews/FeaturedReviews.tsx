export function FeaturedReviews({ reviews, products }: any) {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-12">
          The <span className="text-brand-primary">Verified</span> Archive
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 3).map((review: any) => {
            const product = products.find((p: any) => p.id === review.productId);
            return (
              <div key={review.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-brand-primary text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <h3 className="font-black uppercase text-sm mb-2">{review.title}</h3>
                  <p className="text-slate-500 text-sm italic line-clamp-3">"{review.comment}"</p>
                </div>
                
                <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full overflow-hidden">
                    <img src={product?.image} className="w-full h-full object-cover grayscale" />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span className="text-brand-dark block">{review.username}</span>
                    <span>For: {product?.name}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}