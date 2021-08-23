import { useEffect, useState } from 'react'
import cx from 'classnames'
import { EmojiHappyIcon, PhotographIcon } from '@heroicons/react/outline'

import { EditorIcon as Icon } from './Icon'
import { EditorCover as Cover } from './Cover'
import { formHeader, formStyle, formTitle } from 'entities/form'

const EditorHeader = () => {
  const title = formTitle.use()
  const header = formHeader.use()
  const style = formStyle.use()

  return (
    <header className="relative group">
      {header.cover && <Cover />}
      <div
        className={cx('mx-auto max-w-2xl px-2', {
          'max-w-7xl': style.fullWidth,
        })}
      >
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
              onClick={async () => {
                const request = await fetch('/api/unsplash/random')
                const response = await request.json()
                formHeader.set((state) => ({
                  ...state,
                  cover: response.urls.full,
                }))
              }}
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
            style.fontStyle,
            'mt-2 mb-6 text-2xl lg:text-3xl font-bold leading-none focus:outline-none',
            { 'with-placeholder': !title }
          )}
          onInput={(e) => {
            const target = e.target as HTMLHeadingElement
            const content = target.textContent
            if (content !== '') {
              formTitle.set(content)
            } else {
              formTitle.set(null)
            }
          }}
        ></h1>
      </div>
    </header>
  )
}

export { EditorHeader }
