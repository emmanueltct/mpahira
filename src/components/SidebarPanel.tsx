// components/SidebarPanel.tsx
"use client";

import { useQuery, UseQueryResult } from "@tanstack/react-query";

import { CartTable } from "./CartTable";
import { Cart } from "@/types/cart";


type ItemType = "carts" | "wishlist" | "notifications";

interface SidebarPanelProps {
  type: ItemType;
  cart:UseQueryResult<Cart[], Error>
  onClose: () => void;
}

export default function SidebarPanel({ type, onClose,cart}: SidebarPanelProps) {
   
 
  const titleMap = {
    carts: "Your Cart",
    wishlist: "Your Wishlist",
    notifications: "Notifications",
  };


  if(cart.data){
    console.log("99999999999999999999999999999999999999999999",cart.data[0])
  }

  return (
    <div className="fixed mt-15 right-0 h-full w-full   shadow-2xl z-50 p-4 overflow-y-auto ">
      <div className=" fixed right-0 h-full w-full   shadow-2xl z-50 p-4 overflow-y-auto bg-gray-400  opacity-30"></div>
      <div className="fixed  right-0 h-full w-full sm:w-1/2 bg-white shadow-2xl z-50 p-4 overflow-y-auto">
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-lg font-semibold">{titleMap[type]}</h3>
        <button
          onClick={onClose}
          className="text-red-600 text-xl hover:text-red-800"
        >
          &times;
        </button>
      </div>

      {cart.isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : cart.isError? (
        <p className="text-sm text-red-500">Failed to load {cart.error?.message}.</p>
      ) : cart.data&&cart.data.length > 0 ? (

            <CartTable cartData={cart.data[0]}/>

      
      ) : (
        <p className="text-sm text-gray-500">No items found.</p>
      )}
    </div>
  </div>
  );
}





