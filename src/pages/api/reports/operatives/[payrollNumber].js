import { Buffer } from 'buffer'
import { StatusCodes } from 'http-status-codes'
import { generateCombinedReport } from '@/utils/reports'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { fetchOperative, fetchSummary, fetchTimesheet } from '@/utils/fetch'
import { prnRegex, dateRegex } from '@/utils/fetch'
import { setTag } from '@sentry/nextjs'

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
