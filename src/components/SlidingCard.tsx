'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';

const cards = [
  { image: '/images/haha.jpg', title: 'Fresh Fruits' },
  { image: '/images/basket.jpg', title: 'Organic Vegetables' },
  { image: '/images/haha.jpg', title: 'Grocery Packs' },
  { image: '/images/basket.jpg', title: 'Daily Essentials' },
  { image: '/images/haha.jpg', title: 'Fresh Fruits' },
  { image: '/images/basket.jpg', title: 'Organic Vegetables' },
  { image: '/images/haha.jpg', title: 'Grocery Packs' },
  { image: '/images/basket.jpg', title: 'Daily Essentials' },
];

export default function Carousel() {
  return (
    <div className=" mx-auto max-w-screen lg:w-[100%] md:w-[650] w-[350] px-10 sm:px-4 md:px-6 lg:px-8 bg-">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        loop={true}
        autoplay={{ delay: 5000 }}
        navigation
        pagination={{ clickable: true }}
        slidesPerView={1}
        breakpoints={{
          280: { slidesPerView: 1 },   // very small screens (watch size)
          480: { slidesPerView: 1 },   // phones
          640: { slidesPerView: 2 },   // small tablets
          768: { slidesPerView: 3 },   // medium tablets
          1024: { slidesPerView: 4 },  // desktops
          1280: { slidesPerView: 5 },
        }}
        className="w-full"
      >
        {cards.map((card, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8 w-full h-full flex flex-col justify-between">
              <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-contain rounded-t-lg"
                />
              </div>
              <div className="p-2 sm:p-4 bg-amber-500 flex items-center justify-center">
                <h2 className="text-sm sm:text-base md:text-lg font-semibold text-center text-white">
                  {card.title}
                </h2>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
