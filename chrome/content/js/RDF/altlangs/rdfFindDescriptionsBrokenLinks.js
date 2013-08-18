(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFindDescriptionsBrokenLinks = function(aCategory)
			{
				this.rdfOpen();//opens a connection to the RDF SQLite database.

				var aMsg = 'Categories with broken or external links in descriptions [{CATEGORY}] ({RESULTS}) ';//informative msg and title of document

				//sql query
				var query = this.DBRDF.query(<sql>
											 	SELECT
													categories_path
												FROM
													`PREFIX_categories`

											</sql>);

				var categories = [];
				for(var results = 0;row = this.DBRDF.fetchObjects(query);results++)
				{
					categories.push(row.categories_path);
				}

				//sql query
				var query = this.DBRDF.query(<sql>
											 	SELECT
													*
												FROM
													`PREFIX_categories`
											where categories_description like "%href%"
												order by
													categories_id asc
											</sql>);

				var row, rows = [], aData = [], hrefs = [];

				for(var results = 0;row = this.DBRDF.fetchObjects(query);results++)
				{
					var found = false;

					var links = this.select('a', row.categories_description, this.encodeURI('http://www.dmoz.org/'+row.categories_path))

					for(var id in links){
						var category  = this.decodeUTF8(links[id].getAttribute('href') || '').replace('http://www.dmoz.org/', '').replace(/\/+$/, '')+'/'
						if(categories.indexOf(category) !== -1){}
						else{

							if(!found){
								found = true;
								var subtop = this.categoryGetSubTop(row.categories_path);
								if(!aData[subtop]){
									aData[subtop] = {}
									aData[subtop].str = '';
									aData[subtop].count = 0;
								}
								aData[subtop].count++;
								aData[subtop].str += '[<a href="http://www.dmoz.org/editors/editcat/desc?cat='+this.encodeUTF8(row.categories_path)+'">edit</a>] '+row.categories_path;
								aData[subtop].str += this.__NEW_LINE__;
								aData[subtop].str += this.__NEW_LINE__;
							}
							aData[subtop].str += "\t"+this.htmlSpecialCharsEncode(links[id].getAttribute('href'));
							aData[subtop].str += this.__NEW_LINE__;
						}
					}
					if(found)
						aData[subtop].str += this.__NEW_LINE__;
					//aData += row.categories_description;
				}

				//display results
				if(results>0)
				{
					for(var id in aData)
						this.tabOpen(this.fileCreateTemporal(
											id+'.html',
											aMsg.replace('{CATEGORY}', id).replace('{RESULTS}', aData[id].count),
											'<div class="header">'+aMsg.replace('{CATEGORY}', id).replace('{RESULTS}', aData[id].count)+'</div>'+
											'<pre style="background-color:white !important;padding:2px;">'
												+aData[id].str+
											'</pre>'
										 )
						 , true);
				}
				else
					this.notifyTab(aMsg, 8);

			  this.rdfClose();
			}

	return null;

}).apply(ODPExtension);
