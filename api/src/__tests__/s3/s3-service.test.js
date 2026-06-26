jest.mock('aws4');
jest.mock('axios');

process.env.S3_BUCKETNAME = 'test-bucket';
process.env.S3_HOST = 's3.example.com';
process.env.S3_ACCESS_KEY_ID = 'test-key-id';
process.env.S3_SECRET_ACCESS_KEY = 'test-secret';

const aws4 = require('aws4');
const axios = require('axios');
const {s3UploadFile, s3DownloadFile} = require('../../s3/s3-service.js');

beforeEach(() => {
	jest.clearAllMocks();
	aws4.sign.mockImplementation(options => {
		options.headers = {
			'X-Amz-Date': '20240101T000000Z',
			Authorization: 'mock-auth-header',
		};
	});
});

// ─── s3UploadFile ─────────────────────────────────────────────────────────────

describe('s3UploadFile', () => {
	test('calls axios PUT with signed headers and returns the response', async () => {
		const mockResponse = {status: 200};
		axios.mockResolvedValue(mockResponse);

		const result = await s3UploadFile('doc.pdf', Buffer.from('data'), 4, 'application/pdf');

		expect(axios).toHaveBeenCalledWith(expect.objectContaining({
			method: 'put',
			url: 'https://s3.example.com/test-bucket/doc.pdf',
			headers: expect.objectContaining({
				'X-Amz-Date': '20240101T000000Z',
				Authorization: 'mock-auth-header',
				'Content-Length': 4,
				'Content-Type': 'application/pdf',
			}),
		}));
		expect(result).toBe(mockResponse);
	});

	test('throws and propagates the error on S3 failure', async () => {
		const error = {response: {status: 403, data: 'Forbidden'}};
		axios.mockRejectedValue(error);

		await expect(s3UploadFile('doc.pdf', Buffer.from(''), 0, 'application/pdf')).rejects.toBe(error);
	});
});

// ─── s3DownloadFile ───────────────────────────────────────────────────────────

describe('s3DownloadFile', () => {
	test('calls axios GET with arraybuffer response type and returns the response', async () => {
		const mockResponse = {
			status: 200,
			headers: {'content-type': 'application/pdf'},
			data: Buffer.from('pdf-bytes'),
		};
		axios.mockResolvedValue(mockResponse);

		const result = await s3DownloadFile('doc.pdf');

		expect(axios).toHaveBeenCalledWith(expect.objectContaining({
			method: 'get',
			url: 'https://s3.example.com/test-bucket/doc.pdf',
			responseType: 'arraybuffer',
		}));
		expect(result).toBe(mockResponse);
	});

	test('throws and propagates the error on S3 failure', async () => {
		const error = {response: {status: 404, data: 'Not Found'}};
		axios.mockRejectedValue(error);

		await expect(s3DownloadFile('missing.pdf')).rejects.toBe(error);
	});
});
