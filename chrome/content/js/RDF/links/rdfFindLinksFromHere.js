(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFindLinksFromHere = function(aCategory)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.
				
				var aMsg = '@links from "{CATEGORY}" ({RESULTS})';//informative msg and title of document

				//sql query
				var query = this.DBRDF.query(<sql>
											 	SELECT 
													*
												FROM 
													`PREFIX_categories`,
													`PREFIX_link`
												where
													`link_id_from` IN 
													(
													 	SELECT 
															categories_id
														FROM
															`PREFIX_categories`
														WHERE
															`categories_path` = :categories_path
													 ) AND
													`categories_id` = `link_id_to`
												order by 
													link_id_to asc
											</sql>);

					query.params('categories_path', aCategory);

				//searching
				var row, rows = [], aData = '';
				for(var results = 0;row = this.DBRDF.fetchObjects(query);results++)
				{
					aData += row.link_name;
					aData += '<b style="color:green;font-size:16px;">@</b>';
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
