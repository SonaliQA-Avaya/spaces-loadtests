const webdriver = require("selenium-webdriver")
const By = webdriver.By
const Keys = webdriver.Key 
const until = webdriver.until;
const path = require("path")
const chrome = require("selenium-webdriver/chrome");
// const Basic = require("./src/tests/staging/regular/basic")
const BasicMessage = require("./src/tests/staging/regular/basicMessage")
const goToDashboard = require("./src/tests/testing/regular/goToDashboard")
const run = async ()=>{
    let chromeOptions = new chrome.Options()
    chromeOptions.addArguments([
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
        `--use-file-for-fake-video-capture=${path.join(__dirname,"./sample_video.y4m")}`
    ])
    let driver = await new webdriver.Builder().forBrowser("chrome").setChromeOptions(chromeOptions).build()
    let testConfig = {
        environment : "staging",
        spacesLink : "https://loganstaging2.esna.com/spaces/606f31d940192e14856d95af",
        stayTime : 240000,
        messageFrequency : 1
    }
    let userDetails = {
        username : "user6@ericloadtest.com",
        password : "CZZBnTA87I"
    }
    // let testConfig = {
    //     environment : "testing",
    //     spacesLink : "https://logantesting.esna.com/spaces/604137a7f0785861de0ebd1c",
    //     stayTime : 30000,
    //     messageFrequency : 1
    // }
    // let userDetails = {
    //     username : "lmtest986@largemeeting123456.com", //925
    //     password : "avaya123"
    // }
    let basicTest = new BasicMessage(driver,testConfig,userDetails)
    setTimeout(()=>{
        basicTest.emit("sendMessage",{})
    },120000)
    await basicTest.start()
    await driver.quit()
}

run().then(()=>{
    console.log("test complete")
})

