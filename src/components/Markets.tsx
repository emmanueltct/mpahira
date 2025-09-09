'use client';

import React, { useEffect, useState } from 'react';
import MarketCard from './MarketCard';
import { useMarkets } from '@/hooks/useMarket';
import LoadingSkeloton from './loadingSkeloton';

export default function Markets() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const { data, isLoading } = useMarkets();

  return (
    <section className="bg-white dark:bg-gray-800 w-full container m-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center">
        {/* Heading */}
        <div className="mb-4 w-full flex flex-col items-center py-4">
          <h2 className="font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-xl sm:text-3xl md:text-4xl lg:text-5xl capitalize text-left sm:text-center w-full">
            Where We Are
          </h2>
          <span className="w-20 sm:w-40 h-1 sm:h-2 bg-pink-500 dark:bg-white mb-6 sm:mb-12 mt-2 sm:mt-3"></span>
          <p className="mt-3 mb-6 text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 dark:text-slate-400 w-full sm:w-[90%] md:w-[80%] lg:w-[60%] text-left sm:text-center">
            We currently operate in Kigali, Rwanda, serving a growing number of clients with dependable delivery and shopping services. Our presence in these markets allows us to understand local needs and provide tailored solutions that meet the expectations of our customers.
          </p>
        </div>

        {/* Scrollable Grid only on mobile */}
        <div
          className={`w-full ${isMobile ? "h-[70vh] overflow-y-auto" : "h-auto overflow-visible"}`}
        >
          {isLoading ? (
            <LoadingSkeloton />
          ) : data && data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-10 justify-center">
              {data.map((cat: any, i: number) => (
                <MarketCard
                  key={i}
                  title={cat.marketName}
                  image={cat.marketThumbnail}
                  otherData={cat}
                />
              ))}
            </div>
          ) : (
            <div className="flex w-full justify-center items-center py-10">
              <h1 className="text-gray-500 text-center">
                We are yet to connect with different markets in Kigali
              </h1>
            </div>
          )}
        </div>
        </div>
      
    </section>
  );
}
