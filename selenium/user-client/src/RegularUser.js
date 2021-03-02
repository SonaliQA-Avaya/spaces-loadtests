const {EventEmitter} = require("events");
const constants = require("./constants");
const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
let url = require("url")

let delay = (millis)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,millis)
    })
}

class RegularUser extends EventEmitter{
    constructor(driver,userDetails,spacesLink){
        super()
        let {username,password,stayTime} = userDetails 
        this.username = username;
        this.password = password;
        this.stayTime = stayTime;
        this.spacesLink = spacesLink;
        this.driver = driver
        this.state = "starting"
        let urlObj = url.parse(spacesLink,true)
        this.host = urlObj.host
        this.environment = constants.environments[this.host]
        // starting, error, joined
    }
    events = [
        'joining',
        'error',
        'joined',
        'error',
        'leaving',
        'left'    
    ]
    async start(){
        try{
            // Join from a link.
            if(this.host === constants.PRODUCTION){
                await this.startProduction()
            }else if(this.host === constants.STAGING){
                await this.startStaging()
            }

        }catch(e){
            this.emit('error',e)
        }
    }
    async goToSpaces(){
        await this.driver.get(this.spacesLink)
        await delay(5000)
    }
    async startProduction(){
        // Sign in
        // Go to space.
        // Click Video Icon
        // Turn on camera, if off.
        // Click chat tabw
        // Repeat:
            // enter some message 
            // click enter
        // 
        await this.goToSpaces()
        let bTrue = await this.productionIsOnAccounts()
        if(bTrue){
            let guestLogin = await this.productionIsGuestJoin()
            if(guestLogin){
                await this.productionClickToSignIn()
            }
            await delay(5000)
            await this.productionLogin()
        }else{
            let guestLogin = await this.productionIsGuestJoin()
            if(guestLogin){
                await this.productionClickToSignIn()
            }
            await delay(5000)
            await this.productionLogin()
        }
        await delay(5000)
        this.emit("joining",{
            foo : "bar"
        })
        await this.productionJoinMeeting()
        await this.productionAcceptPreviewMeeting()
        this.emit("joined",{foo:"bar"})
        await delay(60000)
        await this.driver.quit()
        this.emit("left", {foo:"bar"})
    }
    async startStaging(){
        await this.goToSpaces()
        let bTrue = await this.stagingIsOnAccounts()
        if(bTrue){
            let guestLogin = await this.stagingIsGuestJoin()
            if(guestLogin){
                await this.stagingClickToSignIn()
            }
            await delay(5000)
            await this.productionLogin()
        }else{
            let guestLogin = await this.stagingIsGuestJoin()
            if(guestLogin){
                await this.stagingClickToSignIn()
            }
            await delay(5000)
            await this.stagingLogin()
        }
        await delay(5000)
        this.emit("joining",{
            foo : "bar"
        })
        await this.stagingJoinMeeting()
        await this.stagingAcceptPreviewMeeting()
        this.emit("joined",{foo:"bar"})
        await delay(60000)
        await this.driver.quit()
        this.emit("left", {foo:"bar"})
    }
    async productionIsOnAccounts(){
        const url = await this.driver.getCurrentUrl()
        const {accounts} = this.environment
        return url.indexOf(accounts) != -1
    }
    async productionIsGuestJoin(){
        const url = await this.driver.getCurrentUrl()
        let substring = "guestjoin"
        return url.indexOf(substring) != -1
    }
    async productionLogin(){
        let {emailXPath,passwordXPath,signInButtonXPath} = this.environment.selectors
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
    async productionJoinMeeting(){
        let {meetingButtonXPath} = this.environment.selectors
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(5000)
    }

    async productionAcceptPreviewMeeting(){
        let {joinButtonXPath} = this.environment.selectors
        let buttonElement = await this.driver.findElement(By.xpath(joinButtonXPath)).click()
    }
    async productionClickToSignIn(){
        let {signInFromGuestXPath} = this.environment.selectors
        await this.driver.findElement(By.xpath(signInFromGuestXPath)).click()
        await delay(5000)
    }
    async stagingIsOnAccounts(){
        const url = await this.driver.getCurrentUrl()
        const {accounts} = this.environment
        return url.indexOf(accounts) != -1
    }
    async stagingIsGuestJoin(){
        const url = await this.driver.getCurrentUrl()
        let substring = "guestjoin"
        return url.indexOf(substring) != -1
    }
    async stagingLogin(){
        let {emailXPath,passwordXPath,signInButtonXPath} = this.environment.selectors
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
    async stagingJoinMeeting(){
        let {meetingButtonXPath} = this.environment.selectors
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(5000)
    }
    async stagingClickToSignIn(){
        let {signInFromGuestXPath} = this.environment.selectors
        await this.driver.findElement(By.xpath(signInFromGuestXPath)).click()
        await delay(5000)
    }
    async stagingJoinMeeting(){
        let {meetingButtonXPath} = this.environment.selectors
        let buttonElement = await this.driver.findElement(By.xpath(meetingButtonXPath)).click()
        await delay(5000)
    }

    async stagingAcceptPreviewMeeting(){
        let {joinButtonXPath} = this.environment.selectors
        let buttonElement = await this.driver.findElement(By.xpath(joinButtonXPath)).click()
    }
}
module.exports = RegularUser