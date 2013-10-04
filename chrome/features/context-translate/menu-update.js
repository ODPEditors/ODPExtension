(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.addListener('userInterfaceUpdate', function(aEnabled) {
		ODPExtension.translateMenuUpdate();
	});
	//hides or shows the selected languages in the translate context menu, also sets the sort priority of these languages

	this.translateMenuUpdate = function() {
		//this.dump('translateMenuUpdate:');

		//list of languages
		var langs = this.shared.translateMenu.languages;
		var separator = this.getElement('context-translate-priority-separator');

		//enable or disable
		if (!this.preferenceGet('enabled') || !this.preferenceGet('ui.context.menu.translate')) {
			separator.setAttribute('hidden', true);
			for (var id in langs)
				this.getElement('context-translate-item-lang-' + langs[id]).setAttribute('hidden', true);
			return null;
		}
		separator.setAttribute('hidden', false);

		//sort the menu
		for (var id in langs) {
			var item = this.getElement('context-translate-item-lang-' + langs[id]);
			this.moveNodeBelow(item, separator);
		}

		//hides or shows the languages, and move the selected by the user(these without priority) to the bottom
		for (var id in langs) {
			var item = this.getElement('context-translate-item-lang-' + langs[id]);
			if (this.preferenceGet('ui.context.menu.translate.lang.display.' + langs[id]))
				item.setAttribute('hidden', false);
			else
				item.setAttribute('hidden', true);

			item.setAttribute('label', this.getString('ui.context.menu.translate.to.lang').replace('{LANG}', item.getAttribute('original_label')));
			if (item.hasAttribute('oncommand'))
				item.removeAttribute('oncommand');
			if (item.hasAttribute('onclick'))
				item.removeAttribute('onclick');
			item.setAttribute('oncommand', 'ODPExtension.translate(event)');
			item.setAttribute('onclick', 'checkForMiddleClick(this, event)');
		}

	}

	return null;

}).apply(ODPExtension);