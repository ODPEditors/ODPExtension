(function()
{
	
	//handle the update of the categories.txt database if needed
	this.categoriesTXTUpdate = function(forceUpdate)
	{
		//lock this function, this will avoid problems with the unintentional "double click" on the update button
		if(!this.shared.categories.txt.lock)
		{
			this.shared.categories.txt.lock = true;
			
			//the user forced an update on the categories.txt database
			if(forceUpdate)
			{
				this.categoriesTXTUpdateDownload();
			}
			else
			{
				//take a look into the header "date" of the file, to see if we need an update
				var Requester = new XMLHttpRequest();
					Requester.onerror = function()
					{
						ODPExtension.shared.categories.txt.lock = false;
					};
					Requester.onload = function()
					{
						//if fails don't do nothing
						if(Requester.status != '200')
						{
							ODPExtension.shared.categories.txt.lock = false;
						}
						else
						{
							var aDate = Requester.getResponseHeader('Last-Modified');
								if(aDate == '')
									aDate = Requester.getResponseHeader('last-modified');
							
							//yay an update!
							if(aDate != '' && aDate != ODPExtension.preferenceGet('locked.advanced.urls.categories.txt.last.update'))
								ODPExtension.categoriesTXTUpdateDownload(aDate);
							else
								ODPExtension.shared.categories.txt.lock = false;
						}
					};
					if(this.preferenceGet('advanced.urls.categories.txt') != '')
					{
						Requester.open("HEAD", this.preferenceGet('advanced.urls.categories.txt'), true);
						Requester.setRequestHeader("Cache-Control", "no-cache");
						Requester.setRequestHeader("Pragma", "no-cache");
						Requester.send(null);
					}
					else
					{
						this.shared.categories.txt.lock = false;
					}
			}
		}
	}

	return null;

}).apply(ODPExtension);
