"use client";
import React from 'react'
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { Button } from '../ui/button';


export const Social=()=> {
  return (
    <div className="flex items-center justify-center w-full gap-x-2">
        <Button size="lg" variant="outline" className='w-fit cursor-pointer' onClick={()=>{}}>
            <FcGoogle className="h-5 w-5"/>
        </Button>
         <Button size="lg" variant="outline" className='w-fit cursor-pointer' onClick={()=>{}}>
            <FaFacebook className="h-5 w-5"/>
        </Button>
    </div>
  )
}

export default Social