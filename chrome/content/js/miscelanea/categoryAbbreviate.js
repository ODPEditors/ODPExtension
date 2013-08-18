(function()
{
	//returns aCategory abbreviated
	this.categoryAbbreviate = function(aCategory)
	{
		if(!aCategory)
			return '';
		if(!this.preferenceGet('ui.abbreviate.category.names'))
			return aCategory;

		//do not abbreviate top categories
			if(this.subStrCount(aCategory, '/') < 2)
				return this.categoryTitle(aCategory);

		//abbreviated by user
			for(var id in this.shared.category.abbreviation.user.find)
				aCategory = aCategory.split(this.shared.category.abbreviation.user.find[id]).join(this.shared.category.abbreviation.user.replace[id]);

		//languages abbreviations
			if(aCategory.indexOf('World') != -1)
			{
				aCategory = aCategory.replace(/^World\//, '').replace(/World\//g, 'W/');

				for(var id in this.shared.category.abbreviation.languages.find)
					aCategory = aCategory.split(this.shared.category.abbreviation.languages.find[id]).join(this.shared.category.abbreviation.languages.replace[id]);
			}

		return this.categoryTitle(aCategory);
	}
	return null;

}).apply(ODPExtension);
