// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";

import AdminReviewList from "@/components/admin/AdminReviewList";



export default function Page() {
      
  return(
  <Layout>
    <div className="flex  justify-center h-fit">
        <AdminReviewList/>
    </div>
   </Layout>
   )}