

import ClientCheckout from "@/components/clientCheckout";
import DefaultLayout from "@/components/defaultLayout";

export default function Checkout() {
   
    
  return (
    <DefaultLayout>
     <div className="flex flex-col pt-20 container mx-auto">
      {/* <h1 className="flex justify-center">Checkout</h1> */}
      <ClientCheckout  /> {/* Client component */}
    </div>
  </DefaultLayout>
  );
}
