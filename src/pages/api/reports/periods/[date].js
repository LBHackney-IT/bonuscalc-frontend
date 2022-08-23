import { StatusCodes } from 'http-status-codes'
import { transform, stringify } from 'csv/sync'
import { captureException } from '@sentry/nextjs'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { dateRegex, fetchBandChanges } from '@/utils/fetch'
import { numberWithPrecision } from '@/utils/number'

const BAD_REQUEST_ERROR = {
  type: 'https://tools.ietf.org/html/rfc7231#section-6.5.1',
  title: 'Bad Request',
  status: StatusCodes.BAD_REQUEST,
}

const transformer = (bandChange) => {
  const bonusRate = numberWithPrecision(bandChange.bonusRate, 2)

  return [
    bandChange.operativeId,
    bandChange.finalBand,
    bandChange.tradeCode,
    bandChange.rateCode,
    bandChange.finalBand == 1 ? bonusRate : null,
    bandChange.finalBand == 2 ? bonusRate : null,
    bandChange.finalBand == 3 ? bonusRate : null,
    bandChange.finalBand == 4 ? bonusRate : null,
    bandChange.finalBand == 5 ? bonusRate : null,
    bandChange.finalBand == 6 ? bonusRate : null,
    bandChange.finalBand == 7 ? bonusRate : null,
    bandChange.finalBand == 8 ? bonusRate : null,
    bandChange.finalBand == 9 ? bonusRate : null,
  ]
}

const options = {
  header: true,
  columns: [
    'Payroll No.',
    'Final Band',
    'Trade Code',
    'Bonus Rate',
    'Band 1',
    'Band 2',
    'Band 3',
    'Band 4',
    'Band 5',
    'Band 6',
    'Band 7',
    'Band 8',
    'Band 9',
  ],
}

export default authoriseAPIRequest(async (req, res) => {
  try {
    const { date } = req.query
    let output = 'No band changes for this period'

    if (!dateRegex.test(date)) {
      return res.status(StatusCodes.BAD_REQUEST).json(BAD_REQUEST_ERROR)
    }

    const bandChanges = await fetchBandChanges(date)

    if (bandChanges.length > 0) {
      output = stringify(transform(bandChanges, transformer), options)
    }

    res.setHeader('content-type', 'text/csv')
    res.setHeader(
      'content-disposition',
      `attachment; filename="payroll-file-${date}.csv"`
    )

    return res.status(StatusCodes.OK).send(output)
  } catch (error) {
    captureException(error)
    throw Error(error)
  }
})
