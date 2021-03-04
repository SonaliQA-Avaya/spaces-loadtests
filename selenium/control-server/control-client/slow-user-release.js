const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://logantesting.esna.com/spaces/603444221d785c6f0e6aec1d"
const environment = "testing"
const testType = "basicMessage"
const dispatchDelay = 7000
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// 25 users every 15 seconds for 2 minutes 200 users
// 10 users every 15 seconds for 2 minutes 80 users
// 5 users every 15 seconds for 2 minutes 40 users

const dispatchCountArray = [25,25,25,25,25,25,25,25,10,10,10,10,5,5,5,5]

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getting users response ", response)
    console.log("Starting Dispatch Test")
    let dispatchedCount = 0
    for(let count of dispatchCountArray){
        console.log(count)
        dispatchedCount += count
        response = await stopUsers(controlServerIP,count)
        console.log("stop User response ", response)
        await delay(dispatchDelay)
    }
}

run().then(()=>{
    console.log("scipt complete")
})