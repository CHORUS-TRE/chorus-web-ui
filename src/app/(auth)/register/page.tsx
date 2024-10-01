'use client'

import Image from 'next/image'

import UserRegisterForm from '~/components/forms/user-register-form'

import placeholder from '/public/login.png'

export default function Register() {
  return (
    <div className="bg-opacity-50 lg:grid lg:grid-cols-[2fr_1fr]">
      <div className="flex items-center justify-center bg-opacity-50 py-4 text-white">
        <UserRegisterForm />
      </div>
      <div className="hidden bg-opacity-0 bg-cover bg-center lg:block">
        <Image
          src={placeholder}
          alt="Image"
          className="rounded-2xl bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
