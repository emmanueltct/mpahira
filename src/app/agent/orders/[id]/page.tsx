
"use client"

// import {  useParams } from "next/navigation"
import AgentOrderItemsDetailsPage from "@/components/agentOrderDetails";
import Layout from "@/components/Layout";

export default function Page() {
  //   const params = useParams(); // <-- useParams instead of router.query
  // const id = params.id;


  return <Layout><AgentOrderItemsDetailsPage/></Layout>;
}