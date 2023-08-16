const AWS = require('aws-sdk');
const s3 = new AWS.S3({ region: 'us-east-1'});
const BUCKET =  'aws-shake-shack-import';
const {S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const csv = require('@fast-csv/parse');
const fs = require('fs');

module.exports.importProductsFile = async (event) => {
    const fileName = event.queryStringParameters.name;
    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${fileName}`,
        Expires: 30 * 60    ,
        ContentType: 'text/csv'
    }

    const URL = await s3.getSignedUrl('putObject', params)
    return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        },
        body: JSON.stringify(URL),
      };
}
module.exports.importFileParser = async (event) => { 
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    let results = [];
    const csvFile = s3.getObject(params).createReadStream();
    let parserFcn = new Promise((resolve, reject) => {
        const parser = csv
        .parseStream(csvFile, { headers: true })
        .on("data", function (data) {
            results.push(data);
        })
        .on("end", function () {
            resolve("csv parse process finished");
        })
        .on("error", function () {
            reject("csv parse process failed");
        });
    });

    try {
        await parserFcn;
        return results;
      } catch (err) {
        console.log(err);
        const message = `Error on ${key} from bucket ${bucket}. ${err}:`;
        console.log(message);
        throw new Error(message);
      }
}