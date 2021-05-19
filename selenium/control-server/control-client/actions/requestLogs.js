const request = require("request")
const requestLogs = (controlServerIP,browserIds) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'POST',
            'url': `http://${controlServerIP}/api/gatherlogs`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: {browserIds},
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

module.exports = requestLogs