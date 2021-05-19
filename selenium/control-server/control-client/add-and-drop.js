const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://loganstaging2020.esna.com/spaces/6037e90592a7e06923319e81"
const environment = "staging"
const testType = "basicMessage"
const stayTime = 3600000
//////////////////
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
const dropCount = 10;
const dispatchCount = 10;
const dispatchDelay = 5000;

const run = async () => {
    let response
    while(true){
        console.log("running")
        response = await getUsers(controlServerIP)
        console.log("users before stop command : ",response)
        await delay(10000)
        await stopUsers(controlServerIP,dropCount)
        response = await getUsers(controlServerIP)
        console.log("users response after drop command : ". response)
        await delay(10000)
        await dispatchUsers(controlServerIP, dispatchCount, spacesLink, testType, stayTime, environment)
        response = await getUsers(controlServerIP)
        console.log("users response after dispatch command : ". response)

    }
}

run().then(()=>{
    console.log("scipt complete")
})