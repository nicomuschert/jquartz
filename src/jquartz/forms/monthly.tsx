import { createSelect, createTimeFields } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createMonthlyForm: QuartzFormFactoryFn = (key, uname, onChange) => {
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

    dayLabel: <label for={`${name}-day`}> Day </label>,
    weekLabel: <label for={`${name}-week`}> The </label>,

    dayNumber: createSelect('day').on('change', onChangeDay),
    dayMonthNumber: createSelect('monthnum').on('change', onChangeDay),

    weekNthWeekday: createSelect('nth').on('change', onChangeWeek),
    weekWeekday: createSelect('weekday').on('change', onChangeWeek),
    weekMonthNumber: createSelect('monthnum').on('change', onChangeWeek),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td><o.dayRadio /></td>
        <td><o.dayLabel /><o.dayNumber /> of every <o.dayMonthNumber /> month(s)</td>
      </tr>
      <tr>
        <td><o.weekRadio /></td>
        <td><o.weekLabel /><o.weekNthWeekday /> <o.weekWeekday /> of every <o.weekMonthNumber /></td>
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
      const everyMonths = model.dayMonthNumber.val()
      return `${second} ${minute} ${hour} ${dom} ${everyMonths === '1' ? '*' : '1/' + everyMonths} ? *`
    }

    const wd = model.weekWeekday.val()
    const nth = model.weekNthWeekday.val()
    const everyMonths = model.weekMonthNumber.val()
    return `${second} ${minute} ${hour} ? ${everyMonths === '1' ? '*' : '1/' + everyMonths} ${wd}#${nth} *`
  }

  const setQuartz = (quartz: Quartz) => {
    model.startHour.val(quartz.h)
    model.startMinute.val(quartz.m)
    model.startSecond.val(quartz.s)

    const everyMonth = quartz.month === '*' ? '1' : quartz.month.split('/')[1]
    if (quartz.dom !== '?') {
      model.dayNumber.val(quartz.dom)
      model.dayMonthNumber.val(everyMonth)
    } else {
      const [wd, nth] = quartz.dow.split('#')
      model.weekRadio.prop('checked', true)
      model.weekMonthNumber.val(everyMonth)
      model.weekNthWeekday.val(nth)
      model.weekWeekday.val(wd)
    }
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^\d+\s\d+\s\d+\s[1-9]\d?\s\*\s\?\s\*/,
      /^\d+\s\d+\s\d+\s[1-9]\d?\s1\/\d+\s\?\s\*/,
      /^\d+\s\d+\s\d+\s\?\s1\/[1-9][0-2]?\s[a-z]+#\d\s\*/i,
      /^\d+\s\d+\s\d+\s\?\s\*\s[a-z]+#\d\s\*/i,
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
