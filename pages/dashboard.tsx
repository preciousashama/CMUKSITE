// If using Next.js 13+ App Router, this should be in /app/dashboard/page.tsx
// We use a Server Component for the initial hit for better SEO and speed.

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // You'll need to point this to her auth config
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // RECOVERY: In a real app, we fetch stats from Prisma here
  // const orderCount = await prisma.order.count({ where: { userId: session.user.id } });

  const stats = [
    { label: 'Active Orders', value: '0', icon: '📦', href: '/account?tab=orders' },
    { label: 'Saved Designs', value: '0', icon: '🎨', href: '/account?tab=designs' },
    { label: 'Store Credit', value: '£0.00', icon: '💳', href: '#' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500">
          Logged in as <span className="font-bold text-slate-900">{session.user?.email}</span>
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => (
          <Link 
            href={stat.href} 
            key={stat.label}
            className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-4">{stat.icon}</div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">
              {stat.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity placeholder */}
        <section className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
          <h2 className="text-xl font-bold mb-6 flex justify-between items-center">
            Recent Orders
            <Link href="/account?tab=orders" className="text-sm text-blue-600 hover:underline font-normal italic">
              View all
            </Link>
          </h2>
          <div className="text-center py-10">
            <p className="text-slate-400 text-sm">No recent orders to show.</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <Link href="/products" className="flex items-center justify-between p-5 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition-all">
            <span className="font-bold">Browse New Products</span>
            <span>→</span>
          </Link>
          <Link href="/productdetail?id=1" className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            <span className="font-bold text-slate-700">Customize a New Shirt</span>
            <span>🎨</span>
          </Link>
          <Link href="/support" className="flex items-center justify-between p-5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all">
            <span className="font-bold text-slate-700">Contact Support</span>
            <span>💬</span>
          </Link>
        </section>
      </div>
    </div>
  );
}