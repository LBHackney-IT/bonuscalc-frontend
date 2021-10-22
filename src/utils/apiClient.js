import axios from 'axios'
import useSWR from 'swr'
import { StatusCodes } from 'http-status-codes'
import { Operative, Timesheet } from '@/models'

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
