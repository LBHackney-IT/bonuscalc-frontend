import axios from 'axios'
import { StatusCodes } from 'http-status-codes'
import { BandChange, Operative, Summary, Timesheet } from '@/models'
import { OutOfHoursSummary, OvertimeSummary } from '@/models'
import { buildServiceHeaders } from '@/utils/apiAuth'
import { operativeUrl, summaryUrl, timesheetUrl } from '@/utils/apiClient'

const { BONUSCALC_SERVICE_API_URL } = process.env

const client = axios.create({
  baseURL: `${BONUSCALC_SERVICE_API_URL}/v1`,
})

const bandChangesUrl = (bonusPeriodId) => {
  return `/band-changes?date=${bonusPeriodId}`
}

const bandChangeUrl = (payrollNumber) => {
  return `/band-changes/${payrollNumber}`
}

const outOfHoursSummariesUrl = (date) => {
  return `/weeks/${date}/out-of-hours`
}

const overtimeSummariesUrl = (date) => {
  return `/weeks/${date}/overtime`
}

const arrayMap = (klass, items) => items.map((item) => new klass(item))

export const prnRegex = new RegExp('^[0-9]{6}$')
export const dateRegex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')

export const fetchBandChanges = async (req, bonusPeriodId) => {
  const response = await client.get(bandChangesUrl(bonusPeriodId), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return arrayMap(BandChange, response.data)
  } else {
    throw new Error(`Unable to fetch band changes for ${bonusPeriodId}`)
  }
}

export const fetchBandChange = async (req, payrollNumber) => {
  const response = await client.get(bandChangeUrl(payrollNumber), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return new BandChange(response.data)
  } else {
    throw new Error(`Unable to fetch band change ${payrollNumber}`)
  }
}

export const fetchOperative = async (req, payrollNumber) => {
  const response = await client.get(operativeUrl(payrollNumber), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return new Operative(response.data)
  } else {
    throw new Error(`Unable to fetch operative ${payrollNumber}`)
  }
}

export const fetchSummary = async (req, payrollNumber, date) => {
  const response = await client.get(summaryUrl(payrollNumber, date), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return new Summary(response.data)
  } else {
    throw new Error(`Unable to fetch summary ${payrollNumber}/${date}`)
  }
}

export const fetchTimesheet = async (req, payrollNumber, date) => {
  const response = await client.get(timesheetUrl(payrollNumber, date), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return new Timesheet(response.data)
  } else {
    throw new Error(`Unable to fetch timesheet ${payrollNumber}/${date}`)
  }
}

export const fetchOutOfHoursSummaries = async (req, date) => {
  const response = await client.get(outOfHoursSummariesUrl(date), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return arrayMap(OutOfHoursSummary, response.data)
  } else {
    throw new Error(`Unable to fetch out-of-hours summaries for ${date}`)
  }
}

export const fetchOvertimeSummaries = async (req, date) => {
  const response = await client.get(overtimeSummariesUrl(date), {
    headers: buildServiceHeaders(req),
  })

  if (response.status == StatusCodes.OK) {
    return arrayMap(OvertimeSummary, response.data)
  } else {
    throw new Error(`Unable to fetch overtime summaries for ${date}`)
  }
}
