const { EventEmitter } = require("selenium-webdriver");

const {EventEmitter} = require("events")
class Basic extends EventEmitter{
    constructor(driver,testConfig){
        super()
        this.supportedEvents = [
            "error"
        ]
    }
    async start(){
        
    }
}

module.exports = Basic