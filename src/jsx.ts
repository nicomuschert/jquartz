export const _jsxLayout = (model: { [k: string]: any }, cb: (_: { [k: string]: () => JSX.Element }) => any) =>
  cb(model as any) as unknown as JQuery

export const _jsx = (el: string | JQuery | (() => JQuery), attrs: JQuery.PlainObject<any>, ...content: any) => {
  const undef = () => $('<b>').text('!')
  const jq = (typeof el === 'function' ? el() : typeof el === 'string' ? $(document.createElement(el)) : el || undef())
  jq.append(content.reduce((acc: any, c: any) => acc.add(typeof c === 'string' ? document.createTextNode(c) : c), $()))
  Object.entries(attrs || {}).forEach(([key, value]) => {
    if (typeof value === 'function') jq.on(key.slice(2), value)
    else jq.attr(key, value)
  })
  return jq
}
