import { StatusCodes } from 'http-status-codes'
import { transform, stringify } from 'csv/sync'
import { captureException } from '@sentry/nextjs'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { dateRegex, fetchOvertimeSummaries } from '@/utils/fetch'
import { numberWithPrecision } from '@/utils/number'

const BAD_REQUEST_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'Bad Request',
  status: StatusCodes.BAD_REQUEST,
}

const transformer = (summary) => {
  return [
    summary.id,
    summary.name,
    summary.tradeDescription,
    summary.costCode,
    numberWithPrecision(summary.totalValue, 2),
  ]
}

const options = {
  header: true,
  columns: ['Payroll Number', 'Operative', 'Trade', 'Cost Code', 'Amount'],
}

export default authoriseAPIRequest(async (req, res) => {
  try {
    const { date } = req.query
    let output = 'No overtime records for this week'

    if (!dateRegex.test(date)) {
      return res.status(StatusCodes.BAD_REQUEST).json(BAD_REQUEST_ERROR)
    }

    const summaries = await fetchOvertimeSummaries(date)

    if (summaries.length > 0) {
      output = stringify(transform(summaries, transformer), options)
    }

    res.setHeader('content-type', 'text/csv')
    res.setHeader(
      'content-disposition',
      `attachment; filename="overtime-${date}.csv"`
    )

    return res.status(StatusCodes.OK).send(output)
  } catch (error) {
    captureException(error)
    throw Error(error)
  }
})
