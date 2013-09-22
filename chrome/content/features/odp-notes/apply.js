(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//this fills the "edit url" form accourdly to user input which is semi-automated via the ODP Notes toolbar.
	//basically receive the action (aType) a note (aODPNote) the doc and a category optionally (toCategory) if the user want to copy or move the site.

	this.odpURLNotesApply = function(aEvent, aType, aODPNote, aDoc, toCategory) {
		//this check if the user wants to move or copy the site, then ask for a category were to move/copy the site.

		if ((aType.indexOf('move.') != -1 || aType.indexOf('copy.') != -1) && !toCategory) {
			//this.dump('simulating click , user wants to move or copy the site, then ask for a category were to move/copy the site.');
			//simulate click
			var event = this.create('menuitem');

			if (aType == 'move.publish')
				event.setAttribute('action', 'url-notes-move-publish');
			else if (aType == 'move.unreview')
				event.setAttribute('action', 'url-notes-move-unreview');
			else if (aType == 'copy.publish')
				event.setAttribute('action', 'url-notes-copy-publish');
			else if (aType == 'copy.unreview')
				event.setAttribute('action', 'url-notes-copy-unreview');

			event.setAttribute('secondary', aODPNote);
			event.originalTarget = event;

			this.fromCategoryClickType = 'single';
			this.fromCategorySelectedCategory = '';
			this.fromCategorySelectedCategories = [];
			this.fromCategoryClick(event);

			return;
		}

		//if the URL Note is applied to the selected tabs (Multiple Tab Handler)

		if (this.odpURLNotesMultipleTabHandlerSelectedDocuments.length > 0) {
			//this.dump('there is odpURLNotesMultipleTabHandlerSelectedDocuments');
			var documents = this.odpURLNotesMultipleTabHandlerSelectedDocuments;
			this.odpURLNotesMultipleTabHandlerSelectedDocuments = [];
			for (var id in documents) {
				//this.dump('odpURLNotesApply to document '+id);
				this.odpURLNotesApply(aEvent, aType, aODPNote, documents[id], toCategory);
			}
			return;
		}

		//applying a URL Note to a document

		if (!aDoc.forms || !aDoc.forms[1])
			return;

		var aForm = aDoc.forms[1].action == 'http://www.dmoz.org/editors/editunrev/resolveurlerror' ? aDoc.forms[2] : aDoc.forms[1];


		if (aType == 'next') //next site, skip or cancel button
		{
			//this.dump('user wants to skip to next site');
			var found = false;

			//looking for next

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				//if(aElement.name =='submit')
				//{
				if (aElement.getAttribute('accesskey') == '>') {
					//this.dump('element '+aElement.getAttribute('value')+' found');
					aElement.click();
					found = true;
					break;
				}
				//}
			}

			//if not looking for cancel

			if (!found) {
				//this.dump('element next was not found, looking for cancel');
				for (var i = 0; i < aForm.elements.length; i++) {
					var aElement = aForm.elements[i];
					//if(aElement.name =='submit')
					//{
					if (aElement.getAttribute('accesskey') == 'c') {
						// this.dump('element '+aElement.getAttribute('value')+' found');
						aElement.click();
						break;
					}
					//}
				}
			}

			//this.dump('submitting form');
			//return;

			//aForm.submit();

			return;
		} else if (aType == 'reset') //reset the form
		{
			aForm.reset();

			return;
		} else if (aType == 'copy.unreview' || aType == 'copy.publish') //copy a site to unreview or published
		{
			alert('Sorry, currently, the feature "copy site" is disabled due to an outdated implementation.');
			/*
						//copy site data and submit to addurl2.cgi
						//vars to replace
							//listed in
								if(aODPNote.indexOf('{ALREADY_IN}') != -1)
								{
									var listed_in_tmp = [];
									var count =0;
									for(var i = 4; i < aDoc.getElementsByTagName("a").length; i++)
									{
										if(aDoc.getElementsByTagName("a").item(i).hasAttribute('href'))
										{
											var link_href = aDoc.getElementsByTagName("a").item(i).getAttribute('href');
											if (
													link_href.indexOf('import') != -1 &&
													link_href.indexOf('cat=') != -1 &&
													link_href.indexOf('url=') != -1
												)
											{
												var checkSkip = this.categoryGetFromURL(link_href.replace(/^.*import=([^&]*)&?.*$/i, "$1"));
												if(checkSkip.indexOf('Bookmarks/') === 0 || checkSkip.indexOf('Test/') === 0){}
												else
													listed_in_tmp[count++] = checkSkip;
											}
										}
									}
									var listed_in = listed_in_tmp.join(', ');

									if(listed_in=='')
									{
										this.alert(this.getString('url.notes.already.in.data.was.not.found'));
										return;
									}
									aODPNote = aODPNote.split('{ALREADY_IN}').join(listed_in);
								}
							//inputs types hidden, text, radio, checkbox
								var uksite='';
								var type='';
								var cat='';
								for(var i = 0; i < aDoc.getElementsByTagName("input").length; i++)
								{
									if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'newurl')
									{
										if(this.preferenceGet('url.notes.form.submit.confirm'))
										{
											this.focusElement(aDoc.getElementsByTagName("input").item(i));
											window.content.scroll(0,5000);
											aDoc.getElementsByTagName("input").item(i).blur();//if the element is already focused focus() dont scroll to the element.
											aDoc.getElementsByTagName("input").item(i).focus();
										}
										var newurl = aDoc.getElementsByTagName("input").item(i).value;
									}
									else if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'newtitle')
										var newtitle = aDoc.getElementsByTagName("input").item(i).value;
									else if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'date')
										var date = aDoc.getElementsByTagName("input").item(i).value;
									else if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'locale')
										var locale = aDoc.getElementsByTagName("input").item(i).value;
									else if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'typecat')
									{
										if(toCategory != null && toCategory != '')
											var typecat = toCategory;
										else
											var typecat = aDoc.getElementsByTagName("input").item(i).value;
									}

									if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'uksite' && aDoc.getElementsByTagName("input").item(i).checked == true)
										uksite ='on';
									if(aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'type' && aDoc.getElementsByTagName("input").item(i).checked == true)
										type = aDoc.getElementsByTagName("input").item(i).value;
								}
							//selecat & new note
								for(var i = 0; i < aForm.elements.length; i++)
								{
									var aElement = aForm.elements[i];
									if(aElement.name =='selcat')
										var selcat = aElement.options[aElement.selectedIndex].value;
									else if(aElement.name=='newnote')
										var newnote = aElement.value;
									else if(aElement.name=='newdesc')
										var newdesc = aElement.value;
								}

							//new url validation
								if(newurl=='' || newurl=='http://')
								{
									this.alert(this.getString('url.notes.new.url.is.empty'));
									return;
								}

							//setting new cat
								selcat = this.categoryGetFromURL(selcat);
								typecat = this.categoryGetFromURL(typecat);

								if(toCategory  != null && toCategory != '')
									cat = this.categoryGetFromURL(toCategory);
								else if(selcat!='')
									cat = selcat;
								else
									cat = typecat;
							//new url
								if(aODPNote.indexOf('{NEW_URL}') != -1)
								{
									aODPNote = aODPNote.split('{NEW_URL}').join(newurl);
								}
							//new cat
								if(aODPNote.indexOf('{NEW_CAT}') != -1)
								{
									aODPNote = aODPNote.split('{NEW_CAT}').join(toCategory);
								}
							//old url
								if(aODPNote.indexOf('{URL}') != -1)
								{
									aODPNote = aODPNote.split('{URL}').join(newurl);
								}
							//old cat
								if(aODPNote.indexOf('{CAT}') != -1)
								{
									if(cat == '' && typecat != '')
										aODPNote = aODPNote.split('{CAT}').join(typecat);
									else if(cat=='' && selcat != '')
										aODPNote = aODPNote.split('{CAT}').join(selcat);
									else
										aODPNote = aODPNote.split('{CAT}').join(cat);
								}
							//CLIPBOARD
								if(aODPNote.indexOf('{CLIPBOARD}') != -1)
								{
									var clipboard= this.getClipboard();
									if(!clipboard || clipboard=='')
										return;
									aODPNote = aODPNote.split('{CLIPBOARD}').join(clipboard);
								}

							//ASK
								if(aODPNote.indexOf('{ASK}') != -1)
								{
									var ask = this.prompt(this.getString('url.tools.wants.your.input'));
									if(ask != null && ask != '')
										aODPNote = aODPNote.split('{ASK}').join(ask);
									else
										return;
								}

						//apply note

							for(var i = 0; i < aForm.elements.length; i++)
							{
								var aElement = aForm.elements[i];
								if(aElement.name =='newnote')
								{
									aElement.value=aODPNote;
									newnote = aODPNote;
									break;
								}
							}


							//put in unrev or publish the site
								if(aType == 'copy.unreview')
									var omit = 'unrev';
								else
									var omit = 'no';

							//copy site
								var aCopy = 'http://www.dmoz.org/editors/addurl2.cgi?url=&ref=&locale='+this.encodeUTF8(locale)+'&omit='+this.encodeUTF8(omit)+'&submit=Update&date='+this.encodeUTF8(date)+'&uksite='+this.encodeUTF8(uksite)+'&type='+this.encodeUTF8(type)+'&cat='+this.encodeUTF8(cat)+'&newurl='+this.encodeUTF8(newurl)+'&selcat='+this.encodeUTF8(selcat)+'&typecat='+this.encodeUTF8(typecat)+'&newtitle='+this.encodeUTF8(newtitle)+'&newdesc='+this.encodeUTF8(newdesc)+'&newnote='+this.encodeUTF8(newnote);

								if(this.preferenceGet('url.notes.form.submit.confirm'))
								{
									if(this.confirm(this.getString('url.notes.want.copy.site.now')))
									{
										this.tabOpen(aCopy, true);
									}
								}
								else
									this.tabOpen(aCopy, true);*/
		} else {
			//move site or apply a normal note (update, unreview, delete)

			//vars to replace
			//listed in
			if (aODPNote.indexOf('{ALREADY_IN}') != -1) {
				var listed_in_tmp = [];
				var count = 0;
				for (var i = 4; i < aDoc.getElementsByTagName("a").length; i++) {
					if (aDoc.getElementsByTagName("a").item(i).hasAttribute('href')) {
						var link_href = aDoc.getElementsByTagName("a").item(i).getAttribute('href');
						if (
							link_href.indexOf('import') != -1 &&
							link_href.indexOf('cat=') != -1 &&
							link_href.indexOf('url=') != -1) {
							var checkSkip = this.categoryGetFromURL(link_href); //.replace(/^.*import=([^&]*)&?.*$/i, "$1")
							if (checkSkip.indexOf('Bookmarks/') === 0 || checkSkip.indexOf('Test/') === 0) {} else
								listed_in_tmp[count++] = checkSkip;
						}
					}
				}
				var listed_in = listed_in_tmp.join(', ');

				if (listed_in == '') {
					this.alert(this.getString('url.notes.already.in.data.was.not.found'));
					return;
				}
				aODPNote = aODPNote.split('{ALREADY_IN}').join(listed_in);
			}
			//this.dump('{ALREADY_IN} is '+listed_in);
			//inputs type hidden and type text
			for (var i = 0; i < aDoc.getElementsByTagName("input").length; i++) {
				if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'url') {
					var url = aDoc.getElementsByTagName("input").item(i).value;
					if (
						this.preferenceGet('url.notes.form.submit') &&
						this.preferenceGet('url.notes.form.submit.confirm') &&
						aDoc.getElementsByTagName("input").item(i).type != 'hidden') {
						this.focusElement(aDoc.getElementsByTagName("input").item(i));
						window.content.scroll(0, 5000);
						aDoc.getElementsByTagName("input").item(i).blur(); //if the element is already focused focus() dont scroll to the element.
						aDoc.getElementsByTagName("input").item(i).focus();
					}
				} else if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'cat')
					var cat = this.categoryGetFromURL(aDoc.getElementsByTagName("input").item(i).value);
				else if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'newurl') {
					if (
						this.preferenceGet('url.notes.form.submit') &&
						this.preferenceGet('url.notes.form.submit.confirm') &&
						aDoc.getElementsByTagName("input").item(i).type != 'hidden') {
						this.focusElement(aDoc.getElementsByTagName("input").item(i));
						window.content.scroll(0, 5000);
						aDoc.getElementsByTagName("input").item(i).blur(); //if the element is already focused focus() dont scroll to the element.
						aDoc.getElementsByTagName("input").item(i).focus();
					}
					var newurl = aDoc.getElementsByTagName("input").item(i).value;
				} else if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'typecat') {
					if (aType == 'move.unreview' || aType == 'move.publish')
						aDoc.getElementsByTagName("input").item(i).value = toCategory;
					var typecat = aDoc.getElementsByTagName("input").item(i).value;
					typecat = this.categoryGetFromURL(typecat);
					aDoc.getElementsByTagName("input").item(i).value = typecat;
				}
			}

			//this.dump('url is '+url);
			//this.dump('cat is '+cat);
			//this.dump('newurl is '+newurl);
			//this.dump('typecat is '+typecat);

			//selecat

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.id == 'selcat') {
					var selcat = this.categoryGetFromURL(aElement.options[aElement.selectedIndex].value);
					break;
				}
			}

			//stupid backend, lets build our own!!!!!!!!

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.name == 'desc' || aElement.name == 'newdesc') {
					aElement.value = aElement.value + ' ';
				}
			}

			//new url

			if (aODPNote.indexOf('{NEW_URL}') != -1) {
				if (url == newurl) {
					this.alert(this.getString('url.notes.new.url.is.same.as.url'));
					return;
				}
				if (newurl == '' || newurl == 'http://') {
					this.alert(this.getString('url.notes.new.url.is.empty'));
					return;
				}
				aODPNote = aODPNote.split('{NEW_URL}').join(newurl);
			}

			//new cat

			if (aODPNote.indexOf('{NEW_CAT}') != -1) {
				if ((selcat == '' || selcat == cat) && (typecat == cat || typecat == '')) {
					this.alert(this.getString('url.notes.new.cat.is.same.as.cat'));
					return;
				}
				if ((selcat != '' && selcat != cat) && (typecat != cat && typecat != '') && typecat != selcat) {
					this.alert(this.getString('url.notes.all.cats.was.changed'));
					return;
				} else {
					if (selcat == '' || selcat == cat) {
						aODPNote = aODPNote.split('{NEW_CAT}').join(typecat);
					} else {
						aODPNote = aODPNote.split('{NEW_CAT}').join(selcat);
					}
				}
			}

			//old url

			if (aODPNote.indexOf('{URL}') != -1) {
				if (url == '' && newurl != 'http://' && newurl != '')
					aODPNote = aODPNote.split('{URL}').join(newurl);
				else
					aODPNote = aODPNote.split('{URL}').join(url);
			}

			//old cat

			if (aODPNote.indexOf('{CAT}') != -1) {
				if (cat == '' && typecat != '')
					aODPNote = aODPNote.split('{CAT}').join(typecat);
				else if (cat == '' && selcat != '')
					aODPNote = aODPNote.split('{CAT}').join(selcat);
				else
					aODPNote = aODPNote.split('{CAT}').join(cat);
			}

			//CLIPBOARD

			if (aODPNote.indexOf('{CLIPBOARD}') != -1) {
				var clipboard = this.getClipboard();
				if (!clipboard || clipboard == '')
					return;
				aODPNote = aODPNote.split('{CLIPBOARD}').join(clipboard);
			}

			//ASK

			if (aODPNote.indexOf('{ASK}') != -1) {
				var ask = this.prompt(this.getString('url.tools.wants.your.input'));
				if (ask != null && ask != '')
					aODPNote = aODPNote.split('{ASK}').join(ask);
				else
					return;
			}

			//apply note

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.name == 'newnote') {
					aElement.value = aODPNote;
					break;
				}
			}

			//validation empty url

			if (this.preferenceGet('url.notes.form.submit')) {
				if (newurl == '' || newurl == 'http://') {
					this.alert(this.getString('url.notes.new.url.is.empty'));
					return;
				}
			}

			//change radio action

			if (aType == 'update' || aType == 'move.publish')
				var radioValue = 'update,grant';
			else if (aType == 'unreview' || aType == 'move.unreview')
				var radioValue = 'unrev';
			else
				var radioValue = 'deny,delete';


			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.name == 'operation') {
					if (aElement.type == 'hidden') {} else {
						if ((aElement.value == 'update' || aElement.value == 'grant') && radioValue == 'update,grant') {
							aElement.click();
							/*if(this.preferenceGet('url.notes.form.submit'))
												aElement.setAttribute('type','hidden');
											else
												aElement.checked=true;*/
						} else if ((aElement.value == 'deny' || aElement.value == 'delete') && radioValue == 'deny,delete') {
							aElement.click();
							//aElement.checked=false;
						} else if (aElement.value == 'unrev' && radioValue == 'unrev') {
							aElement.click();
						}
					}
				}
			}

			//submitir

			var submitElement = false;

			if (this.preferenceGet('url.notes.form.submit')) {
				var found = false;
				for (var i = 0; i < aForm.elements.length; i++) {
					var Element = aForm.elements[i];
					if (Element.type == 'submit') {
						if (Element.getAttribute('accesskey') == 'b') {
							submitElement = Element;
							found = true;
						} else {
							//Element.setAttribute('name','');
						}
					}
				}
				if (!found) {
					for (var i = 0; i < aForm.elements.length; i++) {
						var Element = aForm.elements[i];
						if (Element.type == 'submit') {
							if (Element.getAttribute('accesskey') == 'n') {
								submitElement = Element;
							} else {
								//Element.setAttribute('name','');
							}
						}
					}
				}
				if (this.preferenceGet('url.notes.form.submit.confirm')) {
					if (aType == 'move.unreview' || aType == 'move.publish') {
						if (this.confirm(this.getString('url.notes.want.move.site.now'))) {
							submitElement.click();
						} else {

							return;
						}
					} else {
						if (this.confirm(this.getString('url.notes.form.submit'))) {
							submitElement.click();
						} else {

							return;
						}
					}
				} else {
					submitElement.click();
				}
			}
			return;

		}
		return;

	}
	return null;

}).apply(ODPExtension);