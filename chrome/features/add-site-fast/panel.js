(function () {

	//updates the content when switching tabs
	this.addListener('onLocationChangeNotDocumentLoad', function (aLocation) {
		ODPExtension.panelFastAddGetInformation();
	});

	this.addListener('onLocationChange', function (aLocation) {
		ODPExtension.panelFastAddGetInformation();
	});
	this.addListener('userInterfaceLoad', function (aEnabled) {
		ODPExtension.setAutocomplete(ODPExtension.getElement('panel-fast-add-category'));
	});

	this.panelFastAddGetInformation = function (aLocation) {
		if (this.preferenceGet('ui.fast.add.panel.closed') || !this.preferenceGet('enabled')) {
			this.panelFastAddShow(false);
		} else {
			var aDoc = this.documentGetFocused();

			if(document.commandDispatcher.focusedElement != this.getElement('panel-fast-add-url'))
				this.getElement('panel-fast-add-url').value = this.tabGetData('panel-fast-add-url') || this.documentGetLocation(aDoc)

			if(document.commandDispatcher.focusedElement != this.getElement('panel-fast-add-title'))
				this.getElement('panel-fast-add-title').value = this.tabGetData('panel-fast-add-title') || this.documentGetTitle(aDoc)

			if(document.commandDispatcher.focusedElement != this.getElement('panel-fast-add-description'))
				this.getElement('panel-fast-add-description').value = this.tabGetData('panel-fast-add-description') || this.documentGetMetaDescription(aDoc)

			if(document.commandDispatcher.focusedElement != this.getElement('panel-fast-add-category'))
				this.getElement('panel-fast-add-category').value = this.tabGetData('panel-fast-add-category') || lastCategory

			this.panelFastAddShow(true);
		}
	}

	var lastCategory = '';

	this.panelFastAddKeyPress = function (aElement, aEvent) {

		ODPExtension.tabSaveData(aElement.id, aElement.value)

		if (aEvent.keyCode == aEvent.DOM_VK_RETURN) {

			this.stopEvent(aEvent);

			switch (aEvent.currentTarget.id) {
			case 'ODPExtension-panel-fast-add-url':
				{
					this.getElement('panel-fast-add-title').focus()
					break;
				}
			case 'ODPExtension-panel-fast-add-title':
				{
					this.getElement('panel-fast-add-description').focus()
					break;
				}
			case 'ODPExtension-panel-fast-add-description':
				{
					this.getElement('panel-fast-add-category').focus()
					break;
				}
			case 'ODPExtension-panel-fast-add-category':
				{
					this.saveAutocomplete(this.getElement('panel-fast-add-category'));

					var url = String(this.getElement('panel-fast-add-url').value).trim()
					var title = String(this.getElement('panel-fast-add-title').value).trim()
					var description = String(this.getElement('panel-fast-add-description').value).trim()
					var category = String(this.getElement('panel-fast-add-category').value).trim()

					if (url != '' && title != '' && description != '' && category != '') {

						description = this.ucFirst(description+'.').replace(/\.+$/, '.')
						title = this.ucFirst(title).replace(/\.+$/, '')

						lastCategory = category

						if(aEvent.ctrlKey)
							var action = 'unrev';
						else
							var action = 'update';

						this.panelFastAddVisibilityHide();
						ODPExtension.tabClose(ODPExtension.tabGetFocused())

						ODPExtension.readURL('http://www.dmoz.org/editors/editurl/doadd?cat=' + this.encodeUTF8(category) + '&url=' + this.encodeUTF8(url) + '&title=' + this.encodeUTF8(title) + '&desc=' + this.encodeUTF8(description) + '&newnote=&contenttype=&newcat=&typecat=' + this.encodeUTF8(category) + '&catselectchild=--select--&mediadate=&operation='+action+'&submit=Update', false, false, false, function (aData) {

							if (aData.indexOf('<form action="login"') != -1) {
								ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
								ODPExtension.tabOpen(url, true)
							} else if (aData.indexOf('javascript:history.back') != -1) {
								ODPExtension.alert('Server busy.. or category too big, try again.')
								ODPExtension.tabOpen(url, true)
							} else {
								ODPExtension.notifyTab('Site "' + url + '" added to "'+action+'" in "' + category+'"')
							}
						}, true, true);
					}
					break;
				}

			}
		}
	}

	return null;

}).apply(ODPExtension);