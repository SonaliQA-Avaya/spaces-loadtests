const config = require("./config")
const SocketUser = require("./src/SocketUser")

const run = async ()=>{
    const {controlServer} = config
    console.log("starting")
    const socketUser = new SocketUser(controlServer.socketConfig)
}

run()