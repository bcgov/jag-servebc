const sequelize = require('../model');
const { pickRandom, randomDate } = require('./helpers/random');
const logger = require("../logger");

async function reset() {
	logger.info('[apt.db.reset] This Will reset the database.');
	
	await sequelize.sync({ force: true });

	// await sequelize.models.servedDocument.bulkCreate([
	// 	{ 
	// 		applicationId: 1,
	// 		applicationStatus: "Review",
	// 		firstName: "John",
	// 		lastName: "Doe",
	// 		contactPronouns: "He/His",
	// 		contactEmail: "a@a.com",
	// 		documentTypeId: 1,
	// 		staffGroupId: 1,
	// 		statusId: 1,
	// 		contactId: 1,
	// 		lawyerName: 'John Sue',
	// 		lawyerPhone: '778 1234567',
	// 		partyName: 'Party Abc',
	// 		streetAddress: '123 1st Street',
	// 		city: 'Victoria',
	// 		province: 'BC',
	// 		postalCode: 'V9A1L1',
	// 		country: 'Canada',
	// 		serviceEmail: 'a@a.com',
	// 		serviceTaxNumber: '01010',
	// 		courtOrTribunal: 'Court 1',
	// 		registry: 'ABC123',
	// 		courtNumber: '1A',
	// 		isCriminal: true,
	// 		dateSubmitted: new Date(),
	// 		submitterEmailSent: 'b@b.com',
	// 		servedDate: new Date(),
	// 		closedDate: null
			
	// 	}
	// ]);

	// await sequelize.models.attachment.bulkCreate([
	// 	{ 
	// 		servedDocumentId: 1,
	// 		dateAdded: new Date(),
	// 		fileName: 'document.doc',
	// 		fileType: 'Contract',
	// 		file: '...'
	// 	}
	// ]);

	// await sequelize.models.note.bulkCreate([
	// 	{ 
	// 		servedDocumentId: 1,
	// 		date: new Date(),
	// 		body: 'Body... ',
	// 		username: 'user1',
	// 		id: "567888-9876987-987688-876876"
	// 	}
	// ]);

	logger.info('[api.db.reset] Done!');
}

reset();
