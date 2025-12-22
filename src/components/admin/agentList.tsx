'use client';

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
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
import LoadingSkeloton from "../loadingSkeloton";
import { fetchAgentList, fetchUserMarket } from "@/hooks/useMarket";

// API Calls

const updateUserMarket = async (agentId: string, marketId: string) => {
  try {
    const { data } = await axiosInstance.post(`/agents`, { marketId, agentId });
    return data;
  } catch (error: any) {
    console.error("Error updating user Market:", error);
    toast.error(error.response?.data?.message || "Something went wrong");
    return null;
  }
};

export default function AgentListPage() {
  const queryClient = useQueryClient();

  // State
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMarket, setSelectedMarket] = useState<string>("All");

  // Queries
  const {
    data: users = [],
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgentList,
  });

  const {
    data: markets = [],
    isLoading: marketsLoading,
    error: marketsError,
  } = useQuery({
    queryKey: ["markets"],
    queryFn: fetchUserMarket,
  });

  // Loading + Error
  if (usersLoading || marketsLoading) {
    return (
      <div className="w-full">
        <LoadingSkeloton />
      </div>
    );
  }
  if (usersError) toast.error("Error fetching agents");
  if (marketsError) toast.error("Error fetching markets");

  // Filtering
  const filteredUsers =
    selectedMarket === "All"
      ? users
      : users.filter((user: any) => user.agentsMarket?.marketId === selectedMarket);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleMarketChange = async (agentId: string, marketId: string) => {
    await updateUserMarket(agentId, marketId);
    queryClient.invalidateQueries(["agents"]);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">All Market Agents</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        {/* Items per page */}
        <label className="flex items-center gap-2">
          <span>Items per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded p-2"
          >
            {[1, 5, 10, 20, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        {/* Market filter */}
        <label className="flex items-center gap-2">
          <span>Filter by Market:</span>
          <select
            value={selectedMarket}
            onChange={(e) => {
              setSelectedMarket(e.target.value);
              setCurrentPage(1);
            }}
            className="border rounded p-2"
          >
            <option value="All">All Markets</option>
            {markets.map((market: any) => (
              <option key={market.id} value={market.id}>
                {market.marketName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Users Table */}
      <div className="w-full overflow-x-auto rounded-lg shadow-sm border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telephone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Market</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedUsers.map((user: any, i: number) => (
              <TableRow key={user.id}>
                <TableCell>{i + 1 + (currentPage - 1) * itemsPerPage}</TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.telephone}</TableCell>
                <TableCell>
                  <Button variant="outline">Orders (0)</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline">10000</Button>
                </TableCell>
                <TableCell>
                  <Button variant="outline">1000</Button>
                </TableCell>
                <TableCell>
                  <select
                    className="border rounded p-1"
                    value={user.agentsMarket?.marketId || ""}
                    onChange={(e) => handleMarketChange(user.id, e.target.value)}
                  >
                    <option value="" disabled>
                      Working Markets
                    </option>
                    {markets.map((market: any) => (
                      <option key={market.id} value={market.id}>
                        {market.marketName}
                      </option>
                    ))}
                  </select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
