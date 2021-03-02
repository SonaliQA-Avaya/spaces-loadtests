const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config")// communication assumed on port 80
const spacesLink = "https://logantesting.esna.com/spaces/603444221d785c6f0e6aec1d"
const environment = "testing"
const testType = "basicMessage"
const stayTime = 600000
//////////////////
const userIncrement = 50
const maxUsers = 150
let dispatchedUsers = 0
const dispatchDelay = 15000
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const run = async () => {
    while(dispatchedUsers < maxUsers){
        dispatchedUsers += userIncrement
        console.log("test dispatching")
        let response = await getUsers(controlServerIP)
        console.log("getting users response ", response)
        response = await dispatchUsers(controlServerIP,userIncrement,spacesLink,testType,stayTime,environment)
        console.log("dispatch response", response)
        await delay(dispatchDelay)
    }
    
    // console.log("getUsers ",response)
    // console.log(response.users.filter(x=>x.state==="ready").length)
    // start 
    // const count = 100
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