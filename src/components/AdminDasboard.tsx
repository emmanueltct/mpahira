import React from 'react'
import { SellerCard } from './SellerCard'
import { useAdminStats } from '@/hooks/useSellerStats';
import { FaHeart, FaCartPlus, FaUsers, FaDollarSign, FaBox } from 'react-icons/fa';

const AdminDashboard=()=> {

const stats = useAdminStats();
const cards = [
{ ...stats.users, icon: <FaBox size={24} /> },
{ ...stats.products, icon: <FaBox size={24} /> },
{ ...stats.wishlist, icon: <FaHeart size={24} /> },
{ ...stats.cart, icon: <FaCartPlus size={24} /> },
{ ...stats.customers, icon: <FaUsers size={24} /> },
{ ...stats.revenue, icon: <FaDollarSign size={24} /> },
{ ...stats.orders, icon: <FaBox size={24} /> },
{ ...stats.customers, icon: <FaUsers size={24} /> },
{ ...stats.revenue, icon: <FaDollarSign size={24} /> },
{ ...stats.orders, icon: <FaBox size={24} /> },
];
  return (
   <main className=" p-6 w-full">
           <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
             {cards.map((card, index) => (
               <SellerCard key={index} {...card} />
             ))}
           </div>
        </main>
  )
}

export default AdminDashboard