(function() {

	this.addSiteMenuUpdate = function(currentPopup) {
		this.removeChilds(currentPopup);

		var aURL = this.focusedLocationBarURL();

		if (aURL == '') {
			var add = this.create('menuitem');
			add.setAttribute('label', 'about:blank');
			add.setAttribute('tooltiptext', 'about:blank');
			add.setAttribute('disabled', true);
			add.setAttribute('secondary', '');
			add.setAttribute('class', 'menuitem-iconic');
			add.setAttribute('image', this.faviconGetFromURL(aURL));
			currentPopup.appendChild(add);
		} else {
			var aTemp = '';
			var pieces = [];

			aTemp = this.removeSession(aURL);
			pieces[pieces.length] = this.shortURL(aTemp);

			aTemp = this.removeVariables(aURL);
			pieces[pieces.length] = this.shortURL(aTemp);

			aTemp = this.removeSensitiveDataFromURL(aURL);
			pieces[pieces.length] = this.shortURL(aTemp);

			aTemp = this.removeFileName(aURL);
			pieces[pieces.length] = aTemp;

			aTemp = this.removeFileName(this.removeFileName(aURL));
			pieces[pieces.length] = aTemp;

			aTemp = this.removeFileName(this.removeFileName(this.removeFileName(aURL)));
			pieces[pieces.length] = aTemp;

			aTemp = this.removeFromTheFirstFolder(aURL);
			pieces[pieces.length] = aTemp;

			var aSubdomain = this.getSubdomainFromURL(aURL);
			var aDomain = this.getDomainFromURL(aURL);

			if (this.isVisitedURL(this.getSchema(aURL) + '://www.' + aSubdomain + '/'))
				aTemp = this.getSchema(aURL) + '://www.' + aSubdomain + '/';
			else if (this.isVisitedURL('https://www.' + aSubdomain + '/'))
				aTemp = 'https://www.' + aSubdomain + '/';
			else if (this.isVisitedURL('http://www.' + aSubdomain + '/'))
				aTemp = 'http://www.' + aSubdomain + '/';
			else
				aTemp = this.getSchema(aURL) + '://' + aSubdomain + '/';
			pieces[pieces.length] = aTemp;

			if (this.isVisitedURL(this.getSchema(aURL) + '://www.' + aDomain + '/'))
				aTemp = this.getSchema(aURL) + '://www.' + aDomain + '/';
			else if (this.isVisitedURL('https://www.' + aDomain + '/'))
				aTemp = 'https://www.' + aDomain + '/';
			else if (this.isVisitedURL('http://www.' + aDomain + '/'))
				aTemp = 'http://www.' + aDomain + '/';
			//do not suggest to remove the www. from domains that contains it.
			else if (this.removeWWW(aSubdomain) != aDomain)
				aTemp = this.getSchema(aURL) + '://' + aDomain + '/';

			pieces[pieces.length] = aTemp;

			pieces = this.arrayUnique(pieces);

			var add = this.create('menuitem');
			add.setAttribute('label', this.shortURL(this.decodeUTF8Recursive(aURL)));
			add.setAttribute('tooltiptext', this.shortURL(this.decodeUTF8Recursive(aURL)));
			add.setAttribute('secondary', this.shortURL(aURL));
			add.setAttribute('action', 'add-site');
			add.setAttribute('image', this.faviconGetFromURL(aURL));
			add.setAttribute('class', 'menuitem-iconic');
			currentPopup.appendChild(add);

			currentPopup.appendChild(this.create('menuseparator'));

			for (var id in pieces) {
				if (pieces[id] != aURL) {
					var add = this.create('menuitem');
					add.setAttribute('label', this.decodeUTF8Recursive(pieces[id]));
					add.setAttribute('tooltiptext', this.decodeUTF8Recursive(pieces[id]));
					add.setAttribute('secondary', pieces[id]);
					add.setAttribute('action', 'add-site');
					add.setAttribute('class', 'menuitem-iconic');
					add.setAttribute('image', this.faviconGetFromURL(pieces[id]));
					currentPopup.appendChild(add);
				}
			}

			if (this.tagName(currentPopup.lastChild) == 'menuseparator')
				this.removeElement(currentPopup.lastChild)
		}
	}
	return null;

}).apply(ODPExtension);