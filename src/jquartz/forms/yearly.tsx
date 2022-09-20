import { createSelect, createTimeFields } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createYearlyForm: QuartzFormFactoryFn = (key, uname, onChange) => {
  const onChangeDay = () => {
    model.dayRadio.is(':checked') || model.dayRadio.prop('checked', true)
    onChange && onChange()
  }

  const onChangeWeek = () => {
    model.weekRadio.is(':checked') || model.weekRadio.prop('checked', true)
    onChange && onChange()
  }

  const [startHour, startMinute, startSecond] = createTimeFields(onChange)
  const name = `${key}-${uname}`
  const model = {
    startHour, startMinute, startSecond,

    dayRadio: <input type="radio" value="day" onchange={onChange} name={name} id={`${name}-day`} checked />,
    weekRadio: <input type="radio" value="week" onchange={onChange} name={name} id={`${name}-week`} />,

    dayLabel: <label for={`${name}-day`}> Every </label>,
    weekLabel: <label for={`${name}-week`}> The </label>,

    dayMonth: createSelect('month').on('change', onChangeDay),
    dayNumber: createSelect('day').on('change', onChangeDay),

    weekNthWeekday: createSelect('nth').on('change', onChangeWeek),
    weekWeekday: createSelect('weekday').on('change', onChangeWeek),
    weekMonth: createSelect('month').on('change', onChangeWeek),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td><o.dayRadio /></td>
        <td><o.dayLabel /><o.dayMonth /> <o.dayNumber /></td>
      </tr>
      <tr>
        <td><o.weekRadio /></td>
        <td><o.weekLabel /><o.weekNthWeekday /> <o.weekWeekday /> of <o.weekMonth /></td>
      </tr>
      <tr>
        <td colspan="2">Start time <o.startHour />:<o.startMinute />:<o.startSecond /></td>
      </tr>
    </tbody></table>)

  const toString = () => {
    const hour = model.startHour.val()
    const minute = model.startMinute.val()
    const second = model.startSecond.val()

    if (model.dayRadio.is(':checked')) {
      const dom = model.dayNumber.val()
      const month = model.dayMonth.val()
      return `${second} ${minute} ${hour} ${dom} ${month} ? *`
    }

    const month = model.weekMonth.val()
    const weekday = model.weekWeekday.val()
    const nthWeekday = model.weekNthWeekday.val()

    return `${second} ${minute} ${hour} ? ${month} ${weekday}#${nthWeekday} *`
  }

  const setQuartz = (quartz: Quartz) => {
    model.startHour.val(quartz.h)
    model.startMinute.val(quartz.m)
    model.startSecond.val(quartz.s)

    if (quartz.dom !== '?') {
      model.dayRadio.prop('checked', true)
      model.dayNumber.val(quartz.dom)
      model.dayMonth.val(quartz.month)
    } else {
      const [weekday, nthWeekday] = quartz.dow.split('#')
      model.weekRadio.prop('checked', true)
      model.weekMonth.val(quartz.month)
      model.weekWeekday.val(weekday)
      model.weekNthWeekday.val(nthWeekday)
    }
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^\d+\s\d+\s\d+\s\d+\s+\d+\s\?\s\*/,
      /^\d+\s\d+\s\d+\s\?\s\d+\s[a-z]+#\d\s\*/i,
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
