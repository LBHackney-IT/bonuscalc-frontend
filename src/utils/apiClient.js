import axios from 'axios'
import useSWR, { mutate } from 'swr'
import { StatusCodes } from 'http-status-codes'
import {
  BonusPeriod,
  Operative,
  Timesheet,
  PayElementType,
  Scheme,
  Summary,
  Week,
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

export const bonusPeriodsUrl = () => {
  return `/periods/current`
}

export const useBonusPeriods = () => {
  const { data, error } = useSWR(bonusPeriodsUrl(), fetcher)

  return {
    bonusPeriods: data ? arrayMap(BonusPeriod, data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}

export const operativeUrl = (payrollNumber) => {
  return `/operatives/${encodeURIComponent(payrollNumber)}`
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
  return `/operatives/${encodeURIComponent(
    payrollNumber
  )}/summary?bonusPeriod=${encodeURIComponent(bonusPeriod)}`
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
  return `/operatives/${encodeURIComponent(
    payrollNumber
  )}/timesheet?week=${encodeURIComponent(week)}`
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

export const weekUrl = (week) => {
  return `/weeks/${encodeURIComponent(week)}`
}

export const useWeek = (week) => {
  const { data, error } = useSWR(weekUrl(week), fetcher)

  return {
    week: data ? new Week(data) : null,
    isLoading: !error && !data,
    isError: error,
  }
}
