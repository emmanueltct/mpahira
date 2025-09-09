"use client";

import React, { useState, useMemo } from "react";
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProductsCategory } from "@/hooks/useProductsCategories";
import { useMarkets } from "@/hooks/useMarket";
import ImageCard from "../ImageCard";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import ProductPricingModal from "./productPricing";


const ProductsPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [category, setCategory] = useState("all");
  const [market, setMarket] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [expires, setExpires] = useState("all");
  const [productId,setProductId]=useState("")
  const [isOpen,setIsOpen]=useState(false);
  const [subUnits, setsubUnits]=useState([])

  const { data: categories } = useProductsCategory();
  const { data: markets } = useMarkets();

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", page, itemsPerPage, category, market, availability, expires],
    queryFn: async () => {
      const res = await axiosInstance.get("/shop-products", {
        params: { page, limit:itemsPerPage, category, market, availability, expires },
      });
      return res.data;
    },
  });

  const totalPages = useMemo(() => (data?.total ? Math.ceil(data.total / itemsPerPage) : 1), [data, itemsPerPage]);

  return (
    <div className="p-4">
     
        <div className="w-full flex justify-between">
                <h1 className="text-2xl font-bold mb-6">Products</h1>
                <Button><Link  href="/seller/products/Add">Add product</Link></Button>
          </div>
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Category</label>
          <Select onValueChange={setCategory} defaultValue={category}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>{cat.product}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Market</label>
          <Select onValueChange={setMarket} defaultValue={market}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Market" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {markets?.map((m: any) => (
                <SelectItem key={m.id} value={m.id}>{m.marketName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Availability</label>
          <Select onValueChange={setAvailability} defaultValue={availability}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Not Available">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Expires</label>
          <Select onValueChange={setExpires} defaultValue={expires}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Expires" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Expired</SelectItem>
              <SelectItem value="false">Not Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Items per Page</label>
          <Select onValueChange={(val) => setItemsPerPage(Number(val))} defaultValue={itemsPerPage.toString()}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((num) => (
                <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ProductPricingModal  productId={productId}  isOpen={isOpen} onClose={()=>setIsOpen(false)} productUnities={subUnits} />
      {/* Table */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading products.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Kinyarwanda</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Shop</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((product: any) => (
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
                <TableCell className="space-x-1"> {product.isExpires && <Badge variant="secondary">Expires Soon</Badge>}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {setIsOpen(true);setProductId(product.id);setsubUnits(product.productUnities)}}
                      >
                       Unit Prices
                  </Button>
                  <Button size="sm" variant="outline">
                     <Link
                      href={`/seller/products/${product.id}/edit`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </Button>
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
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <Button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>Previous</Button>
        <span>Page {page} of {totalPages}</span>
        <Button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default ProductsPage;
