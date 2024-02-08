import React from 'react'

export default function LayoutFullScreen({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <div
      className="bg-cover"
      style={{
        height: "100vh",
        backgroundImage:
          "url(" + "https://images.unsplash.com/photo-1519681393784-d120267933ba" + ")",
      }}
    >
      {children}
    </div>
  )
}
