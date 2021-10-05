import { useAtom } from 'jotai'
import { blocksAtom } from 'lib/atoms/form'
import { formBlock } from 'lib/types/form'
import { createID } from 'lib/utils/createID'

function useBlocks() {
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const addBlock = (block: formBlock, nextTo?: string) => {
    block = { ...block, id: createID(`tf-block`) }
    setBlocks((prev) => {
      const next = [...prev]
      const index = next.findIndex((block) => block.id === nextTo)
      next.splice(index + 1, 0, block)
      return next
    })
    return block
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setBlocks((prev) => {
      const next = [...prev]
      const block = next.splice(fromIndex, 1)[0]
      next.splice(toIndex, 0, block)
      return next
    })
  }

  const removeBlock = (id: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  return { blocks, addBlock, moveBlock, removeBlock }
}

export { useBlocks }
