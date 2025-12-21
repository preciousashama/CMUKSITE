// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
// import { prisma } from "@/lib/prisma"; // Recommended DB setup

// 1. Separate Data Fetching logic (simulate Prisma calls)
async function getDashboardData(userId: string) {
  // In production, use Promise.all for faster parallel fetching
  const [orderCount, designCount] = await Promise.all([
    Promise.resolve(2), // prisma.order.count({ where: { userId } })
    Promise.resolve(5), // prisma.design.count({ where: { userId } })
  ]);

  return {
    orderCount,
    designCount,
    credit: "£0.00"
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    // Better UX: Redirect back after login
    redirect("/login?callbackUrl=/dashboard");
  }

  const data = await getDashboardData(session.user.id);

  const stats = [
    { label: 'Active Orders', value: data.orderCount, icon: '📦', href: '/account/orders' },
    { label: 'Saved Designs', value: data.designCount, icon: '🎨', href: '/account/designs' },
    { label: 'Store Credit', value: data.credit, icon: '💳', href: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-in fade-in duration-700">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Account: <span className="font-bold text-slate-900">{session.user?.email}</span>
          </p>
        </div>
        <div className="hidden sm:block">
           <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-green-100 text-green-700 rounded-full">
             Verified Account
           </span>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link 
            href={stat.href} 
            key={stat.label}
            className="group relative p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="absolute top-6 right-8 text-3xl opacity-20 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0">
              {stat.icon}
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-600 transition-colors">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Recent Activity (Table Style) */}
        <section className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest">
              View All
            </Link>
          </div>
          
          {data.orderCount === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
               <span className="text-4xl block mb-4">📦</span>
               <p className="text-slate-500 font-medium">No orders found.</p>
               <Link href="/products" className="text-xs font-black text-blue-600 uppercase underline mt-2 block">Start Shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {/* This would be a mapped component for actual orders */}
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl" />
                  <div>
                    <p className="font-bold text-sm">Order #8821</p>
                    <p className="text-xs text-slate-400">Processing • 2 items</p>
                  </div>
                </div>
                <p className="font-black text-sm">£45.00</p>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions (Sidebar Style) */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black uppercase italic tracking-tighter mb-6">Quick Actions</h2>
          <Link href="/products" className="group flex items-center justify-between p-6 bg-slate-900 text-white rounded-3xl hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
            <div>
               <p className="font-black uppercase text-xs tracking-widest">Storefront</p>
               <p className="text-white/60 text-[10px]">Browse latest apparel</p>
            </div>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          
          <Link href="/design-pipeline" className="group flex items-center justify-between p-6 border-2 border-slate-100 rounded-3xl hover:border-blue-600 transition-all">
            <div>
               <p className="font-black uppercase text-xs tracking-widest text-slate-900">3D Studio</p>
               <p className="text-slate-400 text-[10px]">Customize new design</p>
            </div>
            <span className="grayscale group-hover:grayscale-0 transition-all">🎨</span>
          </Link>

          <div className="p-8 bg-blue-50 rounded-[2rem] border border-blue-100 mt-6">
             <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2">Need Help?</p>
             <p className="text-sm text-blue-600/80 mb-4">Our design team is available Mon-Fri for strategy calls.</p>
             <Link href="/support" className="text-xs font-black text-blue-700 uppercase underline">
                Book a consultation
             </Link>
          </div>
        </section>
      </div>
    </div>
  );
}