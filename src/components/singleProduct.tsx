"use client";

import { useState, useEffect, useContext } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Truck, ShieldCheck, Heart } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSingleProduct } from "@/hooks/useProducts";
import LoadingSkeloton from "./loadingSkeloton";
import { useCart } from "@/hooks/userCarts";
import { Typography , Button as MaterialBtn} from "@mui/material";
import { AuthContext } from "@/context/auth-context";

export default function SingleProductPage() {
  const { id } = useParams();
  const productId = id as string;

  const [quantity, setQuantity] = useState<number>(1);
  const [inputValue, setInputValue] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [unit, setUnit] = useState<string>("");
  const [minPrice, setMinPrice]=useState(0);
  const [maxPrice, setMaxPrice]=useState(0);
  const[isSelectedProduct, setIsSelectedProduct]=useState<string>("")
  const [total, setTotal] = useState<number>(0);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


   const {user, isAuthenticated } = useContext(AuthContext)!;
    
    const isBuyer = String(user?.role.role || "").toLowerCase() === "buyer";

    const { addToCart } = useCart({
    enabled: isBuyer && isAuthenticated,
  });

  const { data: product, isLoading, error } = useSingleProduct(productId);

  // Fetch recommended products and reviews
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [productsRes, reviewsRes] = await Promise.all([
  //         axios.get("/api/recommended-products"),
  //         axios.get("/api/reviews"),
  //       ]);
  //       setRecommendedProducts(productsRes.data);
  //       setReviews(reviewsRes.data);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  useEffect(()=>{
   
    if(!isLoading){
   
      setUnitPrice(product?.productUnities[0].unitPrice);
      setMaxPrice( product?.productUnities[0].maxPrice)
      setMinPrice( product?.productUnities[0].minPrice)
      setUnit( product?.productUnities[0].subUnit.subUnit)
      setIsSelectedProduct(product?.productUnities[0].id)
    }
  },[product])
  // Quantity change handlers
  const handleChange = (type: "inc" | "dec") => {
    setQuantity((prev) => {
      const newQty = type === "inc" ? prev + 1 : Math.max(1, prev - 1);
      setInputValue(newQty);
      return newQty;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setInputValue(value);

    const parsedValue = value;
    if (!isNaN(parsedValue) && parsedValue > 0) {
      setQuantity(parsedValue);
    }
  };

  const handleBlur = () => {
    const parsedValue = inputValue;
    if (isNaN(parsedValue) || parsedValue <= 0) {
      setQuantity(1);
      setInputValue(1);
    } else {
      setQuantity(parsedValue);
      setInputValue(parsedValue);
    }
  };

  // Price input change
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const value = Number(e.target.value);

    const inputValue=value;
    if (unit === "Qty") {
      setInputValue(inputValue); // allow user input when unit is Qty
    } else {
      setMinPrice(inputValue); // update minPrice if unit isn’t Qty
    }
    setInputValue(inputValue);
    setUnitPrice(inputValue);
  };


  const priceOnBlur=(e: React.ChangeEvent<HTMLInputElement>)=>{

    let value2= Number(e.target.value);
    if (value2 < minPrice) value2 = minPrice;
    if (value2 > maxPrice) value2 = maxPrice;

    const parsedValue = inputValue;
    if (isNaN(parsedValue) || parsedValue <= minPrice) {
      setQuantity(1);
      setInputValue(minPrice);
    } else {
      setQuantity(1);
      setUnitPrice(parsedValue)
      setInputValue(parsedValue);
    }
  
  }
  

  // Add to cart handler
  const handleAddToCart = () => {
    if (!product) return;

    const totalPrice = unitPrice > 0 ? unitPrice * quantity : unitPrice;

    const item = {
      items: {
        productId,
        quantity: Number(quantity),
        unit: unit,
        unitPrice: unitPrice,
        totalPrice: totalPrice,
      },
      totalAmount: totalPrice,
    };

    addToCart.mutate(item);
  };

  // if (isLoading || loading) return <div className="container pt-20"><LoadingSkeloton /></div>;
  if (isLoading ) return <div className="container pt-20"><LoadingSkeloton /></div>;
  if (error) return <p>Something went wrong</p>;

  return (
    <div className="container p-6 mt-16">
      <a
        href="/products"
        className="text-sm text-gray-500 hover:underline mb-4 inline-block"
      >
        ← Back to Products
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center">
          <Image
            src={product?.productProfile}
            alt="Product Image"
            width={600}
            height={250}
            className="rounded-xl shadow-md max-h-[350] w-[500]"
          />
        </div>

        {/* Product Details */}
        <div>
          <span className="text-xs bg-pink-400 text-gray-700 px-3 py-2 rounded-full font-bold ">
            {product?.productName?.product}
          </span>
          <h1 className="text-2xl font-bold mt-2">{product?.engLabel}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {product?.shopName?.brandName} ~{" "}
            {product?.shopName?.market?.marketName}
          </p>

          <p className="text-sm font-semibold text-black mt-4">
            Available in : {product?.productUnities.length} category
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            {product?.productDescription}
          </p>

          {/* Quantity / Price Input */}
          <div className="mt-6 flex flex-col items-center space-y-6">
            <div className="w-full flex justify-between">
              {product.productUnities?.length > 1
                ? product.productUnities?.map((item, index) => (
                    <MaterialBtn
                      key={index}
                      variant="outlined"
                      size="small"
                       sx={{ bgcolor: item.id === isSelectedProduct ? "pink" : "" }}
                      onClick={() => {
                      setUnitPrice(item.unitPrice);
                      setUnit(item.subUnit?.subUnit || "");
                      setMinPrice(item.minPrice);
                      setMaxPrice(item.maxPrice);
                      setIsSelectedProduct(item.id)

                      if (item.subUnit?.subUnit === "Qty") {
                        // If unit is Qty, use minPrice as initial value
                        setInputValue(item.minPrice.toString());
                        setQuantity(item.minPrice);
                      } else {
                        // Otherwise start from 1
                        setInputValue(1);
                        setQuantity(1);
                      }
                    }}
                    >
                      {item.subUnit.subUnit}
                    </MaterialBtn>
                  ))
                : product.productUnities?.map((item, index) => (
                    <Typography key={index} variant="h6" fontWeight="bold">
                      {item.unitPrice || 0} RWF / {item.subUnit?.subUnit}
                    </Typography>
                  ))}
            </div>

            <div className="w-full flex items-center gap-6">
             
                {unit === "Qty" ? (
                <div className="flex items-center border rounded-lg px-2">
                <div className="flex flex-col gap-5">
                  <div className="min-h-10 min-w-50p-4">
                    <span className="w-full pb-2 font-bold font-sans">Please specify the amount for your desired quantity</span>
                    <div className="flex text-[14px] italic mt-2 justify-between">
                      <span>minimum Amount: {" "} {minPrice}</span>
                      <span>maximum Amount: {" "} {maxPrice}</span>
                    </div>
                   
                  </div>
                  <input
                    id="price"
                    min={minPrice}
                    max={maxPrice}
                    type="number"
                     value={inputValue}
                     onChange={handlePriceChange}
                     onBlur={priceOnBlur}
                    className="p-2 w-full border rounded text-center"
                  />
                </div>
                </div>
                ) : (
                <>
                 <div className="flex items-center border rounded-lg px-2">
                   <button
                  className="p-2 disabled:opacity-50"
                  onClick={() => handleChange("dec")}
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                  <input
                    id="quantity"
                    type="number"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min="1"
                    className="p-2 w-full border rounded text-center"
                  />
                  <button
                    className="p-2"
                    onClick={() => handleChange("inc")}
                  >
                    <Plus size={16} />
                  </button>
                  </div>
                  <p className="text-sm text-gray-500">
                      {unitPrice > 0 ? quantity * unitPrice : inputValue} RWF /{" "}
                      {quantity}  packages of {unit}
                  </p>
                  </>
                )}
            </div>
          </div>

          {/* Add to Cart */}
          <div className="mt-6 flex items-center space-x-4">
            <Button
              className="bg-black hover:bg-gray-800 text-white py-3 rounded-lg w-40 flex justify-center"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
            >
              {addToCart.isPending ? "Adding..." : "Add to Cart"}
            </Button>
            <button className="p-3 border rounded-lg hover:bg-gray-100">
              <Heart size={20} color="blue" />
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Truck size={16} /> <span>Delivery cost will depend on location</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <ShieldCheck size={16} /> <span>Orders are processed quickly</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <ShieldCheck size={16} /> <span>Safe and secure delivery to your location</span>
            </div>
          </div>

          {/* Available Products & Prices */}
          <div className="mt-6">
            <h2 className="font-semibold text-gray-800">Available products & Prices</h2>
            <ul className="list-disc pl-5 text-sm text-gray-600 mt-2">
              {product?.productUnities?.map((item, index) => (
                <li key={index}>
                  {item.subUnit?.subUnit} :{" "}
                  {item.unitPrice > 0
                    ? item.unitPrice
                    : item.minPrice > 0 && item.maxPrice > 0
                    ? `Price Range: ${item.minPrice} - ${item.maxPrice}`
                    : `Minimum Amount: ${item.minPrice}`}{" "}
                  RWF
                </li>
              ))}
            </ul>
          </div>

          {/* Location for Features */}
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

      {/* Recommended Products */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recommendedProducts.map((p) => (
              <Card key={p.id} className="shadow-md">
                <CardContent className="p-4">
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={200}
                    height={200}
                    className="rounded-xl object-cover mb-3"
                  />
                  <h3 className="text-lg font-medium">{p.name}</h3>
                  <p className="text-gray-600">RWF {p.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Customer Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
        {loading ? (
          <p>Loading...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="shadow-sm">
                <CardContent className="p-4">
                  <p className="font-medium">{review.user}</p>
                  <p className="text-yellow-500">⭐ {review.rating}/5</p>
                  <p className="text-gray-700">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
