import * as React from 'react'
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
import { formBlocks } from 'lib/entities/form'
import { Block } from 'lib/interfaces/Block'

const blockOptions = [
  {
    id: 'short-answer',
    label: 'Short answer',
    tag: 'input',
    hint: 'Enter a placeholder',
    icon: 'MenuAlt3Icon',
    props: {
      className: 'border-2 border-red-500',
      placeholder: '',
      value: '',
    },
  },
  {
    id: 'long-answer',
    label: 'Long answer',
    icon: 'MenuAlt4Icon',
    tag: 'input',
    hint: 'Enter a placeholder',
    props: {
      className: 'border-2 border-green-600',
      placeholder: '',
      value: '',
    },
  },
  {
    id: 'email-address',
    label: 'Email address',
    icon: 'AtSymbolIcon',
    tag: 'input',
    hint: 'Enter a placeholder',
    props: {
      className: 'border-2 border-yellow-400',
      placeholder: '',
      value: '',
    },
  },
]

const EditableBlock = ({
  setIsCommand,
  block,
}: {
  setIsCommand: any
  block: Block
}) => {
  const [LIIndex, setLIIndex] = React.useState<number>(0)
  const ULRef = React.useRef<any>(null)
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true)
  const [showBlockSelect, setShowBlockSelect] = React.useState<boolean>(false)
  const [options, setOptions] = React.useState<Block[]>(blockOptions)

  React.useEffect(() => {
    let selectedBlock = 0
    setIsCommand(showBlockSelect)
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
              formBlocks.set((prev) => {
                const next = [...prev]
                const i = next.findIndex((e) => e.blockID === block.blockID)
                next[i] = { ...block, ...options[selectedBlock] }
                return next
              })
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
  }, [showBlockSelect, options, setIsCommand, block])

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ULRef && !ULRef.current.contains(e.target)) {
        setShowBlockSelect(false)
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [ULRef])

  return (
    <div className="relative group draggable-block">
      <div className="absolute -left-2 top-0 -translate-x-full flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity font-sans">
        <button tabIndex={-1} className="btn">
          <PlusIcon className="icon text-gray-500" />
        </button>
        <Menu as="div" className="relative">
          <Menu.Button tabIndex={-1} className="btn draggable-block-button">
            <ViewGridIcon className="icon text-gray-500" />
          </Menu.Button>
          <Transition
            as={React.Fragment}
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
      {React.createElement(
        'div',
        {
          id: block.blockID,
          placeholder: block.hint,
          contentEditable: true,
          className: cx(block.props.className, 'focus:outline-none', {
            'with-placeholder': showPlaceholder,
          }),
          suppressContentEditableWarning: true,
          onInput: (e: InputEvent) => {
            const target = e.target as HTMLDivElement
            const content = target.textContent
            if (content !== '') {
              setShowPlaceholder(false)
              if (content?.indexOf('/') === 0) {
                setShowBlockSelect(true)
                const blockFilter = content.split('/')[1]
                setOptions(
                  blockOptions.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(blockFilter.toLowerCase())
                  )
                )
              } else {
                formBlocks.set((prev) => {
                  const next = [...prev]
                  const i = next.findIndex((e) => e.blockID === block.blockID)
                  next[i] = {
                    ...block,
                    props: { ...block.props, value: content },
                  }
                  return next
                })
              }
            } else {
              setShowPlaceholder(true)
              setShowBlockSelect(false)
            }
          },
        },
        null
      )}
      <div ref={ULRef}>
        <Transition
          show={showBlockSelect}
          as={React.Fragment}
          enter="transition duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition duration-95"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ul
            tabIndex={0}
            className="absolute z-10 left-0 w-60 max-h-60 overflow-y-auto custom-scrollbar py-2 bg-white shadow-lg ring-1 ring-black/5 rounded font-sans"
          >
            {options.map((option, key) => {
              return (
                <li
                  key={key}
                  tabIndex={-1}
                  className={cx(
                    'flex items-center gap-4 w-full py-2 px-4 hover:bg-gray-100',
                    { 'bg-gray-100': LIIndex === key }
                  )}
                  onClick={() => {
                    formBlocks.set((prev) => {
                      const next = [...prev]
                      const index = next.findIndex(
                        (e) => e.blockID === block.blockID
                      )
                      console.log(next[index])
                      next[index] = { ...block, ...option }
                      return next
                    })
                    setShowBlockSelect(false)
                  }}
                >
                  <span>{option.label}</span>
                </li>
              )
            })}
          </ul>
        </Transition>
      </div>
    </div>
  )
}

export { EditableBlock }
