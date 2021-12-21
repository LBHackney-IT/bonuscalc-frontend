import axios from 'axios'
import useSWR, { mutate } from 'swr'
import { StatusCodes } from 'http-status-codes'
import {
  BonusPeriod,
  Operative,
  Timesheet,
  PayElementType,
  Summary,
  Week,
} from '@/models'

const client = axios.create({ baseURL: '/api/v1' })

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
    bonusPeriods: data
      ? data.map((bonusPeriod) => new BonusPeriod(bonusPeriod))
      : null,
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

export const payElementTypesUrl = () => {
  return '/pay/types'
}

export const usePayElementTypes = () => {
  const { data, error } = useSWR(payElementTypesUrl(), fetcher)

  return {
    payElementTypes: data
      ? data.map((payElementType) => new PayElementType(payElementType))
      : null,
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
