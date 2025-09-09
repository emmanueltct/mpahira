import React from "react";
import { SellerCard } from "@/components/SellerCard";

import { useSellerStats } from "@/hooks/useSellerStats";
import { RecentActivity } from "@/components/RecentActivity";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { FaHeart, FaCartPlus, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';
import Layout from "@/components/Layout";

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

    <Layout>
    <div className="flex w-full flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <SellerCard key={index} {...card} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <RecentActivity activities={recentActivity} />
        </div>
    </div>
    </Layout>
  );
};

export default SellerDashboardPage;
