'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('notes', {
			id: {
				type: Sequelize.STRING,
				primaryKey: true,
			},
			body: {
				type: Sequelize.STRING,
			},
			username: {
				type: Sequelize.STRING,
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
			date: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('notes');
	},
};
