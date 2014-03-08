(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = false;

	//extract data from a aURL and replaces the extracted values in another URL called urlTool

	this.URLToolsApplyItem = function(aName, aValue, aString) {
		return aString.
		split('={' + aName + '}').join('=' + this.encodeUTF8(aValue) + '').
		split('{' + aName + '|E}').join(this.encodeUTF8(aValue)).
		split('{' + aName + '}').join(aValue);
	}
	this.URLToolsApply = function(urlTool, aURL) {
		aURL = this.string(aURL);

		if (urlTool.indexOf('{URL') != -1) {
			urlTool = this.URLToolsApplyItem('URL', aURL, urlTool);
		}

		if (urlTool.indexOf('{WWW_DOMAIN') != -1) {
			var aSubdomain = this.getSubdomainFromURL(aURL);
			if (aSubdomain != '') {
				urlTool = this.URLToolsApplyItem('WWW_DOMAIN', aSubdomain, urlTool);
			}
			urlTool = this.URLToolsApplyItem('WWW_DOMAIN', '', urlTool);
		}
		if (urlTool.indexOf('{SUBDOMAIN') != -1) {
			var aSubdomain = this.getSubdomainFromURL(aURL);
			if (aSubdomain != '') {
				urlTool = this.URLToolsApplyItem('SUBDOMAIN', aSubdomain, urlTool);
			}
			urlTool = this.URLToolsApplyItem('SUBDOMAIN', '', urlTool);
		}

		if (urlTool.indexOf('{DOMAIN') != -1) {
			var aSubdomain = this.removeWWW(this.getSubdomainFromURL(aURL));
			if (aSubdomain != '') {
				urlTool = this.URLToolsApplyItem('DOMAIN', aSubdomain, urlTool);
			}
			urlTool = this.URLToolsApplyItem('DOMAIN', '', urlTool);
		}

		if (urlTool.indexOf('{OWNER_DOMAIN') != -1) {
			var aDomain = this.getDomainFromURL(aURL);
			if (aDomain != '') {
				urlTool = this.URLToolsApplyItem('OWNER_DOMAIN', aDomain, urlTool);
			}
			urlTool = this.URLToolsApplyItem('OWNER_DOMAIN', '', urlTool);
		}


		if (urlTool.indexOf('{URL_FIRST_FOLDER') != -1) {
			var aString = this.removeFromTheFirstFolder(aURL);
			if (aString != '') {
				urlTool = this.URLToolsApplyItem('URL_FIRST_FOLDER', aString, urlTool);
			}
			urlTool = this.URLToolsApplyItem('URL_FIRST_FOLDER', '', urlTool);
		}

		if (urlTool.indexOf('{URL_LAST_FOLDER') != -1) {
			var aString = this.removeFileName(aURL);
			if (aString != '') {
				urlTool = this.URLToolsApplyItem('URL_LAST_FOLDER', aString, urlTool);
			}
			urlTool = this.URLToolsApplyItem('URL_LAST_FOLDER', '', urlTool);
		}

		if (urlTool.indexOf('{IP') != -1) {
			var anIP = this.getIPFromDomain(this.getSubdomainFromURL(aURL));

			if (anIP != '') {
				urlTool = this.URLToolsApplyItem('IP', anIP, urlTool);
			}
			urlTool = this.URLToolsApplyItem('IP', '', urlTool);
		}

		if (urlTool.indexOf('{SCHEMA') != -1) {
			var aSchema = this.getSchema(aURL);
			if (aSchema != '') {
				urlTool = this.URLToolsApplyItem('SCHEMA', aSchema + '', urlTool);
			}
			urlTool = this.URLToolsApplyItem('SCHEMA', '', urlTool);
		}

		if (urlTool.indexOf('{SELECTED_TEXT') != -1) {
			var aString = this.getSelectedTextOrPrompt(false);
			if (aString != '') {
				urlTool = this.URLToolsApplyItem('SELECTED_TEXT', aString, urlTool);
			}
			urlTool = this.URLToolsApplyItem('SELECTED_TEXT', '', urlTool);
		}

		if (urlTool.indexOf('{CLIPBOARD') != -1) {
			var aString = this.getClipboard();
			if (aString != '') {
				urlTool = this.URLToolsApplyItem('CLIPBOARD', aString, urlTool);
			}
			urlTool = this.URLToolsApplyItem('CLIPBOARD', '', urlTool);
		}

		if (urlTool.indexOf('{ASK') != -1) {
			var aString = this.prompt(this.decodeUTF8Recursive(this.getString('url.tools.wants.your.input')) + ' : ' + urlTool);
			if (aString != '') {
				urlTool = this.URLToolsApplyItem('ASK', aString, urlTool);
			}
			urlTool = this.URLToolsApplyItem('ASK', '', urlTool);
		}

		if (urlTool.indexOf('{CAT') != -1) {
			var aCat = this.categoryGetFromURL(aURL);

			if (aCat == '')
				aCat = this.categoryGetFocused();

			if (aCat != '') {
				urlTool = this.URLToolsApplyItem('CAT', aCat, urlTool);
			}
			urlTool = this.URLToolsApplyItem('CAT', '', urlTool);
		}

		if (urlTool.indexOf('{EDITOR') != -1) {
			var aEditor = this.editorGetFromURL(aURL);

			if (aEditor == '')
				aEditor = this.editorGetFromURL(this.focusedURL);

			if (aEditor != '') {
				urlTool = this.URLToolsApplyItem('EDITOR', aEditor, urlTool);
			}
			urlTool = this.URLToolsApplyItem('EDITOR', '', urlTool);
		}

		if (urlTool.indexOf('{TITLE') != -1) {
			var aTitle = this.documentGetTitle(this.documentGetFocused());

			if (aTitle != '') {
				urlTool = this.URLToolsApplyItem('TITLE', aTitle, urlTool);
			}
			urlTool = this.URLToolsApplyItem('TITLE', '', urlTool);
		}

		if (urlTool.indexOf('{META_DESC') != -1) {
			var aMetaDescription = this.documentGetMetaDescription(this.documentGetFocused());

			if (aMetaDescription != '') {
				urlTool = this.URLToolsApplyItem('META_DESC', aMetaDescription, urlTool);
			}
			urlTool = this.URLToolsApplyItem('META_DESC', '', urlTool);
		}

		return urlTool;
	}

	return null;

}).apply(ODPExtension);