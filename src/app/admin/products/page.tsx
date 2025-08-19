// /Seller/products/page.tsx
"use client";

import React from "react";

import AdminProductListPage from "@/components/admin/adminProducts";
import Layout from "@/components/Layout";

export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <AdminProductListPage/>
    </div>
   </Layout>
   )}