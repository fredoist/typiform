import * as React from 'react'
import { useAtom } from 'jotai'
import cx from 'classnames'
import ReactDragListView from 'react-drag-listview'

import { EditableBlock } from 'components/EditableBlock'
import { createID } from 'lib/utils/createID'
import { blocksAtom, styleAtom, titleAtom } from 'lib/atoms/form'
import { formBlock } from 'lib/types/form'

const EditablePage = () => {
  const [title, setTitle] = useAtom(titleAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [isCommand, setIsCommand] = React.useState<boolean>(false)
  const [latestBlock, setLatestBlock] = React.useState<formBlock | null>(null)

  React.useEffect(() => {
    function placeCaretAtEnd(el: HTMLDivElement) {
      el.focus()
      if (
        typeof window.getSelection != 'undefined' &&
        typeof document.createRange != 'undefined'
      ) {
        var range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        var sel: Selection | null = window.getSelection()
        if (sel) {
          sel.removeAllRanges()
          sel.addRange(range)
        }
      }
    }
    if (latestBlock && latestBlock.id) {
      ;(document.getElementById(latestBlock?.id) as HTMLDivElement).focus()
      placeCaretAtEnd(
        document.getElementById(latestBlock?.id) as HTMLDivElement
      )
    }
  }, [latestBlock])

  function handleGlobalKeyboar(e: React.KeyboardEvent) {
    if (!isCommand) {
      const target = e.target as HTMLDivElement
      let i: number
      switch (e.key) {
        case 'Enter':
          if (!isCommand) {
            e.preventDefault()
            e.stopPropagation()
            const block = {
              id: createID('tf-block'),
              tag: 'p',
              hint: "Type '/' to add a command",
              props: {
                className: 'py-1',
              },
            }
            setBlocks((prev) => {
              const next = [...prev]
              const index = next.findIndex((block) => block.id === target.id)
              next.splice(index + 1, 0, block)
              return next
            })
            setLatestBlock(block)
          }
          break
        case 'Backspace':
          if (target.textContent === '') {
            e.preventDefault()
            e.stopPropagation()
            const index = blocks.findIndex((block) => block.id === target.id)
            setBlocks((prev) => prev.filter((block) => block.id !== target.id))
            if (blocks.length > 1) {
              setLatestBlock(blocks[index - 1])
            } else if (blocks.length === 1) {
              ;(
                document.getElementById('form-title') as HTMLHeadingElement
              ).focus()
            } else {
              setLatestBlock(blocks[0])
            }
          }
          break
        case 'ArrowDown':
          if (blocks.length > 0) {
            e.preventDefault()
            e.stopPropagation()
            if (target.id === 'form-title') {
              setLatestBlock(blocks[0])
              if (blocks[0].id) document.getElementById(blocks[0].id)?.focus()
            } else {
              i = blocks.findIndex((block) => block.id === target.id)
              setLatestBlock(blocks[i + 1])
            }
          }
          break
        case 'ArrowUp':
          if (blocks.length > 0) {
            i = blocks.findIndex((block) => block.id === target.id)
            if (i >= 1) {
              setLatestBlock(blocks[i - 1])
            } else {
              ;(
                document.getElementById('form-title') as HTMLHeadingElement
              ).focus()
            }
          } else {
            setLatestBlock(blocks[0])
          }
          break
      }
    }
  }

  return (
    <div
      onKeyDown={handleGlobalKeyboar}
      className={cx(style.fontStyle, 'mx-auto max-w-2xl px-2', {
        'max-w-7xl': style.fullWidth,
      })}
    >
      <div
        id="form-title"
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
            setTitle(content)
          } else {
            setTitle(null)
          }
        }}
      />
      <ReactDragListView
        nodeSelector="div.draggable-block"
        handleSelector="button.draggable-block-button"
        lineClassName="draggable-block-line"
        onDragEnd={(fromIndex: number, toIndex: number): void => {
          setBlocks((prev) => {
            const data = [...prev]
            const item = data.splice(fromIndex, 1)[0]
            data.splice(toIndex, 0, item)
            return data
          })
        }}
      >
        {blocks.map((block) => (
          <EditableBlock
            key={block.id}
            setIsCommand={setIsCommand}
            block={block}
          />
        ))}
      </ReactDragListView>
    </div>
  )
}

export { EditablePage }
