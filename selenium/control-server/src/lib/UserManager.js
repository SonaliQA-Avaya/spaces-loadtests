const {EventEmitter} = require("events")
const User = require("./User")
let fs = require("fs")
let path = require("path")
let stagingUsers = fs.readFileSync(path.join(__dirname,"../../data/users.csv")).toString().split("\n").map(x=>x.split(",")).map(([username,password])=>{
    return {
        username,
        password,
        state : "ready"
    }
})
let testingUsers = fs.readFileSync(path.join(__dirname,"../../data/testing_users.csv")).toString().split("\n").map(x=>x.split(",")).map(([username,password])=>{
    return {
        username,
        password,
        state : "ready"
    }
})
class AccountsContainer{
    constructor(usersArray){
        this.allUsers = usersArray
    }
    lockUsers(requestedCount){
        let availableUsers = []
        let lockedCount = 0
        let maxFreeUsers = this.allUsers.filter(x=>x.state=="ready").length
        let minCount = Math.min(requestedCount,maxFreeUsers)
        for(let i = 0; i < this.allUsers.length; i++){
            let user = this.allUsers[i]
            if(user.state === "ready"){
                lockedCount += 1
                availableUsers.push(user)
                this.allUsers[i].state = "locked"
            }
            if(lockedCount == minCount){
                break
            }
        }
        return availableUsers
    }
    releaseUsers(usersArray){
        for(let k = 0; k < usersArray.length; k++){
            let userObj = usersArray[k]
            let bReleased = false
            for(let j = 0; j < this.allUsers.length; j++){
                if(this.allUsers[j].username === userObj.username){
                    this.allUsers[j].state = "ready"
                    bReleased = true
                    break
                }
            }
            console.log("released ", userObj, bReleased)
        }
    }
    getSummary(){
        let response = {
            total : this.allUsers.length,
            locked : this.allUsers.filter(x=>x.state !== "ready").length,
            available : this.allUsers.filter(x=>x.state == "ready").length
        }
        return response
    }
}


class UserManager extends EventEmitter{
    constructor(){
        super()
        this.users = {} // Represents connected browsers.
        this.messageTestTypes = ["basicMessage"]
        this.stagingAccounts = new AccountsContainer(stagingUsers)
        this.testingAccounts = new AccountsContainer(testingUsers)

    }
    releaseUserHandler({userCredentials,environment}){
        if(environment == "testing"){
            this.testingAccounts.releaseUsers([userCredentials])
        }else if(environment == "staging"){
            this.stagingAccounts.releaseUsers([userCredentials])
        }
    }
    loadUser(socket){
        // Check is user present
        // Need to add user info
        const browserId = socket.handshake.query.browserId;
        if(this.users[browserId]){
            console.log("socket reconnected !", browserId)
            let userInfo = this.users[browserId].getInfo()
            console.log("reconnect user: ", userInfo)
            this.users[browserId].socket = socket;
            this.users[browserId].setSocketHandlers()
            console.log("assigning new socket and setting new handlers")
        }else{
            const user = new User(socket,browserId);
            user.on("release-user",(...args)=>{
                this.releaseUserHandler(...args)
            })
            socket.browserId = browserId
            this.users[browserId] = user
            return user;
        }

    }
    removeUser(socket){
        const browserId = socket.handshake.query.browserId
        // If the user is locked release the accounts
        if(this.users[browserId] && this.users[browserId].userCredentials != null && this.users[browserId].environment != null){
            let payload = {
                userCredentials : this.users[browserId].userCredentials,
                environment : this.users[browserId].environment
            }
            this.releaseUserHandler(payload)
        }
        delete this.users[browserId]
    }
    getUsers(){
        return Object.values(this.users).map(x=>x.getInfo())
    }

    getAvailableLockedUsers(requestedCount){
        let lockedUsers = Object.values(this.users).filter(x=>x.state === "locked")
        let min = Math.min(requestedCount,lockedUsers.length)
        let finalUsers =  lockedUsers.slice(0,min)
        return finalUsers
    }

    launchUsers(count,spacesLink,testType,stayTime,environment){
        let users
        if(environment === "testing"){
            users = this.testingAccounts.lockUsers(count)
        }else if(environment === "staging"){
            users = this.stagingAccounts.lockUsers(count)
        }
        let availableSocketUsers = this.getUsers().filter(x=>x.state === "ready");
        let min = Math.min(users.length, availableSocketUsers.length)
        if(users.length > min){
            // realease the users 
            // This needs to be fixed. 
            let usersToRelease = users.splice(min - 1, users.length - min)
            if(environment === "testing"){
                this.testingAccounts.releaseUsers(usersToRelease)

            }else if(environment === "staging"){
                this.stagingAccounts.releaseUsers(usersToRelease)
            }
        }

        let payload = {
            "browserId" : "132322",
            "testType" : testType,
            "userDetails" : {
                "username" : "",
                "password" : ""
            },
            "testConfig":{
                "spacesLink": spacesLink,
                "stayTime": stayTime,
                "messageFrequency":1,
                "environment" : environment
            },
            "userType" : "regular",
            "environment": environment
        }
        let response = {
            dispatched : min,
            availableSocketUsers : availableSocketUsers.length,
            availableUsers : users.length
        }
        for (let index = 0; index < availableSocketUsers.length; index++) {
            if(index >= min) break
            const socketUser = availableSocketUsers[index];
            payload.browserId = socketUser.browserId
            payload.userDetails.username = users[index].username
            payload.userDetails.password = users[index].password
            this.users[socketUser.browserId].startTest(payload)
        }
        return response
    }

    launchMessageFlood(){
        let allUsers = this.getUsers()
        allUsers.map(userInfo=>{
            this.users[userInfo.browserId].sendMessage()
        })
    }
    launchMessageFloodCount(count){
        
    }

    forceAllToExit(){
        let allUsers = this.getUsers()
        allUsers.map(userInfo=>{
            this.users[userInfo.browserId].sendTestExit()
        })
    }

    stopUsers(count){
        let availableUsers = this.getAvailableLockedUsers(count)
        availableUsers.forEach(userObj=>{
            userObj.sendTestExit()
        })
        return {
            stopCount : availableUsers.length
        }
    }

    requestLogs(browserIds=[]){
        for(let browserId of browserIds){
            if(this.users[browserId] && this.users[browserId].state == "locked"){
                this.users[browserId].sendRequestLog() 
            }
        }
    }

    requestScreenshots(browserIds=[]){
        for(let browserId of browserIds){
            if(this.users[browserId] && this.users[browserId].state == "locked"){
                this.users[browserId].sendRequestScreenshot() 
            }
        }
    }
    getActiveUsers(){
        let users = Object.values(this.users).filter(user=>{
            return user.state === "locked"
        }).map(user=>{
            return {
                browserId : user.id,
                testType : user.testType,
                userCredentials : {...user.userCredentials}
            }
        })
        return users
    }
}

module.exports = UserManager