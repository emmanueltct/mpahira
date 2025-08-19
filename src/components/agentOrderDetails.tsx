'use client';
import React, { useState, useMemo ,useEffect} from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import OrderDriverForm from "./Auth/DriverRegister";

// Fetch function
const fetchOrderDetails = async (id: string) => {
  const { data } = await axiosInstance.get(`/orders/${id}`);
  return data;
};

// Update generalStatus
const updateGeneralStatus = async (orderId:string,productId: string, status: string) => {
try {
  let data={}
  if(status!=="Available"){
    data={
       generalStatus: status,
       processingStatus:"Cancelled"
    }
  }else{
     data={
       generalStatus: status,
       processingStatus:"Pending"
    }
  }

  const res = await axiosInstance.patch(
    `/orders/${orderId}/item/${productId}`,
    data
  );

  return res.data;
} catch (error: any) {
  console.error("Error updating order:", error);
  toast.error(error.response?.data?.message || "Something went wrong");
  return null;
}
}
// Update processingStatus
const updateProcessingStatus = async (orderId:string,productId: string, status: string) => {
  try {
   const res = await axiosInstance.patch(`/orders/${orderId}/item/${productId}`, { processingStatus:status });
    return res.data;
} catch (error: any) {
  console.error("Error updating order:", error);
  toast.error(error.response?.data?.message || "Something went wrong");
  return null;
}
};

export default function AgentOrderItemsDetailsPage() {
  const params = useParams();
  const id = params.id;
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<"pending" | "processed">("pending");

  

  const { data: itemsData, isLoading, error } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: () => fetchOrderDetails(id as string),
    enabled: !!id,
     keepPreviousData: false,
  });

  //   useEffect(() => {
  //   if (id) {
  //     queryClient.invalidateQueries(["orderDetails", id]); // refetch whenever id changes
  //   }
  // }, [id]);

  const items = Array.isArray(itemsData?.items) ? itemsData.items : [];

  // Pending items
const pendingItems = useMemo(
  () =>
    items.filter(
      (item) =>
        item.processingStatus?.toLowerCase() !== "picked" &&
        item.processingStatus?.toLowerCase() !== "cancelled"
    ),
  [items]
);

