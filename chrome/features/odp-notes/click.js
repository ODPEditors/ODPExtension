(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//manages the click on a note (update,unreview,delete), maybe a new note is created or an old note is applied.

	this.odpURLNotesClick = function(aEvent) {
		//this.dump('odpURLNotesClick', debugingThisFile);

		var aElement = aEvent.originalTarget;
		var aMenu = aEvent.currentTarget;
		var aType = aMenu.getAttribute('value');

		//if the new note menuitem was pressed
		if (aElement.hasAttribute('new')) {
			if (aType.indexOf('move.') != -1) {
				this.notifyInstances('odpURLNotesToolbarbuttonsMenuReset', 'move-publish');
				this.notifyInstances('odpURLNotesToolbarbuttonsMenuReset', 'move-unreview');
			} else if (aType.indexOf('copy.') != -1) {
				this.notifyInstances('odpURLNotesToolbarbuttonsMenuReset', 'copy-publish');
				this.notifyInstances('odpURLNotesToolbarbuttonsMenuReset', 'copy-unreview');
			} else {
				this.notifyInstances('odpURLNotesToolbarbuttonsMenuReset', aType);
			}

			//this.dump('new note:'+aType, debugingThisFile);

			//building the form
			//xul content
			var aLabel = this.createFormLabel(this.getString('url.notes.example'));
			var aTextbox = this.createTextbox('new.note');

			var aHiddenValue = this.createFormHiddenInput('aType', aType);

			//butonscreateFormHiddenInput
			var buttons = [];

			var button = [];
			button[0] = this.getString('save');
			button[1] = function(formData) {
				var note = ODPExtension.trim(formData['new.note']);
				if (note == '')
					return;
				ODPExtension.preferenceSet('url.notes.' + formData['aType'].replace(/\..*$/, ''), ODPExtension.preferenceGet('url.notes.' + formData['aType'].replace(/\..*$/, '')) + '\n' + note);

				if (ODPExtension.confirm(ODPExtension.getString('url.notes.wants.apply'))) {
					ODPExtension.odpURLNotesApply(null, formData['aType'], note, ODPExtension.documentGetFocused());
				}
			}
			buttons[buttons.length] = button;

			var button = [];
			button[0] = this.getString('close');

			buttons[buttons.length] = button;

			this.form('new.note', this.getString('url.notes.new.note.title'), [aLabel, aTextbox, aHiddenValue], buttons, true);
		} else {
			this.odpURLNotesApply(aEvent, aType, aElement.getAttribute('label'), this.documentGetFocused());
		}
	}
	return null;

}).apply(ODPExtension);