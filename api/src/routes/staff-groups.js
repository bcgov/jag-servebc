const { models } = require('../model');
const { getIdParam } = require('../helpers');

async function getAll(req, res) {
	const staffGroups = await models.staffGroup.findAll();
	res.status(200).json(staffGroups);
};

async function getById(req, res) {
	const id = getIdParam(req);
	const staffGroup = await models.staffGroup.findByPk(id, { include: { all: true }});
	if (staffGroup) {
		res.status(200).json(staffGroup);
	} else {
		res.status(404).send('404 - Not found');
	}
};

async function create(req, res) {
	if (req.body.id) {
		res.status(400).send(`Bad request: ID should not be provided, since it is determined automatically by the database.`)
	} else {
		await models.staffGroup.create(req.body);
		res.status(201).end();
	}
};

async function update(req, res) {
	const id = getIdParam(req);

	// We only accept an UPDATE request if the `:id` param matches the body `id`
	if (req.body.id === id) {
		await models.staffGroup.update(req.body, {
			where: {
				id: id
			}
		});
		res.status(200).end();
	} else {
		res.status(400).send(`Bad request: param ID (${id}) does not match body ID (${req.body.id}).`);
	}
};

async function remove(req, res) {
	const id = getIdParam(req);
	await models.staffGroup.destroy({
		where: {
			id: id
		}
	});
	res.status(200).end();
};

module.exports = {
	"AllAuth": true,
	getAll,
	getById,
	create,
	update,
	remove,
};
