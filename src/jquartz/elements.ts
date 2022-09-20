const numbers = Array(101).fill(null).map((_, i) => `${i}`)
const numbers0 = numbers.map(n => `0${n}`.slice(-2))

const constants: { [key: string]: string[] } = {
  period_values: ['yearly', 'monthly', 'weekly', 'daily', 'hourly', 'minutes', 'seconds'],
  period_labels: ['Yearly', 'Monthly', 'Weekly', 'Daily', 'Hourly', 'Minutes', 'Seconds'],

  nth_values: numbers.slice(1, 5),
  nth_labels: ['First', 'Second', 'Third', 'Forth'],

  day_values: numbers.slice(1, 32),
  day_labels: numbers.slice(1, 32),

  nday_values: numbers.slice(1, 101),
  nday_labels: numbers.slice(1, 101),

  weekday_values: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  weekday_labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],

  month_values: numbers.slice(1, 13),
  month_labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December'],

  monthnum_values: numbers.slice(1, 13),
  monthnum_labels: numbers.slice(1, 13),

  hour_values: numbers.slice(0, 24),
  hour_labels: numbers0.slice(0, 24),

  nhour_values: numbers.slice(1, 25),
  nhour_labels: numbers.slice(1, 25),

  minute_values: numbers.slice(0, 60),
  minute_labels: numbers0.slice(0, 60),

  nminute_values: numbers.slice(1, 61),
  nminute_labels: numbers.slice(1, 61),

  second_values: numbers.slice(0, 60),
  second_labels: numbers0.slice(0, 60),

  nsecond_values: numbers.slice(1, 61),
  nsecond_labels: numbers.slice(1, 61),
}

export const getElementConstantValues = (what: string) => constants[`${what}_values`]
export const getElementConstantLabels = (what: string) => constants[`${what}_labels`]

export const createTimeFields = (onChange: any = null) => ([
  createSelect('hour').val(12).on('change', onChange),
  createSelect('minute').on('change', onChange),
  createSelect('second').on('change', onChange),
])

export const createSelect = (what: string) => {
  const labels = getElementConstantLabels(what)
  return getElementConstantValues(what).reduce((acc, value, i) =>
    acc.append($('<option>').attr({ value }).text(labels[i])), $('<select>'))
}

export const createCheckboxes = (what: string, idPrefix: string) =>
  getElementConstantValues(what).reduce((acc, value) => acc.add($('<input type="checkbox">')
    .attr({ value, id: `${idPrefix}-${value}` })), $()) as JQuery<HTMLInputElement>

export const createLabels = (what: string, idPrefix: string) => {
  const values = getElementConstantValues(what)
  return getElementConstantLabels(what).reduce((acc, label, i) =>
    acc.add($('<label>').text(label).attr('for', `${idPrefix}-${values[i]}`)), $())
}

export const createTabs = (
  what: string,
  uname: string,
  initialValue: string,
  onChange: (value: string) => void,
  order?: string[]
) => {
  const labels = getElementConstantLabels(what)
  const values = getElementConstantValues(what)
  return (order || values).reduce((acc, value) => {
    if ((order || values).includes(value)) {
      const name = `jquartz-tab-${uname}`
      const id = `${name}-${value}`
      acc.options[value] = $('<input type="radio">')
        .prop('checked', value === initialValue)
        .attr({ id, name })
        .on('change', () => onChange && onChange(value))
      const label = $('<label>').attr('for', id)
        .append(acc.options[value])
        .append($('<div>').text(labels[values.indexOf(value)] || '?'))
      acc.form.append(label)
    }
    return acc
  }, {
    form: $('<div class="jqartz-tabs">'),
    options: {} as { [_: string]: JQuery }
  })
}
