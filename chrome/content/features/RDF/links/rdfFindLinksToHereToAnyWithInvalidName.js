(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFindLinksToHereToAnyWithInvalidName = function(aCategory)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.

				var aMsg = '@links with a " " or with a double "_" or "-" in the name to the category "{CATEGORY}" or to any of its subcategories ({RESULTS})';//informative msg and title of document

				//sql query
				var query = this.DBRDF.query(' \
											 	SELECT \
													* \
												FROM \
													`PREFIX_categories`, \
													`PREFIX_link` \
												where \
													`link_id_to` IN \
													( \
													 	SELECT \
															categories_id \
														FROM \
															`PREFIX_categories` \
														WHERE \
															`categories_path` GLOB  :categories_path \
													 ) \
													AND \
													( \
														regexp(\'--\', link_name) or \
														regexp(\' \', link_name) or \
														regexp(\'__\', link_name) \
													) \
													AND \
													( \
														`categories_id` = `link_id_to` \
													) \
												order by \
													categories_id asc \
											');

					query.params('categories_path', aCategory+'*');

				//searching
				var row, rows = [], aData = '';
				for(var results = 0;row = this.DBRDF.fetchObjects(query);results++)
				{
					aData += row.categories_path;
					aData += this.__NEW_LINE__;
					aData += this.__NEW_LINE__;
					aData += '\t';
					aData += row.link_name;
					aData += '<b style="color:green;font-size:16px;">@</b>';
					aData += this.rdfGetCategoryFromCategoryID(row.link_id_to).categories_path;
					aData += this.__NEW_LINE__;
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
