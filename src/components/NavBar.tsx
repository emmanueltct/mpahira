'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { useCart } from '@/hooks/userCarts';
import {
  FaHeart,
  FaShoppingCart,
  FaBell,
  FaChevronDown,
} from 'react-icons/fa';
import SidebarPanel from './SidebarPanel';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [now, setNow] = useState<number>();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarType, setSidebarType] = useState<"carts" | "wishlist" | "notifications" | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartQuery } = useCart();

  const isBuyer = user?.role === 'Buyer';
  const isAuthenticated = !!user;

  const cartCount = cartQuery.data?.reduce((acc, cart) => acc + cart.items.length, 0) ?? 0;
  const wishlistCount = 2;
  const notificationCount = 3;

  const toggleSidebar = (type: typeof sidebarType) => {
    setSidebarType((prev) => (prev === type ? null : type));
  };

  useEffect(() => {
  setNow(Date.now());
}, []);

  // const handleLogout = () => {
  //   localStorage.removeItem('tokens');
  //   logout?.(); // In case your auth-context provides it
  //   router.push('/login');
  // };

  // ✅ Auto-logout if token is missing or expired
  // useEffect(() => {
  //   const tokenStr = localStorage.getItem('tokens');
  //   if (!tokenStr) {
  //     handleLogout();
  //     return;
  //   }

  //   try {
  //     const { accessToken } = JSON.parse(tokenStr);
  //     const decoded: DecodedToken = jwtDecode(accessToken);
  //     //const now = Date.now() / 1000;

  //     // if (decoded.exp < now ) {
  //     //   handleLogout();
  //     // }
  //   } catch (error) {
  //     handleLogout(); // Malformed token
  //   }
  // }, []);

  // ✅ Global click to close dropdown and sidebar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }

      // Close any open sidebar on outside click
      // if (
      //   !document.getElementById('sidebar-panel')?.contains(target)
      // ) {
      //   setSidebarType(null);
      // }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo & Menu Icon */}
          <div className="flex items-center space-x-4">
            <button
              className="lg:hidden flex flex-col justify-center items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="w-6 h-0.5 bg-black mb-1"></span>
              <span className="w-6 h-0.5 bg-black mb-1"></span>
              <span className="w-6 h-0.5 bg-black"></span>
            </button>
            <Link href="/" className="font-bebas-neue uppercase text-xl sm:text-3xl font-black flex flex-col leading-none text-gray-800 tracking-widest">
              Mpahira
            </Link>
          </div>

          {/* Nav Links */}
          <nav
            className={`${
              isOpen ? 'block' : 'hidden'
            } absolute top-full left-0 w-full bg-white lg:bg-transparent lg:static lg:flex lg:space-x-6 lg:items-center`}
          >
            <Link href="/" className="block py-2 px-4 hover:text-amber-600">Home</Link>
            <Link href="/about" className="block py-2 px-4 hover:text-amber-600">About Us</Link>
            <Link href="/products" className="block py-2 px-4 hover:text-amber-600">Products</Link>
            <Link href="/contact" className="block py-2 px-4 hover:text-amber-600">Contact</Link>
          </nav>

          {/* Icons and User Dropdown */}
          <div className="flex items-center space-x-4">
            {isBuyer && (
              <>
                <div className="relative cursor-pointer" onClick={() => toggleSidebar("notifications")}>
                  <FaBell className="text-gray-700 text-lg" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                      {notificationCount}
                    </span>
                  )}
                </div>

                <div className="relative cursor-pointer" onClick={() => toggleSidebar("wishlist")}>
                  <FaHeart className="text-gray-700 text-lg" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                      {wishlistCount}
                    </span>
                  )}
                </div>

                <div className="relative cursor-pointer" onClick={() => toggleSidebar("carts")}>
                  <FaShoppingCart className="text-gray-700 text-lg" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1">
                      {cartCount}
                    </span>
                  )}
                </div>
              </>
            )}

            {!isAuthenticated ? (
              <>
                <Link href="/register" className="uppercase py-1 sm:py-2 px-2 sm:px-4 rounded-md sm:rounded-lg bg-transparent border-2 border-pink-500 text-pink-500 dark:text-white hover:bg-pink-500 hover:text-white text-sm sm:text-md">
                  Signup
                </Link>
                <Link href="/login" className="uppercase py-1 sm:py-2 px-2 sm:px-4 rounded-md sm:rounded-lg bg-pink-500 border-2 border-transparent text-white mr-4 hover:bg-pink-400  text-sm sm:text-md">
                  Login
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                >
                  <Image
                    src={user?.profile || '/user-avatar.png'}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full border-2 object-cover"
                  />
                  <span className="text-gray-700 font-medium">{user.firstName}</span>
                  <FaChevronDown className="text-sm text-gray-900" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md z-50 w-48">
                    <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarType && (
        <SidebarPanel
          id="sidebar-panel"
          cart={cartQuery}
          type={sidebarType}
          onClose={() => setSidebarType(null)}
        />
      )}
    </>
  );
};

export default NavBar;
