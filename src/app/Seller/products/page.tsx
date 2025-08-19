// /Seller/products/page.tsx
"use client";

import React from "react";
import ProductListPage from "@/components/seller/sellerProduct";
import Layout from "@/components/Layout";

export default function Page() {
  return <Layout><ProductListPage/></Layout>;
}