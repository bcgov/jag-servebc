const {models} = require('../model');
const {getParameter} = require('../helpers.js');

async function getAll(request, response) {
	try {
		const attachments = await models.attachment.findAll();
		response.status(200).json(attachments);
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function getById(request, response) {
	try {
		const id = getParameter(request);
		const attachment = await models.attachment.findByPk(id, {include: {all: true}});
		if (attachment) {
			response.status(200).json(attachment);
		} else {
			response.status(404).send('404 - Not found');
		}
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function create(request, response) {
	if (request.body.id) {
		return response.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
	}

	try {
		await models.attachment.create(request.body);
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
		await models.attachment.update(request.body, {where: {id}});
		response.status(200).end();
	} catch (error) {
		response.status(500).json({message: error.message});
	}
}

async function remove(request, response) {
	try {
		const id = getParameter(request);
		await models.attachment.destroy({where: {id}});
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
