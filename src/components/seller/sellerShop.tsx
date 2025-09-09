"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarkets } from "@/hooks/useMarket";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

// -----------------------------
// Shop Form Dialog
// -----------------------------
const ShopFormDialog = ({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}) => {
  const queryClient = useQueryClient();
  const { data: markets } = useMarkets();

  const [brandName, setBrandName] = useState("");
  const [marketId, setMarketId] = useState("");

  useEffect(() => {
    if (initialData) {
      setBrandName(initialData.brandName || "");
      setMarketId(initialData.marketId || initialData.market?.id || "");
    } else {
      setBrandName("");
      setMarketId("");
    }
  }, [initialData]);

  const mutation = useMutation({
    mutationFn: async (payload: { brandName: string; marketId: string }) => {
      if (initialData) {
        return axiosInstance.patch(`/shop/${initialData.id}`, payload);
      } else {
        return axiosInstance.post("/shop", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["shops"]);
      toast.success(
        initialData ? "Shop updated successfully" : "Shop created successfully"
      );
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!marketId) {
      toast.error("Please select a market");
      return;
    }

    mutation.mutate({ brandName, marketId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Shop" : "Add New Shop"}</DialogTitle>
          <DialogDescription>
            {initialData
              ? "Update the shop information."
              : "Fill out the form to create a new shop."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Brand Name</label>
            <Input
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Beza Shop"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Market</label>
            <Select onValueChange={setMarketId} value={marketId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Market" />
              </SelectTrigger>
              <SelectContent>
                {markets?.map((m: any) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.marketName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? "Saving..."
                : initialData
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// -----------------------------
// Main Page
// -----------------------------
const SellerShopListPage = () => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [market, setMarket] = useState("all");
  const [shopFormOpen, setShopFormOpen] = useState(false);
  const [editShop, setEditShop] = useState<any>(null);

  const { data: markets } = useMarkets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["shops"],
    queryFn: async () => {
      const res = await axiosInstance.get("/shop");
      return res.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return axiosInstance.delete(`/shop/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["shops"]);
      toast.success("Shop deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete shop");
    },
  });

  // Apply filters + pagination
  const filteredData = useMemo(() => {
    if (!data) return [];
    let shops = data;
    if (market !== "all") {
      shops = shops.filter((shop: any) => shop.marketId === market);
    }
    return shops;
  }, [data, market]);

  const paginatedData = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage) || 1;
  }, [filteredData, itemsPerPage]);

  return (
    <div className="p-4">
      <div className="w-full flex justify-between">
        <h1 className="text-2xl font-bold mb-6">Shops</h1>
        <Button
          onClick={() => {
            setEditShop(null);
            setShopFormOpen(true);
          }}
        >
          Add Shop
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* Market filter */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Market</label>
          <Select onValueChange={setMarket} value={market}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {markets?.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.marketName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Items per Page */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Items per Page</label>
          <Select
            onValueChange={(val) => {
              setItemsPerPage(Number(val));
              setPage(1);
            }}
            value={itemsPerPage.toString()}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              {[1, 5, 10, 20, 50].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading shops.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Shop</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Seller Name</TableHead>
              <TableHead>Seller Telephone</TableHead>
              <TableHead>Seller Email</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((shop: any) => (
              <TableRow key={shop.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={shop.market.marketThumbnail}
                        alt={shop.market.marketName}
                      />
                      <AvatarFallback>PR</AvatarFallback>
                    </Avatar>
                    <span className="font-medium capitalize">
                      {shop.brandName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{shop.market.marketName}</TableCell>
                <TableCell>
                  {shop.seller?.firstName} {shop.seller?.lastName}
                </TableCell>
                <TableCell>{shop.seller?.telephone}</TableCell>
                <TableCell>{shop.seller?.email}</TableCell>
                <TableCell>
                  <Button>Products {"  "} ( {shop.product.length || 0} )</Button>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditShop(shop);
                      setShopFormOpen(true);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        confirm(`Are you sure you want to delete ${shop.brandName}?`)
                      ) {
                        deleteMutation.mutate(shop.id);
                      }
                    }}
                  >
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Pagination */}
      <div  className="flex max-w-full justify-center ">
      <div className="flex justify-between max-w-full w-fit mt-4 gap-4 items-center">
        <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
      </div>

      {/* Form Dialog */}
      <ShopFormDialog
        isOpen={shopFormOpen}
        onClose={() => {
          setShopFormOpen(false);
          setEditShop(null);
        }}
        initialData={editShop}
      />
    </div>
  );
};

export default SellerShopListPage;
