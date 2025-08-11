import React from "react";
import { SellerCard } from "@/components/SellerCard";
import { Sidebar } from "@/components/DashboardSidebar";
import { useSellerStats } from "@/hooks/useSellerStats";
import { RecentActivity } from "@/components/RecentActivity";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { FaHeart, FaCartPlus, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';

const SellerDashboardPage = () => {
  const stats = useSellerStats();
  const recentActivity = useRecentActivity();

  const cards = [
    { ...stats.products, icon: <FaBox size={24} /> },
    { ...stats.wishlist, icon: <FaHeart size={24} /> },
    { ...stats.cart, icon: <FaCartPlus size={24} /> },
    { ...stats.customers, icon: <FaUsers size={24} /> },
    { ...stats.revenue, icon: <FaDollarSign size={24} /> },
    { ...stats.orders, icon: <FaBox size={24} /> },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <SellerCard key={index} {...card} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentActivity activities={recentActivity} />
        </div>
      </main>
    </div>
  );
};

export default SellerDashboardPage;
