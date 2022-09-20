import { createSelect, createTimeFields } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createDailyForm: QuartzFormFactoryFn = (key, uname, onChange) => {
  const onChangeEvery = () => {
    model.everyRadio.is(':checked') || model.everyRadio.prop('checked', true)
    onChange && onChange()
  }

  const onChangeClock = () => {
    model.clockRadio.is(':checked') || model.clockRadio.prop('checked', true)
    onChange && onChange()
  }

  const [everyHour, everyMinute, everySecond] = createTimeFields(onChangeEvery)
  const [clockHour, clockMinute, clockSecond] = createTimeFields(onChangeClock)
  const name = `${key}-${uname}`
  const model = {
    everyHour, everyMinute, everySecond,
    clockHour, clockMinute, clockSecond,

    everyRadio: <input type="radio" value="every" onchange={onChange} name={name} id={`${name}-every`} checked />,
    clockRadio: <input type="radio" value="clock" onchange={onChange} name={name} id={`${name}-clock`} />,

    everyLabel: <label for={`${name}-every`}> Every </label>,
    clockLabel: <label for={`${name}-clock`}> Every week day at </label>,

    everyNDays: createSelect('nday').on('change', onChangeEvery),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td><o.everyRadio /></td>
        <td><o.everyLabel /><o.everyNDays /> day(s) at <o.everyHour />:<o.everyMinute /><o.everySecond /></td>
      </tr>
      <tr>
        <td><o.clockRadio /></td>
        <td><o.clockLabel /><o.clockHour />:<o.clockMinute />:<o.clockSecond /></td>
      </tr>
    </tbody></table>)

  const toString = () => {
    if (model.clockRadio.is(':checked')) {
      const hour = model.clockHour.val()
      const minute = model.clockMinute.val()
      const second = model.clockSecond.val()
      return `${second} ${minute} ${hour} ? * MON-FRI *`
    }
    const hour = model.everyHour.val()
    const minute = model.everyMinute.val()
    const second = model.everySecond.val()
    const everyNDays = model.everyNDays.val()
    return `${second} ${minute} ${hour} ${everyNDays === '1' ? '*' : '1/' + everyNDays} * ? *`
  }

  const setQuartz = (quartz: Quartz) => {
    if (quartz.dow.includes('MON-FRI')) {
      model.clockRadio.prop('checked', true)
      model.clockHour.val(quartz.h)
      model.clockMinute.val(quartz.m)
      model.clockSecond.val(quartz.s)
    } else {
      model.everyRadio.prop('checked', true)
      model.everyHour.val(quartz.h)
      model.everyMinute.val(quartz.m)
      model.everySecond.val(quartz.s)
      model.everyNDays.val(quartz.dom === '*' ? '1' : quartz.dom.split('/')[1])
    }
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^\d+\s\d+\s\d+\s1\/\d+\s\*\s\?\s\*/,
      /^\d+\s\d+\s\d+\s\*\s\*\s\?\s\*/,  // daily at 6:00 is the same as "hourly, every day at 6:00"
      /^\d+\s\d+\s\d+\s\?\s\*\smon-fri\s\*/i
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
