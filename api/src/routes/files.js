const {Buffer} = require('node:buffer');
const crypto = require('node:crypto');
const path = require('node:path');
const {getParameter} = require('../helpers.js');
const {s3UploadFile, s3DownloadFile} = require('../s3/s3-service.js');

const ALLOWED_EXTENSIONS = (process.env.UPLOAD_ALLOWED_EXTENSIONS || '.doc,.docx,.pdf,.zip,.jpg,.png')
	.split(',')
	.map(ext => ext.trim().toLowerCase())
	.filter(Boolean);

const remove = (request, response) => {
	// Do not allow users to delete file, just return an "ok".
	const id = getParameter(request);
	response.status(200).json({id});
};

const getById = async (request, response) => {
	const id = getParameter(request);
	const s3Response = await s3DownloadFile(id);

	response.setHeader('Content-Type', s3Response.headers['content-type'])
		.setHeader('Content-disposition', 'attachment;filename=' + request.query.originalName)
		.setHeader('Content-Length', s3Response.data.length)
		.send(Buffer.from(s3Response.data, 'binary'));
};

const create = async (request, response) => {
	const fileData = request.files.file.data;
	const fileOriginalName = request.files.file.name; // Original name — display only, never used as the S3 key
	const fileSize = request.files.file.size;
	const fileMimetype = request.files.file.mimetype;

	const extension = path.extname(fileOriginalName).toLowerCase();
	if (!ALLOWED_EXTENSIONS.includes(extension)) {
		return response.status(400).send(`File type '${extension || '(none)'}' is not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}.`);
	}

	// S3 key is always server-generated: a client can influence the readable
	// prefix, but never the guid that guarantees uniqueness, so no request
	// can be crafted to overwrite an existing object.
	const safeBaseName = path
		.basename(fileOriginalName, extension)
		.replace(/[^a-zA-Z0-9._-]/g, '_')
		.slice(0, 100);
	const fileS3Name = `${safeBaseName}-${crypto.randomUUID()}${extension}`;

	try {
		await s3UploadFile(fileS3Name, fileData, fileSize, fileMimetype);
	} catch {
		return response.status(500).send('Error while uploading file.');
	}

	response.status(201).json({
		status: 'Ok',
		url: `https://${request.headers.host}/api/v1/files/${fileS3Name}?originalName=${fileOriginalName}`,
	});
};

// Formio probes GET /api/v1/files?baseUrl=...&project=...&form=... on form load
const getAll = (_request, response) => response.status(200).json([]);

module.exports = {
	getAll,
	create,
	getById,
	getById_auth: true,
	remove,
	remove_auth: true,
};
