import { entity } from 'simpler-state'

export const formTitle = entity<string | null>(null)

export const formStyle = entity<{
  fontStyle: string
  smallText: boolean
  fullWidth: boolean
}>({
  fontStyle: 'font-sans',
  smallText: false,
  fullWidth: false,
})

export const formOptions = entity<{
  publicResponses: boolean
  lockedResponses: boolean
}>({
  publicResponses: true,
  lockedResponses: false,
})

export const formHeader = entity<{
  icon: string | null
  header: string | null
}>({
  icon: null,
  header: null,
})
