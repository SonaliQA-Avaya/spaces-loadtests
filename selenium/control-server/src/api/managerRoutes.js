const express = require("express")
class ManagerRoutes {
    constructor(userManager){
        this.userManager = userManager
        this.routes = new express.Router()
        this.setRoutes()
    }
    setRoutes(){
        this.routes.post('/start',(req,res)=>{
            const {browserId} = req.body
            if(this.userManager.users[browserId] && this.userManager.users[browserId].state === "ready"){
                console.log("running test")
                this.userManager.users[browserId].startTest(req.body)
            }
            res.json({
                success : true
            })
        })
        this.routes.get('/users',(req,res)=>{
            let users = this.userManager.getUsers()
            let stagingUsers = this.userManager.stagingAccounts.getSummary()
            let testingUsers = this.userManager.testingAccounts.getSummary()
            res.json({
                success : true,
                users : users,
                count : users.length,
                staging : stagingUsers,
                testing : testingUsers
            })
        })
        this.routes.get('/activeusersummary',(req,res)=>{
            let users = this.userManager.getActiveUsers()
            res.json({
                success : true,
                users : users
            })
        })
        this.routes.get('/test',(req,res)=>{
            res.json({
                success : true
            })
        })
        this.routes.post("/startusers",(req,res)=>{
            let count = req.body.count
            let spacesLink = req.body.spacesLink
            let testType = req.body.testType 
            let stayTime = req.body.stayTime
            let environment = req.body.environment
            let response = this.userManager.launchUsers(count,spacesLink,testType,stayTime,environment);
            res.json({
                success : true,
                ...response
            })
        })
        this.routes.post("/triggerUserMessages",(req,res)=>{
            this.userManager.launchMessageFlood();
            res.json({
                success : true
            })
        })
        this.routes.post("/triggerUserMessageCount",(req,res)=>{
            let count = req.body.count
            let response = this.userManager.launchMessageFloodCount(count)
            res.json({
                success : true,
                ...response
            })
        })
        this.routes.post("/forcealltoexit",(req,res) => {
            this.userManager.forceAllToExit();
            res.json({
                success : true
            })
        })
        this.routes.post("/stopusers",(req,res)=>{
            let response = this.userManager.stopUsers(req.body.count)
            res.json({
                success : true,
                ...response
            })
        })
        this.routes.post("/gatherlogs",(req,res)=>{
            let browserIds = req.body.browserIds;
            let response = this.userManager.requestLogs(browserIds)
            res.json({
                success : true,
                ...response
            })
        })
        this.routes.post("/gatherscreenshots",(req,res)=>{
            let browserIds = req.body.browserIds;
            let response = this.userManager.requestScreenshots(browserIds)
            res.json({
                success : true,
                ...response
            })        
        })
    }
}

module.exports = ManagerRoutes;