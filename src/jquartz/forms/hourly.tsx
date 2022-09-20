import { createSelect, createTimeFields } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createHourlyForm: QuartzFormFactoryFn = (key, uname, onChange) => {
  const [dayHour, dayMinute, daySecond] = createTimeFields(onChange)
  const name = `${key}-${uname}`
  const model = {
    dayHour, dayMinute, daySecond,

    hourRadio: <input type="radio" value="hour" onchange={onChange} name={name} id={`${name}-hour`} checked />,
    dayRadio: <input type="radio" value="day" onchange={onChange} name={name} id={`${name}-day`} />,

    hourLabel: <label for={`${name}-hour`}> Every </label>,
    dayLabel: <label for={`${name}-day`}> Every day at </label>,

    hourNHour: createSelect('nhour').on('change', onChange),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td><o.hourRadio /></td>
        <td><o.hourLabel /><o.hourNHour /> hour(s)</td>
      </tr>
      <tr>
        <td><o.dayRadio /></td>
        <td><o.dayLabel /><o.dayHour />:<o.dayMinute />:<o.daySecond /></td>
      </tr>
    </tbody></table>)

  const toString = () => {
    if (model.dayRadio.is(':checked')) {
      const hour = model.dayHour.val()
      const minute = model.dayMinute.val()
      const second = model.daySecond.val()
      return `${second} ${minute} ${hour} * * ? *`
    }
    const everyNHour = model.hourNHour.val()
    return `0 0 ${everyNHour === '1' ? '*' : '0/' + everyNHour} * * ? *`
  }

  const setQuartz = (quartz: Quartz) => {
    if (quartz.h === '*' || quartz.h.includes('/')) {
      model.hourRadio.prop('checked', true)
      model.hourNHour.val(quartz.h === '*' ? '1' : quartz.h.split('/')[1])
    } else {
      model.dayRadio.prop('checked', true)
      model.dayHour.val(quartz.h)
      model.dayMinute.val(quartz.m)
      model.daySecond.val(quartz.s)
    }
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^0\s0\s0\/\d+\s\*\s\*\s\?\s\*/,
      /^0\s0\s\*\s\*\s\*\s\?\s\*/,
      /^\d+\s\d+\s\d+\s\*\s\*\s\?\s\*/,
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
