import cx from 'classnames'
import { useAtom } from 'jotai'
import { EmojiHappyIcon, PhotographIcon } from '@heroicons/react/outline'

import { EditorIcon as Icon } from './Icon'
import { EditorCover as Cover } from './Cover'
import { headerAtom, styleAtom } from 'lib/atoms/form'

const EditorHeader = () => {
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)

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
              onClick={() => {
                setHeader((state) => ({ ...state, icon: '/icon.png' }))
              }}
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
                setHeader((state) => ({
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
      </div>
    </header>
  )
}

export { EditorHeader }
