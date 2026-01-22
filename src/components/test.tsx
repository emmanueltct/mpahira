'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchCategoryList } from '@/hooks/useProducts';
import { useQuery } from '@tanstack/react-query';
import { ProductCardHomePage } from './ProductCardHomePage';
import AOS from 'aos';
import 'aos/dist/aos.css';

function CategorySection({ category }: { category: Category }) {
  // Filter subcategories that have at least 1 product
  const subcategories = category.productSubCategory.filter(
    (sub) => sub.shopProduct && sub.shopProduct.length > 0
  );

  const [activeSub, setActiveSub] = useState(0);
  const swiperRef = useRef<any>(null);

  if (subcategories.length === 0) return null; // Skip category if no subcategories with products

  const subcategory = subcategories[activeSub];

  const goNextSub = () => setActiveSub((p) => (p + 1) % subcategories.length);
  const goPrevSub = () =>
    setActiveSub((p) => (p - 1 + subcategories.length) % subcategories.length);

  // Delay between category changes (8 seconds)
  useEffect(() => {
    if (!subcategory) return;

    if (subcategory?.shopProduct?.length <= 5) {
      const timer = setTimeout(goNextSub, 8000); // 8 seconds
      return () => clearTimeout(timer);
    }
  }, [activeSub, subcategories.length, subcategory?.shopProduct?.length]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div
      className="flex flex-col lg:flex-row px-4 py-8 gap-6"
      data-aos="fade-up"
    >
      {/* Left Category Info */}
      {subcategory?.shopProduct && (
        <div
          className="hidden  w-full lg:w-1/5 sm:flex flex-col items-center gap-4 shadow-xl p-2"
          data-aos="fade-right"
        >
          {subcategory?.imageUrl && (
            <>
              <Image
                src={subcategory.imageUrl}
                alt={category.product}
                width={100}
                height={150}
                className="w-full h-48 object-contain hidden sm:flex"
              />

              <h1 className="text-xl font-bold text-amber-600">
                {category.product} ({subcategory.subCategoryEng})
              </h1>
            </>
          )}
        </div>
      )}

      {/* Right Section */}
      <div className="w-full lg:w-4/5" data-aos="fade-left">
        {subcategory?.shopProduct && (
          <div className="flex justify-between items-center mb-4">
            <ChevronLeft
              onClick={goPrevSub}
              className="cursor-pointer hover:text-amber-600 transition"
            />
            <h2 className="text-lg font-semibold text-amber-700">
              {subcategory?.subCategoryEng}
            </h2>
            <ChevronRight
              onClick={goNextSub}
              className="cursor-pointer hover:text-amber-600 transition"
            />
          </div>
        )}

        {/* Premium Animated Transition */}
        <AnimatePresence mode="wait">
          <motion.div
            key={subcategory?.id}
            initial={{ opacity: 0, scale: 1.03, filter: 'blur(1px)' }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              filter: 'blur(1px)',
            }}
            transition={{
              duration: 1.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            data-aos="fade-up"
          >
            {/* Render only if products exist */}
            {subcategory.shopProduct.length <= 5 ? (
              <div className="flex flex-wrap justify-center gap-4">
                {subcategory.shopProduct.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl shadow-lg overflow-hidden flex flex-col w-40 sm:w-44 md:w-60"
                    data-aos="zoom-in"
                    data-aos-delay="100"
                  >
                    <ProductCardHomePage
                      product={product}
                      category={category.product}
                    />
                  </div>
                ))}
              </div>
            ) : (
              // Swiper scroll + pause on hover
              <div
                onMouseEnter={() => swiperRef.current?.autoplay.stop()}
                onMouseLeave={() => swiperRef.current?.autoplay.start()}
                className="lg:w-[100%] md:w-[650] w-[350] px-10 sm:px-4 md:px-6 lg:px-8"
              >
                <Swiper
                  modules={[Autoplay]}
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  spaceBetween={16}
                  slidesPerView={Math.min(5, subcategory?.shopProduct?.length)}
                  loop={false}
                  autoplay={{
                    delay: 8000,
                    disableOnInteraction: false,
                  }}
                  onReachEnd={() => setTimeout(goNextSub, 8000)}
                  breakpoints={{
                    280: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                    1280: { slidesPerView: 5 },
                  }}
                  className="w-full"
                >
                  {subcategory.shopProduct.map((product) => (
                    <SwiperSlide key={product.id}>
                      <div
                        className="bg-slate-50 p-3 rounded-xl shadow-lg overflow-hidden flex flex-col w-60 sm:w-44 md:w-48"
                        data-aos="fade-up"
                        data-aos-delay="150"
                      >
                        <ProductCardHomePage
                          product={product}
                          category={category.product}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function EcommercePage() {
  const { data: productCategories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoryList,
  });

  if (isLoading) return '';

  // Filter categories that have at least one subcategory with products
  const filteredCategories = productCategories.filter(
    (cat) =>
      cat.productSubCategory &&
      cat.productSubCategory.some(
        (sub) => sub.shopProduct && sub.shopProduct.length > 0
      )
  );

  return (
    <div className="bg-white dark:bg-gray-800 w-full container mx-auto">
      {filteredCategories.map((cat) => (
        <CategorySection key={cat.id} category={cat} />
      ))}
    </div>
  );
}
