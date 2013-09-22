(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

			this.rdfParser = function()
			{
				while(true)
				{
					var folder = this.fileAskUserFolderSelect(this.getString('rdf.please.select.the.directory.were.the.RDF.files.uncompressed.resides'));
					if(!folder)
						return;

					var checkFiles = [];

					if(!this.fileDame(folder.file.path+'/categories.txt').exists())
						checkFiles[checkFiles.length] = 'categories.txt';
					if(!this.fileDame(folder.file.path+'/ad-structure.rdf.u8').exists())
						checkFiles[checkFiles.length] = 'ad-structure.rdf.u8';
					if(!this.fileDame(folder.file.path+'/kt-structure.rdf.u8').exists())
						checkFiles[checkFiles.length] = 'kt-structure.rdf.u8';
					if(!this.fileDame(folder.file.path+'/structure.rdf.u8').exists())
						checkFiles[checkFiles.length] = 'structure.rdf.u8';
					if(checkFiles.length > 0)
					{
						this.alert(this.getString('rdf.required.files.missing').replace('{FILES}', checkFiles.join(', ')));
					}
					else
					{
						break;
					}
				}

				if(this.confirm(this.getString('rdf.processing.please.dont.touch.your.browser')))
				{
					this.rdfParserStarted = (new Date().toLocaleString());
					//checks if required files are in place
					//odpParser
					Components.classes['@particle.universe.tito/ODPParser;2']
											.getService().wrappedJSObject
											.parse(
												 	this.pathSanitize(folder.file.path+'/'),//folder were *.rdf.u8 resides
													this.pathSanitize(this.extensionDirectory().path+'/RDF.sqlite')//database SQLIte file
												);
				}
			}
			this.rdfParserComplete = function()
			{
				this.notifyTabs(
								this.getString('rdf.processing.completed').replace('{END}',
																				  (new Date().toLocaleString())
																				  )
																		.replace('{START}',  this.rdfParserStarted)
								);
				this.windowGetAttention();//flash the window in the taskbar
			}
	return null;

}).apply(ODPExtension);
