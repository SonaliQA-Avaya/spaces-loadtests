const {Storage} = require("@google-cloud/storage");
const path = require("path")
const config = require("../../config");
const bucketName = config.storage.BUCKET_NAME;

let = storage = new Storage({
    projectId: config.storage.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: config.storage.GOOGLE_CLOUD_KEY_PATH
})

const copyFileToGCS = (localFilePath, options) => {
    return new Promise((resolve)=>{
        options = options || {};

        const bucket = storage.bucket(bucketName);
        const fileName = path.basename(localFilePath);
        const file = bucket.file(fileName);
    
        return bucket.upload(localFilePath, options)
            .then(resolve)
    })
};

module.exports = {
    copyFileToGCS
}