const MongoClient = require('mongodb').MongoClient;
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
let fs = require("fs")
let path = require("path")
let users = fs.readFileSync(path.join(__dirname,"./data/testing_users.csv")).toString().split("\n").map(x=>x.split(","))
const delay = (ms)=>{
	return new Promise((resolve)=>{
		setTimeout(resolve,ms)
	})
}
let usersWithNoSettingsObj = [];
// let users = [['user256@ericloadtest.com']]
let connectionUri = ""
MongoClient.connect(
  connectionUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async (connectErr, client) => {
	let findOne = (filter)=>{
		return new Promise(resolve=>{
			console.log(filter)
			const coll = client.db('logan-testing').collection('usersettings');
			coll.find(filter, async (cmdErr, result) => {
				resolve(await result.toArray())
			});
		})
	}
	let findOneAndUpdate = (filter,update) => {
		return new Promise(resolve=>{
			const coll = client.db('logan-testing').collection('usersettings');
			coll.findOneAndUpdate(filter,{
				$set : {
					showFeatureTipsOnStartUp : false,
					toc_version_agreed : "201812171201"
				}
			},{
				upsert : false
			},async (cmdErr, result) => {
				// console.log(cmdErr)
				// console.log(result)
				resolve()
			});
		})
	}
	let update = {
		showFeatureTipsOnStartUp : false
	}
	for(let index = 924; index < users.length; index++){
		if(index > 1000) break
		let user = users[index]
		let filter = { 'username' : user[0]}
		let [usj1] = await findOne(filter)
		if(!usj1){
			usersWithNoSettingsObj.push(user)
		}
		console.log(usj1.showFeatureTipsOnStartUp)
		let updateResponse = await findOneAndUpdate(filter)
		let [usj2] = await findOne(filter)
		console.log(usj2.showFeatureTipsOnStartUp)
		await delay(300)
	}
	console.log(usersWithNoSettingsObj)
	client.close()
});


// console.log(users)
// let checkData = await ()=>{
// 	for(let user of loadUsers){
		
// 	}
// }