(function()
{

	//downloads the categories.txt and sends the result to the process that will split that file into multiples files
	this.categoriesTXTUpdateDownload = function()
	{
		var progress = this.progress('local.category.finder');
			progress.reset();
			progress.done = '0%';
			progress.running = '100%';
			progress.message = this.getString('local.category.finder')+' : '+this.getString('progress.download');//%

		var Requester = new XMLHttpRequest();
			Requester.onprogress = function(aEvent)
			{
				if (aEvent.lengthComputable)
					  progress.done = Math.floor(100 * (aEvent.loaded / aEvent.total))+'%';
				else
					  progress.done = 'Server is not giving size information';

				 if(progress.done < 2)
					progress.done = '2%';
				progress.progress();
			}
			Requester.onload = function(aEvent)
			{
				if(
				   Requester.status != '200' ||
				   Requester.responseText == null ||
				   Requester.responseText == ''
				   )
				{
					progress.done = 'Error while reading categories.txt, server status = "'+Requester.status+'"';
					progress.progress();
					ODPExtension.shared.categories.txt.lock = false;
				}
				else
				{
					progress.done = '100%';
					progress.progress();

					if(Requester.responseText.indexOf('>') != -1)
					{
						//file contains html, let's dump some msg for users
						progress.done = 'The categories.txt file looks incomplete, will try again in another oportunity';
						progress.progress();
						ODPExtension.shared.categories.txt.lock = false;
						return;
					}
					var aDate = Requester.getResponseHeader('Last-Modified');
					if(aDate == '')
						aDate = Requester.getResponseHeader('last-modified');

					//trying to clean-up the memory of the requester
					ODPExtension.categoriesTXT = ODPExtension.string(Requester.responseText);
					ODPExtension.categoriesTXTDate = ODPExtension.string(aDate);

					setTimeout(function(){	ODPExtension.categoriesTXTUpdateProcess();}, 0);
				}
			};

			if(this.preferenceGet('advanced.urls.categories.txt') != '')
			{
				progress.progress();
				Requester.open("GET", this.preferenceGet('advanced.urls.categories.txt'), true);
				Requester.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
				Requester.send(null);
			}
			else
			{
				this.shared.categories.txt.lock = false;
			}
	}

	return null;

}).apply(ODPExtension);
