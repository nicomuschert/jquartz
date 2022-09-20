import { createCheckboxes, createLabels, createTimeFields } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createWeeklyForm: QuartzFormFactoryFn = (_key, uname, onChange) => {
  const weekdays = createCheckboxes('weekday', `weekday-${uname}`).on('change', onChange)
  const labels = createLabels('weekday', `weekday-${uname}`)

  const [startHour, startMinute, startSecond] = createTimeFields(onChange)
  const model = {
    startHour, startMinute, startSecond,

    dayMon: $(weekdays[0]),
    dayTue: $(weekdays[1]),
    dayWed: $(weekdays[2]),
    dayThu: $(weekdays[3]),
    dayFri: $(weekdays[4]),
    daySat: $(weekdays[5]),
    daySun: $(weekdays[6]),

    labelMon: $(labels[0]),
    labelTue: $(labels[1]),
    labelWed: $(labels[2]),
    labelThu: $(labels[3]),
    labelFri: $(labels[4]),
    labelSat: $(labels[5]),
    labelSun: $(labels[6]),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td><o.dayMon /><o.labelMon /></td>
        <td><o.dayTue /><o.labelTue /></td>
        <td><o.dayWed /><o.labelWed /></td>
        <td><o.dayThu /><o.labelThu /></td>
      </tr>
      <tr>
        <td><o.dayFri /><o.labelFri /></td>
        <td><o.daySat /><o.labelSat /></td>
        <td colspan="2"><o.daySun /><o.labelSun /></td>
      </tr>
      <tr>
        <td colspan="4">Start time <o.startHour />:<o.startMinute />:<o.startSecond /></td>
      </tr>
    </tbody></table>)

  const toString = () => {
    const hour = model.startHour.val()
    const minute = model.startMinute.val()
    const second = model.startSecond.val()
    const list = weekdays.filter(':checked').toArray().map(e => e.value).join(',') || '*'
    return `${second} ${minute} ${hour} ? * ${list} *`
  }

  const setQuartz = (quartz: Quartz) => {
    weekdays.each((_, e) => { e.checked = quartz.dow.includes(e.value) })
    model.startHour.val(quartz.h)
    model.startMinute.val(quartz.m)
    model.startSecond.val(quartz.s)
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^\d+\s\d+\s\d+\s\?\s\*\s\*\s\*$/,
      /^\d+\s\d+\s\d+\s\?\s\*\s[a-z,]+\s\*/i,
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
