/*	A helper function to assert the request ID param is valid
	and convert it to a number for normal Ids(since it comes as a string by default)
*/
function getParameter(request, key = 'id') {
	const value = request.params[key];

	// Check for Integer
	if (/^\d+$/.test(value)) {
		return Number.parseInt(value, 10);
	}

	if (value === undefined) {
		throw new TypeError(`Missing '${key}' param`);
	}

	return value;
}

module.exports = {getParameter};
