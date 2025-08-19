// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";
import ProductCategoryListPage from "@/components/admin/productCategory";

export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <ProductCategoryListPage/>
    </div>
   </Layout>
   )}