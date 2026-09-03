const defineAttachment = require('../../model/attachment.model.js');

describe('attachment model', () => {
	let define;

	beforeEach(() => {
		define = jest.fn();
		defineAttachment({define});
	});

	test('is defined with the correct model name', () => {
		expect(define).toHaveBeenCalledWith('attachment', expect.any(Object), expect.any(Object));
	});

	test('declares the expected fields', () => {
		const fields = define.mock.calls[0][1];
		expect(Object.keys(fields)).toEqual(
			expect.arrayContaining(['id', 'url', 'name', 'originalName', 'fileType', 'file', 'size']),
		);
	});

	test('id is auto-increment', () => {
		const fields = define.mock.calls[0][1];
		expect(fields.id.autoIncrement).toBe(true);
		expect(fields.id.primaryKey).toBe(true);
	});
});
