import React from 'react'
import Image from 'next/image'
import { LoginButton } from './Auth/login-button'
function HeroSection() {
  return (

// {/* <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen"> */}
    <div className="bg-white dark:bg-gray-800 flex relative z-20 items-center container m-auto">
        <div className="container mx-auto px-6 flex relative py-16 ">
            <div className="sm:w-2/3 lg:w-2/5 w-full flex flex-col relative z-20">
                <span className="w-20 h-2 bg-gray-800 dark:bg-white mb-12">
                </span>
                <h1 className="font-bebas-neue uppercase text-3xl md:text-5xl sm:text-8xl font-black flex sm:flex-col md:flex-col flex-row gap-2 pb-4 leading-none dark:text-white text-gray-800">
                    Be on
                    <span className="text-3xl md:text-5xl sm:text-7xl">
                        Time
                    </span>
                </h1>
                <p className="text-sm sm:text-base text-gray-700 dark:text-white leading-6">
                    Dimension of reality that makes change possible and understandable. An indefinite and homogeneous environment in which natural events and human existence take place.
                </p>
                <div className="flex mt-8">
                    <LoginButton>
                        <a href="/login" className="uppercase py-2 px-4 rounded-lg bg-pink-500 border-2 border-transparent text-white sm:text-md text-sm  mr-4 hover:bg-pink-400">
                            Shop With Us
                        </a>
                    </LoginButton>

                     <LoginButton>
                    <a href="#" className="uppercase py-2 px-4 rounded-lg bg-transparent border-2 border-pink-500 text-pink-500 dark:text-white hover:bg-pink-500 hover:text-white sm:text-md text-sm">
                        Read more
                    </a>
                    </LoginButton>
                </div>
            </div>
            <div className="hidden sm:block sm:w-1/3 lg:w-3/5 relative">
                <div className='flex w-full'>
                <div className="relative max-w-xs md:max-w-sm m-auto w-full h-100">
                    <Image
                        aria-hidden
                        src="/basket.jpg"
                        alt="File icon"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                 <div className="relative max-w-xs md:max-w-sm m-auto w-full h-100">
                    <Image
                        aria-hidden
                        src="/haha.jpg"
                        alt="File icon"
                        fill
                        style={{ objectFit: 'contain' }}
                    />
                </div>
                </div>
                {/* <img src="https://www.tailwind-kit.com/images/object/10.png" className="max-w-xs md:max-w-sm m-auto" /> */}
            </div>
        </div>
    </div>
// </main>

  )
}

export default HeroSection