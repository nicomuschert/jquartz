import './index.sass'

import { createTabs, getElementConstantValues } from './elements'
import { splitQuartz } from './period'
import {
  createYearlyForm,
  createMonthlyForm,
  createWeeklyForm,
  createDailyForm,
  createHourlyForm,
  createMinutesForm,
  createSecondsForm,
} from './forms'


$.fn.jQuartz = function(options = {}) {
  const inputFields = $(this)
  inputFields.each(function () {
    const input = $(this)
    const data = input.data() as {[_:string]: string}
    const ui = data.jquartzUi && document.getElementById(data.jquartzUi)
    const periods: any = data.jquartzPeriods && (data.jquartzPeriods as string).split(',')
    initQuartzInput(input, {
      ...options,
      ...(ui ? {ui} : {}),
      ...(periods ? {periods} : {}),
    })
  })
  return inputFields
}

let jquartzCounter = 0
const initQuartzInput = (quartzInput: JQuery, options: JQuartzOptions) => {
  const uname = `${Math.ceil(Math.random() * 1e18).toString(36)}-${jquartzCounter++}`
  const periodFormFactories = {
    yearly: createYearlyForm,
    monthly: createMonthlyForm,
    weekly: createWeeklyForm,
    daily: createDailyForm,
    hourly: createHourlyForm,
    minutes: createMinutesForm,
    seconds: createSecondsForm,
  }

  const periodOrder = options.periods || getElementConstantValues('period') as PeriodType[]
  const orderedPeriodForms = periodOrder.map((key) => {
    const onChange = () => onPeriodFormChange(form)
    const form = { ...periodFormFactories[key](key, uname, onChange), key }
    return form
  })

  const periodForms = orderedPeriodForms.reduce((acc, form) => ({ ...acc, [form.key]: form }),
    {} as { [_: string]: QuartzFormInstance })

  const evaluationOrder = Object.keys(periodFormFactories).filter((key: any) => periodOrder.includes(key))
  const guessPeriodForm = (quartz: Quartz) => {
    const periodType = evaluationOrder.find((key) => periodForms[key].acceptQuartz(quartz))
    return periodType && periodForms[periodType]
  }

  quartzInput.on('keyup', () => {
    const value = String(quartzInput.val() || '')
    if (value !== quartzInputValue) {
      quartzInputValue = value
      const quartz = splitQuartz(value)
      const form = guessPeriodForm(quartz)
      if (form && form.toString() !== quartz.expression) {
        form.setQuartz(quartz)
        setPeriod(form)
      }
    }
  })

  const setPeriod = (form: QuartzFormInstance) => {
    periodTabs.options[form.key].prop('checked', true)
    orderedPeriodForms.forEach(({ form }) => form.detach())
    periodContainer.append(form.form)
  }

  const changePeriod = (key: string) => {
    const form = periodForms[key]
    setPeriod(form)
    onPeriodFormChange(form)
  }

  const onPeriodFormChange = (form: QuartzFormInstance) => {
    const value = String(quartzInput.val() || '')
    const year = String(quartzInput.val() || '').split(' ').slice(7).join(' ')
    quartzInputValue = form.toString() + (year.length ? ` ${year}` : '')
    if (quartzInputValue !== value) quartzInput.val(quartzInputValue).trigger('change')
  }

  let quartzInputValue = String(quartzInput.val() || '')
  const initialQuartz = splitQuartz(quartzInputValue)
  const initialForm = guessPeriodForm(initialQuartz)
  const initialFormKey = initialForm ? initialForm.key : periodOrder[0]

  if (initialForm) {
    initialForm.setQuartz(initialQuartz)
  }

  const periodTabs = createTabs('period', uname, initialFormKey, changePeriod, periodOrder)
  const periodContainer = $('<div class="jqartz-period">')
  $('<div class="jquartz-form">')
    .append(periodTabs.form)
    .append(periodContainer.append(periodForms[initialFormKey].form))
    .appendTo(options.ui || quartzInput.parent())
}
