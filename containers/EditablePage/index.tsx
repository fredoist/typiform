import cx from 'classnames'
import ReactDragListView from 'react-drag-listview'

import { formStyle, formTitle } from 'entities/form'
import { EditableBlock } from 'components/EditableBlock'

const EditablePage = () => {
  const title = formTitle.use()
  const style = formStyle.use()

  return (
    <div
      className={cx(style.fontStyle, 'mx-auto max-w-2xl px-2', {
        'max-w-7xl': style.fullWidth,
      })}
    >
      <h1
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
        handleSelector="button.draggable-button"
        lineClassName="draggable-block-line"
        onDragEnd={(fromIndex: number, toIndex: number): void => {
          // update blocks state
        }}
      >
        <EditableBlock />
      </ReactDragListView>
    </div>
  )
}

export { EditablePage }
