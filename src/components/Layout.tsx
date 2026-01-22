"use client"
import { useEffect, useRef, useState } from "react";
import { Menu, X, Bell, ChevronDown,ActivityIcon,User2Icon,LayoutDashboard,ShoppingBag,StoreIcon,HouseIcon,ChartBarDecreasingIcon } from "lucide-react";

import Image from "next/image";
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';



const teamDropdownItems = [
  { name: "Buyer" },
  { name: "Seller" },
  { name: "Agent" },
  { name: "Driver" },
];



export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);
   const [teams, setTeams] = useState<{ name: string; initials: string, href:string }[]>([]);
   const [navigation , setNavigation]=useState<{ name: string; icon:any, href:string, hasDropdown?:boolean }[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
  if (user?.role.toLowerCase() === "admin") {
    setTeams([
      { name: "Orders", initials: "O", href:"/admin/orders" },
      { name: "Carts", initials: "C", href:"/admin/carts" },
      { name: "Wishlist", initials: "W", href:"/admin/wishlist" },
    ]);

    setNavigation([
      { name: "Dashboard", icon:LayoutDashboard , href:"/admin/dasboard" },
      { name: "Role", icon:ActivityIcon, href:"/admin/roles" },
      { name: "Users", icon:User2Icon, href:"/admin/users" },
      { name: "Agents", icon:User2Icon, href:"/admin/agents" },

      { name: "Markets", icon:HouseIcon, href:"/admin/markets" },
      { name: "shops", icon:StoreIcon, href:"/admin/shops" },
      { name: "product-units", icon:ChartBarDecreasingIcon, href:"/admin/unit-products" },
      { name: "category", icon:ChartBarDecreasingIcon, href:"/admin/categories" },
      { name: "products", icon:ShoppingBag, href:"/admin/products" },
       { name: "clients-Reviews", icon:ShoppingBag, href:"/admin/clients-reviews" },
   
    ])

  } else if(user?.role.toLowerCase() === "seller"){
    setTeams([
        { name: "Orders", initials: "O", href:"/seller/orders" },
        { name: "Carts", initials: "C", href:"/seller/orders" },
        { name: "Wishlist", initials: "W" , href:"/seller/orders" },
      ]);
      setNavigation([
      { name: "Dashboard", icon:LayoutDashboard , href:"/seller/dashboard" },
      { name: "Markets", icon:HouseIcon, href:"/seller/markets" },
      { name: "shops", icon:StoreIcon, href:"/seller/shops" },
      { name: "category", icon:ChartBarDecreasingIcon, href:"/seller/categories" },
      { name: "products", icon:ShoppingBag, href:"/seller/products" },
   
    ])
  }else if(user?.role.toLowerCase() === "agent"){
    setTeams([
        { name: "Orders", initials: "O", href:"/agent/orders" },
      ]);

      setNavigation([
      { name: "Dashboard", icon:LayoutDashboard , href:"/admin/dasboard" },
      { name: "category", icon:ChartBarDecreasingIcon, href:"/admin/categories" },
      { name: "products", icon:ShoppingBag, href:"/agent/products" },
      { name: "reports", icon:ShoppingBag, href:"/agent/reports" },
   
    ])
  } else {
    setTeams([]); // optional, clear for non-admin users
  }
}, [user]);

const navigationClick=(link:string)=>{
  router.push(link)
}

  //let teams: { name: string; initials: string }[] = [];
   

  return (
    <div className="flex min-h-screen bg-gray-100 z-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 z-50 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-0`}
      >
        <div className="flex items-center justify-between h-16 border-b border-gray-800 px-4">
           <span className="text-lg font-bold">Logo</span>
          {/* Close button for mobile */}
          <button
            className="md:hidden p-1 hover:bg-gray-800 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
       <nav className="px-4 py-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon; // ✅ move here

          return (
            <div key={item.name}>
              <button
                onClick={() => {
                  if (item.hasDropdown) {
                    setTeamDropdownOpen(!teamDropdownOpen);
                  }else{
                    navigationClick(item.href)
                  }
                }}
                className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-800 ${
                  item.hasDropdown ? "justify-between" : ""
                }`}
              >
                <span className="flex items-center">
                  <span className="mr-3">
                    <Icon className="w-5 h-5" /> {/* ✅ render icon */}
                  </span>
                  {item.name}
                </span>

                {/* Dropdown Arrow */}
                {/* {item.hasDropdown && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      teamDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                )} */}
              </button>

              {/* Dropdown Items */}
              {item.hasDropdown && teamDropdownOpen && (
                <div className="ml-10 mt-1 space-y-1">
                  {teamDropdownItems.map((subItem) => (
                    <a
                      key={subItem.name}
                      href="#"
                      className="block px-2 py-1 text-sm text-gray-300 rounded hover:bg-gray-800"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Teams section */}
        <div className="mt-6 text-gray-400 text-xs uppercase">Activities</div>
        {teams.map((team) => (
          <a
            key={team.name}
            href={team.href}
            className="flex items-center px-3 py-2 mt-2 rounded-lg hover:bg-gray-800"
          >
            <span className="flex items-center justify-center w-6 h-6 mr-3 text-sm font-medium text-gray-300 bg-gray-700 rounded-full">
              {team.initials}
            </span>
            {team.name}
          </a>
        ))}
      </nav>

        <div className="absolute bottom-0 w-full px-4 py-3 border-t border-gray-800">
          <a
            href="#"
            className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-800"
          >
            ⚙ Settings
          </a>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Topbar */}
        <header className="flex items-center top-0 sticky justify-between px-4 py-2 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button
              className="p-2 mr-2 rounded-md md:hidden hover:bg-gray-200"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <input
              type="text"
              placeholder="Search"
              className="hidden px-3 py-1 border rounded-md md:block border-gray-300"
            />
          </div>
          <div className="flex items-center space-x-4 ">
            <Bell className="w-5 h-5 text-gray-600" />
                <div className="relative" ref={menuRef} onMouseLeave={() => setProfileOpen(false)}>
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="focus:outline-none"
                    >
                        <Image
                         src={'/user-avatar.png'}
                        alt="profile"
                        width={32}
                        height={32}
                        className="rounded-full cursor-pointer"
                        />
                    </button>

                    {profileOpen && (
                        <div className="absolute right-0 w-40 mt-2 bg-white border rounded-lg shadow-lg">
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Your profile
                        </a>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                            Sign out
                        </a>
                        </div>
                    )}
                    </div>
            </div>
          
        </header>

        {/* Content */}
        <main className="flex-1 p-4 ">
          <div className="w-full h-full border border-dashed border-gray-300 bg-[repeating-linear-gradient(45deg,#f0f0f0,#f0f0f0_10px,#ffffff_10px,#ffffff_20px)] rounded-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
