(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFindRelatedToDifferentLanguage = function(aCategory)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.
				
				var aMsg = 'Related categories to a different language from "{CATEGORY}" or from any of its subcategories ({RESULTS})';//informative msg and title of document

				//sql query
				var query = this.DBRDF.query(<sql>
											 	SELECT 
													* 
												FROM 
													`PREFIX_categories`,
													`PREFIX_related`
												where
													`related_id_from` IN 
													(
													 	SELECT 
															categories_id
														FROM
															`PREFIX_categories`
														WHERE
															`categories_path` GLOB :categories_path 
													 ) AND
													`categories_id` = `related_id_to`
												order by
													related_id_from asc,
													related_id_to asc
											</sql>);
					query.params('categories_path', aCategory+'*');

					var topCategory = aCategory.split('/')[0];
				//searching
				var row, rows = [], aData = '', last, tmp;
				for(var results = 0;row = this.DBRDF.fetchObjects(query);)
				{
					if(row.categories_path.indexOf(topCategory) === 0 || row.categories_path.indexOf('Kids') === 0 )
						continue;
					
					tmp = row.related_id_from
					if(last != tmp)
					{
						results++
						last = tmp;
						aData += this.__NEW_LINE__;
						aData += this.rdfGetCategoryFromCategoryID(last).categories_path;
						aData += this.__NEW_LINE__;
						aData += this.__NEW_LINE__;
					}
					aData += '\t';
					aData += row.categories_path;
					aData += this.__NEW_LINE__;
				}
				
				//sets msg
				aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results);
				
				//display results
				if(results>0)
					this.tabOpen(this.fileCreateTemporal(
															'RDF.html',  
															aMsg, 
															'<div class="header">'+aMsg+'</div>'+
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