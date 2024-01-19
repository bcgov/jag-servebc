const aws4  = require('aws4');
const axios = require('axios');
const logger = require("../logger");
require('dotenv').config();

const BUCKETNAME = process.env.S3_BUCKETNAME;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const HOST = process.env.S3_HOST;

function signRequest(method, s3FileName) {
    let opts = { 
        host: HOST, 
        path: `/${BUCKETNAME}/${s3FileName}`,
        method // <<<---- VERY IMPORTANT TO BE IN CAPITALS!!!
    };
    aws4.sign(opts, { accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY });
    return opts;
}

const s3UploadFile = async (fileS3Name, 
                            fileData, 
                            fileSize, 
                            fileMimetype) => {
    const s3Signature = signRequest('PUT', fileS3Name);

    const headers = {
        'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
        'Authorization': s3Signature.headers.Authorization,
        'Content-Length': fileSize,
        'Content-Type': fileMimetype,
    }

    try {
        const resp = await axios({
            method: 'put',
            url: `https://${HOST}/${BUCKETNAME}/${fileS3Name}`,
            headers,
            data: fileData
        });
        logger.info('[api.s3]', resp.status,' s3 upload completed');
        return resp;
    } catch (error) {
        logger.error('[api.s3] S3 upload encountered error - ',error.response.status,'-',error.response.data);
        throw error;
    }
}

const s3DownloadFile = async (fileS3Name) => {
    const s3Signature = signRequest('GET', fileS3Name);
    
    const headers = {
        'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
        'Authorization': s3Signature.headers.Authorization,
        'Accept': 'application/octet-stream'
    }

    try {
        const resp = await axios({
            method: 'get',
            url: `https://${HOST}/${BUCKETNAME}/${fileS3Name}`,
            headers,
            responseType: 'arraybuffer'
        });
        logger.error('[api.s3] S3 download encountered error - ',error.response.status,'-',error.response.data);
        return resp;
    } catch (error) {
        logger.error('[api.s3]' , error.response.data);
        throw error;
    }
}
module.exports = {
    s3UploadFile,
    s3DownloadFile
}