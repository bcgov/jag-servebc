jest.mock('../../model', () => ({
	models: {
		attachment: {
			findAll: jest.fn(),
			findByPk: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			destroy: jest.fn(),
		},
	},
}));

const {getAll, getById, create, update, remove} = require('../../routes/attachments.js');
const {models} = require('../../model');

function mockRes() {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	res.end = jest.fn().mockReturnValue(res);
	return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── getAll ───────────────────────────────────────────────────────────────────

describe('getAll', () => {
	test('returns all attachments with 200', async () => {
		const attachments = [{id: 1, url: 'https://s3/file.pdf'}];
		models.attachment.findAll.mockResolvedValue(attachments);

		const res = mockRes();
		await getAll({}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(attachments);
	});

	test('returns 500 on database error', async () => {
		models.attachment.findAll.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await getAll({}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── getById ──────────────────────────────────────────────────────────────────

describe('getById', () => {
	test('returns attachment with 200 when found', async () => {
		const attachment = {id: 1, url: 'https://s3/file.pdf'};
		models.attachment.findByPk.mockResolvedValue(attachment);

		const res = mockRes();
		await getById({params: {id: '1'}}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(attachment);
	});

	test('returns 404 when attachment does not exist', async () => {
		models.attachment.findByPk.mockResolvedValue(null);

		const res = mockRes();
		await getById({params: {id: '999'}}, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	test('returns 500 on database error', async () => {
		models.attachment.findByPk.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await getById({params: {id: '1'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── create ───────────────────────────────────────────────────────────────────

describe('create', () => {
	test('returns 400 when id is provided', async () => {
		const res = mockRes();
		await create({body: {id: 1, url: 'https://s3/file.pdf'}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.attachment.create).not.toHaveBeenCalled();
	});

	test('creates attachment and returns 201', async () => {
		models.attachment.create.mockResolvedValue({});

		const res = mockRes();
		await create({body: {url: 'https://s3/file.pdf'}}, res);

		expect(models.attachment.create).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test('returns 500 on database error', async () => {
		models.attachment.create.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await create({body: {url: 'https://s3/file.pdf'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── update ───────────────────────────────────────────────────────────────────

describe('update', () => {
	test('returns 400 when param id and body id do not match', async () => {
		const res = mockRes();
		await update({params: {id: '1'}, body: {id: 2}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.attachment.update).not.toHaveBeenCalled();
	});

	test('updates attachment and returns 200 when ids match', async () => {
		models.attachment.update.mockResolvedValue([1]);

		const res = mockRes();
		await update({params: {id: '1'}, body: {id: 1, url: 'https://s3/updated.pdf'}}, res);

		expect(models.attachment.update).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('returns 500 on database error', async () => {
		models.attachment.update.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await update({params: {id: '1'}, body: {id: 1}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── remove ───────────────────────────────────────────────────────────────────

describe('remove', () => {
	test('destroys attachment and returns 200', async () => {
		models.attachment.destroy.mockResolvedValue(1);

		const res = mockRes();
		await remove({params: {id: '1'}}, res);

		expect(models.attachment.destroy).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('returns 500 on database error', async () => {
		models.attachment.destroy.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await remove({params: {id: '1'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
