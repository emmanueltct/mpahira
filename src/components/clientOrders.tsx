"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { OrderDetails} from "./orderDetetails";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { OrderItemsDetails } from "./orderItemsDetail";

// fetch ALL orders (no page param)
const fetchOrders = async () => {
  const { data } = await axiosInstance.get(`/orders`);
  return data; // expects an array of orders
};

export default function ClientOrdersList() {
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});
  const [isOrderItemsDetailOpen, setIsOrderItemsDetailOpen] = useState(false);

  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // filter states
  const [paymentStatus, setPaymentStatus] = useState("All");
  const [deliveryStatus, setDeliveryStatus] = useState("All");
  const [itemsPerPage, setitemsPerPage] = useState(10);

 
  const { data, isLoading, error } = useQuery({
    queryKey: ["order"],
    queryFn: fetchOrders,
  });

  // load orders into state when fetched
  useEffect(() => {
    if (data) {
      setOrdersData(data || []);
    }
  }, [data]);

  // filter logic
  const filteredOrders = useMemo(() => {
    let filtered = [...ordersData];

    if (paymentStatus !== "All") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === paymentStatus
      );
    }

    if (deliveryStatus !== "All") {
      filtered = filtered.filter(
        (order) => order.orderProcessingStatus === deliveryStatus
      );
    }

    return filtered;
  }, [ordersData, paymentStatus, deliveryStatus]);

  // pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onPageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  

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
      <div className="flex flex-row justify-between sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">
          Total Orders ({filteredOrders.length})
        </h1>
        <Button asChild>
          <Link href="/products">Back to products</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">

        <div className="flex">
          <span className="border-1 p-2  w-full">
          Items per page 
          </span>
          <select
          value={itemsPerPage}
          onChange={(e) => {
            setitemsPerPage(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        
        </div>
        

        <select
          value={paymentStatus}
          onChange={(e) => {
            setPaymentStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          <option value="All">All Payment Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
        </select>

        <select
          value={deliveryStatus}
          onChange={(e) => {
            setDeliveryStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          <option value="All">All Delivery Status</option>
          <option value="Delivered">Delivered</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Empty State */}
      {!isLoading && paginatedOrders.length === 0 && (
        <div className="border rounded-lg p-8 shadow-sm space-y-3 w-full sm:w-1/2 mx-auto text-center">
          No orders found matching your filter.
        </div>
      )}

      {/* Orders Table */}
      {!isLoading && paginatedOrders.length > 0 && (
        <div className="overflow-x-auto rounded-lg shadow-sm border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Paid Amount
                </TableHead>
                <TableHead>Refund</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Total Amount
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Payment</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>More</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                     <span suppressHydrationWarning>
                      {new Date(order.createdAt).toISOString().slice(0,16).replace("T"," ")}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.paidAmount}
                  </TableCell>
                  <TableCell>{order.refundAmount}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.totalAmount}
                  </TableCell>
                  <TableCell>{order.orderProcessingStatus}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.paymentStatus}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setIsOrderItemsDetailOpen(true);
                        setOrderDetail(order);
                      }}
                      className="w-20 bg-pink-600"
                      size="sm"
                    >
                      items({order.items?.length || 0})
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setIsOrderDetailOpen(true);
                        setOrderDetail(order);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <OrderDetails
            itemsData={orderDetail}
            isOrderDetailOpen={isOrderDetailOpen}
            onClose={() => setIsOrderDetailOpen(false)}
          />
          <OrderItemsDetails
            itemsData={orderDetail}
            isOrderItemsDetailOpen={isOrderItemsDetailOpen}
            onClose={() => setIsOrderItemsDetailOpen(false)}
          />
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
