(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfGetCategoryAltlangsIDsToCategoryIDs = function(aCategoryID, anArrayResults)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.

				try{aCategoryID = aCategoryID.join(',');}catch(e){/*stupid....*/}

				var query = this.DBRDF.query([/*stupid...*/
									'	SELECT '+
									'		DISTINCT(categories_id),'+
									'		categories_path'+
									'	FROM '+
									'		`PREFIX_categories`,'+
									'		`PREFIX_altlang`'+
									'	where '+
									'		altlang_id_to in ( '+aCategoryID+' ) and '+
									'		(`categories_id` = altlang_id_from)'+
									'	order by'+
									'		categories_id asc'
									]);

				if(!anArrayResults)
					anArrayResults = [];

				var row;
				for(var i=0;row = this.DBRDF.fetchObjects(query);i++)
				{
					anArrayResults.push(row.categories_id);
				}
				return anArrayResults;
			}
	return null;

}).apply(ODPExtension);
