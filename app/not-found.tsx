"use client"
import React from 'react'
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="mx-25 p-8">
      <h1>
        Home / <b>404 Error</b>
      </h1>
      <div className='flex flex-col items-center gap-10 mt-20 mb-10'>
        <h1 className='text-9xl font-semibold'>404 Not Found</h1>
        <h1 className='font-semibold'>Your Visited Page not Found. You may go Home Page</h1>
        <button onClick={()=>router.push("/")} className='bg-red-500 text-neutral-100 px-10 py-3 cursor-pointer'>Back to home page</button>
      </div>
    </div>
  );
}

export default NotFound
