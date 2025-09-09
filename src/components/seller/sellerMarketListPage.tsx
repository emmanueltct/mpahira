'use client';

import React, { useState } from "react";
import { useQuery} from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import toast from "react-hot-toast";
import LoadingSkeloton from "../loadingSkeloton";

// ✅ Fetch all markets
const fetchMarketList = async () => {
  const { data } = await axiosInstance.get("/market");
  console.log("-----------------------------------",data)
  return data ?? []; // ensure array
};


export default function SellerMarketListPage() {
 

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
 

  // ✅ Fetch markets
  const {
    data: markets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["markets"],
    queryFn:fetchMarketList,
  });


  if (isLoading) return <div><LoadingSkeloton/></div>
           

  if (error) toast.error("Error fetching markets");

  // ✅ Pagination logic
  const totalPages = markets.length ? Math.ceil(markets.length / itemsPerPage) : 1;
  const paginatedmarkets = markets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold mb-6">All markets</h1>
        {/* <Button onClick={()=>setIsModalOpen(true)}>Add New Market</Button> */}
      </div>
       {/* <MarketModal
          isModalOpen={isModalOpen}
          onClose={() =>setIsModalOpen(false)}
        /> */}

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <span>Items per page:</span>
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border rounded p-2"
        >
          {[2, 5, 10, 20, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Category Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Sector</TableHead>
              <TableHead>Longitude Coordinate</TableHead>
              <TableHead>Latitude Coordinate</TableHead>
              <TableHead>Google Map Coordinate</TableHead>
              <TableHead>classification</TableHead>
              <TableHead>Created At</TableHead>
              {/* <TableHead>Actions</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedmarkets.map((cat: any, i: number) => (
              <TableRow key={cat.id}>
                <TableCell>{i + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={cat.marketThumbnail}
                        alt={cat.marketName}
                        />
                        <AvatarFallback>PR</AvatarFallback>
                     </Avatar>
                </TableCell>
                <TableCell>{cat.marketName}</TableCell>
                <TableCell>{cat.province}</TableCell>
                <TableCell>{cat.district}</TableCell>
                <TableCell>{cat.sector}</TableCell>
                <TableCell>{cat.locationLongitude}</TableCell>
                <TableCell>{cat.locationLatitude}</TableCell>
                <TableCell>{cat.googleMapCoordinate}</TableCell>
                <TableCell>{cat.classification}</TableCell>
                <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-primary text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
