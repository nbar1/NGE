module.exports = {
	/**
	 * Get account id by user/pass
	 */
	getAccountIdByUserPass: function(database, data, callback) {
		var post  = [data.username, data.password, 1];
		var query = database.connection.query('SELECT account_id FROM accounts WHERE username=? AND password=? AND active=? LIMIT 1', post, function(err, result) {
			var account_id = result[0].account_id;
			if(account_id) {
				callback(account_id)
			}
			else {
				console.log('lol');
				return false;
			}
		});
	},

	/**
	 * Get account information
	 */
	getAccountInfo: function(database, data, callback) {
		var post  = [data.account_id];
		var query = database.connection.query('SELECT * FROM accounts WHERE account_id=? LIMIT 1', post, function(err, result) {
			if(result.length > 0) {
				callback(result[0])
			}
			else {
				return false;
			}
		});
	},

	/**
	 * Update account last login
	 */
	updateAccountLastLogin: function(database, data) {
		var post  = [this.getNowDate(), data.account_id];
		var query = database.connection.query('UPDATE accounts SET last_login=? WHERE account_id=?', post, function(err, result) {
			if(result) {
				return result;
			}
			else {
				return false;
			}
		});
	},

	/**
	 * Create account
	 */
	createAccount: function(database, data, callback) {
		var post = [data.username, data.password, data.email, this.getNowDate(), this.getNowDate()];
		var query = database.connection.query('INSERT INTO accounts (username, password, email, registered_on, last_login) VALUES (?, ?, ?, ?, ?)', post, function(err, result) {
			if(result) {
				callback(true)
			}
			else {
				callback(false);
			}
		});
	},

	/**
	 * Get 'now' formatted as Y-m-d H:i:s
	 */
	getNowDate: function() {
		var dt = new Date();
		var dtstring = dt.getFullYear()
			+ '-' + pad2(dt.getMonth()+1)
			+ '-' + pad2(dt.getDate())
			+ ' ' + pad2(dt.getHours())
			+ ':' + pad2(dt.getMinutes())
			+ ':' + pad2(dt.getSeconds());
		return dtstring;
	},

	/**
	 * Generic callback handler
	 */
	callback: function(data) {
		return data;
	}
}