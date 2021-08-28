import * as React from 'react'
import cx from 'classnames'
import ReactDragListView from 'react-drag-listview'

import { formStyle, formTitle, formBlocks } from 'lib/entities/form'
import { EditableBlock } from 'components/EditableBlock'
import { createID } from 'lib/utils/createID'
import { Block } from 'lib/interfaces/Block'

const EditablePage = () => {
  const title = formTitle.use()
  const style = formStyle.use()
  const blocks = formBlocks.use()
  const [isCommand, setIsCommand] = React.useState<boolean>(false)
  const [latestBlock, setLatestBlock] = React.useState<Block | null>(null)

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
    if (latestBlock && latestBlock.blockID) {
      ;(document.getElementById(latestBlock?.blockID) as HTMLDivElement).focus()
      placeCaretAtEnd(
        document.getElementById(latestBlock?.blockID) as HTMLDivElement
      )
    }
  }, [latestBlock])

  function handleGlobalKeyboar(e: React.KeyboardEvent) {
    if (!isCommand) {
      const target = e.target as HTMLDivElement
      let i: number, next: Block
      switch (e.key) {
        case 'Enter':
          if (!isCommand) {
            e.preventDefault()
            e.stopPropagation()
            const block = {
              blockID: createID('tf-block'),
              tag: 'p',
              hint: "Type '/' to add a command",
              props: {
                className: 'py-1',
              },
            }
            formBlocks.set((prev) => {
              const next = [...prev]
              const index = next.findIndex(
                (block) => block.blockID === target.id
              )
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
            const index = blocks.findIndex(
              (block) => block.blockID === target.id
            )
            formBlocks.set((prev) =>
              prev.filter((block) => block.blockID !== target.id)
            )
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
              if (blocks[0].blockID)
                document.getElementById(blocks[0].blockID)?.focus()
            } else {
              i = blocks.findIndex((block) => block.blockID === target.id)
              setLatestBlock(blocks[i + 1])
            }
          }
          break
        case 'ArrowUp':
          if (blocks.length > 0) {
            i = blocks.findIndex((block) => block.blockID === target.id)
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
            formTitle.set(content)
          } else {
            formTitle.set(null)
          }
        }}
      />
      <ReactDragListView
        nodeSelector="div.draggable-block"
        handleSelector="button.draggable-block-button"
        lineClassName="draggable-block-line"
        onDragEnd={(fromIndex: number, toIndex: number): void => {
          formBlocks.set((prev) => {
            const data = [...prev]
            const item = data.splice(fromIndex, 1)[0]
            data.splice(toIndex, 0, item)
            return data
          })
        }}
      >
        {blocks.map((block) => (
          <EditableBlock
            key={block.blockID}
            setIsCommand={setIsCommand}
            block={block}
          />
        ))}
      </ReactDragListView>
    </div>
  )
}

export { EditablePage }
