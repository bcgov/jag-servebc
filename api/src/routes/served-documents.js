const Sequelize = require('sequelize');
const {models} = require('../model');
const {getParameter} = require('../helpers.js');
const {resolvePostalCode, updateServedDocumentByApplicationId} = require('../services/served-document.service.js');

async function getById(request, response) {
	const id = getParameter(request);
	const servedDocument = await models.servedDocument.findByPk(id, {include: {all: true}});
	if (servedDocument) {
		response.status(200).json(servedDocument);
	} else {
		response.status(404).send('404 - Not found');
	}
}

async function getByQuery(request, response) {
	if (request.query.applicationId) {
		const servedDocument = await models.servedDocument.findOne({where: {applicationId: request.query.applicationId}, include: {all: true}});
		if (servedDocument) {
			response.status(200).json(servedDocument);
		} else {
			response.status(404).send('404 - Not found');
		}
	} else {
		response.status(400).send('Bad request: applicationId query parameter is required.');
	}
}

function isDuplicateApplicationIdError(error) {
	return error instanceof Sequelize.UniqueConstraintError
		|| (error instanceof Sequelize.ValidationError && error.errors.some(item => item.validatorKey === 'isUnique'));
}

async function create(request, response) {
	if (request.body.id) {
		return response.status(400).send('Bad request: ID should not be provided, since it is determined automatically by the database.');
	}

	try {
		const body = resolvePostalCode(request.body);
		const persistedObject = await models.servedDocument.create(
			body,
			{
				include: [
					{model: models.attachment},
					{model: models.note},
				],
			},
		);
		response.status(201).json(persistedObject.dataValues);
	} catch (error) {
		if (isDuplicateApplicationIdError(error)) {
			return response.status(409).send({message: 'ApplicationId already in use!'});
		}

		return error instanceof Sequelize.ValidationError ? response.status(422).send(error.errors) : response.status(400).send({message: error.message});
	}
}

// eslint-disable-next-line unicorn/prevent-abbreviations
async function updateByApplicationId(request, response) {
	if (!request.query.applicationId) {
		return response.status(400).send('Bad request: applicationId is required.');
	}

	try {
		const updatedObject = await updateServedDocumentByApplicationId(
			request.query.applicationId,
			request.body,
		);
		if (updatedObject === null) {
			return response.status(404).send('404 - Not found');
		}

		response.status(200).json(updatedObject);
	} catch (error) {
		return error instanceof Sequelize.ValidationError
			? response.status(422).send(error.errors)
			: response.status(500).send({message: error.message});
	}
}

async function remove(request, response) {
	const id = getParameter(request);
	await models.servedDocument.destroy({where: {id}});
	response.status(200).end();
}

module.exports = {
	allAuth: true,
	getById,
	getByQuery,
	create,
	updateByApplicationId,
	remove,
};
