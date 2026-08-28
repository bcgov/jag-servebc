const {DataTypes} = require('sequelize');

function defineAttachment(sequelize) {
	sequelize.define('attachment', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		url: {
			type: DataTypes.STRING,
		},
		name: {
			type: DataTypes.STRING,
			field: 'file_name',
		},
		originalName: {
			type: DataTypes.STRING,
			field: 'original_name',
		},
		fileType: {
			type: DataTypes.STRING,
			field: 'file_type',
		},
		file: {
			type: DataTypes.STRING,
			field: 'file',
		},
		size: {
			type: DataTypes.INTEGER,
		},
	}, {
		underscored: true,
		timestamps: true,
		updatedAt: false,
		createdAt: 'dateAdded',
	});
}

module.exports = defineAttachment;
