(function() {

	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	//this fills the "edit url" form accourdly to user input which is semi-automated via the ODP Notes toolbar.
	//basically receive the action (aType) a note (aODPNote) the doc and a category optionally (toCategory) if the user want to copy or move the site.

	this.odpURLNotesApply = function(aEvent, aType, aODPNote, aDoc, toCategory, closeTheTab) {
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
				(function(aDoc){
					setTimeout(function() {
						ODPExtension.odpURLNotesApply(aEvent, aType, aODPNote, aDoc, toCategory, true);
					}, id * 830);
				})(documents[id]);
			}
			return;
		}

		//applying a URL Note to a document

		var aForm = this.editingFormURLExists(aDoc);

		if (!aForm)
			return;

		if (aType == 'next') //next site, skip or cancel button
		{
			//this.dump('user wants to skip to next site');
			var found = false;

			//looking for next

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.getAttribute('accesskey') == '>') {
					aElement.click();
					found = true;
					break;
				}
			}

			//if not looking for cancel
			if (!found) {
				for (var i = 0; i < aForm.elements.length; i++) {
					var aElement = aForm.elements[i];
					if (aElement.getAttribute('accesskey') == 'c') {
						aElement.click();
						break;
					}
				}
			}

			return;

		} else if (aType == 'reset') //reset the form
		{
			aForm.reset();

			return;

		} else if (aType == 'copy.unreview' || aType == 'copy.publish') //copy a site to unreview or published
		{

			//listed in
			if (aODPNote.indexOf('{ALREADY_IN}') != -1) {
				var listed_in_tmp = [];
				for (var i = 4; i < aDoc.getElementsByTagName("a").length; i++) {
					if (aDoc.getElementsByTagName("a").item(i).hasAttribute('href')) {
						var link_href = aDoc.getElementsByTagName("a").item(i).getAttribute('href');
						if (
							link_href.indexOf('import') != -1 &&
							link_href.indexOf('cat=') != -1 &&
							link_href.indexOf('url=') != -1) {
							var checkSkip = this.categoryGetFromURL(link_href.replace(/^.*import=([^&]*)&?.*$/i, "$1"));
							if (checkSkip.indexOf('Bookmarks/') === 0 || checkSkip.indexOf('Test/') === 0) {} else
								listed_in_tmp[listed_in_tmp.length] = checkSkip;
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



			try {
				var url = this.getElementNamed('newurl', aDoc).value; //new site, not added yet.
			} catch (e) {
				var url = this.getElementNamed('url', aDoc).value; ///unreview or editing
			}

			var typecat = this.categoryGetFromURL(this.getElementNamed('typecat', aDoc).value);
			var selcat = this.getElementNamed('newcat', aDoc).value;
			var cat = this.getElementNamed('cat', aDoc).value;

			if (aType == 'move.unreview' || aType == 'move.publish')
				this.getElementNamed('typecat', aDoc).value = toCategory;

			if (this.preferenceGet('url.notes.form.submit') &&
				this.preferenceGet('url.notes.form.submit.confirm')) {
				var focus = this.getElementNamed('newurl', aDoc) || this.getElementNamed('url', aDoc)
				this.focusElement(focus);
				window.content.scroll(0, 5000);
				focus.blur(); //if the element is already focused focus() dont scroll to the element.
				focus.focus();
			}

			try {
				var title = this.getElementNamed('newtitle', aDoc).value; //new site, not added yet.
			} catch (e) {
				var title = this.getElementNamed('title', aDoc).value; ///unreview or editing
			}

			try {
				var mediadate = this.getElementNamed('newmediadate', aDoc).value; //new site, not added yet.
			} catch (e) {
				var mediadate = this.getElementNamed('mediadate', aDoc).value; ///unreview or editing
			}

			try {
				var uksite = this.getElementNamed('newuksite', aDoc).checked; //new site, not added yet.
			} catch (e) {
				var uksite = this.getElementNamed('uksite', aDoc).checked; ///unreview or editing
			}
			if (uksite)
				uksite = 'on';

			//kids and teens stuff
			var kt = '';
			if (this.getElementNamed('newkids', aDoc) || this.getElementNamed('kids', aDoc)) {

				try {
					var kids = this.getElementNamed('newkids', aDoc).checked; //new site, not added yet.
				} catch (e) {
					var kids = this.getElementNamed('kids', aDoc).checked; ///unreview or editing
				}
				if (kids)
					kids = 'on';

				try {
					var teens = this.getElementNamed('newteens', aDoc).checked; //new site, not added yet.
				} catch (e) {
					var teens = this.getElementNamed('teens', aDoc).checked; ///unreview or editing
				}
				if (teens)
					teens = 'on';

				try {
					var mteens = this.getElementNamed('newmteens', aDoc).checked; //new site, not added yet.
				} catch (e) {
					var mteens = this.getElementNamed('mteens', aDoc).checked; ///unreview or editing
				}
				if (mteens)
					mteens = 'on';

				kt = '&kids=' + kids + '&teens=' + teens + '&mteens=' + mteens;
			}

			var contenttype = '';
			for (var i = 0; i < aDoc.getElementsByTagName("input").length; i++) {
				if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'newcontenttype' && aDoc.getElementsByTagName("input").item(i).checked == true)
					contenttype = aDoc.getElementsByTagName("input").item(i).value;
			}
			if (contenttype == '') {
				for (var i = 0; i < aDoc.getElementsByTagName("input").length; i++) {
					if (aDoc.getElementsByTagName("input").item(i).getAttribute('name') == 'contenttype' && aDoc.getElementsByTagName("input").item(i).checked == true)
						contenttype = aDoc.getElementsByTagName("input").item(i).value;
				}
			}

			try {
				var desc = this.getElementNamed('newdesc', aDoc).value; //new site, not added yet.
			} catch (e) {
				var desc = this.getElementNamed('desc', aDoc).value; ///unreview or editing
			}

			//new url validation
			if (url == '' || url == 'http://') {
				this.alert(this.getString('url.notes.new.url.is.empty'));
				return;
			}

			//new url
			if (aODPNote.indexOf('{NEW_URL}') != -1) {
				aODPNote = aODPNote.split('{NEW_URL}').join(url);
			}
			//new cat
			if (aODPNote.indexOf('{NEW_CAT}') != -1) {
				aODPNote = aODPNote.split('{NEW_CAT}').join(toCategory);
			}
			//old url
			if (aODPNote.indexOf('{URL}') != -1) {
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

			//put in unrev or publish the site
			if (aType == 'copy.unreview')
				var operation = 'unrev';
			else
				var operation = 'update';

			//copy site
			var aCopy = 'http://www.dmoz.org/editors/editurl/doadd?url=' + this.encodeUTF8(url) + '&typecat=' + this.encodeUTF8(toCategory) + '&title=' + this.encodeUTF8(title) + '&submit=' + this.encodeUTF8('Update') + '&operation=' + this.encodeUTF8(operation) + '&newnote=' + this.encodeUTF8(aODPNote) + '&newcat=&mediadate=' + this.encodeUTF8(mediadate) + '&desc=' + this.encodeUTF8(desc) + '&contenttype=' + this.encodeUTF8(contenttype) + '&cat=' + this.encodeUTF8(toCategory) + '&uksite=' + this.encodeUTF8(uksite) + kt;

			if (this.preferenceGet('url.notes.form.submit.confirm')) {
				if (this.confirm(this.getString('url.notes.want.copy.site.now'))) {
					this.tabOpen(aCopy, true);
				}
			} else {
				this.tabOpen(aCopy, true);
			}
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
								listed_in_tmp[listed_in_tmp.length] = checkSkip;
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

			var url = this.getElementNamed('url', aDoc).value;
			try {
				var newurl = this.getElementNamed('newurl', aDoc).value;
			} catch (e) {
				var newurl = url;
			}
			var cat = this.getElementNamed('cat', aDoc).value;
			var typecat = this.categoryGetFromURL(this.getElementNamed('typecat', aDoc).value);
			var selcat = this.getElementNamed('newcat', aDoc).value;

			if (aType == 'move.unreview' || aType == 'move.publish')
				this.getElementNamed('typecat', aDoc).value = toCategory;


			if (this.preferenceGet('url.notes.form.submit') &&
				this.preferenceGet('url.notes.form.submit.confirm')) {
				var focus = this.getElementNamed('newurl', aDoc) || this.getElementNamed('url', aDoc)
				this.focusElement(focus);
				window.content.scroll(0, 5000);
				focus.blur(); //if the element is already focused focus() dont scroll to the element.
				focus.focus();
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
			this.getElementNamed('newnote', aDoc).value = aODPNote;

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
			else if (aType == 'delete')
				var radioValue = 'deny,delete';
			else
				this.alert('exception aType:' + aType);

			for (var i = 0; i < aForm.elements.length; i++) {
				var aElement = aForm.elements[i];
				if (aElement.name == 'operation') {
					if (aElement.type == 'hidden') {} else {
						if ((aElement.value == 'update' || aElement.value == 'grant') && radioValue == 'update,grant') {
							aElement.click();
							break;
						} else if ((aElement.value == 'deny' || aElement.value == 'delete') && radioValue == 'deny,delete') {
							this.notifyTab('Site marked for deletion', 7)
							aElement.click();
							break;
						} else if (aElement.value == 'unrev' && radioValue == 'unrev') {
							aElement.click();
							break;
						}
					}
				}
			}

			if ( !! closeTheTab) {
				var aTab = this.tabGetFromDocument(aDoc);
				var newTabBrowser = this.browserGetFromTab(aTab);
				newTabBrowser.addEventListener("DOMContentLoaded", function(aEvent) {
					if (ODPExtension.documentGetFromTab(aTab).body.innerHTML.indexOf('history.back') != -1) {} else {
						ODPExtension.tabClose(aTab);
					}
				}, false);
			}
			//submitir
			var submitElement = false;
			if (this.preferenceGet('url.notes.form.submit')) {
				var found = false;
				for (var i = 0; i < aForm.elements.length; i++) {
					var Element = aForm.elements[i];
					if (Element.type == 'submit') {
						if (Element.getAttribute('accesskey') == 'b') { //update + back
							submitElement = Element;
							found = true;
						}
					}
				}
				if (!found) {
					for (var i = 0; i < aForm.elements.length; i++) {
						var Element = aForm.elements[i];
						if (Element.type == 'submit') {
							if (Element.getAttribute('accesskey') == 'n') {
								submitElement = Element;
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