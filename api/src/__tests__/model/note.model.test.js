const defineNote = require('../../model/note.model.js');

describe('note model', () => {
	let define;

	beforeEach(() => {
		define = jest.fn();
		defineNote({define});
	});

	test('is defined with the correct model name', () => {
		expect(define).toHaveBeenCalledWith('note', expect.any(Object), expect.any(Object));
	});

	test('declares the expected fields', () => {
		const fields = define.mock.calls[0][1];
		expect(Object.keys(fields)).toEqual(
			expect.arrayContaining(['id', 'body', 'username']),
		);
	});

	test('id is a client-provided string primary key (not auto-increment)', () => {
		const fields = define.mock.calls[0][1];
		expect(fields.id.primaryKey).toBe(true);
		expect(fields.id.autoIncrement).toBeFalsy();
	});
});
