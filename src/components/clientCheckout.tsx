"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";



// Hooks & Types
import { useCart } from "@/hooks/userCarts";
import { CartItem } from "@/types/cart";

// Components
import CartDetails from "./cartDetails";
import DeliveryLocationCard from "./DeliverLocationCard";
import CheckoutPaymentCard from "./CheckoutPaymentCard";

const fetchCarts = async () => {
  const { data } = await axiosInstance.get("/carts");
  return data;
};

export default function ClientCheckout() {
  const [page] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [layout] = useState<"grid" | "list">("list");
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [cartProductDetails, setCartProductDetails] = useState<CartItem | null>(null);
  const [isCartProductDetailsModalOpen, setIsCartProductDetailsModalOpen] = useState(false);

  const { updateCartItem} = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart", page],
    queryFn: fetchCarts,
    keepPreviousData: true,
  });

  const cartItems = data?.carts?.[0]?.items || [];

  useEffect(() => {
    if (cartItems.length > 0) {
      const initialQuantities: Record<string, number> = {};
      cartItems.forEach((item: any) => {
        initialQuantities[item.productId] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cartItems]);

  const handleChange = (productId: string, type: "inc" | "dec") => {
    setQuantities((prev) => {
      const newQty = type === "inc" ? prev[productId] + 1 : Math.max(1, prev[productId] - 1);
      updateCartItem.mutate({ productId, quantity: newQty });
      return { ...prev, [productId]: newQty };
    });
  };

  const handleBlur = (productId: string, quantity: number, originalQty: number) => {
    if (quantity !== originalQty) {
      updateCartItem.mutate({ productId, quantity });
    }
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center text-red-600">
        Error loading carts. Please try again later.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 sm:py-23">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Total Item ({cartItems.length})</h1>
        <div className="flex gap-2">
         
          <Button asChild>
            <Link href="/products">Back to cart</Link>
          </Button>
        </div>
      </div>

      {/* Modal for delivery location
      <DeliveryLocationCard isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}

      {/* Loading / Empty States */}
     
      {!isLoading && cartItems.length === 0 && (
        <div className="border rounded-lg p-8 shadow-sm space-y-3 w-1/2 mx-auto text-center">
          You haven't added any items to your cart yet. Start shopping by adding your first product!
        </div>
      )}

      {/* Product Details Modal */}
      {cartProductDetails && (
        <CartDetails
          productData={cartProductDetails}
          isCartProductDetailsModalOpen={isCartProductDetailsModalOpen}
          onClose={() => setIsCartProductDetailsModalOpen(false)}
        />
      )}

      {/* Cart Layout */}
      {!isLoading && cartItems.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="w-full flex flex-col-reverse sm:flex-row mx-auto gap-4">
            <div className=" w-full  sm:w-1/3">

           
                <div className="block overflow-x-auto rounded-lg shadow-sm border mb-8">
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

            {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={7}>
                        <div className="h-6 w-full bg-gray-200 animate-pulse rounded" />
                      </TableCell>
                    </TableRow>
                  ))
              :cartItems.map((product: any) => (
                        <TableRow key={product.productId}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage
                                  src={product.ShopProduct.productProfile}
                                  alt={product.ShopProduct.productName.product}
                                />
                                <AvatarFallback>PR</AvatarFallback>
                              </Avatar>
                              <span className="font-medium capitalize">
                                {product.ShopProduct.productName.product}
                              </span>
                            </div>
                          </TableCell>

                          {/* Quantity Controls */}
                          <TableCell>
                            {product.quantity}
                          </TableCell>
                          <TableCell>{product.unit}</TableCell>
                          <TableCell>{product.unitPrice}</TableCell>
                          <TableCell>{product.totalPrice}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Summary + Actions with sticky behavior */}
                  <div className=" bg-white p-4 shadow-lg mt-3 pr-8 sm:pr-10">
                    <div className="space-y-3 text-gray-700 text-sm sm:text-md font-semibold">
                      <div className="flex justify-between border-b pb-1">
                        <span>Items Total:</span>
                        <span>{data?.carts?.[0].totalAmount}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Transport Cost:</span>
                        <span>{data?.carts?.[0].transportCost}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span>Service Charges:</span>
                        <span>{data?.carts?.[0].serviceCost}</span>
                      </div>
                      <div className="flex justify-between pt-3 text-xl font-extrabold text-amber-500">
                        <span>Grand Total:</span>
                        <span>{data?.carts?.[0].generalTotal}</span>
                      </div>
                    </div>
                    </div>
                </div>
            </div>
              

              <div className="w-full  sm:w-1/3 mx-auto">
                <div className="w-full mx-auto space-y-4 ">
                  <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left  w-[80%] mx-auto">
                    Transport cost depends on the delivery location and its distance from the market. Changing the location will update the transport cost and affect the total payment.
                  </p>

                  {data?.carts?.[0].location ? (
                    <div className="w-full sm:w-4/5 mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-3 border border-amber-200">
                      <h2 className="text-lg font-semibold border-b-2 border-amber-400 pb-2 mb-3">
                        <span className="text-amber-500">📍</span> Client Delivery Location
                      </h2>

                      <div className="flex flex-col gap-1 text-gray-700 text-sm sm:text-base">
                        <span><strong>Estimated Distance:</strong> {data?.carts?.[0].deliveryDistance}</span>
                        <span><strong>Street Number:</strong> {data?.carts?.[0].location.streetNumber}</span>
                        <span><strong>Nearest Landmark:</strong> {data?.carts?.[0].location.nearestLandmark}</span>
                        <span><strong>Details:</strong> {data?.carts?.[0].location.locationDescription}</span>
                      </div>

                      <Button onClick={() => setIsModalOpen(true)} className="self-start mt-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md">
                        Change Location 
                      </Button> 
                    </div>
                  ) : (
                    <div className="w-full sm:w-4/5 mx-auto bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 border border-amber-200">
                      <h2 className="text-lg font-semibold border-b-2 border-amber-400 pb-2 mb-3 w-full text-center sm:text-left">
                        <span className="text-amber-500">📍</span> Client Delivery Location
                      </h2>

                      <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                        No delivery location set yet. Click below to add one.
                      </p>

                      <Button className="bg-amber-400 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md" >
                        Set Location 
                      </Button>
                    </div>
                  )}

                  {/* Location modal */}
                  <DeliveryLocationCard isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
                </div>

              </div>
              <div className="w-full  sm:w-1/3" >
                  <CheckoutPaymentCard itemTotal={data?.carts?.[0].totalAmount} transportCost={data?.carts?.[0].transportCost} serviceCost={data?.carts?.[0].serviceCost} generalTotal={data?.carts?.[0].generalTotal} telephone={data?.carts?.[0].buyer.telephone}/>
              </div>
            </div>

        </>
      )}
    </div>
  );
}
