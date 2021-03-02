const fs = require('fs')
const path = require("path")

let create_testing_users = () => {
    let users = []
    for (let index = 1; index < 1001; index++) {
        let username = `lmtest${index}@largemeeting123456.com`
        let password = "avaya123"
        users.push({username,password})
    }
    let csvString = users.map(user=>{
        return `${user.username},${user.password}`
    }).join('\n')
    let filePath = path.join(__dirname,"./data/testing_users.csv")
    fs.writeFileSync(filePath,csvString)
}

create_testing_users()