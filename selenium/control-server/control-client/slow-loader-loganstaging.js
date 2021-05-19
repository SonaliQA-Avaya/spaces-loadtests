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
    let dispatchedCount = 0
    for(let count of dispatchCountArray){
        dispatchedCount += count
        response = await dispatchUsers(controlServerIP, count, spacesLink, testType, stayTime, environment)
        console.log("dispatchResponse", response)
        if(response.dispatched == count){
            console.log("requested users dispatched")
        }else{
            console.log("insufficient users for dispatching")
        }
        await delay(dispatchDelay)
    }
    for(let x = 0; x < 50; x++){
        let c = 20;
        response = await dispatchUsers(controlServerIP, c, spacesLink, testType, stayTime, environment)
        console.log("dispatchResponse", response)
        if(response.dispatched == c){
            console.log("requested users dispatched")
        }else{
            console.log("insufficient users for dispatching")
        }
        await delay(dispatchDelay)
    }
}

run().then(()=>{
    console.log("scipt complete")
})