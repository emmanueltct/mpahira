// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";
import UnitProductListPage from "@/components/admin/unitProduct";


export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <UnitProductListPage/>
    </div>
   </Layout>
   )}