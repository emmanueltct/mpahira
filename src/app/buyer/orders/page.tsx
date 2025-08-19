"use client";

import React from "react";

import ClientOrdersList from "@/components/clientOrders";
import DefaultLayout from "@/components/defaultLayout";

export default function Page() {
  return  <DefaultLayout><ClientOrdersList/></DefaultLayout>;
}