import React from 'react'
import { Plus } from 'lucide-react';
import Image from 'next/image'
import { Button } from './ui/button';
import Link from 'next/link';

interface MarketCardProps {
  title: string;
  image: string;
}


const MarketCard: React.FC<MarketCardProps> = ({ title, image }) => {
  return (
   <div className="relative w-full h-60 overflow-hidden rounded-2xl shadow-lg group cursor-pointer">
      {/* Image */}
      <Image
        aria-hidden
        src={image}
        alt={title}
        fill
        className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-contain rounded-lg"
      />

      {/* Centered Title */}
      {/* <div className="absolute inset-0 flex items-center justify-center">
        Card Title
      </div> */}

      
      {/* Title + Icon Row Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black/10 px-4 py-2 rounded-md flex items-center gap-2">
         <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-black" />
          </div>
          <h3 className="text-white text-xl font-bold drop-shadow-md">{title}</h3>
        </div>
      </div>

      {/* Hover Description Overlay */}
      <div className="absolute inset-0 bg-pink-500 bg-opacity-80 flex items-end transition-all duration-500 translate-y-full group-hover:translate-y-0">
        <div className="p-4 text-white text-sm  flex flex-col items-left justify-center py-8">
        
        <div className='flex'>
         <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center mr-3">
            
            <Plus className="w-4 h-4 text-black" />
          </div>
            <h3 className="text-white text-xl font-bold drop-shadow-md mb-3">{title}</h3>
        </div>
        {/* <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-4"></span>
       */}
          <p>
            This is a short description that slides up to overlay the image on hover. This is a short description that slides up to overlay the image on hover.This is a short description that slides up to overlay the image on hover.
         </p>
           <Button variant="default"  size="sm" className="mt-4 items-end justify-end">
              {/* <Link href=`/products?market=${}`></Link> */}
              Test bute
            </Button>
        </div>
      </div>
    </div>
  )
}

export default MarketCard