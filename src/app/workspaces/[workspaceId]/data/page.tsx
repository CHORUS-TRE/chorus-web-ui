'use client'

import '/node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css'

import React from 'react'
import FileBrowser from 'react-keyed-file-browser'

import { files } from './mock'

export default function DataPage() {
  return (
    <div className="h-full w-full bg-background/80 text-white">
      <FileBrowser files={files} />
    </div>
  )
}
