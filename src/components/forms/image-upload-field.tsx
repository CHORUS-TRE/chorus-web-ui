import Image from 'next/image'
import { ChangeEvent, useState } from 'react'

import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

interface ImageUploadFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  label?: string
  className?: string
}

export function ImageUploadField({
  value,
  onChange,
  error,
  label = 'Icon',
  className
}: ImageUploadFieldProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onChange('')
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      onChange('')
      return
    }

    setIsLoading(true)
    try {
      const base64 = await convertToBase64(file)
      onChange(base64)
    } catch (error) {
      console.error('Error converting image to base64:', error)
      onChange('')
    } finally {
      setIsLoading(false)
    }
  }

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const isBase64 = value.startsWith('data:image/')
  const isUrl = value.startsWith('http')

  return (
    <FormItem className={className}>
      <FormLabel className="text-white">{label}</FormLabel>
      <div className="flex items-center gap-4">
        <FormControl>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="text-white file:rounded-md file:border file:border-accent file:bg-background file:text-accent placeholder:text-white file:hover:cursor-pointer file:hover:bg-accent file:hover:text-black"
            disabled={isLoading}
          />
        </FormControl>
        {(isBase64 || isUrl) && (
          <div className="relative h-10 w-10 overflow-hidden rounded-md">
            <Image
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              width={40}
              height={40}
            />
          </div>
        )}
      </div>
      <FormMessage className="text-destructive">{error}</FormMessage>
    </FormItem>
  )
}
