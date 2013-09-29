(function() {
	//returns aCategory abbreviated
	this.categoryAbbreviate = function(aCategory) {
		if (!aCategory)
			return '';

		//do not abbreviate top categories
		if (this.subStrCount(aCategory, '/') < 2)
			return this.categoryTitle(aCategory);

		//languages abbreviations
		if (aCategory.indexOf('World') != -1) {

			//rtl
			aCategory = aCategory.replace(/^World\/Arabic\/(.)/, '$1').replace(/^World\/Hebrew\/(.)/, '$1').replace(/^World\/Persian\/(.)/, '$1');

			aCategory = aCategory.replace(/^World\//, '').replace(/World\//g, 'W/');
		}
		for (var id in this.shared.category.abbreviation.languages.find)
			aCategory = aCategory.split(this.shared.category.abbreviation.languages.find[id]).join(this.shared.category.abbreviation.languages.replace[id]);

		aCategory = aCategory.replace(/^World\//, '').replace(/World\//g, 'W/');

		return this.categoryTitle(aCategory);
	}
	return null;

}).apply(ODPExtension);