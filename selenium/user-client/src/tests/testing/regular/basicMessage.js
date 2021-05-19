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
        }
    }

    async start(){
        try{
            console.log("starting")
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
            console.log("is on accounts")
            if(bTrue){
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                console.log("should login")
                await delay(5000)
                await this.loginRetry()
            }else{
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                await delay(5000)
                console.log("should login")
                await this.loginRetry()
            }
            let bTerms = await this.checkTermsOfUser()
            if(bTerms){
                await this.acceptTerms()
                await delay(10000)
            }
            await this.waitUntilSpaceLoaded()
            console.log("should be in meeting right now")
            await this.joinMeetingRetry()
            await this.acceptPreviewMeeting()
            this.messageAvailable = true
            await this.idleStay(this.stayTime)
            await this.backToGoogle()
        }catch(e){
            await delay(2000)
            this.emit("error",e)
            await delay(2000)
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
        const accounts = "onesnatesting.esna.com/"
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

    async findUsername(){
        let emailXPath = '//*[@id="UsernameInput"]/input'
        let emailElement = await this.driver.findElement(By.xpath(emailXPath))
        return true
    }

    async findUsernameRetry(){
        let maxTryCount = 10;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            let response = await this.findUsername().catch(async (e)=>{
                console.log("error finding username")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(2000)
            })
            if(response) {
                console.log("found username")
                break
            }
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }

    async sendUsername(){
        let emailXPath = '//*[@id="UsernameInput"]/input'
        let emailElement = await this.driver.findElement(By.xpath(emailXPath))
        await emailElement.sendKeys(this.username)
        return true
    }

    async sendUsernameRetry(){
        let maxTryCount = 10;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            let response = await this.sendUsername().catch(async (e)=>{
                console.log("error finding username")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(2000)
            })
            if(response) break
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }

    async findPassword(){
        let passwordXPath = '//*[@id="PasswordInput"]/input'
        let passwordElement = await this.driver.findElement(By.xpath(passwordXPath))
        return true
    }
    async findPasswordRetry(){
        let maxTryCount = 10;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            let response = await this.findPassword().catch(async (e)=>{
                console.log("error finding password")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(3000)
            })
            if(response) break
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }
    async sendPassword(){
        let passwordXPath = '//*[@id="PasswordInput"]/input'
        let passwordElement = await this.driver.findElement(By.xpath(passwordXPath))
        await passwordElement.sendKeys(this.password)
        return true
    }
    async sendPasswordRetry(){
        let maxTryCount = 20;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            let response = await this.sendPassword().catch(async (e)=>{
                console.log("error sending password")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(3000)
            })
            if(response) break
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }

    async signInClickRetry(){
        let maxTryCount = 10;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            let response = await this.signInClick().catch(async (e)=>{
                console.log("error clicking sign in")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(3000)
            })
            if(response) break
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }

    async signInClick(){
        let signInButtonXPath = '//*[@id="GetStartedBtn"]'
        let signInElement = await this.driver.findElement(By.xpath(signInButtonXPath)).click()
        return true
    }

    async loginRetry(){
        await this.findUsernameRetry()
        await this.sendUsernameRetry()
        await this.findPasswordRetry()
        await this.sendPasswordRetry()
        await this.signInClickRetry()
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

    async joinMeetingRetry(){
        let maxTryCount = 10;
        let start = 0;
        let error 
        while(maxTryCount >= start){
            console.log("should be joining meeting")
            let response = await this.joinMeeting().catch(async (e)=>{
                console.log("error clicking")
                start += 1
                if(maxTryCount == start){
                    error = e
                }
                await delay(4000)
            })
            if(response) break
        }
        if(error){
            throw new Error(error)
        }else{
            return true
        } 
    }

    async joinMeeting(){
        let meetingButtonXPath = '//*[@id="VideoContainer"]/div/div[1]/div/div/button'
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(1000)
        return true
        // throw new Error("fake Error")
    }

    async acceptPreviewMeeting(){
        let joinButtonXPath = '/html/body/div/div/div[3]/div[3]/div[6]/div/div[1]/div/div/div/div[3]/div/button'
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

    // async waitUntilSpaceLoaded(){
    //     // Handle throwing of error.
    //     console.log("waiting till space loaded")
    //     // let meetingButtonXPath = '//*[@id="VideoContainer"]/div/div[1]/div/div/button'
    //     // let condition = until.elementIsVisible(this.driver.findElement(By.xpath(meetingButtonXPath)))
    //     // let waitResponse = await this.driver.wait(condition,60000).catch(err=>{
    //     //     console.log("wait failed")
    //     // })
    //     await delay(30000)
    //     // if(!waitResponse){
    //     //     throw new Error("space took too long to load.")
    //     // }
    // }

    async waitUntilSpaceLoaded(){
        await delay(5000)
    }

    genMessagePayload(){
        const traceId = uuidv4()
        const browserId = process.env.browserId
        const now = new Date()
        let message = `TraceId:${traceId}_browserId:${browserId}_time:${now.toString()}`
        return message
    }

    async sendMessage(){
        let textBoxSelectorXPath = '/html/body/div/div/div[2]/div[3]/div[3]/div[8]/div[1]/div[2]/div[1]/div[2]/div'
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