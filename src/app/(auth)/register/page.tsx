'use client'

import Image from 'next/image'

import UserRegisterForm from '~/components/forms/user-register-form'

import placeholder from '/public/login.png'

export default function Register() {
  return (
    <div className="lg:grid lg:grid-cols-[2fr_1fr]">
      <div className="py-4">
        <UserRegisterForm />
      </div>
      <div className="hidden bg-opacity-0 bg-cover bg-center lg:block ">
        <Image
          src={placeholder}
          alt="Image"
          className="bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
