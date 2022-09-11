($.fn as JQuartz).jQuartz = function(options = {}) {
  const quartzInput = $(this)
  const form = createQuartzForm(quartzInput, options)
  quartzInput.parent().append(form)
  return quartzInput
}

const DEFAULT_PERIOD_TYPES: PeriodType[] = ['yearly', 'monthly', 'weekly', 'daily', 'hourly', 'minutes', 'seconds']
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const WEEKDAYS_SHORT: string[] = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
  'November', 'December']
const NTH = ['First', 'Second', 'Third', 'Forth']


let formCount = 0
const createQuartzForm = (quartzInput: JQuery<HTMLInputElement>, options: JQuartzOptions) => {
  const createYearlyForm = (periodKey: string) => {
    const name = { name: `yearly-${uname}` }
    const dayRadio = $('<input type="radio" value="day" checked>').attr({ ...name, id: `${name.name}-day` })
    const dayMonth = $('<select>').append(createOptionsFromArray(MONTHS, MONTHS.map((_, i) => i + 1)))
    const dayNumber = $('<select>').append(createOptionsFromRange(1, 31))
    const weekRadio = $('<input type="radio" value="week">').attr({ ...name, id: `${name.name}-week` })
    const weekNthWeekday = $('<select>').append(createOptionsFromArray(NTH, NTH.map((_, i) => i + 1)))
    const weekWeekday = $('<select>').append(createOptionsFromArray(WEEKDAYS, WEEKDAYS_SHORT))
    const weekMonth = $('<select>').append(createOptionsFromArray(MONTHS, MONTHS.map((_, i) => i + 1)))
    const timeForm = createTimeForm()
    const model = {
      day: {
        radio: dayRadio,
        month: dayMonth,
        day: dayNumber,
        ...timeForm.model,
      },
      week: {
        radio: weekRadio,
        nthWeekday: weekNthWeekday,
        weekday: weekWeekday,
        month: weekMonth,
        ...timeForm.model,
      },
    }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [
        [
          dayRadio,
          $('<label>').attr('for', dayRadio[0].getAttribute('id'))
            .text(' Every ').add(dayMonth).add($('<span>').text(' ')).add(dayNumber),
        ], [
          weekRadio,
          $('<label>').attr('for', weekRadio[0].getAttribute('id'))
            .text(' The ').add(weekNthWeekday).add($('<span>').text(' '))
            .add(weekWeekday).add($('<span>').text(' of ')).add(weekMonth),
        ], [
          null,
          $('<span>').text('Start time ').add(timeForm.form),
        ]
      ]),
      toQuartz: () => {
        const time = timeForm.toQuartz().split(' ', 3).join(' ')
        if (dayRadio.is(':checked')) {
          const dom = parseInt(dayNumber.val() as string)
          const m = parseInt(dayMonth.val() as string)
          return `${time} ${dom} ${m} ? *`
        }
        const nth = parseInt(weekNthWeekday.val() as string)
        const wd = weekWeekday.val() as string
        const m = parseInt(weekMonth.val() as string)
        return `${time} ? ${m} ${wd}#${nth} *`
      },
      setQuartz: (quartz: string) => {
        const q = timeForm.setQuartz(quartz)
        if (q.dom !== '?') {
          dayRadio.prop('checked', true)
          dayNumber.val(q.dom)
          dayMonth.val(q.month)
        } else {
          const [wd, nth] = q.dow.split('#')
          weekRadio.prop('checked', true)
          weekNthWeekday.val(nth)
          weekWeekday.val(wd)
          weekMonth.val(q.month)
        }
      }
    }
  }

  const createMonthlyForm = (periodKey: string) => {
    const name = { name: `monthly-${uname}` }
    const dayRadio = $('<input type="radio" value="day" checked>').attr({ ...name, id: `${name.name}-day` })
    const dayNumber = $('<select>').append(createOptionsFromRange(1, 31))
    const dayMonthNumber = $('<select>').append(createOptionsFromRange(1, 12))
    const weekRadio = $('<input type="radio" value="week">').attr({ ...name, id: `${name.name}-week` })
    const weekNthWeekday = $('<select>').append(createOptionsFromArray(NTH, NTH.map((_, i) => i + 1)))
    const weekWeekday = $('<select>').append(createOptionsFromArray(WEEKDAYS, WEEKDAYS_SHORT))
    const weekMonthNumber = $('<select>').append(createOptionsFromRange(1, 12))
    const timeForm = createTimeForm()
    const model = {
      day: {
        radio: dayRadio,
        day: dayNumber,
        month: dayMonthNumber,
        ...timeForm.model,
      },
      week: {
        radio: weekRadio,
        nthWeekday: weekNthWeekday,
        weekday: weekWeekday,
        monthNumber: weekMonthNumber,
        ...timeForm.model,
      },
    }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [
        [
          dayRadio,
          $('<label>').attr('for', dayRadio[0].getAttribute('id'))
            .text(' Day ').add(dayNumber).add($('<span>').text(' of every '))
            .add(dayMonthNumber).add($('<span>').text(' month(s)')),
        ], [
          weekRadio,
          $('<label>').attr('for', weekRadio[0].getAttribute('id'))
            .text(' The ').add(weekNthWeekday).add($('<span>').text(' ')).add(weekWeekday).add($('<span>')
              .text(' of every ')).add(weekMonthNumber).add($('<span>').text(' month(s)')),
        ], [
          null,
          $('<span>').text('Start time ').add(timeForm.form),
        ]
      ]),
      toQuartz: () => {
        const time = timeForm.toQuartz().split(' ', 3).join(' ')
        if (dayRadio.is(':checked')) {
          const dom = parseInt(dayNumber.val() as string)
          const m = parseInt(dayMonthNumber.val() as string)
          return `${time} ${dom} ${m === 1 ? '*' : '1/' + m} ? *`
        }
        const wd = weekWeekday.val() as string
        const nth = parseInt(weekNthWeekday.val() as string)
        const m = parseInt(weekMonthNumber.val() as string)
        return `${time} ? ${m === 1 ? '*' : '1/' + m} ${wd}#${nth} *`
      },
      setQuartz: (quartz: string) => {
        const q = timeForm.setQuartz(quartz)
        const month = q.month === '*' ? '1' : q.month.split('/')[1]
        if (q.dom !== '?') {
          dayNumber.val(q.dom)
          dayMonthNumber.val(month)
        } else {
          const [wd, nth] = q.dow.split('#')
          weekRadio.prop('checked', true)
          weekMonthNumber.val(month)
          weekNthWeekday.val(nth)
          weekWeekday.val(wd)
        }
      }
    }
  }

  const createWeeklyForm = (periodKey: string) => {
    const days: { [key: string]: any } = WEEKDAYS_SHORT.reduce((o, value) => Object.assign(o, {
      [value]: $('<input type="checkbox">').attr({
        value,
        name: `weekday-${uname}-${value.toLowerCase()}`,
        id: `weekday-${uname}-${value.toLowerCase()}`,
      })
    }), {})

    const labeledDays = WEEKDAYS.reduce((a, name, i) => a.add(labelCheckbox(days[WEEKDAYS_SHORT[i]], name)), $())
    const startTime = createTimeForm()
    const model = { ...days, ...startTime.model }

    return {
      model,
      form: $('<div>')
        .append((options.renderSection || createSection)(periodKey, model, [
          labeledDays.slice(0, 4).toArray(),
          labeledDays.slice(4).toArray().concat([null as any])]))
        .append($('<div>').append((options.renderSection || createSection)('_', model, [
          [$('<span>').text('Start time'), startTime.form]]))),
      toQuartz: () => {
        const list = WEEKDAYS_SHORT.filter(d => days[d].is(':checked')).join(',') || '*'
        return startTime.toQuartz().split(' ', 3).join(' ') + ` ? * ${list} *`
      },
      setQuartz: (quartz: string) => {
        const q = startTime.setQuartz(quartz)
        WEEKDAYS_SHORT.forEach(name => days[name].prop('checked', q.dow.includes(name)))
      }
    }
  }

  const createDailyForm = (periodKey: string) => {
    const name = { name: `daily-${uname}` }
    const everyRadio = $('<input type="radio" value="every" checked>').attr({ ...name, id: `${name.name}-every` })
    const everyNDays = $('<select>').append(createOptionsFromRange(1, 100))
    const clockRadio = $('<input type="radio" value="clock">').attr({ ...name, id: `${name.name}-clock` })
    const everyTime = createTimeForm()
    const clockTime = createTimeForm()
    const model = {
      every: {
        radio: everyRadio,
        ndays: everyNDays,
        ...everyTime.model,
      },
      clock: {
        radio: clockRadio,
        ...clockTime.model
      }
    }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [
        [
          everyRadio,
          $('<label>').attr('for', everyRadio[0].getAttribute('id')).text(' Every ').add(everyNDays).add($('<span>')
            .text(' day(s) at ')).add(everyTime.form)
        ], [
          clockRadio,
          $('<label>').attr('for', clockRadio[0].getAttribute('id'))
            .text(' Every week day at ').add(clockTime.form)
        ],
      ]),
      toQuartz: () => {
        if (clockRadio.is(':checked')) {
          return clockTime.toQuartz().split(' ', 3).join(' ') + ` ? * MON-FRI *`
        }
        const n = parseInt(everyNDays.val() as string)
        return everyTime.toQuartz().split(' ', 3).join(' ') + ` ${n === 1 ? '*' : '1/' + n} * ? *`
      },
      setQuartz: (quartz: string) => {
        if (quartz.includes('MON-FRI')) {
          clockRadio.prop('checked', true)
          clockTime.setQuartz(quartz)
        } else {
          const q = everyTime.setQuartz(quartz)
          everyRadio.prop('checked', true)
          everyNDays.val(q.dom === '*' ? '1' : q.dom.split('/')[1])
        }
      }
    }
  }

  const createHourlyForm = (periodKey: string) => {
    const name = { name: `hourly-${uname}` }
    const hourRadio = $('<input type="radio" value="hour" checked>').attr({ ...name, id: `${name.name}-hour` })
    const hourHour = $('<select>').append(createOptionsFromRange(1, 24))
    const dayRadio = $('<input type="radio" value="day">').attr({ ...name, id: `${name.name}-day` })
    const dayTime = createTimeForm()
    const model = {
      hour: {
        radio: hourRadio,
        hour: hourHour,
      },
      day: {
        radio: dayRadio,
        ...dayTime.model,
      },
    }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [
        [
          hourRadio,
          $('<label>').attr('for', hourRadio[0].getAttribute('id'))
            .text(' Every ').add(hourHour).add($('<span>').text(' hour(s)')),
        ], [
          dayRadio,
          $('<label>').attr('for', dayRadio[0].getAttribute('id')).text(' Every day at ').add(dayTime.form),
        ]
      ]),
      toQuartz: () => {
        if (dayRadio.is(':checked')) {
          return dayTime.toQuartz()
        }
        const h = parseInt(hourHour.val() as string)
        return `0 0 ${h === 1 ? '*' : '0/' + h} * * ? *`
      },
      setQuartz: (quartz: string) => {
        const q = splitQuartz(quartz)
        if (q.h === '*' || q.h.includes('/')) {
          hourRadio.prop('checked', true)
          hourHour.val(q.h === '*' ? '1' : q.h.split('/')[1])
        } else {
          dayRadio.prop('checked', true)
          dayTime.setQuartz(quartz)
        }
      }
    }
  }

  const createMinutesForm = (periodKey: string) => {
    const minute = $('<select>').append(createOptionsFromRange(1, 60, leadingZero))
    const model = { minute }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [[
        $('<div>').append($('<span>').text('Every ')).append(minute).append($('<span>').text(' minute(s)'))
      ]]),
      toQuartz: () => {
        const m = parseInt(minute.val() as string)
        return `0 ${m === 1 ? '*' : '0/' + m} * * * ? *`
      },
      setQuartz: (quartz: string) => {
        const q = splitQuartz(quartz)
        minute.val(q.m === '*' ? '1' : q.m.split('/')[1])
      }
    }
  }

  const createSecondsForm = (periodKey: string) => {
    const second = $('<select>').append(createOptionsFromRange(1, 60, leadingZero))
    const model = { second }

    return {
      model,
      form: (options.renderSection || createSection)(periodKey, model, [[
        $('<div>').append($('<span>').text('Every ')).append(second).append($('<span>').text(' second(s)'))
      ]]),
      toQuartz: () => {
        const s = parseInt(second.val() as string)
        return `${s === 1 ? '*' : '0/' + s} * * * * ? *`
      },
      setQuartz: (quartz: string) => {
        const q = splitQuartz(quartz)
        second.val(q.s === '*' ? '1' : q.s.split('/')[1])
      }
    }
  }

  const createTimeForm = () => {
    const hour = $('<select>').append(createOptionsFromRange(0, 23, leadingZero)).val(12)
    const minute = $('<select>').append(createOptionsFromRange(0, 59, leadingZero))
    const second = $('<select>').append(createOptionsFromRange(0, 59, leadingZero))

    const time = $()
      .add(hour)
      .add($('<span>').text(':'))
      .add(minute)
      .add($('<span>').text(':'))
      .add(second)

    return {
      form: $('<span>').append(time),
      model: { hour, minute, second },
      toQuartz: () => {
        const s = parseInt(second.val() as string)
        const m = parseInt(minute.val() as string)
        const h = parseInt(hour.val() as string)
        return `${s} ${m} ${h} * * ? *`
      },
      setQuartz: (quartz: string) => {
        const q = splitQuartz(quartz)
        hour.val(q.h)
        minute.val(q.m)
        second.val(q.s)
        return q
      }
    }
  }

  const uname = `${formCount++}-${Math.ceil(Math.random() * 1e18).toString(36)}`
  const initialValue = String(quartzInput.val())
  const guessedPeriodType = guessPeriodType(initialValue)
  const periodTypes: { [key: string]: { option: string, form: any } } = {
    yearly: { option: 'Yearly', form: createYearlyForm },
    monthly: { option: 'Monthly', form: createMonthlyForm },
    weekly: { option: 'Weekly', form: createWeeklyForm },
    daily: { option: 'Daily', form: createDailyForm },
    hourly: { option: 'Hourly', form: createHourlyForm },
    minutes: { option: 'Minutes', form: createMinutesForm },
    seconds: { option: 'Seconds', form: createSecondsForm },
  }

  const quartzChanged = (quartz: string) => {
    const keptYear = (quartzInput.val() as string).split(' ').slice(7).join(' ')
    quartzInput.val(quartz + (keptYear.length ? ` ${keptYear}` : '')).trigger('change')
  }

  const orderedPeriodTypes = options.orderedPeriodTypes || DEFAULT_PERIOD_TYPES
  const selectableOptions = orderedPeriodTypes.map(key => ({ key, ...periodTypes[key] })).filter(o => !!o.form)
  const getSelectedPeriod = () => periods[periodSelect.val() as string]
  const periodSelect = $('<select>')
    .append(createOptionsFromArray(
      selectableOptions.map(o => o.option),
      selectableOptions.map(o => o.key),
      guessedPeriodType || orderedPeriodTypes[0]))
    .on('change', function() {
      const { form, toQuartz } = getSelectedPeriod()
      schedules.children().addClass('d-none')
      form.removeClass('d-none')
      quartzChanged(toQuartz())
    })

  const schedules = $('<div>')
  const quartzForm = $('<div class="jquartz-form">')
    .append($('<strong>').text('Select period: '))
    .append(periodSelect)
    .append(schedules)

  const periods: { [key: string]: any } = selectableOptions.reduce((o, period) => {
    const { form, model, toQuartz, setQuartz } = period.form(period.key)
    const inputFields = Object.values(model).reduce((acc: any, field: any) =>
      (field.length ? [field] : Object.values(field)).reduce((a: any, f) => a.add(f), acc), $()) as JQuery<HTMLElement>

    if (period.key === guessedPeriodType) setQuartz(initialValue)
    form.toggleClass('d-none', !(period.key === (guessedPeriodType || orderedPeriodTypes[0])))
    inputFields.on('change', () => quartzChanged(toQuartz()))
    schedules.append(form)

    return { ...o, [period.key]: { key: period.key, form, model, toQuartz } }
  }, {})

  return quartzForm
}

