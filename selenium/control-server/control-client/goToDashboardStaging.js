
const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://loganstaging2.esna.com/spaces/6054a11d4e65bc6df3797631"
const environment = "staging"
const testType = "goToDashboard"
const stayTime = 3600000
//////////////////
const dispatchDelay = 15000
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const dispatchCount = 1000

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getting users response ", response)
    console.log("Starting Dispatch Test")
    response = await dispatchUsers(controlServerIP,dispatchCount,spacesLink,testType,stayTime,environment)
    console.log("dispatch response ", response)
}

run().then(()=>{
    console.log("scipt complete")
})