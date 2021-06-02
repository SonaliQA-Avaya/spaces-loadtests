const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
const {EventEmitter} = require("events")
const { v4: uuidv4 } = require('uuid');

const delay = (millis)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,millis)
    })
}
class BasicMessage extends EventEmitter{
    constructor(driver,testConfig,userDetails){
        super()
        const {username,password} = userDetails
        this.username = username 
        this.password = password
        console.log(testConfig)
        const {spacesLink,stayTime,messageFrequency=1} = testConfig // default stay for 10 minutes
        console.log(stayTime)
        this.supportedEvents = [
            "error"
        ]
        this.spacesLink = spacesLink;
        this.stayTime = stayTime;
        this.messageFrequency = messageFrequency;
        this.driver = driver
        this.messageAvailable = false; // sets to true when the user can actually send messages
        this.exitAvailble = true;
        this.chatTabSelected = false;
        this.exitTriggered = false
    }

    async idleStay(stayTime){
        let baseCount = 0
        let increment = 1000
        while(baseCount < stayTime){
            // Check if every second an exit signal was triggered. 
            baseCount += increment
            await delay(increment)
            if(this.exitTriggered){
                break
            }
            // Check if we are in the meeting
            let bInMeeting = await this.checkIfInMeeting()
            if(bInMeeting){
                // console.log("In Meeting")
            }else{
                console.log("Not In Meeting")
                throw new Error("User Surprisingly Not In Meeting")
            }
        }
    }

    async checkIfInMeeting(){
        let meetingXPath = '//*[@id="VideoContainer"]/div/div[3]'
        let bFound =  await this.driver.findElement(By.xpath(meetingXPath)).catch(err=>{
            console.log("error trying to find the meeting button ", err)
        })
        if(bFound){
            return true
        }else{
            return false
        }
    }

    async start(){
        try{
            this.on("sendMessage",async ()=>{
                console.log("received send message request")
                if(this.messageAvailable){
                    if(this.chatTabSelected == false){
                        console.log("selecting chat tab")
                        await this.selectChatTab()
                        this.chatTabSelected = true;
                        await delay(4000)
                    }
                    console.log("sending message")
                    await this.sendMessage()
                }
            })
            this.on("test.exit",async () => {
                if(this.exitAvailble){
                    this.exitTriggered = true
                }
            })
            await this.goToSpaces()
            let bTrue = await this.isOnAccounts()
            if(bTrue){
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                await delay(5000)
                await this.login()
            }else{
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                await delay(5000)
                await this.login()
            }
            let bTerms = await this.checkTermsOfUser()
            if(bTerms){
                await this.acceptTerms()
                await delay(5000)
            }
            await this.waitUntilSpaceLoaded()
            console.log("should be in meeting right now")
            await this.joinMeeting()
            await this.acceptPreviewMeeting()
            this.messageAvailable = true
            await this.idleStay(this.stayTime)
            await this.backToGoogle()
        }catch(e){
            await delay(2000)
            this.emit("error",e)
            await delay(20000)
            await this.backToGoogle()
        }
        await this.cleanBrowser()
    }
    async checkTermsOfUser(){
        try{
            let termsOfUseTextSelector = '//*[@id="root"]/div/h1/span';
            let targetText = "Terms of Use"
            let divText = await this.driver.findElement(By.xpath(termsOfUseTextSelector)).getText()
            console.log(targetText)
            console.log(divText)
            let bMatch = divText.toLowerCase().indexOf(targetText.toLowerCase()) != -1
            console.log(bMatch)
            return bMatch
        }catch{
            return false
        }
    }

    async acceptTerms(){
        let acceptButtonXPath = '//*[@id="root"]/div/button'
        await this.driver.findElement(By.xpath(acceptButtonXPath)).click()
    }
    async goToSpaces(){
        await this.driver.get(this.spacesLink)
        await delay(5000)
    }
    async isOnAccounts(){
        const url = await this.driver.getCurrentUrl()
        const accounts = "onesnastaging.esna.com/"
        return url.indexOf(accounts) != -1
    }
    async isGuestJoin(){
        const url = await this.driver.getCurrentUrl()
        let substring = "guestjoin"
        return url.indexOf(substring) != -1
    }
    async clickToSignIn(){
        let signInFromGuestXPath = '//*[@id="root"]/div/div[5]'
        await this.driver.findElement(By.xpath(signInFromGuestXPath)).click()
        await delay(5000)
    }
    async login(){
        let emailXPath = '//*[@id="UsernameInput"]/input'
        let passwordXPath = '//*[@id="PasswordInput"]/input'
        let signInButtonXPath = '//*[@id="GetStartedBtn"]'
        let emailElement = await this.driver.findElement(By.xpath(emailXPath)).catch(err=>{
            console.log(err)
        })
        await emailElement.sendKeys(this.username)
        await delay(10000)
        let passwordElement = await this.driver.findElement(By.xpath(passwordXPath))
        await passwordElement.sendKeys(this.password)
        await delay(1000)
        let signInElement = await this.driver.findElement(By.xpath(signInButtonXPath)).click()
        await delay(10000)
    }

    async joinMeeting(){
        let meetingButtonXPath = '//*[@id="VideoContainer"]/div/div[1]/div/div/div/button'
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(10000)
    }

    async acceptPreviewMeeting(){
        let joinButtonXPath = '/html/body/div/div/div[3]/div[3]/div[6]/div/div/div[1]/div/div/div/div[3]/div/button'
        let buttonElement = await this.driver.findElement(By.xpath(joinButtonXPath)).click()
    }

    async backToGoogle(){
        await this.driver.get("https://google.com")
    }

    async cleanBrowser(){
        await this.driver.manage().deleteAllCookies()
    }

    async selectChatTab(){
        // Click the tab
        let chatTabSelectorXPath = '//*[@id="root"]/div/div[2]/div[3]/div[3]/div[1]/div/a[1]'
        await this.driver.findElement(By.xpath(chatTabSelectorXPath)).click()
        // Send the message
    }

    async waitUntilSpaceLoaded(){
        // Handle throwing of error.
        console.log("waiting till space loaded")
        // let meetingButtonXPath = '//*[@id="VideoContainer"]/div/div[1]/div/div/button'
        // let condition = until.elementIsVisible(this.driver.findElement(By.xpath(meetingButtonXPath)))
        // let waitResponse = await this.driver.wait(condition,60000).catch(err=>{
        //     console.log("wait failed")
        // })
        await delay(30000)
        // if(!waitResponse){
        //     throw new Error("space took too long to load.")
        // }
    }

    genMessagePayload(){
        const traceId = uuidv4()
        const browserId = process.env.browserId
        const now = new Date()
        let message = `traceId:${traceId}_browserId:${browserId}_time:${now.toString()}`
        return message
    }

    async sendMessage(){
        let textBoxSelectorXPath = '//*[@id="root"]/div/div[2]/div[3]/div[3]/div[8]/div[1]/div[2]/div[1]/div/div/div[1]/p'
        let message  = this.genMessagePayload()
        await this.driver.findElement(By.xpath(textBoxSelectorXPath)).sendKeys(message)
        await delay(500)
        let buttonXPath = '/html/body/div/div/div[2]/div[3]/div[3]/div[8]/div[1]/div[2]/div[3]/button[2]'
        await this.driver.findElement(By.xpath(buttonXPath)).click()
    }

    async exitMeeting(){

    }
}

module.exports = BasicMessage