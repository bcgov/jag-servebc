const {DataTypes} = require('sequelize');

function defineNote(sequelize) {
	sequelize.define('note', {
		id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		body: {
			type: DataTypes.STRING,
			field: 'body',
		},
		username: {
			type: DataTypes.STRING,
			field: 'username',
		},
	}, {
		underscored: true,
		timestamps: true,
		updatedAt: false,
		createdAt: 'date',
	});
}

module.exports = defineNote;
