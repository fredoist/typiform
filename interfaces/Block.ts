export interface Block {
  id?: string // unique identifier for this block
  label?: string
  blockID?: string // a random id is going to be generated for each block
  tag: string // the tag it will render, editor uses strictly divs
  // label: string // label value for block selector
  // icon: string // which icon is going to be used
  hint: string | null // the placeholder for the editor
  multiple?: boolean // if multiple a new element template will be cloned below
  icon?: any // icon
  props: {
    className: string // defined classes styling
    style?: object // optional add style attribute
    value?: string | null // wheter the element has a predefined value
    placeholder?: string // wheter the element has a predefined placeholder
  }
}
