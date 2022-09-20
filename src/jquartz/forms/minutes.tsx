import { createSelect } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createMinutesForm: QuartzFormFactoryFn = (key, _uname, onChange = null) => {
  const model = {
    nMinute: createSelect('nminute').val(5).on('change', onChange),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td>Every <o.nMinute /> minute(s)</td>
      </tr>
    </tbody></table>)

  const toString = () => {
    const nMinute = model.nMinute.val()
    return `0 ${nMinute === '1' ? '*' : '0/' + nMinute} * * * ? *`
  }

  const setQuartz = (quartz: Quartz) => {
    model.nMinute.val(quartz.m === '*' ? '1' : quartz.m.split('/')[1])
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^0\s0\/\d+\s\*\s\*\s\*\s\?\s\*/,
      /^0\s\*\s\*\s\*\s\*\s\?\s\*/
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { key, model, form, toString, setQuartz, acceptQuartz }
}
