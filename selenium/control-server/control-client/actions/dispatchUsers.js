const request = require("request")
const dispatchUsers = (controlServerIP,count,spacesLink,testType,stayTime,environment) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'POST',
            'url': `http://${controlServerIP}/api/startusers`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: {count,spacesLink,testType,stayTime,environment},
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

module.exports = dispatchUsers