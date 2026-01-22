"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import HeroSection from "@/components/HeroSection";
import CarouselClientWrapper from "@/components/CarouselClientWrapper";
import Markets from "@/components/Markets";
import Testimony from "@/components/Testimony";
import Contact from "@/components/Contact";
import DefaultLayout from "@/components/defaultLayout";
import EcommercePage from "@/components/test";
import Category from "@/components/Category";
import HeroSearch from "@/components/HeroSearch";

export default function Home() {
  const [loading, setLoading] = useState(true);

  // Simulate preloading
  useEffect(() => {
    const handleLoad = () => {
      // Wait a bit to show loader nicely
      setTimeout(() => setLoading(false), 600);
    };

    // If you want to wait for images as well, use window.onload
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 font-medium text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <DefaultLayout>
      <div className="bg-slate-50 grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-2 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start w-full px-2 mx-auto max-w-fit overflow-hidden">
          <Category />
          <HeroSearch />
          <HeroSection />
          <EcommercePage />
          <CarouselClientWrapper />
          <Markets />
          <Testimony />
          <Contact />
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org/learn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
            Learn
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://vercel.com/templates?framework=next.js"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
            Examples
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
            Go to nextjs.org →
          </a>
        </footer>
       
      </div>
        
    </DefaultLayout>
  );
}
