import { atom } from 'jotai'
import { formBlock, formHeader, formOptions, formStyle } from 'lib/types/form'

export const titleAtom = atom<string | null>(null)

export const headerAtom = atom<formHeader>({
  icon: undefined,
  cover: undefined,
})

export const styleAtom = atom<formStyle>({
  fontStyle: 'font-sans',
  smallText: false,
  fullWidth: false,
})

export const optionsAtom = atom<formOptions>({
  publicResponses: false,
  lockedResponses: false,
})

export const blocksAtom = atom<Array<formBlock>>([])
