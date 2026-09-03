'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.changeColumn('served_documents', 'is_criminal', {
			type: Sequelize.STRING,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.changeColumn('served_documents', 'is_criminal', {
			type: Sequelize.BOOLEAN,
		});
	},
};
