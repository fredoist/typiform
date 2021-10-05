export function createID(prefix: string) {
  const random = Math.random().toString(36).substr(2, 9) + Date.now().toString()
  return `${prefix}--${random}`
}
