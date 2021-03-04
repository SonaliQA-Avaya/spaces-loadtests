const keyPath = process.env.storageKeyPath
module.exports = {
    "controlServer" : {
        "socketConfig" : {
            "url" : `http://${process.env.controlServerIP}`,
            "options" : {
                "transports" : ["websocket"],
                "port" : 443,
                "rejectUnauthorized" : false,
                "query" : `browserId=${process.env.browserId}`
            }
        }
    },
    storage : {
        GOOGLE_CLOUD_PROJECT_ID : "spaces-dev-practice1",
        GOOGLE_CLOUD_KEY_PATH : keyPath,
        BUCKET_NAME : 'rajiv-testing-selenium-screenshots'
    }
}