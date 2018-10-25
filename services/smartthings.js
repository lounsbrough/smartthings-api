const smartthings = require('smartthings-node')
let st = new smartthings.SmartThings(process.env.SMARTTHINGS_PERSONAL_ACCESS_TOKEN)

const findDeviceIdsByName = async (deviceName) => {
    let matchedDevices = []

    await st.devices.listDevices()
    .then(deviceList => {
        deviceList.items.forEach(device => {
            if ((device.label || device.name).toLowerCase() == deviceName.toLowerCase()) {
                matchedDevices.push(device)
            }
        })
    })

    return matchedDevices
}

const turnLightOn = async (deviceName) => {
    const devicesFound = await findDeviceIdsByName(deviceName)

    if (!Array.isArray(devicesFound) || devicesFound.length == 0) {
        return `No devices found for {${deviceName}}`
    }
    
    const commands = [{
        command: 'on',
        capability: 'switch',
        component: 'main',
        arguments: []
    }]

    await st.devices.executeDeviceCommand(devicesFound[0].deviceId, commands)
    return `Device ${devicesFound[0].deviceId} turned on`
}

const turnLightOff = async (deviceName) => {
    const devicesFound = await findDeviceIdsByName(deviceName)

    if (!Array.isArray(devicesFound) || devicesFound.length == 0) {
        return `No devices found for {${deviceName}}`
    }
    
    const commands = [{
        command: 'off',
        capability: 'switch',
        component: 'main',
        arguments: []
    }]

    await st.devices.executeDeviceCommand(devicesFound[0].deviceId, commands)
    return `Device ${devicesFound[0].deviceId} turned off`
}

module.exports = {
    turnLightOff,
    turnLightOn
}