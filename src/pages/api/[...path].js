import { StatusCodes } from 'http-status-codes'
import { authoriseAPIRequest } from '@/utils/apiAuth'
import { forwardAPIRequest } from '@/utils/apiAuth'

export default authoriseAPIRequest(async (req, res) => {
  try {
    const data = await forwardAPIRequest(req)
    res.status(StatusCodes.OK).json(data)
  } catch (error) {
    throw Error(error)
  }
})
