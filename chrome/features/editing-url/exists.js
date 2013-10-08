(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//check if the "edit URL" form exits on aDoc

	this.editingFormURLExists = function(aDoc) {
		if (!aDoc.forms)
			return false;

		var aLocation = this.documentGetLocation(aDoc);
		if (
			aLocation.indexOf('http://www.dmoz.org/editors/editunrev/editurl?') === 0 ||
			aLocation.indexOf('http://www.dmoz.org/editors/editurl/edit?') === 0 ||
			aLocation.indexOf('http://www.dmoz.org/editors/editurl/add?') === 0) {

			for (var i = 0; i < aDoc.forms.length; i++) {
				if (
					aDoc.forms[i].action == 'http://www.dmoz.org/editors/editunrev/updateurl' ||
					aDoc.forms[i].action == 'http://www.dmoz.org/editors/editurl/doadd' ||
					aDoc.forms[i].action == 'http://www.dmoz.org/editors/editurl/update') {
					return aDoc.forms[i];
				}
			}

		}
		return false;
	}

	return null;

}).apply(ODPExtension);