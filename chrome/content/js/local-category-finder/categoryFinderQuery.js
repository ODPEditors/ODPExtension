(function()
{
	
	//do a search in the categories.txt database
	this.categoryFinderQuery = function(aQuery, aDatabase, aCategory)
	{
		//saving last selected
	//	this.dump(aDatabase);
		if(aDatabase)
			this.preferenceSet('locked.advanced.local.category.finder.last.selected', aDatabase);

		if(!aQuery || aQuery=='')
			return;
		
		if(
		   aQuery.indexOf('^') != -1
		   || aQuery.indexOf('$') != -1
		   || aQuery.indexOf('(') != -1
		   || aQuery.indexOf(')') != -1
		   || aQuery.indexOf('[') != -1
		   || aQuery.indexOf(']') != -1
		   || aQuery.indexOf('*') != -1
		   || aQuery.indexOf('?') != -1
		   || aQuery.indexOf('+') != -1
		   || aQuery.indexOf('.') != -1
		  )
		{
			aQuery = this.trim(aQuery).replace(/ /g, '_');
			var aResult = this.categoriesTXTQuery(aQuery, aDatabase, aCategory);
		}
		else
		{
			aQuery = this.trim(aQuery).replace(/_/g, ' ');
			var aResult = this.categoriesTXTQuery(aQuery, aDatabase, aCategory, true);
		}
			
		//SHOWING RESULTS
		if(aResult.count>0)
			this.tabOpen(this.fileCreateTemporal(
													'category-finder.html',  
													aQuery, 
													'<div class="header">'+this.htmlSpecialCharsEncode(this.getString('results').replace('{QUERY}', aQuery).replace('{NUM}', aResult.count))+'</div>'+
													'<pre style="background-color:white !important;padding:2px;">'
														+aResult.categories.join(this.__NEW_LINE__)+
													'</pre>'
												 )
						 , true);
		else
			this.notifyTab(this.getString('no.results').replace('{QUERY}', aQuery), 8);
	}

	return null;

}).apply(ODPExtension);
