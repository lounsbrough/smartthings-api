const smartthings = require('smartthings-node')
let st = new smartthings.SmartThings(process.env.SMARTTHINGS_PERSONAL_ACCESS_TOKEN)

const findDevicesByName = async (deviceName) => {
    let matchedDevices = []

    await st.devices.listDevices()
    .then(deviceList => {
        deviceList.items.forEach(device => {
            if (deviceLabelFromDevice(device).toLowerCase() == deviceName.toLowerCase()) {
                matchedDevices.push(device)
            }
        })
    })

    return matchedDevices
}

const deviceIdFromDevice = (device) => {
    return device.deviceId
}

const deviceLabelFromDevice = (device) => {
    return device.label || device.name
}

const commandToSetSwitchPowerState = (power) => {
    return [{
        command: power ? 'on' : 'off',
        capability: 'switch',
        component: 'main',
        arguments: []
    }]
}

const setSwitchPowerState = async (deviceName, power) => {
    const devicesFound = await findDevicesByName(deviceName)

    if (!Array.isArray(devicesFound) || devicesFound.length == 0) {
        return `No devices found for {${deviceName}}`
    }

    const deviceId = deviceIdFromDevice(devicesFound[0])

    await st.devices.executeDeviceCommand(deviceId, commandToSetSwitchPowerState(power))

    return `Device ${deviceId} turned ${power ? 'on' : 'off'}`
}

const setAllSwitchesPowerState = async (power, exceptions) => {
    st.devices.listDevicesByCapability('switch')
    .then(deviceList => {
        deviceList.items.forEach(async (device) => {
            if (exceptions && exceptions.map(e => e.toLowerCase()).includes(deviceLabelFromDevice(device).toLowerCase())) {
                return
            }

            await st.devices.executeDeviceCommand(deviceIdFromDevice(device), commandToSetSwitchPowerState(power))
        })
    })

    return `All switches turned ${power ? 'on' : 'off'}${exceptions ? ` with the exception of [${exceptions.join(", ")}]` : ''}`
}

module.exports = {
    setAllSwitchesPowerState,
    setSwitchPowerState
}