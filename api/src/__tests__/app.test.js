// Mock Keycloak before app.js loads — prevents real Keycloak instantiation
jest.mock('../keycloak-config.js', () => ({
	middleware: () => (req, res, next) => next(),
	protect: () => (req, res, next) => next(),
}));

jest.mock('../model', () => ({
	models: {
		note: {
			findAll: jest.fn().mockResolvedValue([]),
			findByPk: jest.fn().mockResolvedValue(null),
			create: jest.fn().mockResolvedValue({}),
			update: jest.fn().mockResolvedValue([1]),
			destroy: jest.fn().mockResolvedValue(1),
		},
		attachment: {
			findAll: jest.fn().mockResolvedValue([]),
			findByPk: jest.fn().mockResolvedValue(null),
			create: jest.fn().mockResolvedValue({}),
			update: jest.fn().mockResolvedValue([1]),
			destroy: jest.fn().mockResolvedValue(1),
		},
		servedDocument: {
			findByPk: jest.fn().mockResolvedValue(null),
			findOne: jest.fn().mockResolvedValue(null),
			create: jest.fn().mockResolvedValue({dataValues: {}}),
			destroy: jest.fn().mockResolvedValue(1),
		},
	},
}));

jest.mock('../services/served-document.service.js', () => ({
	resolvePostalCode: jest.fn(body => body),
	updateServedDocumentByApplicationId: jest.fn().mockResolvedValue(null),
}));

const request = require('supertest');
const app = require('../app.js');
const {models} = require('../model');

beforeEach(() => jest.clearAllMocks());

// ─── Root ─────────────────────────────────────────────────────────────────────

describe('GET /', () => {
	test('returns 200 with running message', async () => {
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
		expect(res.text).toContain('API is running');
	});
});

// ─── Healthcheck ──────────────────────────────────────────────────────────────

describe('GET /api/v1/healthcheck', () => {
	test('returns 200 with uptime and message', async () => {
		const res = await request(app).get('/api/v1/healthcheck');
		expect(res.status).toBe(200);
		expect(res.body).toMatchObject({
			message: 'OK',
			uptime: expect.any(Number),
			timestamp: expect.any(Number),
		});
	});
});

// ─── Notes routes ─────────────────────────────────────────────────────────────

describe('notes routes', () => {
	test('GET /api/v1/notes returns 200 with array', async () => {
		const notes = [{id: 'n1', body: 'first'}];
		models.note.findAll.mockResolvedValueOnce(notes);

		const res = await request(app).get('/api/v1/notes');
		expect(res.status).toBe(200);
		expect(res.body).toEqual(notes);
	});

	test('GET /api/v1/notes?servedDocumentId=42 passes filter to handler', async () => {
		await request(app).get('/api/v1/notes?servedDocumentId=42');
		expect(models.note.findAll).toHaveBeenCalledWith({where: {servedDocumentId: '42'}});
	});

	test('GET /api/v1/notes/:id returns 404 when not found', async () => {
		const res = await request(app).get('/api/v1/notes/note-1');
		expect(res.status).toBe(404);
	});

	test('GET /api/v1/notes/:id returns 200 when found', async () => {
		const note = {id: 'note-1', body: 'test'};
		models.note.findByPk.mockResolvedValueOnce(note);

		const res = await request(app).get('/api/v1/notes/note-1');
		expect(res.status).toBe(200);
		expect(res.body).toEqual(note);
	});

	test('POST /api/v1/notes without id returns 400', async () => {
		const res = await request(app)
			.post('/api/v1/notes')
			.send({body: 'note text'});
		expect(res.status).toBe(400);
	});

	test('POST /api/v1/notes with id returns 201', async () => {
		const res = await request(app)
			.post('/api/v1/notes')
			.send({id: 'note-1', body: 'note text'});
		expect(res.status).toBe(201);
	});

	test('DELETE /api/v1/notes/:id returns 200', async () => {
		const res = await request(app).delete('/api/v1/notes/note-1');
		expect(res.status).toBe(200);
	});
});

// ─── Attachments routes ───────────────────────────────────────────────────────

describe('attachments routes', () => {
	test('GET /api/v1/attachments returns 200', async () => {
		const res = await request(app).get('/api/v1/attachments');
		expect(res.status).toBe(200);
	});

	test('POST /api/v1/attachments with id returns 400', async () => {
		const res = await request(app)
			.post('/api/v1/attachments')
			.send({id: 1, url: 'https://s3/file.pdf'});
		expect(res.status).toBe(400);
	});

	test('POST /api/v1/attachments without id returns 201', async () => {
		const res = await request(app)
			.post('/api/v1/attachments')
			.send({url: 'https://s3/file.pdf'});
		expect(res.status).toBe(201);
	});
});

// ─── Served documents routes ──────────────────────────────────────────────────

describe('servedDocuments routes', () => {
	test('GET /api/v1/servedDocuments without applicationId returns 400', async () => {
		const res = await request(app).get('/api/v1/servedDocuments');
		expect(res.status).toBe(400);
	});

	test('GET /api/v1/servedDocuments?applicationId=42 returns 404 when not found', async () => {
		const res = await request(app).get('/api/v1/servedDocuments?applicationId=42');
		expect(res.status).toBe(404);
	});

	test('GET /api/v1/servedDocuments/:id returns 404 when not found', async () => {
		const res = await request(app).get('/api/v1/servedDocuments/1');
		expect(res.status).toBe(404);
	});

	test('POST /api/v1/servedDocuments with id returns 400', async () => {
		const res = await request(app)
			.post('/api/v1/servedDocuments')
			.send({id: 1, firstName: 'Alice'});
		expect(res.status).toBe(400);
	});
});

// ─── Error propagation ────────────────────────────────────────────────────────

describe('error propagation', () => {
	test('unhandled DB error in notes handler returns 500', async () => {
		models.note.findAll.mockRejectedValueOnce(new Error('DB connection lost'));

		const res = await request(app).get('/api/v1/notes');
		expect(res.status).toBe(500);
	});

	test('unhandled DB error in servedDocuments getById bubbles through async wrapper', async () => {
		models.servedDocument.findByPk.mockRejectedValueOnce(new Error('DB error'));

		const res = await request(app).get('/api/v1/servedDocuments/1');
		expect(res.status).toBe(500);
	});
});

// ─── CORS ─────────────────────────────────────────────────────────────────────

describe('CORS', () => {
	test('blocks request from an origin not in the allowlist', async () => {
		const res = await request(app)
			.get('/')
			.set('Origin', 'https://evil.example.com');
		expect(res.status).toBe(500);
	});

	test('allows request with no origin header', async () => {
		const res = await request(app).get('/');
		expect(res.status).toBe(200);
	});

	test('allows any origin when CORS_ORIGIN is *', async () => {
		process.env.CORS_ORIGIN = '*';
		jest.resetModules();
		const wildcardApp = require('../app.js');

		const res = await request(wildcardApp)
			.get('/')
			.set('Origin', 'https://any-site.example.com');
		expect(res.status).toBe(200);

		delete process.env.CORS_ORIGIN;
		jest.resetModules();
	});
});
