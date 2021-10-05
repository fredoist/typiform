import * as React from 'react'

const OverlayPage = ({
  title,
  description,
}: {
  title: string
  description: string
}) => {
  return (
    <div className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-sm text-gray-500 py-2">{description}</p>
      </div>
    </div>
  )
}

export { OverlayPage }
