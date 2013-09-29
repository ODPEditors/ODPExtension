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

			if (this.isVisitedURL(this.getSchema(aURL) + '://www.' + this.getSubdomainFromURL(aURL) + '/'))
				aTemp = this.getSchema(aURL) + '://www.' + this.getSubdomainFromURL(aURL) + '/';
			else if (this.isVisitedURL('https://www.' + this.getSubdomainFromURL(aURL) + '/'))
				aTemp = 'https://www.' + this.getSubdomainFromURL(aURL) + '/';
			else if (this.isVisitedURL('http://www.' + this.getSubdomainFromURL(aURL) + '/'))
				aTemp = 'http://www.' + this.getSubdomainFromURL(aURL) + '/';
			else
				aTemp = this.getSchema(aURL) + '://' + this.getSubdomainFromURL(aURL) + '/';
			pieces[pieces.length] = aTemp;

			if (this.isVisitedURL(this.getSchema(aURL) + '://www.' + this.getDomainFromURL(aURL) + '/'))
				aTemp = this.getSchema(aURL) + '://www.' + this.getDomainFromURL(aURL) + '/';
			else if (this.isVisitedURL('https://www.' + this.getDomainFromURL(aURL) + '/'))
				aTemp = 'https://www.' + this.getDomainFromURL(aURL) + '/';
			else if (this.isVisitedURL('http://www.' + this.getDomainFromURL(aURL) + '/'))
				aTemp = 'http://www.' + this.getDomainFromURL(aURL) + '/';
			//do not suggest to remove the www. from domains that contains it.
			else if (this.removeWWW(this.getSubdomainFromURL(aURL)) != this.getDomainFromURL(aURL))
				aTemp = this.getSchema(aURL) + '://' + this.getDomainFromURL(aURL) + '/';

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