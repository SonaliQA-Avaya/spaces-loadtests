const config = require("./config")
const UserManager = require("./src/lib/UserManager");
const userManager = new UserManager()
const express = require("express")
const ManagerRouter = require("./src/api/managerRoutes");
const managerRoutes = new ManagerRouter(userManager)
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser())
app.use("/api",managerRoutes.routes)
const http = require("http").Server(app)
const socketServer = require("./src/socket/index")
const io = require("socket.io")(http,{
    transports: ["websocket"]
})

socketServer.socketHandlers(io,userManager)
const {host,port} = config

http.listen(port,host,()=>{
    console.log(`listening on http://${host}:${port}`)
})