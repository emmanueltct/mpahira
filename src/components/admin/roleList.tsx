'use client';

import React, { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import LoadingSkeloton from "../loadingSkeloton";
import RoleModal from "./addCategory";
import RoleCategoryModal from "./addRole";

// ✅ Fetch all roles
const fetchRoleList = async () => {
  const { data } = await axiosInstance.get("/roles");
  console.log("-----------------------------------",data)
  return data ?? []; // ensure array
};


export default function RoleListPage() {
 

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen,setIsModalOpen]=useState(false)

  // ✅ Fetch roles
  const {
    data: roles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn:fetchRoleList,
  });


  if (isLoading) return <div><LoadingSkeloton/></div>
           

  if (error) toast.error("Error fetching roles");

  // ✅ Pagination logic
  const totalPages = roles.length ? Math.ceil(roles.length / itemsPerPage) : 1;
  const paginatedroles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold mb-6">All Roles</h1>
        <Button onClick={()=>setIsModalOpen(true)}>Add New Role</Button>
      </div>
       <RoleCategoryModal
          isModalOpen={isModalOpen}
          onClose={() =>setIsModalOpen(false)}
        />

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
              <TableHead>Role</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedroles.map((cat: any, i: number) => (
              <TableRow key={cat.id}>
                <TableCell>{i + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>{cat.role}</TableCell>
                <TableCell>{new Date(cat.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button>
                    <FaEdit/>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => toast(`Update category ${cat.id}`)}
                  >
                    <FaTrash/>
                  </Button>
                </TableCell>
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