const guessPeriodType = (quartz: string) => {
  const seconds = [
    /^0\/\d+\s\*\s\*\s\*\s\*\s\?\s\*/,
    /^\*\s\*\s\*\s\*\s\*\s\?\s\*/].reduce((b, exp) => b || exp.test(quartz), false) && 'seconds'
  const minutes = [
    /^0\s0\/\d+\s\*\s\*\s\*\s\?\s\*/,
    /^0\s\*\s\*\s\*\s\*\s\?\s\*/].reduce((b, exp) => b || exp.test(quartz), false) && 'minutes'
  const hourly = [
    /^0\s0\s0\/\d+\s\*\s\*\s\?\s\*/,
    /^0\s0\s\*\s\*\s\*\s\?\s\*/,
    /^\d+\s\d+\s\d+\s\*\s\*\s\?\s\*/].reduce((b, exp) => b || exp.test(quartz), false) && 'hourly'
  const daily = [
    /^\d+\s\d+\s\d+\s1\/\d+\s\*\s\?\s\*/,
    /^\d+\s\d+\s\d+\s\*\s\*\s\?\s\*/,  // daily at 6:00 is the same as "hourly, every day at 6:00"
    /^\d+\s\d+\s\d+\s\?\s\*\smon-fri\s\*/i].reduce((b, exp) => b || exp.test(quartz), false) && 'daily'
  const weekly = [
    /^\d+\s\d+\s\d+\s\?\s\*\s\*\s\*$/,
    /^\d+\s\d+\s\d+\s\?\s\*\s[a-z,]+\s\*/i,].reduce((b, exp) => b || exp.test(quartz), false) && 'weekly'
  const monthly = [
    /^\d+\s\d+\s\d+\s[1-9]\d?\s\*\s\?\s\*/,
    /^\d+\s\d+\s\d+\s[1-9]\d?\s1\/\d+\s\?\s\*/,
    /^\d+\s\d+\s\d+\s\?\s1\/[1-9][0-2]?\s[a-z]+#\d\s\*/i,
    /^\d+\s\d+\s\d+\s\?\s\*\s[a-z]+#\d\s\*/i].reduce((b, exp) => b || exp.test(quartz), false) && 'monthly'
  const yearly = [
    /^\d+\s\d+\s\d+\s\d+\s+\d+\s\?\s\*/,
    /^\d+\s\d+\s\d+\s\?\s\d+\s[a-z]+#\d\s\*/i].reduce((b, exp) => b || exp.test(quartz), false) && 'yearly'

  return seconds || minutes || daily || hourly || weekly || monthly || yearly
}

// helpers
const splitQuartz = (quartz: string) => {
  const [s, m, h, dom, month, dow, year] = quartz.toUpperCase().split(' ')
  return { s, m, h, dom, month, dow, year }
}

const labelStartTime = (time: JQuery<HTMLElement>) => $('<div>').append($('<span>').text('Start time')).append(time)
const labelCheckbox = (checkbox: JQuery<HTMLElement>, label: string) =>
  $('<div>').append(checkbox).append($('<label>').text(label).attr('for', checkbox[0].getAttribute('name')))
const createOptionsFromArray = (opts: Array<number | string>, values?: Array<number | string>, checkedValue?: string) =>
  opts.reduce((a, label, i) => {
    const value = String(values ? values[i] : label)
    const selected = checkedValue !== undefined && (value === String(checkedValue))
    return a.add($('<option>').attr({ value }).prop('selected', selected).text(label))
  }, $())

const leadingZero = (n: number) => `${n < 10 ? '0' : ''}${n}`
const createOptionsFromRange = (start: number, end: number, format = (n: number) => `${n}`) => {
  let options = $()
  for (var i = start; i <= end; i++) options = options.add($('<option>').attr('value', i).text(format(i)))
  return options
}

const createSection = (_periodKey: string, _model: object, rows: Array<HTMLElement | JQuery<HTMLElement> | null>[]) => {
  const trs = () => rows.reduce((r, columns) => r.add($('<tr>').append(tds(columns))), $())
  const tds = (columns: any[]) => columns.reduce((cells, cell) => cells.add(td(cell)), $())
  const td = (cell: any) => $('<td>').append(cell)
  return $('<table>').append($('<tbody>').append(trs()))
}
