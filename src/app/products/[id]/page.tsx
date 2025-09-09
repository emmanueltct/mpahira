import React from 'react'
import DefaultLayout from '@/components/defaultLayout'
import SingleProductPage from '@/components/singleProduct'

function page() {
  return (
    <DefaultLayout>
    <div className="bg-slate-50 dark:bg-gray-800 flex relative z-10 items-center justify-center mx-auto">< SingleProductPage/></div>
    </DefaultLayout>
  )
}

export default page