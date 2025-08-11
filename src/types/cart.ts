export type CartItem = {
  productId: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  productName?:any
};

export type Cart = {
  items: CartItem[];
  totalAmount: number;
};