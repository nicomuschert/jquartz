export const splitQuartz = (expression: string): Quartz => {
  const [s, m, h, dom, month, dow, year] = expression.trim().toUpperCase().split(' ')
  return { expression, s, m, h, dom, month, dow, year }
}
