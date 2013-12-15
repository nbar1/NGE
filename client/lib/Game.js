var game = game || {};

game = {
	chat: {messages: []},
	rendered: false,
	x: 0,
	y: 0,
	z: 0,

	/**
	 * Initialize
	 */
	init: function() {
		// bind user interactions
		this.bind();
		// check for socket.io
		if (typeof io === 'undefined') {
			gui.loadGuiElement('stage', 'server_offline');
		} else {
			this.socket = io.connect('http://game.nbar1.com:3700/');
			this.setHandlers();
			this.doHandshake();
			//Gui.setStage('game');
		}
	},

	/**
	 * Set up bindings
	 */
	bind: function() {
		//$('#search_submit').live('click', function() { gs.searchSubmit(); });
		//$('#search_input').bind('keypress', function(e) { gs.searchSubmitViaKeypress(e); });
	},

	/**
	 * Handshake server
	 */
	doHandshake: function() {
		this.socket.emit('HANDSHAKE');
	},

	/**
	 * Disconnect from server
	 */
	disconnect: function(message) {
		if(this.socket) { this.socket.disconnect(message); }
	},

	/**
	 * Set handlers
	 */
	setHandlers: function() {
	
		/**
		 * SET_GUI
		 */
		this.socket.on('SET_GUI', function(data) {
			gui.loadGuiElement(data.type, data.template, data.data);
		});

		/**
		 * CHAT
		 */
		this.socket.on('CHAT', function (data) {
			if(data.message) {
				console.log('['+data.from+'] '+data.message);
			} else {
				console.log("There is a problem:", data);
			}
		});
	
		/**
		 * SET_PLAYER_DATA
		 */
		this.socket.on('PLAYER_DATA', function(data) {
			game.player = data;
			game.ui.addPlayerSpriteToMap();
		});
	
		/**
		 * XOBJS - recieved ui elements
		 */
		this.socket.on('XOBJS', function(data) {
			game.ui.addScreenElements(data);
		});
	
		/**
		 * XOBJS - recieved ui elements
		 */
		this.socket.on('MOVE', function(data) {
			coords = game.ui.convertCoordsMapToCanvas(data);
			game.ui.moveCanvasTo(coords);
		});
	}
}

$(document).ready(function() {
	game.init();
	game.ui.init();
});