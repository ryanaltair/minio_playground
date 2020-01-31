var Minio = require('minio')
let path = require('path')
var minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: false,
    accessKey: 'MINIO_ACCESS',
    secretKey: 'MINIO_SECRET'
});


// Make a bucket called playground.
async function makeBucket(bucketName) {
    let ans = await new Promise((resolve, reject) => {
        minioClient.makeBucket(bucketName, function (err) {
            if (err) {
                reject(err)
                console.log(err)
                return
            }
            console.log('Bucket created successfully.')
            resolve()
        });
    })
    return ans

}

async function putObject(bucketName, filename) {
    let a = await new Promise((resolve, reject) => {
        let uploadName = path.basename(filename)
        var metaData = {
            'Content-Type': 'application/octet-stream',
            'X-Amz-Meta-Testing': 1234,
            'example': 5678
        }
        minioClient.fPutObject(bucketName, uploadName, filename, metaData, function (err, etag) {
            if (err) return console.log(err)
            console.log('File uploaded successfully.')
        });
    })
    return a
}
async function listObjects(bucketName, prefix = '', startAfter = '') {
    let ans = await new Promise((resolve, reject) => {
        let objectList = []
        var stream = minioClient.listObjectsV2(bucketName, prefix, true, startAfter)
        stream.on('data', function (obj) {
            objectList.push(obj)
        })
        stream.on('error', function (err) {
            // console.log(err)
            reject(err)
        })
        stream.on('end', function (err) {
            // console.log(objectList)
            resolve(objectList)
        })
    })
    return ans
}
async function main() {
    // makeBucket("playground4")
    let bucketName = "playground"
    let list = await listObjects(bucketName, '', 'hello/world/')
    console.log(list)
    putObject(bucketName,'test/test.scad')
}
main()