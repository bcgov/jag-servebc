function applyExtraSetup(sequelize) {
	const {attachment, note, servedDocument} = sequelize.models;

	// ServedDocument relationships
	servedDocument.hasMany(attachment);
	attachment.belongsTo(servedDocument);
	servedDocument.hasMany(note);
	note.belongsTo(servedDocument);
}

module.exports = {applyExtraSetup};
