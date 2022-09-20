type PeriodType = 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'minutes' | 'seconds'
type JQuartzOptions = {
  ui?: HTMLElement|JQuery<HTMLElement>,
  periods?: PeriodType[],
}

type QuartzFormFactoryFn = (key: string, uname: string, onChange: any) => QuartzForm
type QuartzFormInstance = QuartzForm & { key: string }
type QuartzForm = {
  form: JQuery
  model: { [_: string]: JQuery }
  toString: () => string
  setQuartz: (quartz: Quartz) => void
  acceptQuartz: (quartz: Quartz) => boolean
}

type Quartz = {
  expression: string
  s: string
  m: string
  h: string
  dom: string
  month: string
  dow: string
  year: string
}

interface JQuery {
    jQuartz(o: JQuartzOptions): JQuery;
}

declare namespace JSX {
  type Element = any
  interface IntrinsicElements {
    [key: string]: any
  }
}
