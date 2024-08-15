'use client'

import Image from 'next/image'

import UserRegisterForm from '~/components/forms/user-register-form'

import placeholder from '/public/placeholder.svg'

export default function Register() {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <UserRegisterForm />
      </div>
      <div className="hidden bg-muted lg:block">
        <Image
          src={placeholder}
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
