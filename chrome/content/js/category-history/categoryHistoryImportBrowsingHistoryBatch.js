(function()
{
		var debugingThisFile = false;//sets debuging on/off for this JavaScript file

		//bacth process to send categories to the category history database
		this.categoryHistoryImportBrowsingHistoryBatch = function()
		{
			if(this.fileExists('temp.category.history.txt'))
			{
				var progress = this.progress('importing.sites');

					if(!this.categoryHistoryImportBrowsingHistoryBatchInterval)
					{
						//we need to start the importing of sites
						this.categoryHistoryImportBrowsingHistoryBatchSites = this.fileRead('temp.category.history.txt').split('//__new_line_separator_//\n');

						this.categoryHistoryImportBrowsingHistoryBatchInterval = setInterval(function(){ODPExtension.categoryHistoryImportBrowsingHistoryBatch();}, 2500);
					}

				//check if the process finished

					if(this.categoryHistoryImportBrowsingHistoryBatchSites.length < 1)
					{
						clearInterval(this.categoryHistoryImportBrowsingHistoryBatchInterval);
						this.fileRemove('temp.category.history.txt');
						this.notifyTab('Sorry for disturbing.. but your entire category history was sucessfully imported to the "Category History" database!, you don\'t need to run this process again. Happy editing!');
						return;
					}

				//insert the site

					var site = this.categoryHistoryImportBrowsingHistoryBatchSites.pop().split('//__separator_//');

					//this.dump(site);
					if(site.length != 3){}
					else
						this.categoryHistoryInsert(site[0], site[1], site[2]);

					progress.done++;

				//every x amount we save the state to the file

					if(progress.done % 60 == 0)
					{
						this.fileWrite('temp.category.history.txt', this.categoryHistoryImportBrowsingHistoryBatchSites.join('//__new_line_separator_//\n'));
					}
			}
		}
	return null;

}).apply(ODPExtension);
