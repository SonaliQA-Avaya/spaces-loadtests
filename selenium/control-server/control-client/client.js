const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://logantesting.esna.com/spaces/6033ae4a3f1614163f3a4058"
const environment = "testing"
const testType = "basicMessage"
const stayTime = 720000
//////////////////

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getUsers ",response)
    console.log(response.users.filter(x=>x.state!=="ready"))
    // start 
    // const count = 1
    // response = await dispatchUsers(controlServerIP,count,spacesLink,testType,stayTime,environment)
    // console.log("dispatch response", response)

    // response = await stopUsers(controlServerIP,count)
    // console.log("stop User response ", response)

    // response = await forceUsersExit(controlServerIP)
    // console.log("force exit User response ", response)
    // response = await triggerMessageFlood(controlServerIP)
    // console.log("triggerMessageFlood ", response)


}

run().then(()=>{
    console.log("scipt complete")
})