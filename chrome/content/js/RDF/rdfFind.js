(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfFind = function(aQuery)
			{
				while(true)
				{
					var aFile = this.fileAskUserFileOpen('', 'rdf.u8');
					if(!aFile)
						return;
					aFile = aFile.file.path;
					
					var checkFiles = [];
					
					//parsing only allowed on *.content.rdf.u8 and *.structure.rdf.u8
					if(
					   	!/structure\.rdf\.u8$/.test(aFile) && 
					   	!/content\.rdf\.u8$/.test(aFile)
					)
					{
						checkFiles[checkFiles.length] = 'structure.rdf.u8';
						checkFiles[checkFiles.length] = 'content.rdf.u8';
					}

					if(checkFiles.length > 0)
					{
						this.alert(this.getString('rdf.required.files.missing').replace('{FILES}', checkFiles.join(', ')));
					}
					else
					{
						break;
					}
				}

			//odpParser
				this.alert(this.getString('please.wait'));

				var results = Components.classes['@particle.universe.tito/ODPParser;2']
										.getService().wrappedJSObject
										.find(aFile, aQuery);

				//sets msg
				var aMsg = 'Results for search "{QUERY}" on file "{FILE}" ({RESULTS})';//informative msg and title of document
					aMsg = aMsg.replace('{QUERY}', aQuery).replace('{RESULTS}', results.count).replace('{FILE}', aFile);

				//display results
				if(results.count>0)
					this.tabOpen(this.fileCreateTemporal('RDF.xml', aMsg, results.data), true);
				else
					this.notifyTabs(aMsg, 8);

				this.windowGetAttention();
			}
	return null;

}).apply(ODPExtension);
