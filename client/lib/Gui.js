gui = {
	/**
	 * Template cache array
	 */
	templates: [],
	
	/**
	 * Allowed template types
	 */
	allowed_types: [
		'stage',
		'overlay',
		'sidebar'
	],

	/**
	 * Set Gui stage
	 */
	loadGuiElement: function(type, template, data) {
		if(data == undefined) data = {};

		var cachedTemplate = this.getTemplateFromCache(type, template);

		if(this.getTemplateFromCache(type, template) == false) {
			this.getTemplateFromFile(type, template, data);
			return;
		}

		this.setTemplate(type, template, cachedTemplate, data);
	},

	/**
	 * Set template to given area
	 */
	setTemplate: function(type, template, template_string, data) {
		if(this.allowed_types.indexOf(type !== -1)) {
			this.cacheTemplate(type, template, template_string);
			var template_string = Mustache.render(template_string, data);
			$('#'+type).html(template_string);
		}
	},

	/**
	 * Check for cached template
	 */
	getTemplateFromFile: function(type, template, data) {
		$.when($.get('/assets/templates/'+type+'/'+template+'.chtml'))
			.done(function(template_string) {
				gui.cacheTemplate(type, template, template_string);
				gui.loadGuiElement(type, template, data);
			})
			.fail(function() {
				if(template == 'error') {
					$('body').html('<div id="error" class="fatal">FATAL</div>');
				} else {
					gui.loadGuiElement('stage', 'error');
				}
				game.disconnect();
			})
	},

	/**
	 * Check for cached template
	 */
	getTemplateFromCache: function(type, template) {
		if(this.templates[type+'_'+template]) {
			return this.templates[type+'_'+template];
		}
		return false;
	},

	/**
	 * Store template locally for faster loading
	 */
	cacheTemplate: function(type, template, template_string) {
		this.templates[type+'_'+template] = template_string;
	}
}