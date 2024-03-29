import axios from 'axios'
import useSWR, { mutate } from 'swr'
import { StatusCodes } from 'http-status-codes'
import {
  BandChange,
  BonusPeriod,
  Operative,
  OperativeProjection,
  Timesheet,
  PayElementType,
  Scheme,
  Summary,
  Week,
  WorkElement,
} from '@/models'

const client = axios.create({ baseURL: '/api/v1' })

const arrayMap = (klass, items) => items.map((item) => new klass(item))

const objectMap = (key, klass, items) =>
  Object.fromEntries(items.map((item) => [item[key], new klass(item)]))

export const fetcher = async (url) => {
  const { status, data } = await client.get(url)

  if (status != StatusCodes.OK) {
    const error = new Error('An error occurred while fetching the data.')

    error.status = status
    error.info = data

    throw error
  }

  return data
}

export const authorisationsUrl = () => {
  return `/band-changes/authorisations`
}

export const useAuthorisations = () => {
  const { data, error } = useSWR(authorisationsUrl(), fetcher)

  return {
    authorisations: data ? arrayMap(BandChange, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const bandChangePeriodUrl = () => {
  return `/band-changes/period`
}

export const useBandChangePeriod = () => {
  const { data, error } = useSWR(bandChangePeriodUrl(), fetcher)

  return {
    bonusPeriod: data ? new BonusPeriod(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const getBandChangePeriod = async () => {
  const url = bandChangePeriodUrl()

  try {
    const { status, data } = await client.get(url)

    if (status == StatusCodes.OK) {
      return new BonusPeriod(data)
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const startBandChangeProcessUrl = () => {
  return `/band-changes/start`
}

export const startBandChangeProcess = async () => {
  const url = startBandChangeProcessUrl()

  try {
    const { status } = await client.post(url)

    if (status == StatusCodes.OK) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const bandChangesUrl = (period) => {
  if (period) {
    return `/band-changes?date=${period}`
  } else {
    return `/band-changes`
  }
}

export const useBandChanges = (period) => {
  const { data, error } = useSWR(bandChangesUrl(period), fetcher)

  return {
    bandChanges: data ? arrayMap(BandChange, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const managerDecisionUrl = (operative) => {
  return `/band-changes/${operative}/manager`
}

export const saveManagerDecision = async (operative, data) => {
  const url = managerDecisionUrl(operative)

  try {
    const res = await client.post(url, data)

    // Invalidate the cached band changes
    mutate(authorisationsUrl())

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const supervisorDecisionUrl = (operative) => {
  return `/band-changes/${operative}/supervisor`
}

export const saveSupervisorDecision = async (operative, data) => {
  const url = supervisorDecisionUrl(operative)

  try {
    const res = await client.post(url, data)

    // Invalidate the cached band changes
    mutate(bandChangesUrl())
    mutate(authorisationsUrl())

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const bandChangeReportSentAtUrl = (payrollNumber) => {
  return `/band-changes/${payrollNumber}/report`
}

export const saveBandChangeReportSentAt = async (payrollNumber) => {
  const url = bandChangeReportSentAtUrl(payrollNumber)

  try {
    const res = await client.post(url)
    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const bonusPeriodsUrl = () => {
  return `/periods`
}

export const useBonusPeriods = () => {
  const { data, error } = useSWR(bonusPeriodsUrl(), fetcher)

  return {
    bonusPeriods: data ? arrayMap(BonusPeriod, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const createBonusPeriod = async (date) => {
  const url = bonusPeriodsUrl()

  try {
    const res = await client.post(url, { id: date })

    // Invalidate the cached bonus periods
    mutate(bonusPeriodsUrl())

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const currentBonusPeriodsUrl = () => {
  return `/periods/current`
}

export const useCurrentBonusPeriods = () => {
  const { data, error } = useSWR(currentBonusPeriodsUrl(), fetcher)

  return {
    bonusPeriods: data ? arrayMap(BonusPeriod, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const operativeProjectionsUrl = () => {
  return `/band-changes/projected`
}

export const useOperativeProjections = () => {
  const { data, error } = useSWR(operativeProjectionsUrl(), fetcher)

  return {
    operativeProjections: data ? arrayMap(OperativeProjection, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const operativeUrl = (payrollNumber) => {
  return `/operatives/${payrollNumber}`
}

export const operativeExists = async (payrollNumber) => {
  try {
    const res = await client.get(operativeUrl(payrollNumber))
    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const useOperative = (payrollNumber) => {
  const { data, error } = useSWR(operativeUrl(payrollNumber), fetcher)

  return {
    operative: data ? new Operative(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const payBandsUrl = () => {
  return '/pay/bands'
}

export const useSchemes = () => {
  const { data, error } = useSWR(payBandsUrl(), fetcher)

  return {
    schemes: data ? objectMap('id', Scheme, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const payElementTypesUrl = () => {
  return '/pay/types'
}

export const usePayElementTypes = () => {
  const { data, error } = useSWR(payElementTypesUrl(), fetcher)

  return {
    payElementTypes: data ? arrayMap(PayElementType, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const summaryUrl = (payrollNumber, bonusPeriod) => {
  return `/operatives/${payrollNumber}/summary?bonusPeriod=${bonusPeriod}`
}

export const useSummary = (payrollNumber, bonusPeriod) => {
  const { data, error } = useSWR(
    summaryUrl(payrollNumber, bonusPeriod),
    fetcher
  )

  return {
    summary: data ? new Summary(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const timesheetUrl = (payrollNumber, week) => {
  return `/operatives/${payrollNumber}/timesheet?week=${week}`
}

export const useTimesheet = (payrollNumber, week) => {
  const { data, error } = useSWR(timesheetUrl(payrollNumber, week), fetcher)

  return {
    timesheet: data ? new Timesheet(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const saveTimesheet = async (payrollNumber, week, data) => {
  const url = timesheetUrl(payrollNumber, week)

  try {
    const res = await client.post(url, data)

    // Invalidate the cached timesheet
    mutate(url)

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const reportSentAtUrl = (payrollNumber, week) => {
  return `/operatives/${payrollNumber}/timesheet/report?week=${week}`
}

export const saveReportSentAt = async (payrollNumber, week) => {
  const url = reportSentAtUrl(payrollNumber, week)

  try {
    const res = await client.post(url)
    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const reportsSentAtUrl = (week) => {
  return `/weeks/${week}/reports`
}

export const saveReportsSentAt = async (week) => {
  const url = reportsSentAtUrl(week)

  try {
    const res = await client.post(url)

    // Invalidate the cached week
    mutate(`/weeks/${week}`)

    // Invalidate the cached bonus periods
    const { status, data } = await client.get(currentBonusPeriodsUrl())

    if (status == StatusCodes.OK) {
      mutate('/periods/current', data)
    }

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const weekUrl = (week) => {
  return `/weeks/${week}`
}

export const useWeek = (week) => {
  const { data, error } = useSWR(weekUrl(week), fetcher)

  return {
    week: data ? new Week(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const saveWeek = async (week, data) => {
  const url = weekUrl(week)

  try {
    const res = await client.post(url, data)

    // Invalidate the cached timesheet
    mutate(url)

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const bonusPeriodUrl = (period) => {
  return `/periods/${period}`
}

export const useBonusPeriod = (period) => {
  const { data, error } = useSWR(bonusPeriodUrl(period), fetcher)

  return {
    bonusPeriod: data ? new BonusPeriod(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const saveBonusPeriod = async (period, data) => {
  const url = bonusPeriodUrl(period)

  try {
    const res = await client.post(url, data)

    return res.status == StatusCodes.OK
  } catch (error) {
    return false
  }
}

export const findOperatives = async (query) => {
  try {
    const res = await client.get('/operatives', { params: { query } })

    if (res.status == StatusCodes.OK) {
      return arrayMap(Operative, res.data)
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

export const findWorkElements = async (query) => {
  try {
    const res = await client.get('/work/elements', { params: { query } })

    if (res.status == StatusCodes.OK) {
      return arrayMap(WorkElement, res.data)
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
