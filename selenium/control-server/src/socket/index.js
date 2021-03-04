const socketHandlers = (io,userManager) => {
    io.on("connection",(socket)=>{
        console.log("new connection ")
        // Is a new user or reconnecting user?
        const user = userManager.loadUser(socket)        
        user.moveToReady()
        socket.on("disconnect",()=>{
            userManager.removeUser(socket)
        })
    })
}

module.exports = {
    socketHandlers : socketHandlers
}