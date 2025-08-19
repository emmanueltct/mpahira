
import { RegisterForm } from '@/components/Auth/register-form'
import DefaultLayout from '@/components/defaultLayout'
import React from 'react'
const RegisterPage=()=> {
  return (
     <DefaultLayout>
    <main className='flex  h-full flex-col items-center  bg-slate-50'>
        <div className='space-y-6'>
            {/* <h1 className='text-6xl font-semibold text-black drop-shadow-md'>
                User Register
            </h1>
            <p className='text-white text-lg'>
                Register to access our services
            </p> 
             */}
            <div >
              <RegisterForm/>
              {/* <RegisterButton>
                <Button variant="secondary" size="lg">
                   Signi in
                </Button>
              </RegisterButton> */}
              
            </div>
        </div>
    </main>
    </DefaultLayout>
  )
}

export default RegisterPage