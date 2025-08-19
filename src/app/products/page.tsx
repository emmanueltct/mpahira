import React from 'react'
import Products from '@/components/products'
import DefaultLayout from '@/components/defaultLayout'

function page() {
  return (
    <DefaultLayout>
    <div className="bg-slate-50 dark:bg-gray-800 flex relative z-10 items-center justify-center mx-auto"><Products/></div>
    </DefaultLayout>
  )
}

export default page