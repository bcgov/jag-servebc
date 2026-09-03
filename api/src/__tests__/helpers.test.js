const {getParameter} = require('../helpers.js');

describe('getParameter', () => {
	test('returns integer for a numeric string param', () => {
		expect(getParameter({params: {id: '42'}})).toBe(42);
	});

	test('returns string for a non-numeric param', () => {
		expect(getParameter({params: {id: 'note-abc'}})).toBe('note-abc');
	});

	test('throws TypeError when param is missing', () => {
		expect(() => getParameter({params: {}})).toThrow(TypeError);
		expect(() => getParameter({params: {}})).toThrow("Missing 'id' param");
	});

	test('reads a custom key', () => {
		expect(getParameter({params: {fileId: '99'}}, 'fileId')).toBe(99);
	});

	test('throws with the custom key name in the message', () => {
		expect(() => getParameter({params: {}}, 'fileId')).toThrow("Missing 'fileId' param");
	});
});
