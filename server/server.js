var database = require('./mod_database');
var save = require('./mod_save');
var account = require('./mod_account');
var character = require('./mod_character');
database.init();

var version = '0.0.1',
	express = require("express"),
	app = express(),
	io = require('socket.io').listen(app.listen(3700)),
	players = [];

console.log('Game Engine v' + version);

// set up database handlers

io.sockets.on('connection', function (socket) {
	/**
	 * DISCONNECT
	 */
	socket.on('disconnect', function() {
		// Remove socket from players array
		players.splice(players.indexOf(socket.connection_id), 1);
	});

	/**
	 * INIT
	 */
	socket.emit('CHAT', {from: 'SERVER', message: 'N1GE v' + version + ' Loaded'});

	/**
	 * LOGIN
	 */
	socket.on('HANDSHAKE', function(data) {
		// maybe check if server is in some type of mode that doesn't allow you to log on
		socket.emit('SET_GUI', {type: 'stage', template: 'login'});
	});
	/**
	 * LOGIN
	 */
	socket.on('LOGIN', function (data) {
		/**
		 * Check against database here
		 */
		account.getAccountIdByUserPass(database, data, function(account_id) {
			if(account_id == false) {
				socket.emit('SET_GUI', {type: 'stage', template: 'login', data: {error_message: 'Account could not be authenticated'}});
				return;
			}
			account.getAccountInfo(database, {account_id: account_id}, function(account) {
				// set account to socket
				socket.account = account;
				// get characters
				character.getCharacterByAccountId(database, {account_id: account.account_id}, function(character) {
					if(character == false) {
						socket.emit('SET_GUI', {type: 'stage', template: 'login', data: {error_message: 'No characters on account'}});
						return;
					}
					// set character to socket
					socket.character = character;
					socket.connection_id = players.push(socket) - 1;

					io.sockets.emit('CHAT', {from: 'SERVER', message: character.name+' has joined the game.'});

					socket.emit('SET_GUI', {type: 'stage', template: 'game', data: {version: version}});
					socket.emit('SET_GUI', {type: 'sidebar', template: 'default', data: {player: socket.character}});
					socket.emit('PLAYER_DATA', socket.character);
					
					/**
					 * LOAD OBJECTS
					 */
					/**
					 * START MOCK LOAD OBJECTS
					 */
					// pause for a .5 seconds while gui loads
					
					/*
					objects.getLocalObjects(database, {x: socket.player.coord_x, y: socket.player.coord_y, z: socket.player.coord_z}, function(objects) {
						socket.emit('XOBJS', objects);
					});
					*/
					var gui_pause = setTimeout(function() {
						socket.emit('XOBJS', {
							'leet': {
								x: 17,
								y: 13,
								width: 30,
								height: 30,
								position: 'relative',
								color: '#fff'
							}
						});
					}, 1000);
				});
			});
		});
	});

	/**
	 * MOVE
	 *
	 * TODO: add move timeout so consecutive moves can't be made quickly
	 */
	socket.on('MOVE', function(data) {
		console.log('MOVING TO: ' + data.x + ', ' + data.y);
		// successful move
		playerData = {
			id: 1,
			auth: 'sfd098h34fewnq43f3qev',
			session: socket.connection_id,
			name: 'testuser',
			lvl: 13,
			access: 'admin',
			coord_x: data.x,
			coord_y: data.y,
			coord_z: 0,
		};
		socket.emit('PLAYER_DATA', playerData);
		socket.emit('SET_GUI', {type: 'sidebar', template: 'default', data: {player: playerData}});
		socket.emit('MOVE', {x: data.x, y: data.y});
	});

	/**
	 * CLICK_XOBJ
	 */
	socket.on('CLICK_XOBJ', function(xobj) {
		console.log('XOBJ: ' + xobj.id);
	});
});
