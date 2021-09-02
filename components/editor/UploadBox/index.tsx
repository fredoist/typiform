import * as React from 'react'
import cx from 'classnames'
import { PhotographIcon } from '@heroicons/react/outline'

const UploadBox = ({
  id,
  onUpload,
}: {
  id: string
  onUpload: (value: string | undefined) => void
}) => {
  const [isOver, setIsOver] = React.useState<boolean>(false)

  return (
    <label
      htmlFor={id}
      className={cx(
        'h-48 p-2 border border-dashed border-gray-300 rounded flex items-center justify-center flex-col gap-2 cursor-pointer hover:bg-gray-100 transition-colors',
        { 'bg-gray-100': isOver }
      )}
      onDragEnter={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
      onDragOver={(e) => {
        e.stopPropagation()
        e.preventDefault()
        setIsOver(true)
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.stopPropagation()
        e.preventDefault()
        const dt = e.dataTransfer
        const files = dt.files
        const reader = new FileReader()
        reader.onloadend = function () {
          onUpload(reader.result?.toString())
          setIsOver(false)
        }
        reader.readAsDataURL(files[0])
      }}
    >
      <input
        type="file"
        name={id}
        id={id}
        className="sr-only"
        onChange={(e) => {
          const files = e.target.files || []
          const reader = new FileReader()
          reader.onloadend = function () {
            onUpload(reader.result?.toString())
          }
          reader.readAsDataURL(files[0])
        }}
      />
      <PhotographIcon className="w-6 h-6 text-gray-500" />
      <span className="text-sm">Drag and drop an image or click to select</span>
      <span className="text-gray-400 text-sm">Upload a high quality image</span>
    </label>
  )
}

export { UploadBox }
