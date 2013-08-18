(function()
{
	//returns the URL for a ODP search looking at the preference "advanced.use.private.odp.when.posible"
	this.odpSearchGetURL = function(aString)
	{
		if(this.preferenceGet('advanced.use.private.odp.when.posible'))
			return this.odpSearchGetURLPrivate(aString);
		else
			return this.odpSearchGetURLPublic(aString);
	}
	return null;

}).apply(ODPExtension);
