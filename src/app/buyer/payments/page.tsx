

import ClientCheckout from "@/components/clientCheckout";

export default function Checkout() {
   
    
  return (
     <div className="flex flex-col pt-20 container mx-auto">
      {/* <h1 className="flex justify-center">Checkout</h1> */}
      <ClientCheckout  /> {/* Client component */}
    </div>
  );
}
