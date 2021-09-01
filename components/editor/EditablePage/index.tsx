import * as React from 'react'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import cx from 'classnames'
import ReactDragListView from 'react-drag-listview'

import definedBlocks from 'lib/blocks.json'
import { EditableBlock } from 'components/editor/EditableBlock'
import { titleAtom } from 'lib/atoms/form'
import { formBlock, formStyle } from 'lib/types/form'
import { placeCaretAtEnd } from 'lib/utils/placeCaretAtEnd'
import { useBlocks } from 'lib/hooks/useBlocks'
import { useFormFetch } from 'lib/hooks/useFormFetch'

const EditablePage = ({
  title,
  blocks,
  style,
}: {
  title: string | null
  blocks: formBlock[]
  style: formStyle
}) => {
  const router = useRouter()
  const { id } = router.query
  const { form } = useFormFetch(`${id}`)
  const [, setTitle] = useAtom(titleAtom)
  const [isCommand, setIsCommand] = React.useState<boolean>(false)
  const [latestBlock, setLatestBlock] = React.useState<formBlock | null>(null)
  const { addBlock, moveBlock, removeBlock } = useBlocks()

  React.useEffect(() => {
    if (latestBlock && latestBlock.id) {
      const block = document.getElementById(latestBlock?.id) as HTMLDivElement
      block.focus()
      placeCaretAtEnd(block)
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
            const block = addBlock(definedBlocks[0], target.id)
            setLatestBlock(block)
          }
          break
        case 'Backspace':
          if (target.textContent === '') {
            e.preventDefault()
            e.stopPropagation()
            const index = blocks.findIndex((block) => block.id === target.id)
            removeBlock(target.id)
            if (blocks.length > 1) {
              setLatestBlock(blocks[index - 1])
            } else if (blocks.length === 1) {
              placeCaretAtEnd(
                document.getElementById('form-title') as HTMLDivElement
              )
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
              if (blocks[0].id) {
                placeCaretAtEnd(
                  document.getElementById(blocks[0].id) as HTMLDivElement
                )
              }
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
              placeCaretAtEnd(
                document.getElementById('form-title') as HTMLDivElement
              )
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
      className={cx(style.fontStyle, 'mx-auto px-2', {
        'max-w-5xl': style.fullWidth,
        'max-w-xl': !style.fullWidth,
        'text-sm': style.smallText,
        'text-base': !style.smallText,
      })}
    >
      <div
        id="form-title"
        contentEditable
        suppressContentEditableWarning
        placeholder="Untitled form"
        className={cx(
          style.fontStyle,
          'mt-2 mb-6 font-bold leading-none focus:outline-none',
          {
            'text-xl lg:text-2xl': style.smallText,
            'text-2xl lg:text-3xl': !style.smallText,
            'before:!content-[attr(placeholder)] before:text-gray-300 before:cursor-text':
              !title,
          }
        )}
        onInput={(e) => {
          const target = e.target as HTMLDivElement
          const content = target.textContent
          if (content !== '') {
            setTitle(content)
          } else {
            setTitle(null)
          }
        }}
      >
        {form && form.title}
      </div>
      <ReactDragListView
        nodeSelector="div.draggable-block"
        handleSelector="button.draggable-block-button"
        lineClassName="draggable-block-line"
        onDragEnd={moveBlock}
      >
        {blocks.map((block, index) => (
          <EditableBlock
            key={block.id}
            setIsCommand={setIsCommand}
            block={block}
            fetchedBlock={form && form.blocks[index]}
            setLatestBlock={setLatestBlock}
          />
        ))}
      </ReactDragListView>
    </div>
  )
}

export { EditablePage }
