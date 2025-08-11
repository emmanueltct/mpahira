'use client';

import { useState } from 'react';
import { Home, ShoppingCart, Users, Package, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const Sidebar = () => {
  const [productOpen, setProductOpen] = useState(false);
   

  return (
    <aside className="w-64 bg-white shadow-lg h-screen fixed top-0 left-0 p-6 flex flex-col">
      <h2 className="text-2xl font-extrabold mb-8 text-blue-700 select-none">Seller Panel</h2>
      <nav className="flex flex-col gap-3 text-gray-700 text-lg font-medium">
        <Link
          href="/Seller/Dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition"
        >
          <Home size={22} /> Dashboard
        </Link>

        <div
          onMouseEnter={() => setProductOpen(true)}
          onMouseLeave={() => setProductOpen(false)}
          className="relative group"
        >
          <div
            className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition select-none"
          >
            <span className="flex items-center gap-3">
              <Package size={22} /> Product
            </span>
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${productOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>

          {/* Dropdown */}
           <div
            className={`absolute left-0  pb-10  top-8 ml-1 mt-2 bg-white border rounded-lg shadow-md p-2 space-y-2 text-sm w-48 transition-all duration-200 ${
              productOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <Link href="/Seller/Products" className="block hover:text-blue-600 hover:bg-blue-50 p-2">
              All Products
            </Link>
            <Link href="/Seller/Products/Add" className="block hover:text-blue-600 hover:bg-blue-50 p-2">
              Add Product
            </Link>
            <Link href="/Seller/Products/Categories" className="block hover:text-blue-600 hover:bg-blue-50 p-2">
              Categories
            </Link>
          </div>
        </div>

        <Link
          href="/Seller/Orders"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition"
        >
          <ShoppingCart size={22} /> Orders
        </Link>

        <Link
          href="/Seller/Customers"
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-100 hover:text-blue-700 transition"
        >
          <Users size={22} /> Customers
        </Link>
      </nav>
    </aside>
  );
};
