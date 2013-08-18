(function()
{
	
	//searchs in the categories.txt database
	this.categoriesTXTQuery = function(aQuery, aDatabase, aCategory, aSearchEngineSearch)
	{
		if(!aQuery || aQuery=='' || !this.categoriesTXTRequired())
			return;
			
		//var queryHash = this.sha256(aQuery+'_-_'+aDatabase+'_-_'+aCategory);//for caching results but they are fast
		//this.dump('categoriesTXTQuery:aQuery:'+aQuery+':'+aDatabase+':'+aCategory);
		//GETTING THE DATABASES
		var databases = this.shared.categories.txt.databases;
		var database = [];

		if(!aCategory){}
		else
			aDatabase = this.categoriesTXTGetDatabaseNameFromCategory(aCategory);
		//this.dump('la database:'+aDatabase);
		//CUSTOM SEARCHES
		if(aDatabase== '' || aDatabase== 'all' || aDatabase== 'top' || aDatabase== 'regional' || aDatabase== 'world')
		{
			if(aDatabase=='all' || aDatabase=='')
			{
				database = databases;
			}
			else 
			{
				for(var id in databases)
				{
					if(aDatabase == 'top' && databases[id].indexOf('World') == -1 && databases[id].indexOf('Regional') == -1)
						database[database.length] = databases[id];
					else if(aDatabase == 'regional' && databases[id].indexOf('Regional') === 0)
						database[database.length] = databases[id];
					else if(aDatabase == 'world' &&  databases[id].indexOf('World') === 0)
						database[database.length] = databases[id];
				}	
			}
		}
		else
		{
			//SELECTED WORLD-LANG- this will look into all  WORLD-LANG subcategories
			if(/\-\.txt$/.test(aDatabase))
			{
				aDatabase = aDatabase.replace('.txt', '');
				for(var id in databases)
				{
					if(databases[id].indexOf(aDatabase) === 0)
						database[database.length] = databases[id];
				}
			}
			//SELECTED A "FIXED" CATEGORY
			else
			{
				database[database.length] = aDatabase;
			}
		}
		

		//SEARCHING
		var aCategories;
		var results = {};
			results.count = 0;
			results.query = aQuery;
			results.categories = [];
			results.databases = database;
			
		if(!aSearchEngineSearch)
		{
			aQuery = this.trim(aQuery).replace(/ /g, '_');
	
			for(var id in database)
			{
				aCategories = this.fileRead('categories.txt/'+database[id]).split('\n');
				//this.dump('leyendo archivo '+'categories.txt/'+database[id]);
				for(var i in aCategories)
				{
					if(this.match(aCategories[i], aQuery))
					{
						results.categories[results.count] = aCategories[i];
						results.count++;
					}
				}
			}
		}
		else
		{
			aQuery = this.trim(aQuery).replace(/_/g, ' ');
	
			for(var id in database)
			{
				aCategories = this.fileRead('categories.txt/'+database[id]).split('\n');
				//this.dump('leyendo archivo '+'categories.txt/'+database[id]);
				for(var i in aCategories)
				{
					if(this.searchEngineSearch(aQuery, aCategories[i].replace(/_/g, ' ').replace(/-/g, ' ') ))
					{
						results.categories[results.count] = aCategories[i];
						results.count++;
					}
				}
			}
		}
		return results;
	}

	return null;

}).apply(ODPExtension);
