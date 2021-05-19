const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
const {EventEmitter} = require("events")
const delay = (millis)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,millis)
    })
}
const Url = require("url-parse");
console.log(process.env.browserId)
const podNumber = Number(process.env.browserId)
const delayOffset = async () => {
    const podDelay = podNumber * 2000
    console.log(podDelay)
    await delay(podDelay)
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
        this.exitAvailble = true;
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
            this.on("test.exit",async () => {
                if(this.exitAvailble){
                    this.exitTriggered = true
                }
            })
            await delayOffset()
            console.log("done delay offset")
            await this.goToDashboard()
            let bTrue = await this.isOnAccounts()
            if(bTrue){
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                await delay(10000)
                await this.login()
            }else{
                let guestLogin = await this.isGuestJoin()
                if(guestLogin){
                    await this.clickToSignIn()
                }
                await delay(10000)
                await this.login()
            }
            let bTerms = await this.checkTermsOfUser()
            if(bTerms){
                await this.acceptTerms()
                await delay(5000)
            }
            await this.waitUntilSpaceLoaded()
            await this.goToDashboard()
            console.log("should be in meeting right now")
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
        await delay(10000)
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
        await delay(10000)
    }
    async login(){
        let emailXPath = '//*[@id="UsernameInput"]/input'
        let passwordXPath = '//*[@id="PasswordInput"]/input'
        let signInButtonXPath = '//*[@id="GetStartedBtn"]'
        let emailElement = await this.driver.findElement(By.xpath(emailXPath)).catch(err=>{
            console.log(err)
        })
        await emailElement.sendKeys(this.username)
        await delay(15000)
        let passwordElement = await this.driver.findElement(By.xpath(passwordXPath))
        await passwordElement.sendKeys(this.password)
        await delay(5000)
        let signInElement = await this.driver.findElement(By.xpath(signInButtonXPath)).click()
        await delay(15000)
    }

    async backToGoogle(){
        await this.driver.get("https://google.com")
    }

    async cleanBrowser(){
        await this.driver.manage().deleteAllCookies()
    }

    async goToDashboard(){
        let urlObj = new Url(this.spacesLink)
        let location = urlObj.origin;
        await this.driver.get(location)
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

}

module.exports = BasicMessage