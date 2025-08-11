"use client";

import Image from "next/image";

export default function ImageCard({ product }: { product: any }) {
  console.log("--------------------------------------------",product)
  return (
    <div className="w-full max-w-sm rounded shadow bg-white">
     {product.productProfile && (
        <Image
            src={
                product.productProfile.startsWith("http")
                    ? product.productProfile
                    : `/${product.productProfile}`
                } // Ensures spaces and characters are safe
            alt={product.productName.product}
            width={400}
            height={160}
            className="w-full h-40 object-cover rounded"
        />
        )}
        
    </div>
  );
}
