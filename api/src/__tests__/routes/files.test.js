jest.mock('../../s3/s3-service.js', () => ({
	s3UploadFile: jest.fn(),
	s3DownloadFile: jest.fn(),
}));

const {uploadFile, getFile, removeFile} = require('../../routes/files.js');
const {s3UploadFile, s3DownloadFile} = require('../../s3/s3-service.js');

function mockRes() {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	res.setHeader = jest.fn().mockReturnValue(res);
	return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── removeFile ───────────────────────────────────────────────────────────────

describe('removeFile', () => {
	test('returns 200 with fileId without calling S3', () => {
		const res = mockRes();
		removeFile({params: {fileId: 'doc-abc.pdf'}}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({fileId: 'doc-abc.pdf'});
		expect(s3UploadFile).not.toHaveBeenCalled();
		expect(s3DownloadFile).not.toHaveBeenCalled();
	});
});

// ─── uploadFile ───────────────────────────────────────────────────────────────

describe('uploadFile', () => {
	const baseRequest = {
		files: {
			file: {
				data: Buffer.from('pdf-bytes'),
				name: 'original.pdf',
				size: 9,
				mimetype: 'application/pdf',
			},
		},
		body: {name: 'stored-name.pdf'},
		headers: {host: 'api.example.com'},
	};

	test('uploads file to S3 and returns 201 with url', async () => {
		s3UploadFile.mockResolvedValue({status: 200});

		const res = mockRes();
		await uploadFile(baseRequest, res);

		expect(s3UploadFile).toHaveBeenCalledWith('stored-name.pdf', expect.anything(), 9, 'application/pdf');
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
			status: 'Ok',
			url: expect.stringContaining('stored-name.pdf'),
		}));
	});

	test('returns 500 when S3 upload fails', async () => {
		s3UploadFile.mockRejectedValue(new Error('S3 unreachable'));

		const res = mockRes();
		await uploadFile(baseRequest, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── getFile ──────────────────────────────────────────────────────────────────

describe('getFile', () => {
	test('downloads from S3 and streams the file to the response', async () => {
		const s3Response = {
			headers: {'content-type': 'application/pdf'},
			data: Buffer.from('pdf-content'),
		};
		s3DownloadFile.mockResolvedValue(s3Response);

		const res = mockRes();
		await getFile({params: {fileId: 'doc-abc.pdf'}, query: {originalName: 'my-doc.pdf'}}, res);

		expect(s3DownloadFile).toHaveBeenCalledWith('doc-abc.pdf');
		expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/pdf');
		expect(res.setHeader).toHaveBeenCalledWith('Content-disposition', 'attachment;filename=my-doc.pdf');
		expect(res.send).toHaveBeenCalled();
	});
});
