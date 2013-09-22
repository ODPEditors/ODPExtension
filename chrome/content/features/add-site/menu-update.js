(function()
{

	this.addSiteMenuUpdate = function(currentPopup)
	{
		this.removeChilds(currentPopup);

		var aURL = this.focusedLocationBarURL();

		if(aURL == '')
		{
			var add = this.create('menuitem');
				add.setAttribute('label', 'about:blank');
				add.setAttribute('tooltiptext', 'about:blank');
				add.setAttribute('disabled', true);
				add.setAttribute('secondary', '');
				add.setAttribute('class', 'menuitem-iconic');
				add.setAttribute('image', this.faviconGetFromURL(aURL));
				currentPopup.appendChild(add);
		}
		else
		{
			var aTemp = '';
			var pieces = [];

				aTemp = this.removeSession(aURL);
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = this.shortURL(aTemp);

				aTemp = this.removeVariables(aURL);
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = this.shortURL(aTemp);


				aTemp = this.removeSensitiveDataFromURL(aURL);
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = this.shortURL(aTemp);

				aTemp = this.removeFileName(aURL);
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = aTemp;

				aTemp = this.removeFileName(this.removeFileName(aURL));
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = aTemp;

				aTemp = this.removeFileName(this.removeFileName(this.removeFileName(aURL)));
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = aTemp;

				aTemp = this.removeFromTheFirstFolder(aURL);
				if(!this.inArray(pieces, aTemp) || this.subStrCount(aTemp,'/') < 2)
					pieces[pieces.length] = aTemp;

				aTemp = this.getSchema(aURL)+'://'+this.getSubdomainFromURL(aURL)+'/';
				if(!this.inArray(pieces, aTemp))
					pieces[pieces.length] = aTemp;

				if(this.getDomainFromURL(aURL) != this.removeWWW(this.getSubdomainFromURL(aURL)))//I should not suggest to remove the www.
				{
					if(this.isVisitedURL(this.getSchema(aURL)+'://www.'+this.getDomainFromURL(aURL)+'/'))
						aTemp = this.getSchema(aURL)+'://www.'+this.getDomainFromURL(aURL)+'/';
					else
						aTemp = this.getSchema(aURL)+'://'+this.getDomainFromURL(aURL)+'/';

					if(!this.inArray(pieces, aTemp))
						pieces[pieces.length] = aTemp;
				}
				else if(this.isVisitedURL(this.getSchema(aURL)+'://www.'+this.getDomainFromURL(aURL)+'/'))
				{
					aTemp = this.getSchema(aURL)+'://www.'+this.getDomainFromURL(aURL)+'/';
					if(!this.inArray(pieces, aTemp))
						pieces[pieces.length] = aTemp;
				}

				pieces = this.arrayUnique(pieces);

			var add = this.create('menuitem');
				add.setAttribute('label',  this.shortURL(this.decodeUTF8Recursive(aURL)));
				add.setAttribute('tooltiptext',  this.shortURL(this.decodeUTF8Recursive(aURL)));
				add.setAttribute('secondary', this.shortURL(aURL));
				add.setAttribute('action', 'add-site');
				add.setAttribute('image', this.faviconGetFromURL(aURL));
				add.setAttribute('class', 'menuitem-iconic');
				currentPopup.appendChild(add);

				currentPopup.appendChild(this.create('menuseparator'));
				for(var id in pieces)
				{
					if(pieces[id] != aURL)
					{
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

				if(this.tagName(currentPopup.lastChild) == 'menuseparator')
					this.removeElement(currentPopup.lastChild )
		}
	}
	return null;

}).apply(ODPExtension);
