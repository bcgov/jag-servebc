jest.mock('../../model', () => ({
	models: {
		note: {
			findAll: jest.fn(),
			findByPk: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			destroy: jest.fn(),
		},
	},
}));

const {getAll, getById, create, update, remove} = require('../../routes/notes.js');
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
	test('returns all notes with 200 when no query params', async () => {
		const notes = [{id: 'n1', body: 'first'}];
		models.note.findAll.mockResolvedValue(notes);

		const res = mockRes();
		await getAll({query: {}}, res);

		expect(models.note.findAll).toHaveBeenCalledWith({where: {}});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(notes);
	});

	test('filters by servedDocumentId when provided', async () => {
		models.note.findAll.mockResolvedValue([]);

		await getAll({query: {servedDocumentId: '42'}}, mockRes());

		expect(models.note.findAll).toHaveBeenCalledWith({where: {servedDocumentId: '42'}});
	});

	test('returns 500 on database error', async () => {
		models.note.findAll.mockRejectedValue(new Error('connection lost'));

		const res = mockRes();
		await getAll({query: {}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({message: 'connection lost'});
	});
});

// ─── getById ──────────────────────────────────────────────────────────────────

describe('getById', () => {
	test('returns the note with 200 when found', async () => {
		const note = {id: 'n1', body: 'test'};
		models.note.findByPk.mockResolvedValue(note);

		const res = mockRes();
		await getById({params: {id: 'n1'}}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(note);
	});

	test('returns 404 when note does not exist', async () => {
		models.note.findByPk.mockResolvedValue(null);

		const res = mockRes();
		await getById({params: {id: 'n1'}}, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	test('returns 500 on database error', async () => {
		models.note.findByPk.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await getById({params: {id: 'n1'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── create ───────────────────────────────────────────────────────────────────

describe('create', () => {
	test('returns 400 when id is not provided', async () => {
		const res = mockRes();
		await create({body: {body: 'note text'}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.note.create).not.toHaveBeenCalled();
	});

	test('creates note and returns 201 when id is provided', async () => {
		models.note.create.mockResolvedValue({});

		const res = mockRes();
		await create({body: {id: 'note-1', body: 'note text'}}, res);

		expect(models.note.create).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(201);
	});

	test('returns 500 on database error', async () => {
		models.note.create.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await create({body: {id: 'note-1', body: 'note text'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── update ───────────────────────────────────────────────────────────────────

describe('update', () => {
	test('returns 400 when param id and body id do not match', async () => {
		const res = mockRes();
		await update({params: {id: 'note-1'}, body: {id: 'note-2', body: 'text'}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.note.update).not.toHaveBeenCalled();
	});

	test('updates note and returns 200 when ids match', async () => {
		models.note.update.mockResolvedValue([1]);

		const res = mockRes();
		await update({params: {id: 'note-1'}, body: {id: 'note-1', body: 'updated'}}, res);

		expect(models.note.update).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('returns 500 on database error', async () => {
		models.note.update.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await update({params: {id: 'note-1'}, body: {id: 'note-1', body: 'updated'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── remove ───────────────────────────────────────────────────────────────────

describe('remove', () => {
	test('destroys note and returns 200', async () => {
		models.note.destroy.mockResolvedValue(1);

		const res = mockRes();
		await remove({params: {id: 'note-1'}}, res);

		expect(models.note.destroy).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});

	test('returns 500 on database error', async () => {
		models.note.destroy.mockRejectedValue(new Error('DB error'));

		const res = mockRes();
		await remove({params: {id: 'note-1'}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});
