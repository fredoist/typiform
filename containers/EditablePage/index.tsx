import cx from 'classnames'
import ReactDragListView from 'react-drag-listview'

import { formStyle } from 'entities/form'
import { EditableBlock } from 'components/EditableBlock'

const EditablePage = () => {
  const style = formStyle.use()

  return (
    <div
      className={cx(style.fontStyle, 'mx-auto max-w-2xl px-2', {
        'max-w-7xl': style.fullWidth,
      })}
    >
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
