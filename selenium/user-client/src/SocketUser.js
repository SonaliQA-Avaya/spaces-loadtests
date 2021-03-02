const io = require("socket.io-client")
const environments = require("./tests/environments")
const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
const path = require("path")
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs")
const {copyFileToGCS} = require("./helpers/storage");

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
        let chromeOptions = new chrome.Options()
        chromeOptions.addArguments([
            "--no-sandbox",
            "--disable-dev-shm-usage",
            "--use-fake-device-for-media-stream",
            "--use-fake-ui-for-media-stream",
            `--use-file-for-fake-video-capture=${path.join(__dirname,"../sample_video.y4m")}`
        ])
        this.driver = await new webdriver.Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build()
    }

    async takeScreenShot(){
        let imageName = process.env.browserId + "-" + Date.now().toString() + '-' + "screenshot.png"
        let writePath = path.join("/tmp/",imageName)
        let image = await this.driver.takeScreenshot()
        fs.writeFileSync(writePath,image,"base64")
        await copyFileToGCS(writePath)
        fs.unlinkSync(writePath)
        return
    }

    async killDriver(){
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
                    await this.takeScreenShot()
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
        this.socket.on("test.forceful.exit", async() => {
            console.log("forceful client exit received from server")
            if(this.inTest && this.test != null){
                this.test.emit("test.exit")
            }
        })
    }
}

module.exports = SocketUser