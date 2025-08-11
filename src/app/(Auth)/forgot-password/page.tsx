
import { ForgotPasswordForm } from '@/components/Auth/forgot-password-form'
import React from 'react'
const ForgotPasswordPage=()=> {
  return (
    <main className='flex  h-full flex-col items-center justify-center bg-slate-50'>
        <div className='space-y-6'>
            {/* <h1 className='text-6xl font-semibold text-black drop-shadow-md'>
                User Register
            </h1>
            <p className='text-white text-lg'>
                Register to access our services
            </p> 
             */}
            <div >
              <ForgotPasswordForm/>
              {/* <RegisterButton>
                <Button variant="secondary" size="lg">
                   Signi in
                </Button>
              </RegisterButton> */}
              
            </div>
        </div>
    </main>
  )
}

export default ForgotPasswordPage