"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const fetchOrders = async () => {
  const { data } = await axiosInstance.get("/orders");
  return data;
};

export default function ClientOrdersList() {
  const [page] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["order", page],
    queryFn: fetchOrders,
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      setOrders(data|| []); // adjust based on API shape
    }
  }, [data]);

  

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-red-600">
        Error loading orders. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 sm:py-24">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">
          Total Orders ({orders.length})
        </h1>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>

      {/* Empty State */}
      {!isLoading && orders.length === 0 && (
        <div className="border rounded-lg p-8 shadow-sm space-y-3 w-full sm:w-1/2 mx-auto text-center">
          You haven't placed any orders yet. Start shopping now!
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && orders.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">Items</TableHead>
                <TableHead className="hidden sm:table-cell">Paid Amount</TableHead>
                 <TableHead>Refund</TableHead>
                <TableHead className="hidden sm:table-cell">Total Amount</TableHead>
                <TableHead className="hidden md:table-cell">Transport Cost</TableHead>
                <TableHead className="hidden md:table-cell">Service Cost</TableHead>
                <TableHead className="hidden lg:table-cell">Transaction ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead className="hidden sm:table-cell">Delivery Place</TableHead>
                <TableHead className="hidden lg:table-cell">Estimated Distance</TableHead>
                 <TableHead className="hidden lg:table-cell">More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order,i) => (
                <TableRow key={i}>
                  <TableCell>{i+1}</TableCell>
                  <TableCell>
                  {new Date(order.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month:'2-digit',
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  }).replace(',', '')}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{order.items.length}</TableCell>
                   <TableCell className="hidden sm:table-cell">{order.paidAmount}</TableCell>
                   <TableCell>{order.refundAmount}</TableCell>
                  <TableCell className="hidden sm:table-cell">{ order.totalAmount}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.transportCost}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.serviceCost}</TableCell>
                  <TableCell className="hidden lg:table-cell">{order.paymentTransaction}</TableCell>
                  <TableCell>{order.orderProcessingStatus}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.paymentStatus}</TableCell>
                  <TableCell className="hidden lg:table-cell">{"KG 800 Street, Gatsata "}</TableCell>
                  <TableCell className="hidden lg:table-cell">{ order.deliveryDistance}</TableCell>
                  <TableCell className="hidden lg:table-cell"><Button>More</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
