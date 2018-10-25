const express = require('express')

const logger = require('./services/logging-service')

let app = express()
const port = 7238

app.use(express.json())

app.post('/', async (req, res) => {
    let smartthingsService = require('./services/smartthings')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    if (req.body.authCode && req.body.authCode == process.env.HTTPS_AUTHENTICATION_SECRET) {
        if (req.body.deviceName && req.body.action) {
            let response
            switch (req.body.action) {
                case 'turnLightOff':
                    response = await smartthingsService.turnLightOff(req.body.deviceName)
                    break
                case 'turnLightOn':
                    response = await smartthingsService.turnLightOn(req.body.deviceName)
                    break
                default:
                    response = `Invalid action: ${req.body.action}`
            }
            logger.info(response)
            res.write(response)
        }
    }
    res.end()
})

app.listen(port, function () {
    logger.info(`app listening on port ${port}`)
})