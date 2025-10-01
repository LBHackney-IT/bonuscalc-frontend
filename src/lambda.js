const server = require('restana')()
const app = require('next')({ dev: false })
const files = require('serve-static')
const path = require('path')


const getHandler = async () => {
    await app.prepare()
    
    const nextRequestHandler = app.getRequestHandler()

    return nextRequestHandler;
    
    // handler = require('serverless-http')(server);
    
}

const nextRequestHandler = await getHandler()

server.use(files(path.join(__dirname, 'build')))
server.use(files(path.join(__dirname, 'public')))

server.all('*', (req, res) => nextRequestHandler(req, res))


module.exports.handler = require('serverless-http')(server)
