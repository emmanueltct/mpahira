'use client';
import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

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
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import ImageCard from "../ImageCard";

const fetchProducts = async (page: number) => {
  const { data } = await axiosInstance.get("/shop-products", { params: { page } });
  return data;
};

export default function AdminProductListPage() {
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Filters
  const [productFilter, setProductFilter] = useState("");
  const [shopFilter, setShopFilter] = useState("");
  const [sellerFilter, setSellerFilter] = useState("");
  const [marketFilter, setMarketFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["products", page],
    queryFn: () => fetchProducts(page),
    keepPreviousData: true,
  });

  // Apply filters
  const filteredData = data?.data?.filter((product: any) => {
    const productName = product.productName.product.toLowerCase();
    const shopName = product.shopName.brandName.toLowerCase();
    const sellerName = `${product.shopName.seller.firstName} ${product.shopName.seller.lastName}`.toLowerCase();
    const marketName = product.shopName.market.marketName.toLowerCase();

    return (
      productName.includes(productFilter.toLowerCase()) &&
      shopName.includes(shopFilter.toLowerCase()) &&
      sellerName.includes(sellerFilter.toLowerCase()) &&
      marketName.includes(marketFilter.toLowerCase())
    );
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Products ({filteredData?.length ?? 0})
        </h1>
        <Button asChild>
          <Link href="/seller/products/Add">Add Product</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Product"
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by Shop"
          value={shopFilter}
          onChange={(e) => setShopFilter(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by Seller"
          value={sellerFilter}
          onChange={(e) => setSellerFilter(e.target.value)}
          className="border rounded p-2"
        />
        <input
          type="text"
          placeholder="Filter by Market"
          value={marketFilter}
          onChange={(e) => setMarketFilter(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Responsive Table for large screens */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-lg shadow-sm border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Kinyarwanda</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell colSpan={7}>
                      <div className="h-6 w-full bg-gray-200 animate-pulse rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredData?.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={product.productProfile} alt={product.engLabel} />
                          <AvatarFallback>PR</AvatarFallback>
                        </Avatar>
                        <span className="font-medium capitalize">{product.engLabel}</span>
                      </div>
                    </TableCell>
                    <TableCell>{product.kinyLabel}</TableCell>
                    <TableCell>{product.productName.product}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{product.productDescription}</TableCell>
                    <TableCell className="capitalize">{product.shopName.brandName}</TableCell>
                    <TableCell className="capitalize">
                      {product.shopName.seller.firstName} {product.shopName.seller.lastName}
                    </TableCell>
                    <TableCell className="capitalize">{product.shopName.market.marketName}</TableCell>
                    <TableCell className="space-x-1">
                      {product.isAvailable ? (
                        <Badge variant="default">Available</Badge>
                      ) : (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    
                    </TableCell>
                    <TableCell className="space-x-1">  {product.isExpires && <Badge variant="outline">Expires Soon</Badge>}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="destructive">Delete</Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setSelectedProduct(product)}
                          >
                            View More
                          </Button>
                        </DialogTrigger>
                        {selectedProduct?.id === product.id && (
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>{product.productName.product}</DialogTitle>
                              <ImageCard product={product}/>
                              <DialogDescription>
                                <p><strong>Description:</strong> {product.productDescription}</p>
                                <p><strong>Shop:</strong> {product.shopName.brandName}</p>
                                <p><strong>Seller:</strong> {product.shopName.seller.firstName} {product.shopName.seller.lastName}</p>
                                <p><strong>Market:</strong> {product.shopName.market.marketName}</p>
                                <p><strong>Status:</strong> {product.isAvailable ? "Available" : "Unavailable"}</p>
                                {product.isExpires && <p><strong>Expires Soon</strong></p>}
                              </DialogDescription>
                            </DialogHeader>
                          </DialogContent>
                        )}
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Card layout for small screens */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {!isLoading && filteredData?.map((product: any) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm space-y-3">
            <ImageCard product={product}/>
            <div>
              <h3 className="text-lg font-semibold capitalize">{product.productName.product}</h3>
              <p className="text-sm text-muted-foreground">{product.productDescription}</p>
              <p className="text-sm"><strong>Shop:</strong> {product.shopName.brandName}</p>
              <p className="text-sm"><strong>Seller:</strong> {product.shopName.seller.firstName} {product.shopName.seller.lastName}</p>
              <p className="text-sm"><strong>Market:</strong> {product.shopName.market.marketName}</p>
              <p className="text-sm">
                <strong>Status:</strong> {product.isAvailable ? (
                  <span className="text-green-600 font-medium">Available</span>
                ) : (
                  <span className="text-red-600 font-medium">Unavailable</span>
                )}
                {product.isExpires && <span className="ml-1 text-yellow-600">(Expires Soon)</span>}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {data?.totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent className="justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="cursor-pointer"
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-4 text-sm">
                Page {page} of {data.totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, data.totalPages))}
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
