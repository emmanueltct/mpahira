// src/components/CarouselClientWrapper.tsx
'use client';

import dynamic from 'next/dynamic';

const Carousel = dynamic(() => import('@/components/SlidingCard'), {
  ssr: false,
});




export default function CarouselClientWrapper() {
  return (
    <div className="bg-white dark:bg-gray-800 flex flex-col items-center w-full  container mx-auto">
      <div className=" px-4 sm:px-6 lg:px-8 flex flex-col items-center py-6">
        <h2 className="font-heading mb-4 font-bold tracking-tight text-gray-900 dark:text-white text-2xl sm:text-4xl md:text-5xl capitalize text-left sm:text-center w-full">
          Customer Favorite
        </h2>
        
        <span className="w-20 sm:w-40 h-1 sm:h-2 bg-pink-500 dark:bg-white mb-6 sm:mb-12 mt-2 sm:mt-3"></span>

        <p className="mt-3 mb-12 text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-400 text-left sm:text-center w-full max-w-3xl">
          Our best-selling product is a customer favorite, trusted for its quality, reliability, and value. Loved by loyal clients and perfect for any occasion, it consistently delivers great performance and satisfaction — making it the ideal choice for both new and returning customers.
        </p>
      </div>

      {/* Make sure <Carousel /> is also responsive inside */}
      <Carousel />
    </div>
  );
}
