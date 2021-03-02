const {EventEmitter} = require("events")
const {v4:uuidv4} = require("uuid")
class User extends EventEmitter{
    constructor(socket,browser_id){
        super()
        this.socket = socket
        this.id = browser_id // hash userInfo for this. or easy lookup
        this.setSocketHandlers()
        this.state = "starting"
        this.testType = null
        this.messageTestTypes = ["basicMessage"]
        this.userCredentials = null
        this.environment = null
    }
    setSocketHandlers(){
        this.socket.on("ready",()=>{
            this.state = "ready"
            this.testType = null
            console.log("emitting ready browserId", this.getInfo())
            console.log({userCredentials:this.userCredentials})
            console.log({environment:this.environment})
            if(this.userCredentials != null){
                let payload = {
                    userCredentials : {...this.userCredentials},
                    environment : this.environment
                }
                console.log("should be releasing user")
                this.emit("release-user",payload)
                this.environment = null
                this.userCredentials = null
            }
        })
        this.socket.on("locked",()=>{
            this.state = "locked"
        })
        this.socket.on("test.error",(error)=>{
            this.state = "ready"
            console.log("socket error ", this.getInfo(),error)
        })
    }
    changeSocket(socket){
        this.socket = socket
    }
    startTest(payload){
        console.log("setting user info",this.getInfo(),payload)
        this.userCredentials = {...payload.userDetails};
        this.testType = payload.testType
        this.environment = payload.environment
        this.state = "locked"
        this.socket.emit("test.start",payload)
    }
    moveToReady(){
        this.state = "awaiting.ready";
        this.socket.emit("move.to.ready")
    }
    getInfo(){
        return {
            state : this.state,
            browserId : this.id,
            testType : this.testType
        }
    }
    sendMessage(){
        if( this.state == "locked" && this.messageTestTypes.indexOf(this.testType) != -1 ){
            this.socket.emit("test.sendmessage",{})
        }
    }
    sendTestExit(){
        if( this.state == "locked" && this.messageTestTypes.indexOf(this.testType) != -1 ){
            this.socket.emit("test.forceful.exit",{})
        }   
    }
}

module.exports = User