// Processed items: Available, Not available, picked, cancelled, or missing generalStatus
const processedItems = useMemo(
  () =>
    items.filter(
      (item) =>
        ["available", "not available", "picked", "cancelled"].includes(
          item.processingStatus?.toLowerCase()
        ) || !item.generalStatus
    ),
  [items]
);

    const displayedItems = activeTab === "pending" ? pendingItems : processedItems;

  useEffect(() => {
  setActiveTab((prevTab) => {
    if (pendingItems.length === 0 && processedItems.length > 0) {
      return prevTab !== "processed" ? "processed" : prevTab;
    } else {
      return prevTab !== "pending" ? "pending" : prevTab;
    }
  });
}, [pendingItems, processedItems]);

  if (isLoading) {
  return (
    <div className="block overflow-x-auto rounded-lg shadow-sm border mb-8">
      <Table>
        <TableBody>
          {Array.from({ length: 6 }).map((_, idx) => (
            <TableRow key={idx}>
              <TableCell colSpan={7}>
                <span className="h-6 w-full bg-gray-200 animate-pulse rounded" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

  if (error){

    toast.error(error?.response?.data?.message);
  }

  // Handlers to toggle statuses
  const handleToggleGeneralStatus = async (product: any,id) => {
  const newStatus = product.generalStatus === "Available" ? "Not available" : "Available";
  await updateGeneralStatus(id,product.productId, newStatus);
  queryClient.invalidateQueries(["orderDetails", id]); // refresh data
};

  const handleUpdateProcessingStatus = async (product: any, newStatus: string,id) => {
    await updateProcessingStatus(id,product.productId, newStatus);
    queryClient.invalidateQueries(["orderDetails", id]); // refresh data
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Order Details</h1>
       {/* Order meta info */} 
       <div className="flex flex-col gap-2 border-b border-gray-200 pb-4 mb-4"> 
        <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
           <span>Date:</span> 
           <span suppressHydrationWarning> 
            {new Date(itemsData.createdAt) .toLocaleString("en-GB", { 
              day: "2-digit",
               month: "2-digit",
                year: "numeric",
                 hour: "2-digit", 
                 minute: "2-digit", }) .replace(",", "")}
           </span>
         </div> 
         <div className="flex justify-between">
           <span>Client:</span> 
           <span>{itemsData.buyer.firstName} {itemsData.buyer.lastName}</span>
         </div> 
          <div className="flex justify-between">
           <div>
              {/* <span>Contact:</span>  */}
           </div>
           <div className="flex flex-col">
            <span> {itemsData.buyer.telephone}</span> 
           <span>{itemsData.buyer.email}</span>
           </div>
         </div>
      </div> 
      {/* Status info */} 
      <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
         <div className="flex justify-evenly w-1/2">
          <strong>Payment:</strong>
           <span>{itemsData.paymentStatus}</span>
            </div> 
        <div className="flex justify-evenly w-1/2">
         <strong>Delivery:</strong>
          <span>{itemsData.orderProcessingStatus}</span>
           </div> 
        </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-3">
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({pendingItems.length})
        </Button>
        <Button
          variant={activeTab === "processed" ? "default" : "outline"}
          onClick={() => setActiveTab("processed")}
        >
          Processed ({processedItems.length})
        </Button>
      </div>

      {/* Table */}
      {displayedItems.length > 0 ? (
        <div className="block overflow-x-auto rounded-lg shadow-sm border mb-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>General Status</TableHead>
                <TableHead>Processing</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
  
              {displayedItems.map((product: any) => (
                <TableRow key={product.productId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={product.ShopProduct?.productProfile}
                          alt={product.ShopProduct?.productName?.product}
                        />
                        <AvatarFallback>PR</AvatarFallback>
                      </Avatar>
                      <span className="font-medium capitalize">
                        {product.ShopProduct?.productName?.product}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.unitPrice}</TableCell>
                  <TableCell>{product.totalPrice}</TableCell>

                  {/* Toggle General Status */}
                 <TableCell>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={product.generalStatus === "Available"}
                      onChange={() => handleToggleGeneralStatus(product,id)}
                      disabled= {itemsData.orderProcessingStatus==="Shipping"||itemsData.orderProcessingStatus === "Delivered"?true:false}
                    />
                    <div className="w-11 h-6 mr-2 bg-gray-200 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-green-300 relative transition-colors">
                      <span
                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                          product.generalStatus === "Available" ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></span>
                     
                    </div>
                     {product.generalStatus}
                  </label>
                </TableCell>

                  {/* Update Processing Status */}
                  <TableCell>
                    <select
                      className="border rounded p-1"
                      value={product.processingStatus }
                      onChange={(e) => handleUpdateProcessingStatus(product, e.target.value,id)}
                      disabled= {itemsData.orderProcessingStatus==="Shipping"||itemsData.orderProcessingStatus === "Delivered"?true:false}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Started">Started</option>
                      <option value="Picked">Completed</option>
                      <option value="Cancelled">Not Available</option>
                     
                    </select>
                    {/* {product.processingStatus} */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Summary */} 
          <div className="bg-white p-4 shadow-lg mt-3 pr-8 sm:pr-10"> 
            <div className="space-y-3 text-gray-700 text-sm sm:text-md font-semibold">
               <div className="flex justify-between border-b pb-1"> <span>Items Total:</span> <span>{itemsData.totalAmount}</span> </div>
                <div className="flex justify-between border-b pb-1"> <span>Clint Refund:</span> <span>{itemsData.refundAmount}</span> </div>
               <div className="flex justify-between border-b pb-1"> <span>Agent Commission:</span> <span>{itemsData.agentCommission}</span> </div>
             </div> 
           </div> 
          
          
          <div className="w-full flex flex-col-reverse sm:flex-row  gap-2  text-gray-700 text-sm sm:text-md">
            {itemsData.orderProcessingStatus==="Shipping"|| itemsData.orderProcessingStatus === "Delivered" ?(
            <div className="w-full sm:w-1/2 border justify-center p-3 m-3">
              <h2 className="text-lg font-semibold pb-2 mb-2 border-b-2 border-b-amber-200">Assigned Driver</h2>
              <div className="flex w-full py-2">
                <strong>Name</strong>:<span>Emmanuel munezero</span>
              </div>
              <div className="flex w-full  py-2">
                <strong>Telephone</strong>:<span>0787031933</span>
              </div>
              <div className="flex w-full  py-2">
                <strong>Plate Number</strong>:<span>RAB 412 A</span>
              </div>
            </div>
            ):(
              <OrderDriverForm processedItem={processedItems} orderItem={itemsData} />
            )}
            {/* customer Deliver Address start here */}

            <div className="w-full sm:w-1/2 border justify-center p-3 m-3">
              <h2 className="text-lg font-semibold  py-2 mb-2 border-b-2 border-b-amber-200">Delivery Location</h2>
              <div className="flex w-full  py-2">
                <strong>Street Number</strong>:<span>Kg 715 St Gisozi , Kigali, Rwanda</span>
              </div>
              <div className="flex w-full  py-2">
                <strong>Nearest Landmark</strong>:<span>Kigali Design</span>
              </div>
              <div className="flex w-full border-t  py-2">
                <strong>Desicription</strong>:<span>RAB 412 A</span>
              </div>
            </div>
          </div>
         
        </div>
      ) : (
        <p className="text-center text-gray-500">{error?.response?.data?.message}</p>
      )}
    </div>
  );
}
