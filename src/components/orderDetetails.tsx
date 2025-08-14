import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

type OrderDetailsProps = {
  itemsData: any;
  isOrderDetailOpen: boolean;
  onClose: () => void;
};

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  itemsData,
  isOrderDetailOpen,
  onClose,
}) => {
  const items =
    itemsData && Array.isArray(itemsData.items) ? itemsData.items : [];
  const count = items.length;

  return (
    <Dialog open={isOrderDetailOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto w-[95%]">
        <DialogHeader>
          {/* Keep title clean */}
          <DialogTitle>Order Summary</DialogTitle>

          {/* Move meta info to description */}
          <DialogDescription asChild>
            <div className="flex flex-col gap-4">
              {/* Date & Reference */}
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

              {/* Payment & Delivery */}
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

              {/* Amount Details */}
              <div className="flex justify-between border-b-2 border-b-amber-100 pb-4">
                <p>
                  <strong>Paid Amount:</strong> {itemsData.paidAmount}
                </p>
                <p>
                  <strong>General Total:</strong> {itemsData.generalTotal}
                </p>
                <p>
                  <strong>Refund:</strong> {itemsData.refundAmount}
                </p>
              </div>

              <div className="flex justify-between border-b-2 border-b-amber-100 pb-4">
                <p>
                  <strong>Items:</strong> {itemsData.totalAmount}
                </p>
                <p>
                  <strong>Service:</strong> {itemsData.serviceCost}
                </p>
                <p>
                  <strong>Transport:</strong> {itemsData.transportCost}
                </p>
              </div>

              {/* Counts */}
              <div className="flex justify-between border-b-2 border-b-amber-100 pb-4">
                <p>
                  <strong>Items ({count})</strong>
                </p>
                <p>
                  <strong>Comments ({count})</strong>
                </p>
                <p>
                  <strong>Rating ({count})</strong>
                </p>
              </div>

              {/* Address Info */}
              <div className="flex justify-between border-b-2 border-b-amber-100 pb-4">
                <p>Street Number ({count})</p>
                <p>Nearest Landmark ({count})</p>
              </div>

              {/* Comments */}
              <div className="pb-4">Comments</div>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Footer now only for actions */}
        <DialogFooter className="flex justify-between text-sm font-light italic">
          <Button size="sm">Add comments</Button>
          <Button>Rating</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
