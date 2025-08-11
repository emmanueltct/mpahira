"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CartItem } from "@/types/cart";
import { Button } from "./ui/button";
import DeliveryLocationCard from "./DeliverLocationCard";
import Link from "next/link";

interface Location {
  latitude: number;
  longitude: number;
  streetNumber?: string;
  nearestLandmark?: string;
  locationDescription?: string;
}

interface CartData {
  items: CartItem[];
  totalAmount: number;
  serviceCost: number;
  transportCost: number;
  generalTotal: number;
  userId: string;
  location: Location;
  deliveryDistance: string;
}

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card" },
  { id: "mobile_money", label: "Mobile Money" },
  { id: "paypal", label: "PayPal" },
];

export const ClientCheckout = () => {

  const [cart, setCart] = useState(null);

  useEffect(() => {
    const cartJson = localStorage.getItem("carts");
    if (cartJson) {
      setCart(JSON.parse(cartJson));
    }
  }, []);

  // cartData depends on cart state after hydration
  const cartData = cart ? cart[0] : null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);

  if (!cartData) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600 font-semibold">
        No cart data available.
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-10 space-y-14 bg-gray-50 ">
      {/* Delivery Location + Payment Method Section */}
        <h1 className="w-full text-2xl text-center  capitalize border-b-2 border-b-amber pb-2">Client Checkout Page</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Delivery Location */}
        <div className="bg-white rounded-3xl shadow-xlp-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-5 border-b pb-3 border-amber-400">
            Delivery Location
          </h2>

          {cartData.location ? (
            <div className="text-gray-700 space-y-4 text-sm sm:text-base flex-grow">
              <p>
                <strong>Estimated Distance:</strong> {cartData.deliveryDistance}
              </p>
              <p>
                <strong>Street Number:</strong> {cartData.location.streetNumber}
              </p>
              <p>
                <strong>Nearest Landmark:</strong> {cartData.location.nearestLandmark}
              </p>
              <p>
                <strong>Details:</strong> {cartData.location.locationDescription}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base mb-4 flex-grow">
              No delivery location set. Please add one.
            </p>
          )}

          <Button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 bg-amber-400 hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md w-full sm:w-auto self-start"
          >
            {cartData.location ? "Change Location" : "Set Location"}
          </Button>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          <h2 className="text-2xl font-bold mb-6 border-b pb-3 border-amber-400">
            Payment Method
          </h2>

          <form className="space-y-5 text-gray-800 text-base font-medium flex-grow">
            {paymentMethods.map(({ id, label }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex items-center gap-4 cursor-pointer"
              >
                <input
                  type="radio"
                  id={id}
                  name="paymentMethod"
                  value={id}
                  checked={selectedPayment === id}
                  onChange={() => setSelectedPayment(id)}
                  className="form-radio h-6 w-6 text-amber-400"
                />
                <span>{label}</span>
              </label>
            ))}
          </form>

          {/* <Button
            onClick={() => alert(`Payment method selected: ${selectedPayment}`)}
            className="mt-8 bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold shadow-md w-full"
          >
            Proceed to Pay
          </Button> */}
        </div>
      </section>

      {/* Products + Order Summary Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Products List: span 2 cols on large */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 overflow-x-auto">
          <h2 className="text-3xl font-extrabold mb-6 border-b pb-3 border-amber-400">
            Your Products
          </h2>

          <Table className="min-w-[600px] sm:min-w-full text-sm sm:text-base">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Product</TableHead>
                <TableHead className="text-left hidden sm:table-cell">Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartData.items.map((item) => (
                <TableRow
                  key={item.productId}
                  className="border-t hover:bg-amber-50 transition-colors"
                >
                  <TableCell className="py-3">{item.productName?.product}</TableCell>
                  <TableCell className="hidden sm:table-cell py-3">
                    {item.productName?.unit}
                  </TableCell>
                  <TableCell className="text-right py-3">
                    {item.unitPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right py-3">{item.quantity}</TableCell>
                  <TableCell className="text-right py-3 font-semibold">
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col">
          <h2 className="text-3xl font-bold mb-6 border-b pb-3 border-amber-400 text-center">
            Order Summary
          </h2>

          <div className="space-y-5 text-gray-700 text-lg font-semibold flex-grow">
            <div className="flex justify-between border-b pb-3">
              <span>Items Total:</span>
              <span>{cartData.totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span>Transport Cost:</span>
              <span>{cartData.transportCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span>Service Charges:</span>
              <span>{cartData.serviceCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 text-2xl font-extrabold text-amber-500">
              <span>Grand Total:</span>
              <span>{cartData.generalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
            <Button className="bg-amber-400 hover:bg-amber-500 text-white py-3 rounded-lg font-semibold shadow-md flex-1">
              Proceed to Pay
            </Button>
            <Link href={"/products"} className="bg-transparent border-2 border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-white py-1 rounded-lg font-semibold flex-1 text-center">
              back to product
            </Link>
          </div>
        </div>
      </section>

      {/* Delivery Location Modal */}
      <DeliveryLocationCard
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
