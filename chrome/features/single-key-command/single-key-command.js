(function() {
	//executes functions on single key presses, such edit a category when E is pressed and a category is focused, etc.

	this.singleKeyCommand = function(aEvent) {
		//this.dump( aEvent.originalTarget.tagName.toLowerCase());
		if (!this.preferenceGet('single.key.command') || !aEvent.originalTarget || !aEvent.originalTarget.tagName || !aEvent.originalTarget.ownerDocument
		// || aEvent.originalTarget.ownerDocument != this.documentGetFocused()
		|| aEvent.ctrlKey || aEvent.shiftKey || aEvent.altKey || this.preferenceBrowserGet('accessibility.typeaheadfind')) {} else {

			if (
				aEvent.originalTarget.tagName.toLowerCase() == 'html' ||
				aEvent.originalTarget.tagName.toLowerCase() == 'body' ||
				aEvent.originalTarget.tagName.toLowerCase() == 'xul:window') {
				this.fromCategoryUpdateMenu(aEvent, 'from-category', true);

				//getting categories selected/focused
				var aCategories = [];
				if (this.fromCategorySelectedCategories.length > 0)
					aCategories = this.fromCategorySelectedCategories;
				else if (this.fromCategorySelectedCategory != '')
					aCategories[0] = this.fromCategorySelectedCategory;
				else if (this.focusedCategory != '')
					aCategories[0] = this.focusedCategory;
				//if there is categories go
				if (aCategories.length > 0)
					this.onSingleKeyShortCut(aEvent.charCode, aCategories);
				//every page
				if (aEvent.charCode == 113) //Q - close tab
					this.tabClose(this.tabGetFocused());
				else if (aEvent.charCode == 116) //T - open tab
					this.tabOpen('about:blank', true);
				else if (aEvent.charCode == 103) //G - google
				{
					var searchFor = this.getSelectedText(true);
					if (!searchFor)
						searchFor = this.prompt(this.getString('search.ellipsis'))
					if (searchFor != '') {
						if (this.focusedSubdomain != '')
							this.openURL('http://www.google.com/search?q=' + this.encodeUTF8('site:' + this.removeWWW(this.focusedSubdomain)) + '+' + this.encodeUTF8(searchFor).replace(/%20/g, '+'), true, null, true);
						else
							this.openURL('http://www.google.com/search?q=' + this.encodeUTF8(searchFor).replace(/%20/g, '+'), true, null, true);
					}
				} else if (aEvent.charCode == 241) //Ñ - español
				{
					this.openURL(this.encodeURI('http://www.dmoz.org/World/Español/'), inNewTab);
				}
			}
		}
	}

	return null;

}).apply(ODPExtension);