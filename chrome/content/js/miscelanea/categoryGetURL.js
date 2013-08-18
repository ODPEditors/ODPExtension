(function()
{
	//returns the URL from a category name looking at the preference "advanced.use.private.odp.when.posible"
	this.categoryGetURL = function(aCategory)
	{
		if(this.preferenceGet('advanced.use.private.odp.when.posible') ||  aCategory.indexOf('Test') === 0 )
			return this.categoryGetURLPrivate(aCategory);
		else
			return this.categoryGetURLPublic(aCategory);
	}
	return null;

}).apply(ODPExtension);
