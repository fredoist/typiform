import * as React from 'react'
import { useAtom } from 'jotai'
import cx from 'classnames'
import Image from 'next/image'
import { Menu, Transition } from '@headlessui/react'
import {
  DuplicateIcon,
  PlusIcon,
  TrashIcon,
  ViewGridIcon,
} from '@heroicons/react/outline'

import { blocksAtom } from 'lib/atoms/form'
import blockTypes from 'lib/blocks.json'
import { formBlock } from 'lib/types/form'
import { useBlocks } from 'lib/hooks/useBlocks'

const EditableBlock = ({
  setIsCommand,
  block,
  setLatestBlock,
  fetchedBlock,
}: {
  setIsCommand: any
  block: formBlock
  setLatestBlock: any
  fetchedBlock: formBlock
}) => {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [LIIndex, setLIIndex] = React.useState<number>(0)
  const ULRef = React.useRef<any>(null)
  const [showPlaceholder, setShowPlaceholder] = React.useState<boolean>(true)
  const [showBlockSelect, setShowBlockSelect] = React.useState<boolean>(false)
  const [options, setOptions] = React.useState<any[]>(blockTypes)
  const { addBlock, removeBlock } = useBlocks()

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
              setBlocks((prev) => {
                const next = [...prev]
                const index = next.findIndex((e) => e.id === block.id)
                next[index] = { ...options[selectedBlock], id: block.id }
                return next
              })
              if (block.id) {
                const target = document.getElementById(
                  block?.id
                ) as HTMLDivElement
                target.textContent = null
                setShowPlaceholder(true)
              }
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
  }, [showBlockSelect, options, setIsCommand, block, setBlocks])

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
    <div
      className="relative group draggable-block"
      style={{
        // hack to prevent other block elements to appear above current block
        // this sets z-index hierarchy by highest to lowest on the block tree
        zIndex: blocks.length - blocks.findIndex((e) => e.id === block.id),
      }}
    >
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
                    onClick={() => {
                      const newBlock = addBlock(block, block.id)
                      setLatestBlock(newBlock)
                    }}
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
                    onClick={() => {
                      if (block.id) removeBlock(block.id)
                    }}
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
          id: block.id,
          placeholder: block.placeholder,
          contentEditable: true,
          className: cx(block.props?.className, 'my-2 focus:outline-none', {
            'before:!content-[attr(placeholder)] before:text-gray-300 before:cursor-text':
              showPlaceholder && !block.value,
            'before:text-opacity-0 group-focus-within:before:text-opacity-100 group-hover:before:text-opacity-100 before:transition-opacity':
              block.tag === 'p',
            'text-gray-400': ['input', 'textarea'].includes(block.tag),
          }),
          suppressContentEditableWarning: true,
          onInput: (e: InputEvent) => {
            const target = e.target as HTMLDivElement
            const content = target.textContent
            if (content !== '') {
              setShowPlaceholder(false)
              if (block.tag === 'p' && content?.indexOf('/') === 0) {
                setShowBlockSelect(true)
                const blockFilter = content.split('/')[1]
                setOptions(
                  blockTypes.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(blockFilter.toLowerCase())
                  )
                )
              } else {
                setBlocks((prev) => {
                  const next = [...prev]
                  const i = next.findIndex((e) => e.id === block.id)
                  next[i] = {
                    ...block,
                    value: content
                      ? `${content.toString()}`
                      : 'Untitled element',
                  }
                  return next
                })
              }
            } else {
              setShowPlaceholder(true)
              setShowBlockSelect(false)
              setBlocks((prev) => {
                const next = [...prev]
                const i = next.findIndex((e) => e.id === block.id)
                next[i] = {
                  ...block,
                  value: 'Untitled element',
                }
                return next
              })
            }
          },
        },
        fetchedBlock ? fetchedBlock.value : null
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
                    setBlocks((prev) => {
                      const next = [...prev]
                      const index = next.findIndex((e) => e.id === block.id)
                      console.log(next[index])
                      next[index] = { ...option, id: block.id }
                      return next
                    })
                    if (block.id) {
                      const target = document.getElementById(
                        block?.id
                      ) as HTMLDivElement
                      target.textContent = null
                      target.focus()
                      setShowPlaceholder(true)
                    }
                    setShowBlockSelect(false)
                  }}
                >
                  <Image
                    src={`/img/blocks/${option.icon}`}
                    alt="Icon"
                    width={20}
                    height={20}
                  />
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
