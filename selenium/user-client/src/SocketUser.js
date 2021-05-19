const io = require("socket.io-client")
const environments = require("./tests/environments")
const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
const logging= webdriver.logging;
const path = require("path")
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs")
const {copyFileToGCS} = require("./helpers/storage");

const writeFile = (fp,stringContent,options={}) => {
    return new Promise((resolve,reject) => {
        fs.writeFile(fp,stringContent,options,(err)=>{
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        })
    })
}

class SocketUser{
    constructor(controlServerConfig){
        const {url,options} = controlServerConfig
        this.socket = io(url,options);
        this.user = null;
        this.driver = null
        this.setHandlers()
        this.inTest = false
        this.test = null
        this.testType = null
    }
    async initDriver(){
        console.log("initializing the driver")
        let chromeOptions = new chrome.Options()
        chromeOptions.addArguments([
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            `--use-file-for-fake-video-capture=${path.join(__dirname,"../sample_video.y4m")}`
        ])
        let logPreferences = new logging.Preferences()
        logPreferences.setLevel(logging.Type.BROWSER,logging.Level.ALL)
        this.driver = await new webdriver.Builder().forBrowser("chrome").setChromeOptions(chromeOptions).setLoggingPrefs(logPreferences).build()
        // this.driver.sendDevToolsCommand("Log.enable",{})
    }

    async getBrowserLogs(){
        let entries = await this.driver.manage().logs().get(logging.Type.BROWSER).catch(err=>{
            console.log("Error getting browser logs", err)
        })
        if(!entries){
            return
        }
        let logString = entries.map(entry => {
            return `${entry.level.name} ${entry.message}`
        }).join("\n")
        let logName = process.env.browserId + "-server-requested" + "-" + Date.now().toString() + '-' + "clientlogs.txt"
        let writeLogPath = path.join("/tmp/",logName)
        let writeSuccess = await writeFile(writeLogPath,logString).catch(err => {
            console.log("log write error ", err)
        })
        if(!writeSuccess){
            return
        }
        await copyFileToGCS(writeLogPath)
        fs.unlinkSync(writeLogPath)
        return
    }

    async getErrorBrowserLogs(){
        console.log("getting error browser logs")
        let entries = await this.driver.manage().logs().get(logging.Type.BROWSER).catch(err=>{
            console.log("Error getting browser logs", err)
        })
        if(!entries){
            return
        }
        let startIndex = entries.length > 3000 ? entries.length - 3000 : 0   
        let lastEntries = entries.slice(startIndex)
        let logString = lastEntries.map(entry => {
            return JSON.stringify(entry.toJSON(),null,2)
        }).join("\n")
        let logName = process.env.browserId + "-error" + "-" + Date.now().toString() + '-' + "clientlogs.txt"
        let writeLogPath = path.join("/tmp/",logName)
        let writeSuccess = await writeFile(writeLogPath,logString).catch(err => {
            console.log("log write error ", err)
        })
        if(!writeSuccess){
            return
        }
        await copyFileToGCS(writeLogPath)
        fs.unlinkSync(writeLogPath)
        return
    }

    async takeScreenShot(){
        let imageName = process.env.browserId + "-server-requested" + "-" + Date.now().toString() + '-' + "screenshot.png"
        let writePath = path.join("/tmp/",imageName)
        let image = await this.driver.takeScreenshot()
        fs.writeFileSync(writePath,image,"base64")
        await copyFileToGCS(writePath)
        fs.unlinkSync(writePath)
        return
    }

    async takeErrorScreenShot(){
        let imageName = process.env.browserId + "-error" + "-" + Date.now().toString() + '-' + "screenshot.png"
        let writePath = path.join("/tmp/",imageName)
        let image = await this.driver.takeScreenshot()
        fs.writeFileSync(writePath,image,"base64")
        await copyFileToGCS(writePath)
        fs.unlinkSync(writePath)
        return
    }

    async killDriver(){
        console.log("killing the driver")
        await this.driver.quit()
        this.driver = null
    }

    setHandlers(){
        this.socket.on("connect",()=>{
            console.log("connected")
        })
        this.socket.on("start_regular",userInfo=>{
            console.log("start_user")
        })
        this.socket.on("move.to.ready",async ()=>{
            console.log("moving to ready")
            // Initialize the selenium components...ie the driver and go to google. 
            // For now nothing, it will get passed in after initialization.
            if(this.driver == null){
                await this.initDriver()
            }
            this.socket.emit("ready")
        })
        this.socket.on("test.start",async (payload)=>{
            console.log("test.start fired ")
            if(!this.inTest){
                const {testType,testConfig={},userDetails={},userType="anonymous",environment="production"} = payload
                // Check if test is avaliable
                if(environments.indexOf(environment) == -1 ){
                    console.log("invalid environment")
                    return
                }
                let availableTests
                if(userType == "anonymous"){
                    availableTests = require(`./tests/${environment}/manifests.js`).anonymous;
                }else if(userType == "regular"){
                    availableTests = require(`./tests/${environment}/manifests.js`).regular;
                }else{
                    console.log("un-recognized user type")
                    this.socket.emit("test.error",{
                        message : "Unrecognized user type"
                    })
                    return
                }
                if(availableTests.indexOf(testType) == -1){
                    console.log("test type not recognized")
                    return
                }
                this.testType = testType
                console.log(testType)
                const Test = require(`./tests/${environment}/${userType}/${testType}`)
                this.test = new Test(this.driver,testConfig,userDetails)
                this.test.on("error",async (error)=>{
                    console.log("error", error)
                    await this.takeErrorScreenShot()
                    await this.getErrorBrowserLogs()
                    this.socket.emit("test.error",{
                        message : error.message
                    })
                    // capture the screenshot and save to file and maybe upload to disk
                })
                this.inTest = true
                this.socket.emit("locked")
                await this.test.start()
                this.inTest = false
                this.test = null
                this.testType = null
                await this.killDriver()
                await this.initDriver()
                console.log("test complete moving back to ready")
                this.socket.emit("ready")
            }
        })
        this.socket.on("test.sendmessage",async () => {
            console.log("received send message request from server")
            let messageTestTypes = ["basicMessage"]
            if(this.inTest && messageTestTypes.indexOf(this.testType) != -1 ){
                this.test.emit("sendMessage",{})
            }
        })
        this.socket.on("test.capturescreenshot",async ()=>{
            console.log("server requested screenshot")
            let messageTestTypes = ["basicMessage"]
            if(this.inTest && messageTestTypes.indexOf(this.testType) != -1 ){
                await this.takeScreenShot()
            }
        })
        this.socket.on("test.capturelogs",async () => {
            console.log("server requesting logs")
            let messageTestTypes = ["basicMessage"]
            if(this.inTest && messageTestTypes.indexOf(this.testType) != -1 ){
                await this.getBrowserLogs()
            }
        })
        this.socket.on("test.forceful.exit", async() => {
            console.log("forceful client exit received from server")
            if(this.inTest && this.test != null){
                this.test.emit("test.exit")
            }
        })
    }
}

module.exports = SocketUser