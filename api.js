const { BONUSCALC_SERVICE_API_KEY } = process.env

const isAuthorized = (req) => {
  return req.headers['x-api-key'] === BONUSCALC_SERVICE_API_KEY
}

const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)

server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next()
  } else {
    res.status(401).json({ status: '401', title: 'Unauthorized' })
  }
})

server.use('/api/v1', router)

server.listen(6000, () => {
  console.log('JSON Server is running')
})
