import { EmojiHappyIcon, PhotographIcon } from '@heroicons/react/outline'

import { EditorIcon as Icon } from './Icon'
import { EditorCover as Cover } from './Cover'

const EditorHeader = () => {
  return (
    <header className="relative group">
      <Cover />
      <div className="mx-auto max-w-2xl px-2">
        <Icon />
        <div className="pt-16 lg:pt-20 flex gap-2 text-gray-400 text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <button className="btn">
            <EmojiHappyIcon className="icon" />
            <span>Add icon</span>
          </button>
          <button className="btn">
            <PhotographIcon className="icon" />
            <span>Add cover</span>
          </button>
        </div>
        <h1 className="mt-2 mb-6 text-2xl lg:text-3xl font-bold leading-none">
          Form title
        </h1>
      </div>
    </header>
  )
}

export { EditorHeader }
