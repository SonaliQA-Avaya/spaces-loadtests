const request = require("request")
const getActiveUsers = (controlServerIP) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'GET',
            'url': `http://${controlServerIP}/api/activeusersummary`,
            'headers': {
              'Content-Type': 'application/json'
            },
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

module.exports = getActiveUsers