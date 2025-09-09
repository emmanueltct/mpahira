


import ProfilePage from '@/components/Auth/profilePage'
import DefaultLayout from '@/components/defaultLayout'
import React from 'react'
const UserProfilePage=()=> {
  return (
    <DefaultLayout>
    <main className='flex min-h-screen max-w-full flex-col items-center justify-center   bg-slate-50'>
        <div className='space-y-6'>
            <div >
              <ProfilePage/>
            </div>
        </div>
    </main>
   </DefaultLayout>
  )
}

export default UserProfilePage