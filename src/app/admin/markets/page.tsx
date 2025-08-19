// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";
import MarketListPage from "@/components/admin/marketList";



export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <MarketListPage/>
    </div>
   </Layout>
   )}