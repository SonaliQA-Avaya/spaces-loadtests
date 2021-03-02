const request = require("request")
const stopUsers = (controlServerIP,count) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'POST',
            'url': `http://${controlServerIP}/api/stopusers`,
            'headers': {
              'Content-Type': 'application/json'
            },
            body: {count},
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

module.exports = stopUsers