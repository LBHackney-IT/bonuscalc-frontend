const { BONUSCALC_SERVICE_API_KEY } = process.env

const isAuthorized = (req) => {
  return req.headers['x-api-key'] === BONUSCALC_SERVICE_API_KEY
}

const toJSONAPI = (type, attributes) => {
  const id = attributes['id']
  return { type, id, attributes }
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
    res.status(401).json({
      errors: [{ status: '401', title: 'Unauthorized' }],
    })
  }
})

router.render = (req, res) => {
  const data = res.locals.data
  const type = 'operatives'

  if (Array.isArray(data)) {
    res.jsonp({ data: data.map((item) => toJSONAPI(type, item)) })
  } else {
    res.jsonp({ data: toJSONAPI(type, data) })
  }
}

server.use('/api/v1', router)

server.listen(6000, () => {
  console.log('JSON Server is running')
})
