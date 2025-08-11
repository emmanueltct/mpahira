
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FaPlus, FaMinus, FaTrash, FaComment, FaPlusCircle } from 'react-icons/fa';
import { useCart } from '@/hooks/userCarts';
import { CartItem } from '@/types/cart';
import { Button } from './ui/button';
import DeliveryLocationCard from './DeliverLocationCard';
import CartDetails from './cartDetails'; // ✅ Use PascalCase
import { link } from 'fs';
import Link from 'next/link';

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

export const CartTable = ({ cartData }: { cartData: CartData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iscartProductDetailsModalOpen, setIscartProductDetailsModalOpen] = useState(false);
  const [cartProductDetails, setCartProductDetails] = useState<CartItem | null>(null);
  const { updateCartItem, removeFromCart } = useCart();

  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    cartData.items.forEach((item) => {
      initial[item.productId] = item.quantity;
    });
    return initial;
  });

  const handleChange = (productId: string, type: 'inc' | 'dec') => {
    setQuantities((prev) => {
      const newQty = type === 'inc' ? prev[productId] + 1 : Math.max(1, prev[productId] - 1);
      updateCartItem.mutate({ productId, quantity: newQty });
      return { ...prev, [productId]: newQty };
    });
  };

  const handleBlur = (productId: string, quantity: number, originalQty: number) => {
    if (quantity !== originalQty) {
      updateCartItem.mutate({ productId, quantity });
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      {cartData.location ? (
        <div className="w-full sm:w-[80%] mx-auto bg-white rounded-2xl shadow-2xl p-4 text-sm leading-8 flex flex-col">
          <h1 className="w-full border-b-2 pb-2 mb-2 border-amber-400">Client delivery Location</h1>
          <span>Estimated Distance: {cartData.deliveryDistance}</span>
          <span>Street Number: {cartData.location.streetNumber}</span>
          <span>Nearest Landmark: {cartData.location.nearestLandmark}</span>
          <span>Details: {cartData.location.locationDescription}</span>
          <Button className="max-w-[150px]" onClick={() => setIsModalOpen(true)}>Change location</Button>
        </div>
      ) : (
        <div className="w-full sm:w-[80%] mx-auto bg-white rounded-2xl shadow-2xl p-4 text-sm leading-8">
          <h1 className="w-full border-b-2 pb-2 mb-2 border-amber-400">Client delivery Location</h1>
          <span>No delivery location set? Click here to add one.</span>
          <Button className="max-w-[150px]" onClick={() => setIsModalOpen(true)}>Set location</Button>
        </div>
      )}

      {/* Location modal */}
      <DeliveryLocationCard isModalOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Product details modal */}
      {cartProductDetails && (
        <CartDetails
          productData={cartProductDetails}
          isCartProductDetailsModalOpen={iscartProductDetailsModalOpen}
          onClose={() => setIscartProductDetailsModalOpen(false)}
        />
      )}

      {/* Cart table */}
      <div className="w-full sm:w-[80%] mx-auto bg-white rounded-2xl mt-2 shadow-2xl p-6 text-base leading-8">
        <Table className="w-full mt-4 text-sm">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="hidden md:table-cell">More</TableHead>
              <TableHead className="hidden md:table-cell">Comments</TableHead>
              <TableHead className="hidden md:table-cell">Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartData.items.map((item) => (
              <TableRow key={item.productId}>
                <TableCell>{item.productName?.product}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <FaMinus
                    className={`cursor-pointer ${quantities[item.productId] <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                    onClick={() => handleChange(item.productId, 'dec')}
                  />
                  <input
                    type="number"
                    min={1}
                    value={quantities[item.productId]}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setQuantities((prev) => ({ ...prev, [item.productId]: qty }));
                    }}
                    onBlur={() => handleBlur(item.productId, quantities[item.productId], item.quantity)}
                    className="p-2 w-13 sm:w-20 border rounded text-center"
                  />
                  <FaPlus className="cursor-pointer" onClick={() => handleChange(item.productId, 'inc')} />
                </TableCell>
                <TableCell>{item.productName?.unit}</TableCell>
                <TableCell>{item.unitPrice}</TableCell>
                <TableCell>{item.unitPrice * quantities[item.productId]}</TableCell>
                <TableCell>
                  <FaPlusCircle
                    className="text-blue-500 cursor-pointer"
                    size={18}
                    onClick={() => {
                      setCartProductDetails(JSON.parse(JSON.stringify(item))); // store plain object
                      setIscartProductDetailsModalOpen(true);
                    }}
                  />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <FaComment className="text-blue-500 cursor-pointer" size={18} />
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <FaTrash
                    size={18}
                    onClick={() => removeFromCart.mutate(item.productId)}
                    className="text-red-600 cursor-pointer"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Totals */}
        <div className="flex w-full sm:w-[80%] justify-between">
          <Link  href='/buyer/payments' className="mt-4 uppercase py-2 px-4 rounded-lg bg-pink-500 border-2 border-transparent text-white sm:text-md text-sm mr-4 hover:bg-pink-400">
            Place Order
          </Link>
          <Button className="mt-4 uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-pink-500 text-pink-500 dark:text-white hover:bg-pink-500 hover:text-white sm:text-md text-sm">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
