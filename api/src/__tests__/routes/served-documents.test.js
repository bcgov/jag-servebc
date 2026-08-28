jest.mock('../../model', () => ({
	models: {
		servedDocument: {
			findByPk: jest.fn(),
			findOne: jest.fn(),
			create: jest.fn(),
			destroy: jest.fn(),
		},
		attachment: {},
		note: {},
	},
}));

jest.mock('../../services/served-document.service.js', () => ({
	resolvePostalCode: jest.fn(body => body),
	nullifyEmptyDates: jest.fn(body => body),
	updateServedDocumentByApplicationId: jest.fn(),
}));

const {getById, getByQuery, create, updateByApplicationId, remove} = require('../../routes/served-documents.js');
const {models} = require('../../model');
const {resolvePostalCode, nullifyEmptyDates, updateServedDocumentByApplicationId} = require('../../services/served-document.service.js');
const {ValidationError, ValidationErrorItem, UniqueConstraintError} = require('sequelize');

function mockRes() {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	res.end = jest.fn().mockReturnValue(res);
	return res;
}

beforeEach(() => jest.clearAllMocks());

// ─── getById ──────────────────────────────────────────────────────────────────

describe('getById', () => {
	test('returns served document with 200 when found', async () => {
		const doc = {id: 1, firstName: 'Alice'};
		models.servedDocument.findByPk.mockResolvedValue(doc);

		const res = mockRes();
		await getById({params: {id: '1'}}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(doc);
	});

	test('returns 404 when document does not exist', async () => {
		models.servedDocument.findByPk.mockResolvedValue(null);

		const res = mockRes();
		await getById({params: {id: '99'}}, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});
});

// ─── getByQuery ───────────────────────────────────────────────────────────────

describe('getByQuery', () => {
	test('returns 400 when applicationId is missing', async () => {
		const res = mockRes();
		await getByQuery({query: {}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.servedDocument.findOne).not.toHaveBeenCalled();
	});

	test('returns document with 200 when found by applicationId', async () => {
		const doc = {id: 1, applicationId: 42};
		models.servedDocument.findOne.mockResolvedValue(doc);

		const res = mockRes();
		await getByQuery({query: {applicationId: '42'}}, res);

		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(doc);
	});

	test('returns 404 when no document matches applicationId', async () => {
		models.servedDocument.findOne.mockResolvedValue(null);

		const res = mockRes();
		await getByQuery({query: {applicationId: '99'}}, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});
});

// ─── create ───────────────────────────────────────────────────────────────────

describe('create', () => {
	test('returns 400 when id is provided', async () => {
		const res = mockRes();
		await create({body: {id: 1, firstName: 'Alice'}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(models.servedDocument.create).not.toHaveBeenCalled();
	});

	test('resolves postal code and creates document, returns 201', async () => {
		const persisted = {dataValues: {id: 1, firstName: 'Alice'}};
		models.servedDocument.create.mockResolvedValue(persisted);

		const body = {firstName: 'Alice', country: 'CANADA'};
		const res = mockRes();
		await create({body}, res);

		expect(resolvePostalCode).toHaveBeenCalledWith(body);
		expect(nullifyEmptyDates).toHaveBeenCalledWith(body);
		expect(res.status).toHaveBeenCalledWith(201);
		expect(res.json).toHaveBeenCalledWith(persisted.dataValues);
	});

	test('returns 422 on Sequelize validation error', async () => {
		const error = new ValidationError('Validation error', [
			new ValidationErrorItem('must be an email', 'Validation error', 'contactEmail'),
		]);
		models.servedDocument.create.mockRejectedValue(error);

		const res = mockRes();
		await create({body: {firstName: 'Alice'}}, res);

		expect(res.status).toHaveBeenCalledWith(422);
	});

	test('returns 400 on other database error', async () => {
		models.servedDocument.create.mockRejectedValue(new Error('constraint violation'));

		const res = mockRes();
		await create({body: {firstName: 'Alice'}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
	});

	test('returns 409 when custom isUnique validator rejects duplicate applicationId', async () => {
		const error = new ValidationError('Validation error', [
			new ValidationErrorItem('ApplicationId already in use!', 'Validation error', 'applicationId', 42, null, 'isUnique'),
		]);
		models.servedDocument.create.mockRejectedValue(error);

		const res = mockRes();
		await create({body: {applicationId: 42}}, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.send).toHaveBeenCalledWith({message: 'ApplicationId already in use!'});
	});

	test('returns 409 on Sequelize UniqueConstraintError', async () => {
		const error = new UniqueConstraintError({
			message: 'Validation error',
			errors: [
				new ValidationErrorItem('applicationId must be unique', 'unique violation', 'applicationId', 42),
			],
		});
		models.servedDocument.create.mockRejectedValue(error);

		const res = mockRes();
		await create({body: {applicationId: 42}}, res);

		expect(res.status).toHaveBeenCalledWith(409);
		expect(res.send).toHaveBeenCalledWith({message: 'ApplicationId already in use!'});
	});
});

// ─── updateByApplicationId ────────────────────────────────────────────────────

describe('updateByApplicationId', () => {
	test('returns 400 when applicationId is missing', async () => {
		const res = mockRes();
		await updateByApplicationId({query: {}, body: {}}, res);

		expect(res.status).toHaveBeenCalledWith(400);
		expect(updateServedDocumentByApplicationId).not.toHaveBeenCalled();
	});

	test('returns 404 when service returns null', async () => {
		updateServedDocumentByApplicationId.mockResolvedValue(null);

		const res = mockRes();
		await updateByApplicationId({query: {applicationId: '42'}, body: {}}, res);

		expect(res.status).toHaveBeenCalledWith(404);
	});

	test('returns updated document with 200 on success', async () => {
		const updated = {id: 1, applicationId: 42, firstName: 'Alice'};
		updateServedDocumentByApplicationId.mockResolvedValue(updated);

		const res = mockRes();
		await updateByApplicationId({query: {applicationId: '42'}, body: {firstName: 'Alice'}}, res);

		expect(updateServedDocumentByApplicationId).toHaveBeenCalledWith('42', {firstName: 'Alice'});
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith(updated);
	});

	test('returns 500 on internal service error', async () => {
		updateServedDocumentByApplicationId.mockRejectedValue(new Error('Internal error'));

		const res = mockRes();
		await updateByApplicationId({query: {applicationId: '42'}, body: {}}, res);

		expect(res.status).toHaveBeenCalledWith(500);
	});
});

// ─── remove ───────────────────────────────────────────────────────────────────

describe('remove', () => {
	test('destroys document and returns 200', async () => {
		models.servedDocument.destroy.mockResolvedValue(1);

		const res = mockRes();
		await remove({params: {id: '1'}}, res);

		expect(models.servedDocument.destroy).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
	});
});
