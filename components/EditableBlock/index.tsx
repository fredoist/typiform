import {
  Fragment,
  useEffect,
  useState,
  useRef,
  createRef,
  RefObject,
  LegacyRef,
} from 'react'
import cx from 'classnames'
import { Menu, Transition } from '@headlessui/react'
import {
  AtSymbolIcon,
  DuplicateIcon,
  MenuAlt3Icon,
  MenuAlt4Icon,
  PlusIcon,
  TrashIcon,
  ViewGridIcon,
} from '@heroicons/react/outline'

const Icons = {
  AtSymbolIcon,
  MenuAlt3Icon,
  MenuAlt4Icon,
}

const blockOptions = [
  {
    id: 1,
    label: 'Short answer',
    icon: 'MenuAlt3Icon',
    properties: {
      tag: 'p',
      class: '',
      placeholder: '',
      value: '',
    },
  },
  {
    id: 2,
    label: 'Long answer',
    icon: 'MenuAlt4Icon',
    properties: {
      tag: 'p',
      class: '',
      placeholder: '',
      value: '',
    },
  },
  {
    id: 3,
    label: 'Email address',
    icon: 'AtSymbolIcon',
    properties: {
      tag: 'p',
      class: '',
      placeholder: '',
      value: '',
    },
  },
]

const EditableBlock = () => {
  const [LIIndex, setLIIndex] = useState<number>(0)
  const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true)
  const [showBlockSelect, setShowBlockSelect] = useState<boolean>(false)
  const [options, setOptions] = useState<
    {
      id: number
      label: string
      icon: string
      properties: {
        tag: string
        class: string
        placeholder: string
        value: string
      }
    }[]
  >(blockOptions)

  useEffect(() => {
    let selectedBlock = 0
    function handleKeyboardEvents(e: KeyboardEvent) {
      if (showBlockSelect) {
        if (
          [
            'ArrowDown',
            'ArrowUp',
            'Enter',
            'Tab',
            'Escape',
            'End',
            'Home',
            'PageUp',
            'PageDown',
          ].includes(e.key)
        ) {
          switch (e.key) {
            case 'ArrowDown':
              e.preventDefault()
              e.stopPropagation()
              selectedBlock =
                selectedBlock < options.length - 1
                  ? ++selectedBlock
                  : options.length - 1
              setLIIndex(selectedBlock)
              break
            case 'ArrowUp':
              e.preventDefault()
              e.stopPropagation()
              selectedBlock = selectedBlock > 0 ? --selectedBlock : 0
              setLIIndex(selectedBlock)
              break
            case 'Home':
            case 'PageUp':
              e.preventDefault()
              e.stopPropagation()
              selectedBlock = 0
              setLIIndex(selectedBlock)
              break
            case 'End':
            case 'PageDown':
              e.preventDefault()
              e.stopPropagation()
              selectedBlock = options.length - 1
              setLIIndex(selectedBlock)
              break
            case 'Enter':
              e.preventDefault()
              e.stopPropagation()
              setShowBlockSelect(false)
              break
            case 'Escape':
              e.preventDefault()
              e.stopPropagation()
              setShowBlockSelect(false)
              break
            case 'Tab':
              e.preventDefault()
              e.stopPropagation()
              break
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyboardEvents)
    return () => window.removeEventListener('keydown', handleKeyboardEvents)
  }, [showBlockSelect, options])

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
                      'flex items-center gap-2 py-2 px-4 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none w-full',
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
              const blockFilter = content.split('/')[1]
              setOptions(
                blockOptions.filter((option) =>
                  option.label.toLowerCase().includes(blockFilter.toLowerCase())
                )
              )
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
        <ul
          tabIndex={0}
          className="absolute left-0 w-60 max-h-60 overflow-y-auto custom-scrollbar py-2 bg-white shadow-lg ring-1 ring-black/5 rounded font-sans"
        >
          {options.map((option, key) => {
            const { [option.icon]: Icon }: any = Icons
            return (
              <li
                key={key}
                tabIndex={-1}
                className={cx(
                  'flex items-center gap-4 w-full py-2 px-4 hover:bg-gray-100',
                  { 'bg-gray-100': LIIndex === key }
                )}
                onClick={() => console.log(option.label)}
              >
                <Icon className="icon" />
                <span>{option.label}</span>
              </li>
            )
          })}
        </ul>
      </Transition>
    </div>
  )
}

export { EditableBlock }
