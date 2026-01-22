"use client";

import React, { useEffect, useState } from "react";
import { fetchCategoryList } from "@/hooks/useProducts";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Category() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const { data: productCategories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategoryList,
  });

  if (!mounted) return null;
  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10">Failed to load categories</p>;

  const settings = {
   autoplay: true,
    infinite:true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll:4,
    initialSlide: 0,
     responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className=" dark:bg-gray-900 py-2 w-full  container mx-auto max-w-full ">

       <div className="w-full px-4  slider-container"> 
        {/* Slider parent must have width */}
        <Slider {...settings}>
          {productCategories.map((category, index) => (
            <div
              key={category.id}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="px-2"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 hover:bg-sky-50 dark:hover:bg-gray-800 cursor-pointer rounded-lg transition-colors duration-300 w-full min-w-[150px]">
                <div className="w-15 h-15 rounded-full overflow-hidden border-2 border-gray-300 dark:border-gray-700 shadow-md flex-shrink-0">
                  <Image
                    src={category.image || "/placeholder.png"}
                    alt={category.product}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {category.product}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.productSubCategory?.length || 0} subcategories
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
       </div> 
    </div>
  );
}

export default Category;
