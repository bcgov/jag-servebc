jest.mock('../../model', () => ({
	models: {
		note: {
			destroy: jest.fn(),
			update: jest.fn(),
			create: jest.fn(),
		},
		servedDocument: {
			findOne: jest.fn(),
			update: jest.fn(),
		},
	},
	transaction: jest.fn(async cb => cb({})),
}));

const {resolvePostalCode, sanitizeEmptyDates, getUpdatableFields, syncNotes, updateServedDocumentByApplicationId} = require('../../services/served-document.service.js');
const sequelize = require('../../model');
const {models} = sequelize;

beforeEach(() => jest.clearAllMocks());

// ─── resolvePostalCode ────────────────────────────────────────────────────────

describe('resolvePostalCode', () => {
	test('returns body unchanged when country is CANADA', () => {
		const body = {country: 'CANADA', postalCode: 'V8V 1A1', altPostalCode: '90210'};
		expect(resolvePostalCode(body)).toEqual(body);
	});

	test('is case-insensitive for the Canada check', () => {
		const body = {country: 'canada', postalCode: 'V8V 1A1', altPostalCode: '90210'};
		expect(resolvePostalCode(body)).toEqual(body);
	});

	test('swaps postalCode with altPostalCode for non-Canada country', () => {
		const body = {country: 'USA', postalCode: 'V8V 1A1', altPostalCode: '90210'};
		expect(resolvePostalCode(body).postalCode).toBe('90210');
	});

	test('does not mutate the original body', () => {
		const body = {country: 'USA', postalCode: 'original', altPostalCode: 'swapped'};
		resolvePostalCode(body);
		expect(body.postalCode).toBe('original');
	});
});

// ─── sanitizeEmptyDates ───────────────────────────────────────────────────────

describe('sanitizeEmptyDates', () => {
	test('converts empty-string date fields to null', () => {
		const body = {nextAppearanceDate: '', servedDate: '', closedDate: ''};
		expect(sanitizeEmptyDates(body)).toEqual({nextAppearanceDate: null, servedDate: null, closedDate: null});
	});

	test('leaves populated date fields unchanged', () => {
		const body = {nextAppearanceDate: '2024-01-01', servedDate: null, closedDate: undefined};
		expect(sanitizeEmptyDates(body)).toEqual(body);
	});

	test('leaves non-date fields unchanged', () => {
		const body = {firstName: '', country: 'CANADA'};
		expect(sanitizeEmptyDates(body)).toEqual(body);
	});

	test('does not mutate the original body', () => {
		const body = {nextAppearanceDate: ''};
		sanitizeEmptyDates(body);
		expect(body.nextAppearanceDate).toBe('');
	});
});

// ─── getUpdatableFields ───────────────────────────────────────────────────────

describe('getUpdatableFields', () => {
	test('excludes id and applicationId', () => {
		const obj = {id: 1, applicationId: 2, firstName: 'Alice', lastName: 'Smith'};
		expect(getUpdatableFields(obj)).toEqual(['firstName', 'lastName']);
	});

	test('returns empty array when only excluded fields are present', () => {
		expect(getUpdatableFields({id: 1, applicationId: 2})).toEqual([]);
	});

	test('returns all fields when none are excluded', () => {
		const obj = {firstName: 'Alice', country: 'CANADA'};
		expect(getUpdatableFields(obj)).toEqual(['firstName', 'country']);
	});
});

// ─── syncNotes ────────────────────────────────────────────────────────────────

describe('syncNotes', () => {
	test('destroys notes whose id is not in the new list', async () => {
		models.note.destroy.mockResolvedValue(1);
		models.note.update.mockResolvedValue([1]);

		await syncNotes(5, [{id: 'keep-1', body: 'kept'}], {});

		expect(models.note.destroy).toHaveBeenCalledWith(
			expect.objectContaining({where: expect.objectContaining({servedDocumentId: 5})}),
		);
	});

	test('destroys all notes when new list is empty', async () => {
		models.note.destroy.mockResolvedValue(2);

		await syncNotes(5, [], {});

		expect(models.note.destroy).toHaveBeenCalledWith(
			expect.objectContaining({where: {servedDocumentId: 5}}),
		);
	});

	test('creates notes that have no id', async () => {
		models.note.destroy.mockResolvedValue(0);
		models.note.create.mockResolvedValue({});

		await syncNotes(5, [{body: 'brand new'}], {});

		expect(models.note.create).toHaveBeenCalledWith(
			expect.objectContaining({servedDocumentId: 5}),
			expect.anything(),
		);
	});

	test('updates notes that have an existing id', async () => {
		models.note.destroy.mockResolvedValue(0);
		models.note.update.mockResolvedValue([1]);

		await syncNotes(5, [{id: 'note-1', body: 'edited'}], {});

		expect(models.note.update).toHaveBeenCalledWith(
			expect.objectContaining({id: 'note-1', servedDocumentId: 5}),
			expect.objectContaining({where: {id: 'note-1'}}),
		);
	});

	test('handles mixed create and update in the same call', async () => {
		models.note.destroy.mockResolvedValue(0);
		models.note.update.mockResolvedValue([1]);
		models.note.create.mockResolvedValue({});

		await syncNotes(5, [
			{id: 'note-1', body: 'existing'},
			{body: 'new'},
		], {});

		expect(models.note.update).toHaveBeenCalledTimes(1);
		expect(models.note.create).toHaveBeenCalledTimes(1);
	});
});

// ─── updateServedDocumentByApplicationId ───────────────────────────────────────

describe('updateServedDocumentByApplicationId', () => {
	test('sanitizes empty-string date fields before writing', async () => {
		models.servedDocument.findOne
			.mockResolvedValueOnce({id: 1})
			.mockResolvedValueOnce({id: 1, nextAppearanceDate: null});
		models.servedDocument.update.mockResolvedValue([1]);
		models.note.destroy.mockResolvedValue(0);

		await updateServedDocumentByApplicationId(42, {firstName: 'Alice', nextAppearanceDate: ''});

		expect(models.servedDocument.update).toHaveBeenCalledWith(
			expect.objectContaining({nextAppearanceDate: null}),
			expect.anything(),
		);
	});
});
