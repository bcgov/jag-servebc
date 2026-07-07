'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('served_documents', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
			},
			application_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
			},
			application_status: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			first_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			last_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			contact_pronouns: {
				type: Sequelize.STRING,
			},
			contact_email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			contact_phone: {
				type: Sequelize.STRING,
			},
			lawyer_name: {
				type: Sequelize.STRING,
			},
			lawyer_phone: {
				type: Sequelize.STRING,
			},
			party_name: {
				type: Sequelize.STRING,
			},
			street_address: {
				type: Sequelize.STRING,
			},
			city: {
				type: Sequelize.STRING,
			},
			province: {
				type: Sequelize.STRING,
			},
			postal_code: {
				type: Sequelize.STRING,
			},
			country: {
				type: Sequelize.STRING,
			},
			service_email: {
				type: Sequelize.STRING,
			},
			service_fax_number: {
				type: Sequelize.STRING,
			},
			court_or_tribunal: {
				type: Sequelize.STRING,
			},
			registry: {
				type: Sequelize.STRING,
			},
			court_number: {
				type: Sequelize.STRING,
			},
			is_criminal: {
				type: Sequelize.STRING,
			},
			next_appearance_date: {
				type: Sequelize.DATE,
			},
			submitter_email_sent: {
				type: Sequelize.STRING,
			},
			served_date: {
				type: Sequelize.DATE,
			},
			closed_date: {
				type: Sequelize.DATE,
			},
			mark_as: {
				type: Sequelize.STRING,
				defaultValue: 'Unread',
			},
			staff_group: {
				type: Sequelize.STRING,
			},
			document_status: {
				type: Sequelize.STRING,
			},
			document_type: {
				type: Sequelize.STRING,
			},
			date_submitted: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('served_documents');
	},
};
