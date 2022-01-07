import axios from 'axios'
import { Buffer } from 'buffer'
import { StatusCodes } from 'http-status-codes'
import { Operative, Summary, Timesheet } from '@/models'
import { generateCombinedReport } from '@/utils/reports'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { operativeUrl, summaryUrl, timesheetUrl } from '@/utils/apiClient'
import { setTag } from '@sentry/nextjs'

const { BONUSCALC_SERVICE_API_URL, BONUSCALC_SERVICE_API_KEY } = process.env

const client = axios.create({
  baseURL: `${BONUSCALC_SERVICE_API_URL}/v1`,
  headers: {
    'x-api-key': BONUSCALC_SERVICE_API_KEY,
    'content-type': 'application/json',
  },
})

const prnRegex = new RegExp('^[0-9]{6}$')
const dateRegex = new RegExp('^[0-9]{4}-[0-9]{2}-[0-9]{2}$')

const fetchOperative = async (payrollNumber) => {
  const response = await client.get(operativeUrl(payrollNumber))

  if (response.status == StatusCodes.OK) {
    return new Operative(response.data)
  } else {
    throw new Error(`Unable to fetch operative ${payrollNumber}`)
  }
}

const fetchSummary = async (payrollNumber, date) => {
  const response = await client.get(summaryUrl(payrollNumber, date))

  if (response.status == StatusCodes.OK) {
    return new Summary(response.data)
  } else {
    throw new Error(`Unable to fetch summary ${payrollNumber}/${date}`)
  }
}

const fetchTimesheet = async (payrollNumber, date) => {
  const response = await client.get(timesheetUrl(payrollNumber, date))

  if (response.status == StatusCodes.OK) {
    return new Timesheet(response.data)
  } else {
    throw new Error(`Unable to fetch timesheet ${payrollNumber}/${date}`)
  }
}

export default authoriseAPIRequest(async (req, res) => {
  try {
    const { payrollNumber, date } = req.query

    if (!prnRegex.test(payrollNumber)) {
      throw new Error('Invalid payroll number')
    }

    if (!dateRegex.test(date)) {
      throw new Error('Invalid bonus period')
    }

    const operative = await fetchOperative(payrollNumber)
    const summary = await fetchSummary(payrollNumber, date)
    const { bonusPeriod, closedWeeklySummaries } = summary

    const timesheets = await Promise.all(
      closedWeeklySummaries.map(async (ws) => {
        return fetchTimesheet(payrollNumber, ws.weekId)
      })
    )

    // Add Sentry tags
    setTag('operative', operative.id)
    setTag('bonus_period', bonusPeriod.id)

    const pdf = generateCombinedReport(operative, summary, timesheets)
    const filename = `${operative.id}-${bonusPeriod.year}-${bonusPeriod.number}.pdf`

    res.setHeader('content-type', 'application/pdf')
    res.setHeader('content-disposition', `attachment; filename="${filename}"`)

    const buffer = Buffer.from(pdf.output('arraybuffer'))
    return res.status(StatusCodes.OK).send(buffer)
  } catch (error) {
    throw Error(error)
  }
})
