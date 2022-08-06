import axios from 'axios'
import { StatusCodes } from 'http-status-codes'

const client = axios.create({ baseURL: '/api/reports' })

export const sendReportEmail = async (operative, bonusPeriod) => {
  const url = `/operatives/${operative}/email?date=${bonusPeriod}`
  const response = await client.post(url)

  return (
    response.status == StatusCodes.OK ||
    response.status == StatusCodes.NO_CONTENT
  )
}
