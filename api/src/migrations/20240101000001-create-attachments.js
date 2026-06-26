'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('attachments', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			url: {
				type: Sequelize.STRING,
			},
			file_name: {
				type: Sequelize.STRING,
			},
			original_name: {
				type: Sequelize.STRING,
			},
			file_type: {
				type: Sequelize.STRING,
			},
			file: {
				type: Sequelize.STRING,
			},
			size: {
				type: Sequelize.INTEGER,
			},
			served_document_id: {
				type: Sequelize.INTEGER,
				references: {
					model: 'served_documents',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			date_added: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('attachments');
	},
};
