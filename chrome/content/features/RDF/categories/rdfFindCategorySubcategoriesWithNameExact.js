(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFindCategorySubcategoriesWithNameExact = function(aCategory, aQuery)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.

				var aMsg = 'Subcategories of "{CATEGORY}" with exact name "{QUERY}" ({RESULTS})';//informative msg and title of document

				//sql query
				var subCategories = this.rdfGetCategorySubcategoriesRecursiveFromCategoryPath(aCategory)

				//searching
				var aData = '';
				for(var results = 0, i=0;i < subCategories.length;i++)
				{
					if(subCategories[i].categories_category != aQuery)
						continue;
					results++
					aData += subCategories[i].categories_path;
					aData += this.__NEW_LINE__;
				}

				//sets msg
				aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results).replace('{QUERY}', aQuery);

				//display results
				if(results>0)
					this.tabOpen(this.fileCreateTemporal(
															'RDF.html',
															aMsg,
															'<div class="header">'+this.htmlSpecialCharsEncode(aMsg)+'</div>'+
															'<pre style="background-color:white !important;padding:2px;">'
																+aData+
															'</pre>'
														 )
								 , true);
				else
					this.notifyTab(aMsg, 8);

			  this.rdfClose();
			}
	return null;

}).apply(ODPExtension);
