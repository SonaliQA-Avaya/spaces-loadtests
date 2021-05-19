const dispatchUsers = require("./actions/dispatchUsers")
const getUsers = require("./actions/getUsers")
const forceUsersExit = require("./actions/forceUsersExit")
const stopUsers = require("./actions/stopUsers");
const triggerMessageFlood = require("./actions/triggerMessageFlood")
//////////////////
// Test Variables
const {controlServerIP} = require("./config") // communication assumed on port 80
const spacesLink = "https://loganstaging2.esna.com/spaces/609ecd364911060621eff7c7"
const environment = "staging" // staging || testing
const testType = "basicMessage" // constant
const stayTime = 3600000 // in ms
//////////////////
const dispatchDelay = 15000 // in ms
const delay = (ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// 25 users every 15 seconds for 2 minutes 200 users
// 10 users every 15 seconds for 2 minutes 40 users
// 5 users every 15 seconds for 2 minutes 20 users
// const dispatchCountArray = [10,10,10,10,20,20,20,50,50,20,20,20,10,10]
// const dispatchCountArray = [2]
const dispatchCountArray = [10,10,10,10,20,20,20,20,20,50,50,50,50,100,100,100,100,100,50,50,50,50,20,20,20,20,20,10,10,10,10,10,10]
console.log({
    totalTime : (dispatchCountArray.length * 15) / 60,
    totalUsers : dispatchCountArray.reduce((i,j)=>i+j) 
})

const run = async () => {
    let response = await getUsers(controlServerIP)
    console.log("getting users response ", response)
    console.log("Starting Dispatch Test")
    let dispatchedCount = 0
    let totalUsers = dispatchCountArray.reduce((i,j)=>i+j,0)
    console.log(totalUsers)
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
}

run().then(()=>{
    console.log("scipt complete")
})