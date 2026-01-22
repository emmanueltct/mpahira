"use client";

import { useState, useEffect, useContext, ChangeEvent } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Minus, Plus, Truck, ShieldCheck, Heart, X } from "lucide-react";
import { Typography, Button as MaterialBtn, IconButton, Tooltip  } from "@mui/material";
import {Card, CardContent} from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { Button } from "@/components/ui/button";
import LoadingSkeloton from "./loadingSkeloton";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

import { useSingleProduct } from "@/hooks/useProducts";
import { useCart } from "@/hooks/userCarts";
import { AuthContext } from "@/context/auth-context";
import Link from "next/link";

export default function SingleProductPage() {
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const { user, isAuthenticated } = useContext(AuthContext)!;
  const isBuyer =
    String(user?.role?.role ?? "").toLowerCase() === "buyer";

  const { addToCart } = useCart({
    enabled: isBuyer && isAuthenticated,
  });

  const {
    data: product,
    isLoading,
    error,
  } = useSingleProduct(productId);

  const [quantity, setQuantity] = useState(1);
  const [inputValue, setInputValue] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [unit, setUnit] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [selectedUnityId, setSelectedUnityId] = useState("");

  /* -------------------- Init default unit -------------------- */
  useEffect(() => {
    if(product?.message) return

    if (!product || product.productUnities.length === 0) return;

    const first = product.productUnities[0];

    setSelectedUnityId(first.id);
    setUnit(first.subUnit?.subUnit ?? "");
    setUnitPrice(first.unitPrice);
    setMinPrice(first.minPrice);
    setMaxPrice(first.maxPrice);
    setQuantity(1);
    setInputValue(1);
  }, [product]);

  /* -------------------- Quantity handlers -------------------- */
  const handleQuantityChange = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      const next = type === "inc" ? prev + 1 : Math.max(1, prev - 1);
      setInputValue(next);
      return next;
    });
  };

  const handleQuantityInput = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value) && value > 0) {
      setQuantity(value);
      setInputValue(value);
    }
  };

  /* -------------------- Price handlers -------------------- */
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!Number.isNaN(value)) {
      setInputValue(value);
      setUnitPrice(value);
    }
  };

  const handlePriceBlur = () => {
    let value = inputValue;
    if (value < minPrice) value = minPrice;
    if (value > maxPrice) value = maxPrice;

    setInputValue(value);
    setUnitPrice(value);
  };

  /* -------------------- Add to cart -------------------- */
  const handleAddToCart = () => {
    if (!product) return;

    const totalPrice =
      unit === "Qty" ? unitPrice : unitPrice * quantity;

    addToCart.mutate({
      items: {
        productId: product.id,
        quantity,
        unit,
        unitPrice,
        totalPrice,
      },
      totalAmount: totalPrice,
    });
  };

  /* -------------------- Guards -------------------- */
  if (isLoading) {
    return (
      <div className="container pt-20">
        <LoadingSkeloton />
      </div>
    );
  }

  if (error || !product) {
    return <p className="text-center">Something went wrong</p>;
  }

   console.log("===================================================productttsts",product.recommendedProducts)
  /* ==================== UI ==================== */
  return (
    <div className="container p-6 mt-16">
      <Link href="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to Products
      </Link>
       {product.message?(
        <>
         <div className="max-w-[95%] mt-6 sm:mt-16 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded relative mx-auto">
        <p className='w-[90%]'>{product.message}</p>
        <button
          className="absolute top-2 right-2 text-yellow-700 hover:text-yellow-900"
        >
          <X size={30} color="red"/>
        </button>
      </div>
        </>
       ):(
      <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Image */}
       
        <div className="flex justify-center">
          <Image
            src={product.productProfile}
            alt={product.engLabel}
            width={500}
            height={350}
            objectFit="cover"
            className="rounded-xl shadow-md w-[500] h-[350]"
          />
        </div>

        {/* Details */}
        <div>
          <span className="text-xs bg-pink-400 px-3 py-2 rounded-full font-bold">
            {product.productName?.product}
          </span>

          <h1 className="text-2xl font-bold mt-2">
            {product.engLabel}
          </h1>

          <p className="text-gray-500 text-sm">
            {product.shopName?.brandName} ~{" "}
            {product.shopName?.market?.marketName}
          </p>

          <p className="mt-4">{product.productDescription}</p>

          {/* Units */}
          <div className="mt-6 flex gap-3 flex-wrap">
            {product.productUnities.map((item) => (
              <MaterialBtn
                key={item.id}
                variant="outlined"
                size="small"
                sx={{
                  color: "black",
                  fontWeight: 600,
                  bgcolor:
                    item.id === selectedUnityId ? "#f472b6" : "",
                }}
                onClick={() => {
                  setSelectedUnityId(item.id);
                  setUnit(item.subUnit?.subUnit ?? "");
                  setUnitPrice(item.unitPrice);
                  setMinPrice(item.minPrice);
                  setMaxPrice(item.maxPrice);
                  setQuantity(1);
                  setInputValue(1);
                }}
              >
                {item.subUnit?.subUnit}
              </MaterialBtn>
            ))}
          </div>

          {/* Quantity / Price */}
          <div className="mt-6">
            {unit === "Qty" ? (
              <>
                <Typography fontWeight="bold">
                  Enter amount ({minPrice} – {maxPrice})
                </Typography>
                <input
                  type="number"
                  value={inputValue}
                  min={minPrice}
                  max={maxPrice}
                  onChange={handlePriceChange}
                  onBlur={handlePriceBlur}
                  className="p-2 border rounded w-full mt-2"
                />
              </>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleQuantityChange("dec")}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>

                <input
                  type="number"
                  value={inputValue}
                  onChange={handleQuantityInput}
                  className="p-2 border rounded w-20 text-center"
                />

                <button onClick={() => handleQuantityChange("inc")}>
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Add to cart */}
          <div className="mt-6 flex gap-4">
            <Button
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="bg-black text-white"
            >
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </Button>

            <button className="border p-3 rounded-lg">
              <Heart size={20} />
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-2 text-sm text-gray-600">
            <div className="flex gap-2">
              <Truck size={16} /> Delivery depends on location
            </div>
            <div className="flex gap-2">
              <ShieldCheck size={16} /> Fast order processing
            </div>
             <div className="flex gap-2">
              <ShieldCheck size={16} />Safe and secure delivery to your location
            </div>
          </div>
          {/* Available Products & Prices */} 
        <div className="flex gap-4 space-x-6">
        <div className="mt-6">
          <h2 className="font-semibold text-gray-800">
            Available Products & Prices
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
            {product?.productUnities?.map((item) => {
              let priceDisplay: string;

              if (item.unitPrice > 0) {
                priceDisplay = `${item.unitPrice} RWF`;
              } else if (item.minPrice > 0 && item.maxPrice > 0) {
                priceDisplay = `Price Range: ${item.minPrice} - ${item.maxPrice} RWF`;
              } else if (item.minPrice > 0) {
                priceDisplay = `Minimum Amount: ${item.minPrice} RWF`;
              } else {
                priceDisplay = "Contact for price";
              }

              return (
                <li key={item.id}>
                  {item.subUnit?.subUnit ?? "Unit"}: {priceDisplay}
                </li>
              );
            })}
          </ul>
        </div>
          
        <div className="mt-6"> 
          <h2 className="font-semibold text-gray-800">Location for Features</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 mt-2"> 
            <li>{product?.shopName?.market?.province}</li> 
              <li>{product?.shopName?.market?.district}</li>
              <li>{product?.shopName?.market?.sector}</li> 
          </ul>
        </div>
      </div>

        </div> 

                  {/* Location for Features */}
         
        </div>
          {/* Recommended Products */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
       
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-center">
            {product?.recommendedProducts.map((p) => (
              <Card key={p.id} className="shadow-xs">
                <CardContent className="p-4 flex flex-col items-center justify-center ">
                  <Image
                    src={p.recommendedProduct.productProfile}
                    alt={p.recommendedProduct.engLabel}
                    width={250}
                    height={250}
                    className="rounded-xl object-cover mb-3"
                  />
                  <h3 className="text-lg font-medium">{p.recommendedProduct.engLabel}</h3>
                  
                   <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleAddToCart}
                      disabled={addToCart.isPending}
                      className="text-black bg-pink-500"
                    >
                      {addToCart.isPending ? "Adding..." : "Details"}
                    </Button>
                    <Tooltip title="Add To Cart">
                    <button className="border p-1  rounded-lg">
                    <IconButton  size="small"color="primary" >
                        <ShoppingCartOutlinedIcon />
                    </IconButton>
                    </button>
                    </Tooltip>
                  <Tooltip title="Wish List">
                    <button className="border p-3 rounded-lg">
                      <Heart size={20} />
                    </button>
                  </Tooltip>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
       
      </section>

      { /* Reviews */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6  justify-center">
            
             <div className="w-full sm:w-1/3 ">
              <ReviewForm productId={product.id} />
            </div>
            <div className="w-full sm:w-2/3 p-3">
              <ReviewList productReview={product.productReview} />
            </div>
          </div>
        </>
        )}
    </div>
  );
}
