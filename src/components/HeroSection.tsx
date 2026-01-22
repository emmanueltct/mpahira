"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { LoginButton } from "./Auth/login-button";

function HeroSection() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900 relative z-10 overflow-hidden">
      {/* Left-side Net-like SVG */}
      <svg
        className="absolute left-0 top-0 h-full w-1/2"
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        data-aos="fade-right"
      >
        {/* Curved net lines */}
        <path
          d="M0,0 C150,200 450,100 600,300"
          stroke="#F472B6"
          strokeOpacity="0.2"
          strokeWidth="2"
        />
        <path
          d="M0,100 C150,300 450,200 600,400"
          stroke="#F472B6"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <path
          d="M0,200 C150,400 450,300 600,500"
          stroke="#FB7185"
          strokeOpacity="0.15"
          strokeWidth="2"
        />
        <path
          d="M0,300 C150,500 450,400 600,600"
          stroke="#FB7185"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
        <path
          d="M0,400 C150,600 450,500 600,700"
          stroke="#F472B6"
          strokeOpacity="0.1"
          strokeWidth="2"
        />
      </svg>

      <div className="container mx-auto px-6 py-16 lg:py-32 flex flex-col lg:flex-row items-center gap-10 relative z-10">
        {/* Left Text Content */}
        <div className="lg:w-1/2 flex flex-col gap-6 pl-6 lg:pl-16" data-aos="fade-right">
          <span className="w-16 h-1 bg-gray-800 dark:bg-white mb-4"></span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight flex flex-col gap-2">
            <span>You Order.</span>
            <span className="text-pink-500 font-bold text-xl">
              We Shop and <span className="ml-2">Deliver Fast.</span>
            </span>
          </h1>

          <p className="text-gray-700 dark:text-gray-200 text-sm sm:text-base leading-relaxed">
            Place your order and relax. We shop fresh food from all markets across Kigali and deliver straight to your door—saving you time, transport costs, effort, and stress.
          </p>

          <div className="flex flex-wrap gap-4 mt-6" data-aos="fade-up" data-aos-delay="200">
            <LoginButton>
              <a
                href="/login"
                className="uppercase py-3 px-6 rounded-lg bg-pink-500 text-white text-sm sm:text-base font-medium hover:bg-pink-400 transition"
              >
                Shop With Us
              </a>
            </LoginButton>

            <LoginButton>
              <a
                href="#"
                className="uppercase py-3 px-6 rounded-lg border-2 border-pink-500 text-pink-500 dark:text-white text-sm sm:text-base font-medium hover:bg-pink-500 hover:text-white transition"
              >
                Read More
              </a>
            </LoginButton>
          </div>
        </div>

        {/* Right Images */}
        <div className="lg:w-1/2 flex justify-center items-center gap-6 relative">
          {/* Cart Image */}
          <div className="relative w-40 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80" data-aos="fade-up" data-aos-delay="300">
            <Image
              src="/basket.jpg"
              alt="Shopping cart with groceries"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Person Image */}
          <div className="relative w-40 sm:w-56 md:w-64 h-56 sm:h-72 md:h-80" data-aos="fade-up" data-aos-delay="500">
            <Image
              src="/haha.jpg"
              alt="Woman holding groceries"
              fill
              style={{ objectFit: "contain" }}
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
