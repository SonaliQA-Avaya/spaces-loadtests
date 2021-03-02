const request = require("request")
const getUsers = (controlServerIP) => {
    return new Promise((resolve,reject)=>{
        const options = {
            'method': 'GET',
            'url': `http://${controlServerIP}/api/users`,
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

module.exports = getUsers