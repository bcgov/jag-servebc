const defineServedDocument = require('../../model/served-document.model.js');

describe('servedDocument model', () => {
	let define;

	beforeEach(() => {
		define = jest.fn();
		defineServedDocument({define});
	});

	test('is defined with the correct model name', () => {
		expect(define).toHaveBeenCalledWith('servedDocument', expect.any(Object), expect.any(Object));
	});

	test('declares the expected fields', () => {
		const fields = define.mock.calls[0][1];
		expect(Object.keys(fields)).toEqual(
			expect.arrayContaining([
				'id', 'applicationId', 'applicationStatus',
				'firstName', 'lastName', 'contactEmail',
				'country', 'postalCode',
			]),
		);
	});

	test('required fields have allowNull false', () => {
		const fields = define.mock.calls[0][1];
		expect(fields.applicationId.allowNull).toBe(false);
		expect(fields.applicationStatus.allowNull).toBe(false);
		expect(fields.firstName.allowNull).toBe(false);
		expect(fields.lastName.allowNull).toBe(false);
		expect(fields.contactEmail.allowNull).toBe(false);
	});

	test('applicationId is unique', () => {
		const fields = define.mock.calls[0][1];
		expect(fields.applicationId.unique).toBe(true);
	});

	test('markAs defaults to Unread', () => {
		const fields = define.mock.calls[0][1];
		expect(fields.markAs.defaultValue).toBe('Unread');
	});
});
