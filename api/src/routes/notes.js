const {models} = require('../model');
const {getParameter} = require('../helpers.js');

async function getAll(request, response) {
	try {
		const where = request.query.servedDocumentId
			? {servedDocumentId: request.query.servedDocumentId}
			: {};
		const notes = await models.note.findAll({where});
		response.status(200).json(notes);
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function getById(request, response) {
	try {
		const id = getParameter(request);
		const note = await models.note.findByPk(id);
		if (note) {
			response.status(200).json(note);
		} else {
			response.status(404).send('404 - Not found');
		}
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function create(request, response) {
	const {id} = request.body;
	if (!id) {
		return response.status(400).send('Bad request: ID should be provided.');
	}

	try {
		await models.note.create(request.body);
		response.status(201).end();
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function update(request, response) {
	const id = getParameter(request);
	if (request.body.id !== id) {
		return response.status(400).send(`Bad request: param ID (${id}) does not match body ID (${request.body.id}).`);
	}

	try {
		await models.note.update(request.body, {where: {id}});
		response.status(200).end();
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function remove(request, response) {
	try {
		const id = getParameter(request);
		await models.note.destroy({where: {id}});
		response.status(200).end();
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

module.exports = {
	allAuth: true,
	getAll,
	getById,
	create,
	update,
	remove,
};
