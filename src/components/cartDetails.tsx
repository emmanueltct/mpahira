import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CartItem } from '@/types/cart';
import ImageCard from '@/components/ImageCard'; // Adjust path if needed

type CartDetailsProps = {
  productData: CartItem;
  isCartProductDetailsModalOpen: boolean;
  onClose: () => void;
};

const CartDetails: React.FC<CartDetailsProps> = ({
  productData,
  isCartProductDetailsModalOpen,
  onClose
}) => {
  const product = productData.ShopProduct;


  return (
    <Dialog open={isCartProductDetailsModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>

             <div className='flex w-full justify-between py-4 border-b-2 border-b-amber-100'>
                {product.productName.product}
            </div>
          </DialogTitle>
          <ImageCard product={product} />
          <DialogDescription>
            <div className='flex w-full justify-between py-4 border-b-2 border-b-amber-100'>
                <p><strong>Quantity:</strong> {productData.quantity} {productData.unit} </p>
                <p><strong>Unit Price:</strong> {productData.unitPrice}</p>
                <p><strong>Total:</strong> {productData.totalPrice}</p>
            </div>

             <div className='flex w-full justify-between py-4 border-b-2 border-b-amber-100'>
                {product.productDescription}
            </div>

             <div className='flex w-full justify-between py-4 border-b-2 border-b-amber-100'>
                <p><strong>Shop:</strong> {product.shopName.brandName}</p>  /
                <p><strong>Market:</strong> {product.shopName.market.marketName}</p>
            </div>
             
            
           
          </DialogDescription>
          <DialogFooter>
            <div className='flex w-full justify-between py-4 text-sm font-light italic '>
             <p><b>Status:</b> {product.isAvailable ? "Available" : "Unavailable"}</p>
            {product.isExpires && <p><b>Expiry Date: {product.expireDate}</b></p>}
             </div>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CartDetails;
