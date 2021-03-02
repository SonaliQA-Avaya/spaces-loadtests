const MongoClient = require('mongodb').MongoClient;
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */
let fs = require("fs")
let path = require("path")
let users = fs.readFileSync(path.join(__dirname,"./data/staging_users.csv")).toString().split("\n").map(x=>x.split(","))
const delay = (ms)=>{
	return new Promise((resolve)=>{
		setTimeout(resolve,ms)
	})
}
// let users = [['user256@ericloadtest.com']] 
const connectionString = ""
MongoClient.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  async (connectErr, client) => {
	let findOne = (filter)=>{
		return new Promise(resolve=>{
			console.log(filter)
			const coll = client.db('logan-staging').collection('usersettings');
			coll.find(filter, async (cmdErr, result) => {
				resolve(await result.toArray())
			});
		})
	}
	let findOneAndUpdate = (filter,update) => {
		return new Promise(resolve=>{
			const coll = client.db('logan-staging').collection('usersettings');
			coll.findOneAndUpdate(filter,{
				$set : {
					showFeatureTipsOnStartUp : false
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
	for(let index = 0; index < users.length; index++){
		if(index > 1000) break
		let user = users[index]
		let filter = { 'username' : user[0]}
		let [usj1] = await findOne(filter)
		console.log(usj1.showFeatureTipsOnStartUp)
		let updateResponse = await findOneAndUpdate(filter)
		let [usj2] = await findOne(filter)
		console.log(usj2.showFeatureTipsOnStartUp)
		await delay(300)
	}
	client.close()
});


// console.log(users)
// let checkData = await ()=>{
// 	for(let user of loadUsers){
		
// 	}
// }