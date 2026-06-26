const {Op} = require('sequelize');
const sequelize = require('../model');

const {models} = sequelize;

function getUpdatableFields(fullObject) {
	const fieldsToExclude = new Set(['id', 'applicationId']);
	return Object.keys(fullObject).filter(s => !fieldsToExclude.has(s));
}

function resolvePostalCode(body) {
	if (body.country.toUpperCase() !== 'CANADA') {
		return {...body, postalCode: body.altPostalCode};
	}

	return body;
}

async function syncNotes(servedDocumentId, newNotes = [], transaction) {
	const keepIds = newNotes.filter(n => n.id).map(n => n.id);

	await models.note.destroy({
		where: {
			servedDocumentId,
			...(keepIds.length > 0 ? {id: {[Op.notIn]: keepIds}} : {}),
		},
		transaction,
	});

	await Promise.all(newNotes.map(n =>
		n.id
			? models.note.update({...n, servedDocumentId}, {where: {id: n.id}, transaction})
			: models.note.create({...n, servedDocumentId}, {transaction})));
}

// eslint-disable-next-line unicorn/prevent-abbreviations
async function updateServedDocumentByApplicationId(applicationId, body) {
	return sequelize.transaction(async t => {
		const updatableFields = getUpdatableFields(body);
		const oldObject = await models.servedDocument.findOne({
			where: {applicationId},
			include: {all: true},
			transaction: t,
		});

		if (!oldObject) {
			return null;
		}

		const bodyWithId = {...body, id: oldObject.id};
		const [updatedCount] = await models.servedDocument.update(bodyWithId, {
			where: {applicationId},
			fields: updatableFields,
			transaction: t,
		});

		if (updatedCount === 0) {
			throw new Error('Internal error: update affected 0 rows');
		}

		await syncNotes(bodyWithId.id, bodyWithId.notes ?? [], t);

		const updatedObject = await models.servedDocument.findOne({
			where: {applicationId},
			include: {all: true},
			transaction: t,
		});

		if (!updatedObject) {
			throw new Error('Internal error: record not found after update');
		}

		return updatedObject;
	});
}

module.exports = {
	getUpdatableFields,
	resolvePostalCode,
	syncNotes,
	updateServedDocumentByApplicationId,
};
