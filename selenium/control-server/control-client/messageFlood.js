const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
const getActiveUsers = require("./actions/getActiveUsers")
const requestScreenshot = require("./actions/requestScreenshot.js")
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
    const count = 500

    // response = await forceUsersExit(controlServerIP)
    // console.log("force exit User response ", response)
    response = await triggerMessageFlood(controlServerIP)
    console.log("triggerMessageFlood ", response)


}

run().then(()=>{
    console.log("scipt complete")
})