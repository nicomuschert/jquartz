import { createSelect } from '../elements'
import { _jsx, _jsxLayout } from '../../jsx'


export const createSecondsForm: QuartzFormFactoryFn = (_key, _uname, onChange) => {
  const model = {
    nSecond: createSelect('nsecond').val(30).on('change', onChange),
  }

  const form = _jsxLayout(model, (o) =>
    <table><tbody>
      <tr>
        <td>Every <o.nSecond /> second(s)</td>
      </tr>
    </tbody></table>)

  const toString = () => {
    const nSecond = model.nSecond.val()
    return `${nSecond === '1' ? '*' : '0/' + nSecond} * * * * ? *`
  }

  const setQuartz = (quartz: Quartz) => {
    model.nSecond.val(quartz.s === '*' ? '1' : quartz.s.split('/')[1])
  }

  const acceptQuartz = ({ expression }: Quartz) => {
    return [
      /^0\/\d+\s\*\s\*\s\*\s\*\s\?\s\*/,
      /^\*\s\*\s\*\s\*\s\*\s\?\s\*/,
    ].reduce((b, exp) => b || exp.test(expression), false)
  }

  return { model, form, toString, setQuartz, acceptQuartz }
}
