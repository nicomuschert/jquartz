type JQuartz = JQuery & {
  jQuartz: JQuartzFn
}

type JQuartzFn = (o: JQuartzOptions) => JQuery<HTMLElement>
type PeriodType = 'yearly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'minutes' | 'seconds'
type JQuartzOptions = {
  orderedPeriodTypes?: PeriodType[],
  renderSection?: (period: string, model: object, _: any[]) => JQuery<HTMLElement>,
}
