const process = require('node:process');
const aws4 = require('aws4');
const axios = require('axios');
const logger = require('../logger.js');
require('dotenv').config();

const BUCKETNAME = process.env.S3_BUCKETNAME;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const HOST = process.env.S3_HOST;
// Defaults to true so the real S3-compatible endpoint (HTTPS-only) keeps working
// unchanged; set S3_USE_SSL=false for a plain-HTTP local endpoint like MinIO.
const PROTOCOL = process.env.S3_USE_SSL === 'false' ? 'http' : 'https';

function signRequest(method, s3FileName, headersToSign = {}, body) {
	const options = {
		host: HOST,
		path: `/${BUCKETNAME}/${s3FileName}`,
		method, // <<<---- VERY IMPORTANT TO BE IN CAPITALS!!!
		service: 's3', // Avoid relying on aws4's *.amazonaws.com hostname inference.
		headers: headersToSign, // Any header set here ends up in SignedHeaders too.
		body, // Lets aws4 hash the real payload for X-Amz-Content-Sha256.
	};
	aws4.sign(options, {accessKeyId: ACCESS_KEY_ID, secretAccessKey: SECRET_ACCESS_KEY});
	return options;
}

const s3UploadFile = async (fileS3Name, fileData, fileSize, fileMimetype) => {
	// Content-Length/Content-Type must be part of the signature (not just sent
	// alongside it) — some S3-compatible servers (MinIO) reject any header
	// present on the request that wasn't included in SignedHeaders.
	const s3Signature = signRequest('PUT', fileS3Name, {
		'Content-Length': fileSize,
		'Content-Type': fileMimetype,
	}, fileData);
	const headers = {
		'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
		'X-Amz-Content-Sha256': s3Signature.headers['X-Amz-Content-Sha256'],
		Authorization: s3Signature.headers.Authorization,
		'Content-Length': fileSize,
		'Content-Type': fileMimetype,
	};

	try {
		const resp = await axios({
			method: 'put',
			url: `${PROTOCOL}://${HOST}/${BUCKETNAME}/${fileS3Name}`,
			headers,
			data: fileData,
		});
		logger.info('[api.s3]', resp.status, ' S3 upload completed');
		return resp;
	} catch (error) {
		// error.response is undefined on network errors/timeouts
		const status = error.response?.status ?? 'no-response';
		const data = error.response?.data ?? error.message;
		logger.error('[api.s3] S3 upload encountered error -', status, '-', data);
		throw error;
	}
};

const s3DownloadFile = async fileS3Name => {
	const s3Signature = signRequest('GET', fileS3Name);

	const headers = {
		'X-Amz-Date': s3Signature.headers['X-Amz-Date'],
		'X-Amz-Content-Sha256': s3Signature.headers['X-Amz-Content-Sha256'],
		Authorization: s3Signature.headers.Authorization,
		Accept: 'application/octet-stream',
	};

	try {
		const resp = await axios({
			method: 'get',
			url: `${PROTOCOL}://${HOST}/${BUCKETNAME}/${fileS3Name}`,
			headers,
			responseType: 'arraybuffer',
		});
		logger.info('[api.s3]', resp.status, ' S3 download completed');
		return resp;
	} catch (error) {
		const status = error.response?.status ?? 'no-response';
		const data = error.response?.data ?? error.message;
		logger.error('[api.s3] S3 download encountered error -', status, '-', data);
		throw error;
	}
};

module.exports = {
	s3UploadFile,
	s3DownloadFile,
};
