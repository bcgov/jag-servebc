//import fs from 'fs'
//import AWS from 'aws-sdk'
var AWS = require('aws-sdk');
var fs = require('fs');


var ep = new AWS.Endpoint({
   host: 'ag-pssg-sharedservices.objectstore.gov.bc.ca',
   port: 443,
   protocol: 'https'

});

const s3 = new AWS.S3({
    //accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    accessKeyId: 'AKIA2CD6BD9A0C8EC26C',
    secretAccessKey: 'b/i6oHBTOy5OYui+85vvSo9J4jVJuMlor6rargAG',
    AWS_S3_ENDPOINT:'https://ag-pssg-sharedservices.objectstore.gov.bc.ca',
    endpoint: ep
     
  })

   s3.listBuckets( (err, data) => {
    if (err) {
      console.log(err)
    }
    //resolve(data.Location)
    console.log(err)
  })

/* 
const filename = 'portal-main-page.pdf'
const fileContent = fs.readFileSync(filename)

const params = {
  // Bucket: process.env.AWS_BUCKET_NAME,
  Bucket: 'ag-pssg-jsb-srvdoc-dev-bkt',
  Key: `${filename}.pdf`,
  Body: fileContent
}

s3.upload(params, (err, data) => {
  if (err) {
    console.log(err)
  }
  //resolve(data.Location)
  console.log(err)
}) */