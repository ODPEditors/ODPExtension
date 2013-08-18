(function()
{

	//returns a aCategory with plantrob format
	this.plantRob = function(aCategory)
	{
		aCategory = aCategory.replace(/\/+$/, '').split('/');
		for(var a=0;a<aCategory.length;a++)
		{
			aCategory[a] = this.encodeUTF8(aCategory[a]);
			if(a>1)
			{
				aCategory[a] = aCategory[a].split('')
				for(var i =0;i<aCategory[a].length;i++)
				{
					if(aCategory[a][i] == '%')
					{
						i++;
						aCategory[a][i] = aCategory[a][i].toLowerCase();
						i++;
						aCategory[a][i] = aCategory[a][i].toLowerCase();
					}
				}
				aCategory[a] = aCategory[a].join('');
			}
		}

		return aCategory.join(':').replace(/%/g, '~');
	}
	return null;

}).apply(ODPExtension);
