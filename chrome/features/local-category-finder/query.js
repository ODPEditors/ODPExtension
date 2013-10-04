(function() {

	this.categoryFinderQueryToolbarKeyPress = function(aEvent) {
		if (aEvent.keyCode == aEvent.DOM_VK_RETURN) {
			if (!this.popupOpen) {
				this.categoryFinderQuery(
					this.getElement('local-category-finder-textbox').value,
					this.getElement('local-category-finder-textbox-where').value);
				this.saveAutocomplete(this.getElement('local-category-finder-textbox'));
				this.saveAutocomplete(this.getElement('local-category-finder-textbox-where'));
			}
		}
	}
	this.categoryFinderQueryToolbarGo = function() {
		this.categoryFinderQuery(
			this.getElement('local-category-finder-textbox').value,
			this.getElement('local-category-finder-textbox-where').value);
		this.saveAutocomplete(this.getElement('local-category-finder-textbox'));
		this.saveAutocomplete(this.getElement('local-category-finder-textbox-where'));
	}
	//do a search in the categories.txt database
	this.categoryFinderQuery = function(aQuery, aWhere) {

		if (
			aQuery.indexOf('^') != -1 || aQuery.indexOf('$') != -1 || aQuery.indexOf('(') != -1 || aQuery.indexOf(')') != -1 || aQuery.indexOf('[') != -1 || aQuery.indexOf(']') != -1 || aQuery.indexOf('*') != -1 || aQuery.indexOf('?') != -1 || aQuery.indexOf('+') != -1 || aQuery.indexOf('.') != -1) {
			var aResult = this.categoriesTXTQuery(aQuery, aWhere);
		} else {
			var aResult = this.categoriesTXTQuery(aQuery, aWhere, true);
		}

		//SHOWING RESULTS
		if (aResult.count > 0)
			this.tabOpen(this.fileCreateTemporal(
				'category-finder.html',
				aQuery,
				'<div class="header">' + this.htmlSpecialCharsEncode(this.getString('results').replace('{QUERY}', aQuery).replace('{NUM}', aResult.count)) + '</div>' +
				'<pre style="background-color:white !important;padding:2px;">' + aResult.categories.join('\n') +
				'</pre>'), true);
		else
			this.notifyTab(this.getString('no.results').replace('{QUERY}', aQuery) + ' in "' + aWhere + '"', 8);
	}

	return null;

}).apply(ODPExtension);