const request = require("request")
const forceAllUsersToExit = (controlServerIP) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'POST',
            'url': `http://${controlServerIP}/api/forcealltoexit`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: {},
            json: true
        }
        request(options, function (error, response) {
            if (error){
                reject(error)
            }else{
                resolve(response.body)
            } 
        });
    })
}

module.exports = forceAllUsersToExit