(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			//opens a connection to the RDF SQLite database
			
			this.rdfOpen = function()
			{
				if(!this.DBRDF)
				{
					this.DBRDF = this.databaseGet('RDF');
					//getting the last and previous RDF database
						var tables = this.DBRDF.getTables();
						var prefix = [];
						for(var id in tables)
						{
							if(/[0-9]{8}/.test(tables[id]))
							{
								prefix[prefix.length] = tables[id].split('_')[0];
							}
						}
						prefix = this.arrayUnique(prefix);
						prefix.sort(this.sortLocale);
						this.rdfCurrentData = prefix.pop();
						this.rdfPreviousData =  prefix.pop();
					
					this.DBRDF.setPrefix(this.rdfCurrentData);
					this.DBRDF.create(<sql>PRAGMA temp_store = 2</sql>);
					this.DBRDF.create(<sql>PRAGMA journal_mode = memory</sql>);
				}
			}
			this.rdfClose = function()
			{
				this.DBRDF.close();
				this.DBRDF = false;
			}
	return null;

}).apply(ODPExtension);
