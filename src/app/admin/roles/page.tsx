// /Seller/products/page.tsx
"use client";

import React from "react";

import Layout from "@/components/Layout";
import RoleListPage from "@/components/admin/roleList";


export default function Page() {
      
  return(
  <Layout>
    <div className="flex items-center justify-center h-fit">
        <RoleListPage/>
    </div>
   </Layout>
   )}