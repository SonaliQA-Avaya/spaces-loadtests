const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
const requestScreenshot = require("./actions/requestScreenshot")
const requestLogs = require("./actions/requestLogs")
const getActiveUsers = require("./actions/getActiveUsers")

//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://loganstaging.esna.com/spaces/60185f66ac9a0cffdd403b35"
const environment = "staging"
const testType = "basicMessage"
const stayTime = 3600000
//////////////////
const dispatchDelay = 15000
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// 25 users every 15 seconds for 2 minutes 200 users
// 10 users every 15 seconds for 2 minutes 40 users
// 5 users every 15 seconds for 2 minutes 20 users

const dispatchCountArray = [5,5,5,5,10,10,10,10,20,20]

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getting users response ", response)
    console.log("Starting Dispatch Test")
    let count = 1
    response = await dispatchUsers(controlServerIP, count, spacesLink, testType, stayTime, environment)
    console.log("dispatch response ", response)

    let browserIds = ['132322']

    await delay(120000)
    response = await getActiveUsers(controlServerIP)
    console.log("active user response ", response)

    // response  = await requestScreenshot(controlServerIP,browserIds)
    // console.log("screenshot request response", response)
    // response  = await requestLogs(controlServerIP,browserIds)
    // console.log("log request response", response)
}

run().then(()=>{
    console.log("scipt complete")
})