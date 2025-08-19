import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "./ui/button";

type OrderDetailsProps = {
  itemsData: any;
  isOrderItemsDetailOpen: boolean;
  onClose: () => void;
};

export const OrderItemsDetails: React.FC<OrderDetailsProps> = ({
  itemsData,
  isOrderItemsDetailOpen,
  onClose,
}) => {
  const items =
    itemsData && Array.isArray(itemsData.items) ? itemsData.items : [];

  return (
    <Dialog open={isOrderItemsDetailOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto w-[95%] max-h-2/3 overflow-auto">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              {/* Order meta info */}
              <div className="flex flex-col gap-2 border-b-2 border-b-amber-100 pb-4">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span suppressHydrationWarning>
                    {new Date(itemsData.createdAt)
                      .toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                      .replace(",", "")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span>{itemsData.paymentTransaction}</span>
                </div>
              </div>

              {/* Status info */}
              <div className="flex justify-between border-b-2 border-b-amber-100 pb-4">
                <div className="flex justify-evenly w-1/2">
                  <strong>Payment:</strong>
                  <span>{itemsData.paymentStatus}</span>
                </div>
                <div className="flex justify-evenly w-1/2">
                  <strong>Delivery:</strong>
                  <span>{itemsData.orderProcessingStatus}</span>
                </div>
              </div>

              {/* Table */}
              {items.length > 0 && (
                <div className="block overflow-x-auto rounded-lg shadow-sm border mb-8   ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((product: any) => (
                        <TableRow key={product.productId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={product.ShopProduct.productProfile}
                                  alt={
                                    product.ShopProduct.productName.product
                                  }
                                />
                                <AvatarFallback>PR</AvatarFallback>
                              </Avatar>
                              <span className="font-medium capitalize">
                                {product.ShopProduct.productName.product}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>{product.unitPrice}</TableCell>
                          <TableCell>{product.totalPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Summary */}
                  <div className="bg-white p-4 shadow-lg mt-3 pr-8 sm:pr-10">
                    <div className="space-y-3 text-gray-700 text-sm sm:text-md font-semibold">
                      <div className="flex justify-between border-b pb-1">
                        <span>Items Total:</span>
                        <span>{itemsData.totalAmount}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Service Charges:</span>
                        <span>{itemsData.serviceCost}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
