(function()
{
	//removes duplicate values from an array
	this.arrayUnique = function (anArray)
	{
		var tmp = [];
		for(var id in anArray)
		{
			if(!this.inArray(tmp, anArray[id]))
			{
				tmp[tmp.length] = anArray[id];
			}
		}
		return tmp;
	};
	//checks if a value exists in an array
	this.inArray = function (anArray, some)
	{
		for(var id in anArray)
		{
			if(anArray[id]==some)
				return true;
		}
		return false;
	};
	//sorts using the current locale.
  this.sortLocale = function(a, b)
  {
	  return String(a).localeCompare(String(b));
  }

	return null;

}).apply(ODPExtension);
