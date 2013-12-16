module.exports = {
	/**
	 * Get character by account id
	 */
	getCharacterByAccountId: function(database, data, callback) {
		var post  = [data.account_id, 1];
		var query = database.connection.query(
			'SELECT * FROM characters WHERE account_id=? AND active=? LIMIT 1',
			post,
			function(err, result) {
				if(result.length > 0) {
					callback(result[0])
				}
				else {
					return false;
				}
			}
		);
	},
}