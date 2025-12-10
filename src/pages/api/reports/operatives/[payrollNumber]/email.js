import { Buffer } from 'buffer'
import { StatusCodes } from 'http-status-codes'
import { NotifyClient } from 'notifications-node-client'
import { v4 as uuid } from 'uuid'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { fetchOperative, fetchSummary, fetchTimesheet } from '@/utils/fetch'
import { prnRegex, dateRegex } from '@/utils/fetch'
import { generateCombinedReport } from '@/utils/reports'
import { setTag, captureException } from '@sentry/nextjs'

const { NOTIFY_TEMPLATE_ID, NOTIFY_API_KEY } = process.env

const BAD_REQUEST_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'Bad Request',
  status: StatusCodes.BAD_REQUEST,
}

const NOT_FOUND_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.4',
  title: 'Not Found',
  status: StatusCodes.NOT_FOUND,
}

const INTERNAL_SERVER_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.6.1',
  title: 'Internal Server Error',
  status: StatusCodes.INTERNAL_SERVER_ERROR,
}

const sendEmail = async (operative, summary, buffer) => {
  try {
    console.info("Sending email to operative:", operative.id);

    const notify = new NotifyClient(NOTIFY_API_KEY)
    const period = summary.bonusPeriod
    const week = summary.lastClosedWeeklySummary

    const template = NOTIFY_TEMPLATE_ID
    const reference = uuid()

    const email = operative.emailAddress
    const personalisation = {
      name: operative.name,
      week_start: week.startDate,
      week_end: week.endDate,
      period_number: period.number,
      period_year: period.year,
      link_to_file: notify.prepareUpload(buffer),
    }

    const options = { personalisation, reference }

    return await notify.sendEmail(template, email, options)
  } catch (error) {
    throw Error(error)
  }
}

export default authoriseAPIRequest(async (req, res) => {

  try {
    if (req.method == 'POST') {
      
      const { payrollNumber, date } = req.query

      if (!prnRegex.test(payrollNumber)) {
        return res.status(StatusCodes.BAD_REQUEST).json(BAD_REQUEST_ERROR)
      }

      if (!dateRegex.test(date)) {
        return res.status(StatusCodes.BAD_REQUEST).json(BAD_REQUEST_ERROR)
      }

      const operative = await fetchOperative(payrollNumber)

      if (operative.isArchived || !operative.emailAddress) {
        return res.status(StatusCodes.NO_CONTENT).json()
      }

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

      try {
        const pdf = generateCombinedReport(operative, summary, timesheets)
        const buffer = Buffer.from(pdf.output('arraybuffer'))
        const { data } = await sendEmail(operative, summary, buffer)

        return res.status(StatusCodes.OK).json(data)
      } catch (error) {
        captureException(error)
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json(INTERNAL_SERVER_ERROR)
      }
    } else {
      return res.status(StatusCodes.NOT_FOUND).json(NOT_FOUND_ERROR)
    }
  } catch (error) {
    captureException(error)
    throw Error(error)
  }
})
