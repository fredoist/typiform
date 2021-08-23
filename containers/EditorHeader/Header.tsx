import { useEffect, useState } from 'react'
import cx from 'classnames'
import { EmojiHappyIcon, PhotographIcon } from '@heroicons/react/outline'

import { EditorIcon as Icon } from './Icon'
import { EditorCover as Cover } from './Cover'
import { formHeader, formTitle } from 'entities/form'

const EditorHeader = () => {
  const title = formTitle.use()
  const header = formHeader.use()
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(false)

  useEffect(() => {
    title !== null || title !== ''
      ? setShowPlaceholder(false)
      : setShowPlaceholder(true)
  }, [title])

  return (
    <header className="relative group">
      {header.cover && <Cover />}
      <div className="mx-auto max-w-2xl px-2">
        <div
          className={cx({ 'h-8 md:h-12 lg:h-16': header.cover && header.icon })}
        >
          {header.icon && <Icon />}
        </div>
        <div className="pt-4 flex gap-2 text-gray-400 text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          {!header.icon && (
            <button
              className="btn"
              onClick={() =>
                formHeader.set((state) => ({ ...state, icon: '/icon.png' }))
              }
            >
              <EmojiHappyIcon className="icon" />
              <span>Add icon</span>
            </button>
          )}
          {!header.cover && (
            <button
              className="btn"
              onClick={() =>
                formHeader.set((state) => ({
                  ...state,
                  cover:
                    'https://images.unsplash.com/photo-1629649439562-4c682cd0c0d4',
                }))
              }
            >
              <PhotographIcon className="icon" />
              <span>Add cover</span>
            </button>
          )}
        </div>
        <h1
          contentEditable
          suppressContentEditableWarning
          placeholder="Form title"
          className={cx(
            'mt-2 mb-6 text-2xl lg:text-3xl font-bold leading-none focus:outline-none',
            { 'with-placeholder': showPlaceholder }
          )}
          onInput={(e) => {
            const target = e.target as HTMLHeadingElement
            const content = target.textContent
            if (content !== '') {
              setShowPlaceholder(false)
              formTitle.set(content)
            } else {
              setShowPlaceholder(true)
              formTitle.set(null)
            }
          }}
        ></h1>
      </div>
    </header>
  )
}

export { EditorHeader }
