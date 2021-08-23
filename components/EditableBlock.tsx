import { Fragment, useState } from 'react'
import cx from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import {
  DuplicateIcon,
  MenuAlt3Icon,
  PlusIcon,
  TrashIcon,
  ViewGridIcon,
} from '@heroicons/react/outline'

const EditableBlock = () => {
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true)
  const [showBlockSelect, setShowBlockSelect] = useState<boolean>(false)

  return (
    <div className="relative group draggable-block">
      <div className="absolute -left-2 top-0 -translate-x-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
        <button className="btn">
          <PlusIcon className="icon text-gray-500" />
        </button>
        <Menu as="div" className="relative">
          <Menu.Button className="btn">
            <ViewGridIcon className="icon text-gray-500" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition duration-95"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 py-2 bg-white shadow-lg ring-1 ring-black/5 rounded z-20 text-sm">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={cx(
                      'flex items-center gap-2 py-2 px-4 hover:bg-gray-100 w-full',
                      { 'bg-gray-100': active }
                    )}
                  >
                    <DuplicateIcon className="icon text-gray-500" />
                    <span>Clone</span>
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={cx(
                      'flex items-center gap-2 py-2 px-4 hover:bg-gray-100 w-full',
                      { 'bg-gray-100': active }
                    )}
                  >
                    <TrashIcon className="icon text-gray-500" />
                    <span>Remove</span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <div
        placeholder="Type '/' to add a block element"
        className={cx('py-1 my-2 focus:outline-none', {
          'with-placeholder': showPlaceholder,
        })}
        onInput={(e) => {
          const target = e.target as HTMLDivElement
          const content = target.textContent
          if (content !== '') {
            setShowPlaceholder(false)
            if (content?.indexOf('/') === 0) {
              setShowBlockSelect(true)
            }
          } else {
            setShowPlaceholder(true)
            setShowBlockSelect(false)
          }
        }}
        contentEditable
        suppressContentEditableWarning
      />
      <Transition
        show={showBlockSelect}
        as={Fragment}
        enter="transition duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-95"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <ul className="absolute left-0 w-60 max-h-60 overflow-y-auto custom-scrollbar py-2 bg-white shadow-lg ring-1 ring-black/5 rounded font-sans">
          <li>
            <button className="flex items-center gap-4 w-full py-2 px-4 hover:bg-gray-100">
              <MenuAlt3Icon className="icon" />
              <span>Short answer</span>
            </button>
          </li>
        </ul>
      </Transition>
    </div>
  )
}

export { EditableBlock }
