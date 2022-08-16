import { Buffer } from 'buffer'
import { StatusCodes } from 'http-status-codes'
import { NotifyClient } from 'notifications-node-client'
import { v4 as uuid } from 'uuid'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { fetchOperative, fetchBandChange } from '@/utils/fetch'
import { prnRegex } from '@/utils/fetch'
import { generateBandChangeReport } from '@/utils/reports'
import { setTag, captureException } from '@sentry/nextjs'

const { NOTIFY_BC_TEMPLATE_ID, NOTIFY_API_KEY } = process.env

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

const sendEmail = async (operative, period, buffer) => {
  try {
    const notify = new NotifyClient(NOTIFY_API_KEY)

    const template = NOTIFY_BC_TEMPLATE_ID
    const reference = uuid()

    const email = operative.emailAddress
    const personalisation = {
      name: operative.name,
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
      const { payrollNumber } = req.query

      if (!prnRegex.test(payrollNumber)) {
        return res.status(StatusCodes.BAD_REQUEST).json(BAD_REQUEST_ERROR)
      }

      const operative = await fetchOperative(payrollNumber)

      if (operative.isArchived || !operative.emailAddress) {
        return res.status(StatusCodes.NO_CONTENT).json()
      }

      const bandChange = await fetchBandChange(payrollNumber)
      const bonusPeriod = bandChange.bonusPeriod

      // Add Sentry tags
      setTag('operative', operative.id)
      setTag('bonus_period', bonusPeriod.id)

      try {
        const pdf = generateBandChangeReport(operative, bandChange)
        const buffer = Buffer.from(pdf.output('arraybuffer'))
        const { data } = await sendEmail(operative, bonusPeriod, buffer)

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
