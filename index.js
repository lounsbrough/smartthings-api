const express = require('express')

const logger = require('./services/logging-service')

let app = express()
const port = 7238

app.use(express.json())

app.post('/', async (req, res) => {
    let smartthingsService = require('./services/smartthings')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    if (req.body.authCode && req.body.authCode == process.env.HTTPS_AUTHENTICATION_SECRET) {
        if (req.body.action) {
            let response
            switch (req.body.action) {
                case 'openBlinds':
                    response = await Promise.all(
                        req.body.deviceNames.map(deviceName => smartthingsService.setBlindOpenState(deviceName, true))
                    )
                    break
                case 'closeBlinds':
                    response = await Promise.all(
                        req.body.deviceNames.map(deviceName => smartthingsService.setBlindOpenState(deviceName, false))
                    )
                    break
                case 'turnSwitchOff':
                    response = await smartthingsService.setSwitchPowerState(req.body.deviceName || '', false)
                    break
                case 'turnSwitchOn':
                    response = await smartthingsService.setSwitchPowerState(req.body.deviceName || '', true)
                    break
                case 'turnAllSwitchesOff':
                    response = await smartthingsService.setAllSwitchesPowerState(false, req.body.exceptions)
                    break
                case 'turnAllSwitchesOn':
                    response = await smartthingsService.setAllSwitchesPowerState(true, req.body.exceptions)
                    break
                case 'setPowerLevel':
                    response = await smartthingsService.setSwitchPowerLevel(req.body.deviceName || '', req.body.level)
                    break
                default:
                    response = `Invalid action: ${req.body.action}`
            }
            logger.info(response.toString())
            res.write(response.toString())
        }
    }
    res.end()
})

app.listen(port, function () {
    logger.info(`app listening on port ${port}`)
})