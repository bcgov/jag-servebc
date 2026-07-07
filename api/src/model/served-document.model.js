const {DataTypes} = require('sequelize');

function defineServedDocument(sequelize) {
	const ServedDocument = sequelize.define('servedDocument', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		applicationId: {
			type: DataTypes.INTEGER,
			field: 'application_id',
			allowNull: false,
			unique: true,
			validate: {
				isUnique(value, next) {
					ServedDocument.findOne({
						where: {applicationId: value},
						attributes: ['applicationId'],
					})
						.then(function (servedDocument) {
							if (servedDocument && this.isNewRecord) {
								return next('ApplicationId already in use!');
							}

							next();
						});
				},
			},
		},
		applicationStatus: {
			type: DataTypes.STRING,
			field: 'application_status',
			allowNull: false,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		contactPronouns: {
			type: DataTypes.STRING,
		},
		contactEmail: {
			type: DataTypes.STRING,
			field: 'contact_email',
			allowNull: false,
		},
		contactPhone: {
			type: DataTypes.STRING,
			field: 'contact_phone',
		},
		lawyerName: {
			type: DataTypes.STRING,
			field: 'lawyer_name',
		},
		lawyerPhone: {
			type: DataTypes.STRING,
			field: 'lawyer_phone',
		},
		partyName: {
			type: DataTypes.STRING,
			field: 'party_name',
		},
		streetAddress: {
			type: DataTypes.STRING,
			field: 'street_address',
		},
		city: {
			type: DataTypes.STRING,
			field: 'city',
		},
		province: {
			type: DataTypes.STRING,
			field: 'province',
		},
		postalCode: {
			type: DataTypes.STRING,
			field: 'postal_code',
		},
		country: {
			type: DataTypes.STRING,
			field: 'country',
		},
		serviceEmail: {
			type: DataTypes.STRING,
			field: 'service_email',
		},
		serviceFaxNumber: {
			type: DataTypes.STRING,
			field: 'service_fax_number',
		},
		courtOrTribunal: {
			type: DataTypes.STRING,
			field: 'court_or_tribunal',
		},
		registry: {
			type: DataTypes.STRING,
			field: 'registry',
		},
		courtNumber: {
			type: DataTypes.STRING,
			field: 'court_number',
		},
		isCriminal: {
			type: DataTypes.STRING,
			field: 'is_criminal',
		},
		nextAppearanceDate: {
			type: DataTypes.DATE,
			field: 'next_appearance_date',
		},
		submitterEmailSent: {
			type: DataTypes.STRING,
			field: 'submitter_email_sent',
		},
		servedDate: {
			type: DataTypes.DATE,
			field: 'served_date',
		},
		closedDate: {
			type: DataTypes.DATE,
			field: 'closed_date',
		},
		markAs: {
			type: DataTypes.STRING,
			field: 'mark_as',
			defaultValue: 'Unread',
		},
		staffGroup: {
			type: DataTypes.STRING,
			field: 'staff_group',
		},
		documentStatus: {
			type: DataTypes.STRING,
			field: 'document_status',
		},
		documentType: {
			type: DataTypes.STRING,
			field: 'document_type',
		},
	}, {
		underscored: true,
		timestamps: true,
		updatedAt: false,
		createdAt: 'dateSubmitted',
	});
}

module.exports = defineServedDocument;
