export type formStyle = {
  fontStyle: string
  smallText: boolean
  fullWidth: boolean
}

export type formOptions = {
  publicResponses: boolean
  lockedResponses: boolean
}

export type formHeader = {
  icon: string | undefined
  cover: string | undefined
}

export type formBlock = {
  tag: string
  id?: string
  placeholder?: string
  value?: string | null
  icon: string
  props?: {
    className?: string // defined classes styling
    style?: React.CSSProperties // optional add style attribute
    placeholder?: string // wheter the element has a predefined placeholder
  }
  childrens?: Array<formBlock>
}
