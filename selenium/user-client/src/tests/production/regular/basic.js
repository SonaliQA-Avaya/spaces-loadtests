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
class Basic extends EventEmitter{
    constructor(driver,testConfig,userDetails){
        super()
        const {username,password} = userDetails
        this.username = username 
        this.password = password
        const {spacesLink,stayTime=10,messageFrequency=1} = testConfig // default stay for 10 minutes
        this.supportedEvents = [
            "error"
        ]
        this.spacesLink = spacesLink;
        this.stayTime = stayTime;
        this.messageFrequency = messageFrequency;
        this.driver = driver
    }
    async start(){
        try{
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
            await delay(5000)
            await this.joinMeeting()
            await this.acceptPreviewMeeting()
            await delay(60000)
            await this.backToGoogle()
        }catch(e){
            await this.backToGoogle()
            await delay(2000)
            this.emit("error",e)
        }
        await this.cleanBrowser()

    }
    async goToSpaces(){
        await this.driver.get(this.spacesLink)
        await delay(5000)
    }
    async isOnAccounts(){
        const url = await this.driver.getCurrentUrl()
        const accounts = "accounts.avayacloud.com"
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
        await delay(5000)
        let passwordElement = await this.driver.findElement(By.xpath(passwordXPath))
        await passwordElement.sendKeys(this.password)
        await delay(1000)
        let signInElement = await this.driver.findElement(By.xpath(signInButtonXPath)).click()
        await delay(10000)
    }

    async joinMeeting(){
        let meetingButtonXPath = '//*[@id="VideoContainer"]/div/div[1]/div/div/button'
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(5000)
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
}

module.exports = Basic