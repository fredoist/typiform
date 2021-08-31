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

export { placeCaretAtEnd }
