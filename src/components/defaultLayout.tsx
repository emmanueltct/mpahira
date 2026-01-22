'use client';

import { useState, useEffect, useRef, useContext } from "react";

import Link from "next/link";
import Image from "next/image";

import { useCart } from "@/hooks/userCarts";
import { FaHeart, FaShoppingCart, FaBell, FaChevronDown } from "react-icons/fa";
import { X } from "lucide-react";
import { AuthContext } from "@/context/auth-context";
import DropdownMenu from "./dropdown";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sidebarType, setSidebarType] = useState<"carts" | "wishlist" | "notifications" | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

 const { user, logout, loading, isAuthenticated } = useContext(AuthContext)!;
  
  const isBuyer = String(user?.role || "").toLowerCase() === "buyer";

  // ✅ Fetch cart only if user is authenticated
  const { cartQuery } = useCart({
    enabled: isBuyer && isAuthenticated,
  });

  // Update cart count automatically
  useEffect(() => {
    if (isBuyer && cartQuery?.data) {
      const count = cartQuery.data.reduce(
        (acc: number, cart: any) => acc + cart.items.length,
        0
      );
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  }, [cartQuery?.data, isBuyer]);

  const wishlistCount = 2;
  const notificationCount = 3;

  const toggleSidebar = (type: typeof sidebarType) => {
    setSidebarType((prev) => (prev === type ? null : type));
  };

  const handleLogout = () => {
    logout();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


if (loading) return null;

  return (
    <div className="w-max-full">
      <header className="fixed top-0 left-0 w-full z-50 bg-white">
        <div className="w-full border-b shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                className="sm:hidden flex flex-col justify-center items-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                {!isOpen ? (
                  <>
                    <span className="w-6 h-0.5 bg-black mb-1"></span>
                    <span className="w-6 h-0.5 bg-black mb-1"></span>
                    <span className="w-6 h-0.5 bg-black"></span>
                  </>
                ) : (
                  <X size={25} />
                )}
              </button>
              <Link href="/" className="font-bebas-neue uppercase text-xl sm:text-3xl font-black flex flex-col leading-none text-gray-800 tracking-widest">
                Mpahira
              </Link>
            </div>

            {/* Nav */}
            <nav
              className={`${isOpen ? 'block bg-white shadow-2xl h-screen sm:h-12 translate-x-0 transition-transform duration-400 ease-in-out' : '-translate-x-full sm:-translate-x-0'} absolute top-full left-0 w-1/2 sm:w-full sm:bg-white lg:static lg:flex lg:space-x-6 lg:items-center justify-start sm:justify-end`}
            >
              <div className="flex flex-col sm:flex-row w-[80%] sm:w-[60%] items-start sm:items-end ml-3 sm:ml-0">
               
                {!isAuthenticated && <Link href="/" className="block py-2 px-4 hover:text-amber-600">Home</Link>}
                {!isAuthenticated &&<DropdownMenu/>}
                {!isAuthenticated && <Link href="/about" className="block py-2 px-4 hover:text-amber-600">About Us</Link>}
                <Link href="/products" className="block py-2 px-4 hover:text-amber-600">Products</Link>
                {isAuthenticated && <Link href="/buyer/orders" className="block py-2 px-4 hover:text-amber-600">Orders</Link>}
                {isAuthenticated && isOpen && <Link href="/buyer/carts" className="block py-2 px-4 hover:text-amber-600">Carts ({cartCount})</Link>}
                {isAuthenticated && isOpen && <Link href="/buyer/whishlist" className="block py-2 px-4 hover:text-amber-600">WishList ({wishlistCount})</Link>}
                {isAuthenticated && isOpen && <Link href="/buyer/notification" className="block py-2 px-4 hover:text-amber-600">Notification ({notificationCount})</Link>}
                {isAuthenticated && isOpen && <Link href="#" onClick={handleLogout} className="block py-2 px-4 hover:text-amber-600">Logout</Link>}
                {!isAuthenticated && <Link href="/contact" className="block py-2 px-4 hover:text-amber-600">Contact</Link>}
              </div>
            </nav>

            {/* Icons + User Dropdown */}
            <div className="flex items-center justify-end space-x-4 mr-5 sm:w-2/3">
              {isBuyer && (
                <div className="hidden sm:flex w-1/2 justify-around">
                  <div className="relative cursor-pointer" onClick={() => toggleSidebar("notifications")}>
                    <FaBell size={22} className="text-gray-700" />
                    {notificationCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                    )}
                  </div>
                  <div className="relative cursor-pointer" onClick={() => toggleSidebar("wishlist")}>
                    <FaHeart size={22} className="text-gray-700" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <Link href="/buyer/carts" className="relative cursor-pointer">
                    <FaShoppingCart size={22} className="text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-3 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>
              )}

              {!isAuthenticated ? (
                <div className="flex gap-3">
                  <Link href="/register" className="uppercase py-1 px-2 sm:px-4 rounded-lg border-2 border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white text-sm">Signup</Link>
                  <Link href="/login" className="uppercase py-1 px-2 sm:px-4 rounded-lg bg-pink-500 text-white hover:bg-pink-400 text-sm">Login</Link>
                </div>
              ) : (
                <div className="relative mr-2" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                    <Image
                      src={user?.profile || '/user-avatar.png'}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="w-10 h-10 rounded-full border-2 object-cover"
                    />
                    <span className="text-gray-700 font-medium">{user?.lastName}</span>
                    <FaChevronDown className="text-sm text-gray-900" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-48 z-50">
                      {(user?.role.toLowerCase() === "admin" || user?.role.toLowerCase() === "seller") && (
                        <Link className="block mt-4 px-4 py-2 hover:bg-gray-100" href={`/${user?.role.toLowerCase()}/dashboard`}>Go to Dashboard</Link>
                      )}
                      <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                      <Link href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <main className="min-h-screen h-full w-full mt-6">{children}</main>
      {
        isAuthenticated &&(
        
             <div className="flex sm:hidden w-full bg-white bottom-0 sticky z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.35)]  border-t border-gray-200  h-20 items-center justify-around px-4">
                 <div className="relative cursor-pointer flex flex-col items-center" onClick={() => toggleSidebar("notifications")}>
                    <FaBell size={22} className="text-gray-700" />
                    {notificationCount > 0 && (
                      <>
                      <span className="absolute -top-2 left-12 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {notificationCount}
                      </span>
                      </>
                    )}
                     <span>
                       {"Notifications"}
                    </span>
                  </div>
                  <div className="relative cursor-pointer flex flex-col items-center" onClick={() => toggleSidebar("wishlist")}>
                    <FaHeart size={22} className="text-gray-700" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 left-10 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                     <span>
                       {"Wish List"}
                    </span>
                  </div>
                  <div className="relative  cursor-pointer " onClick={() => toggleSidebar("wishlist")}>
                  <Link href="/buyer/carts" className="relative cursor-pointer flex flex-col items-center">
                    <FaShoppingCart size={22} className="text-gray-700" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 left-10 bg-red-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                     <span>
                       {"Cart item"}
                    </span>
                  </Link>
                </div>
            </div>
       
        )
      }
     
    </div>
  );
};

export default DefaultLayout;
