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
const spacesLink = "https://logantesting.esna.com/spaces/60468867e58d33aa57db1594"
const environment = "testing"
const testType = "basicMessage"
const stayTime = 3600000
//////////////////

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getUsers ",response)
    console.log(response.users.filter(x=>x.state!=="ready").length)
    // start 
    const count = 1000
    // let currentRoster = require("./roster_presence")
    response = await getActiveUsers(controlServerIP)
    console.log("active user response ", response.users.filter(x=>x.userCredentials.username === "user8@ericloadtest.com")) 
    // let currentRosterActive = Object.values(currentRoster)
    // let unAccountedUsers = response.users.filter(user=>{
    //     let bPresent = currentRosterActive.filter((x=>{
    //         return x.user.username === user.userCredentials.username
    //     }))
    //     return bPresent.length === 0
    // })

    // console.log(unAccountedUsers)

    // let browserIds = ['6']
    // response = await requestScreenshot(controlServerIP,browserIds)
    // console.log("screen shot responses ", response)
    // response = await requestLogs(controlServerIP,browserIds)
    // console.log("log responses ", response)
    // response = await dispatchUsers(controlServerIP,count,spacesLink,testType,stayTime,environment)
    // console.log("dispatch response", response)

    // response = await stopUsers(controlServerIP,count)
    // console.log("stop User response ", response)

    // response = await forceUsersExit(controlServerIP)
    // console.log("force exit User response ", response)
    response = await triggerMessageFlood(controlServerIP)
    console.log("triggerMessageFlood ", response)


}

run().then(()=>{
    console.log("scipt complete")
})