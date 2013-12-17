game.ui = {
	scale: 1.0,
	pixels_per_coord: 10,
	sidebar_width: 300,

	/**
	 * Initialize
	 */
	init: function () {
		this.bind();
	},

	/**
	 * Set up bindings
	 */
	bind: function() {
		// Still need to remap objects on when addPlayerSpriteToMap is called from a resize
		$(window).resize(function(){ game.ui.addPlayerSpriteToMap(); });
		$('#stage').on('click', function(e){ game.ui.sendClick(e, e); });
	},

	/**
	 * Add elements to the screen
	 */
	addScreenElements: function(data) {
		$.each(data, function(k, v) {
			var canvas_coords = game.ui.convertCoordsMapToCanvas(v);
			canvas_coords.x = canvas_coords.x - (v.width / 2)
			canvas_coords.y = canvas_coords.y - (v.height / 2)
			var xobj = document.createElement("div");
			xobj.id = 'xobj_'+k;
			document.getElementById('game').appendChild(xobj);
			console.log('item to ' + canvas_coords.x + ', ' + canvas_coords.y + ' (' + v.x + ', ' + v.y + ')');
			$('#xobj_'+k).css({
				left: canvas_coords.x,
				top: canvas_coords.y,
				width: v.width * game.ui.scale,
				height: v.height * game.ui.scale,
				position: 'relative',
				background: v.color
			});
		});
	},

	/**
	 * Captures and routes click events
	 *
	 * @REFACTOR
	 */
	sendClick: function(e) {
		if(e.target.id.indexOf("xobj") !== -1) {
			// object click
			console.log(e.target.id.replace('xobj_', ''));
			game.socket.emit('CLICK_XOBJ', {id: e.target.id.replace('xobj_', '')})
			return;
		}
		if(e.target.id == "login_submit") {
			game.login.login();
			return;
		} 
		var container = this.getContainerCoordinates();
		var canvas = {
			x: e.clientX,
			y: e.clientY
		};
		if(canvas.x <= $('#game_wrapper').width() - this.sidebar_width) {
			if(e.target.id.indexOf("xobj") !== -1) {
				// object click
				console.log(e.target.id.replace('xobj_', ''));
				game.socket.emit('CLICK_XOBJ', {id: e.target.id.replace('xobj_', '')})
			} 
			else {
				canvas.x = canvas.x - container.canvas.left;
				canvas.y = canvas.y - container.canvas.top;
				game.socket.emit('MOVE', this.convertCoordsCanvasToMap(canvas));
			}
		} // else sidebar click
	},

	/**
	 * Get container coordinates
	 */
	getContainerCoordinates: function(data) {
		var map = $('#game');
		var player = {x: game.player.coord_x, y: game.player.coord_y};
		var canvas = {
			left: parseInt(map.css('left')),
			top: parseInt(map.css('top')),
			width: map.width() - this.sidebar_width,
			height: map.height()
		};
		canvas.x = canvas.left + (canvas.width / 2);
		canvas.y = canvas.top + (canvas.height / 2);
		var game_map = {
			x: canvas.left - canvas.width,
			y: canvas.top - canvas.height
		};
		return {
			player: player,
			canvas: canvas,
			map_center: game_map
		};
	},

	/**
	 * Move canvas
	 */
	moveCanvasTo: function(coords) {
		var canvas = this.getContainerCoordinates().canvas;
		var coords = {
			x: coords.x - canvas.x,
			y: coords.y - canvas.y
		};
		$('#game').animate({
			top: coords.y * -1 + 'px',
			left: coords.x * -1 + 'px'
		});
	},

	/**
	 * Add player sprite to map
	 */
	addPlayerSpriteToMap: function() {
		var addWait = setTimeout(function() {
			var canvas = game.ui.getContainerCoordinates().canvas;
			$('#player_sprite').css({
				top: (canvas.height / 2) - ($('#player_sprite').height() / 2),
				left: (canvas.width / 2) - ($('#player_sprite').width() / 2)
			});
		}, 500);
	},

	/**
	 * Convert map coords to canvas coords
	 *
	 * For use when placing an object on the screen based on it's map coords
	 */
	convertCoordsMapToCanvas: function(coords) {
		var canvas = this.getContainerCoordinates().canvas;
		return {
			x: coords.x * (this.pixels_per_coord * this.scale) + canvas.x,
			y: coords.y * (this.pixels_per_coord * this.scale) + canvas.y
		};
	},

	/**
	 * Convert canvas coords to map coords
	 *
	 * For use when figuring out map coordinates based off of screen coordinates
	 */
	convertCoordsCanvasToMap: function(coords) {
		var game_canvas = this.getContainerCoordinates().canvas;
		var x = Math.round((coords.x - (game_canvas.width / 2)) / (this.pixels_per_coord * this.scale));
		var y = Math.round((coords.y - (game_canvas.height / 2)) / (this.pixels_per_coord * this.scale));
		return {
			x: x,
			y: y
		};
	},

	/**
	 * Flush UI
	 *
	 * @TODO make useful or delete
	 */
	flush: function(data) {
		$('#game').css({top: '0px', left: '0px'});
		$('#game').html('');
	}
}