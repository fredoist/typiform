function sanitize(string: string) {
  const map: any = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '.': '_', // https://github.com/react-hook-form/react-hook-form/issues/676
  }
  const reg = /[&<>"'/\.]/gi
  return string.replace(reg, (match: string) => map[match])
}

export { sanitize }
