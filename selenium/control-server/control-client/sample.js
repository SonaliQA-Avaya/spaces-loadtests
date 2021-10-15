const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
const getActiveUsers = require("./actions/getActiveUsers")
const requestScreenshot = require("./actions/requestScreenshot.js")
const requestLogs = require("./actions/requestLogs")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://loganstaging2020.esna.com/spaces/612edfb56b67fe5aed384aad"
const environment = "staging"
const testType = "basicMessage"
const stayTime = 3600000
const delay = (ms) => {
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}
const run = async () => {
    for(let i = 0; i < 1000; i++){
        let response = await getUsers(controlServerIP)
        console.log("getUsers ",response)
        let count = 1
        response = await dispatchUsers(controlServerIP,count,spacesLink,testType,stayTime,environment)
        console.log("dispatch response", response)
        await delay(3000)
    }
    let browserIds = ['4']
    let response = await requestScreenshot(controlServerIP,browserIds)
    console.log("screen shot responses ", response)
    response = await triggerMessageFlood(controlServerIP)
    console.log("triggerMessageFlood ", response)
}
run().then(()=>{
    console.log("complete")
})
