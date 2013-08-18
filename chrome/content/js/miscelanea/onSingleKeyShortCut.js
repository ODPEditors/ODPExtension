(function()
{
	//executes an action with the press of a key
	this.onSingleKeyShortCut = function(aKey, aCategories)
	{
		//this.dump(aKey);

		if(aCategories.length > 1)
			var inNewTab = true;
		else
			var inNewTab = false;

		for(var id in aCategories)
		{
			var aCategory = aCategories[id];
			switch(aKey)
			{
				case 97 : //A - altlangs
				{
					this.openURL('http://www.dmoz.org/editors/editcat/editrelation?cat='+this.encodeUTF8(aCategory+'/')+'&type=altlang', inNewTab);break;
				}
				case 99 : //C - copy
				{
					this.copyToClipboard(aCategories.join('/\n')+'/');break;return;
				}
				case 100 : //D - description
				{
					this.openURL('http://www.dmoz.org/editors/editcat/desc?cat='+this.encodeUTF8(aCategory+'/'), inNewTab);break;
				}
				case 101 : //E - edit cat
				{
					this.openURL(this.categoryGetURLEdit(aCategory), inNewTab);break;
				}
				case 102 : //F - Frog
				{
					var aTop = aCategory.split('/');
					if(aTop.length > 3)
						aTop = aTop[0]+'/'+aTop[1]+'/'+aTop[2]+'/'+aTop[3];
					else if(aTop.length > 2)
						aTop = aTop[0]+'/'+aTop[1]+'/'+aTop[2];
					else if(aTop.length > 1)
						aTop = aTop[0]+'/'+aTop[1];
					else
						aTop = aTop[0];

					this.openURL('http://pmoz.info/qc/scansets.php5?branch='+this.plantRob(aTop), inNewTab);
					break;
				}
				case 104 : //H - hyper-links
				{
					if(!this.fileExists('RDF.sqlite'))
					{
						if(this.confirm(this.getString('rdf.there.is.no.database.based.on.rdf.data')))
						{
							this.rdfParser();
							return;
						}
					}
					else
					{
						this.rdfFindAltlangsToHereToAny(aCategory+'/');
						this.rdfFindRelatedToHereToAny(aCategory+'/');
						this.rdfFindLinksToHereToAny(aCategory+'/');
					}
					break;
				}
				case 107 : //K - find subcategory
				{
					var searchFor;
					if( (searchFor = this.prompt(this.getString('search.ellipsis')) ) != '')
						this.categoryFinderQuery(aCategory+'/ '+searchFor+' ', null, aCategory);
					break;
				}
				case 108 : //L - logs
				{
					this.openURL('http://www.dmoz.org/editors/profile/view?type=editdetail&editor=&cat='+this.encodeUTF8(aCategory+'/'), inNewTab);break;
				}
				case 109 : //M - mozilla
				{
					this.openURL('http://www.dmoz.org/editors/editcat/editImage?cat='+this.encodeUTF8(aCategory+'/')+'&flag='+this.encodeUTF8('/'), inNewTab);break;
				}
				case 110 : //N - new subcat
				{
					this.openURL('http://www.dmoz.org/editors/editcat/new?cat='+this.encodeUTF8(aCategory+'/'), inNewTab);break;
				}
				case 111 : //O - open
				{
					this.openURL(this.categoryGetURLPrivate(aCategory), inNewTab);break;
				}
				case 112 : //P - publish
				{
					this.openURL('http://www.dmoz.org/editors/pub.cgi?cat='+this.encodeUTF8(aCategory+'/'), inNewTab);break;
				}
				case 114 : //R - related
				{
					this.openURL('http://www.dmoz.org/editors/editcat/editrelation?cat='+this.encodeUTF8(aCategory+'/')+'&type=related', inNewTab);break;
				}
				case 115 : //S - sysmlinks add
				{
					this.openURL('http://www.dmoz.org/editors/editcat/addrelation?cat='+this.encodeUTF8(aCategory+'/')+'&type=symbolic', inNewTab);break;
				}
				case 117 : //U - unreview
				{
					this.openURL('http://www.dmoz.org/editors/editunrev/listurl?cat='+this.encodeUTF8(aCategory+'/')+'#unrevedit', inNewTab);break;
				}
				case 118 : //V - subcategories
				{
					this.categoryFinderQuery(aCategory+'/', null, aCategory);break;
				}
				case 119 : //W - worllinkerate
				{
					this.openURL('http://odp.rpfuller.com/worldlinkerator/worldlinkerator.cgi?cat='+this.encodeUTF8(aCategory+'/')+'&server=dmoz8080', inNewTab);break;
				}
				case 120 : //X - related non reciprocal
				{
					if(!this.fileExists('RDF.sqlite'))
					{
						if(this.confirm(this.getString('rdf.there.is.no.database.based.on.rdf.data')))
						{
							this.rdfParser();
							return;
						}
					}
					else
					{

						this.rdfFindAltlangsNonReciprocal(aCategory+'/');break;
					}
				}
			}
		}
	}
	return null;

}).apply(ODPExtension);
