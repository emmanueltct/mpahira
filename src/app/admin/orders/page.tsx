// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";

import OrderListPage from "@/components/admin/adminOrderList";



export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <OrderListPage/>
    </div>
   </Layout>
   )}