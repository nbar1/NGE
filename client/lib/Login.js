game.login = {
	/**
	 * Login
	 */
	login: function() {
		var username = $('#login_username').val();
		var password = md5($('#login_password').val());
		game.socket.emit('LOGIN', {username: username, password: password});
	},

	/**
	 * Logout
	 */
	logout: function() {
		game.socket.emit('LOGOUT');
	}
}