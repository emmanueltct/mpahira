
import { LoginForm } from '@/components/Auth/login-form'
import React from 'react'
const LoginPage=()=> {
  return (
    <main className='flex min-h-screen max-w-full flex-col items-center justify-center   bg-slate-50'>
        <div className='space-y-6'>
            {/* <h1 className='text-6xl font-semibold text-black drop-shadow-md'>
                User login
            </h1>
            <p className='text-white text-lg'>
                login to access our services
            </p> 
             */}
            <div >
              <LoginForm/>
              {/* <LoginButton>
                <Button variant="secondary" size="lg">
                   Signi in
                </Button>
              </LoginButton> */}
              
            </div>
        </div>
    </main>
  )
}

export default LoginPage