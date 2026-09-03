const {healthcheck} = require('../../routes/healthcheck.js');

function mockRes() {
	const res = {};
	res.status = jest.fn().mockReturnValue(res);
	res.send = jest.fn().mockReturnValue(res);
	return res;
}

describe('healthcheck', () => {
	test('returns uptime, message OK, and a timestamp', async () => {
		const res = mockRes();
		await healthcheck({}, res);

		expect(res.send).toHaveBeenCalledWith(expect.objectContaining({
			message: 'OK',
			uptime: expect.any(Number),
			timestamp: expect.any(Number),
		}));
	});
});
