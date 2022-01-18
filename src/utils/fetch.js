import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { Operative, Summary, Timesheet } from '@/models'
import { operativeUrl, summaryUrl, timesheetUrl } from '@/utils/apiClient'

const { BONUSCALC_SERVICE_API_URL, BONUSCALC_SERVICE_API_KEY } = process.env

const client = axios.create({
  baseURL: `${BONUSCALC_SERVICE_API_URL}/v1`,
  headers: {
    'x-api-key': BONUSCALC_SERVICE_API_KEY,
    'content-type': 'application/json',
  },
})

export const prnRegex = new RegExp('^[0-9]{6}$')
export const dateRegex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')

export const fetchOperative = async (payrollNumber) => {
  const response = await client.get(operativeUrl(payrollNumber))

  if (response.status == StatusCodes.OK) {
    return new Operative(response.data)
  } else {
    throw new Error(`Unable to fetch operative ${payrollNumber}`)
  }
}

export const fetchSummary = async (payrollNumber, date) => {
  const response = await client.get(summaryUrl(payrollNumber, date))

  if (response.status == StatusCodes.OK) {
    return new Summary(response.data)
  } else {
    throw new Error(`Unable to fetch summary ${payrollNumber}/${date}`)
  }
}

export const fetchTimesheet = async (payrollNumber, date) => {
  const response = await client.get(timesheetUrl(payrollNumber, date))

  if (response.status == StatusCodes.OK) {
    return new Timesheet(response.data)
  } else {
    throw new Error(`Unable to fetch timesheet ${payrollNumber}/${date}`)
  }
}
