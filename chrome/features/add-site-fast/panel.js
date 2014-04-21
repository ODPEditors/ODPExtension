(function () {

	//updates the content when switching tabs
	this.addListener('onLocationChangeNotDocumentLoad', function (aLocation) {
		ODPExtension.panelFastAddGetInformation();
	});

	this.addListener('onLocationChange', function (aLocation) {
		ODPExtension.panelFastAddGetInformation();
	});
	this.addListener('userInterfaceLoad', function (aEnabled) {
		setTimeout(function(){
			try{
				ODPExtension.setAutocomplete(ODPExtension.getElement('panel-fast-add-category'));
				ODPExtension.setAutocomplete(ODPExtension.getElement('panel-fast-add-note'));
			} catch(e) {
				ODPExtension.setAutocomplete(ODPExtension.getElement('panel-fast-add-category'));
				ODPExtension.setAutocomplete(ODPExtension.getElement('panel-fast-add-note'));
			}
		}, 0);
	});

	var panel
	this.addListener('userInterfaceLoad', function () {
		panel = ODPExtension.getElement('panel-fast-add');
	});
	var lastCategory = '';

	this.panelFastAddGetInformation = function (aLocation) {
		if ( (this.preferenceGet('ui.fast.add.panel.closed') || !this.preferenceGet('enabled')) && !this.tabGetData('panel-fast-add-linked-function')) {
			this.panelFastAddShow(false);
		} else {
			var aDoc = this.documentGetFocused();

			try{
				var placeholder = document.commandDispatcher.focusedElement.placeholder
			}catch(e){
				var placeholder = ''
			}

			if (placeholder != 'URL' || this.getElement('panel-fast-add-url').value == '')
				this.getElement('panel-fast-add-url').value = this.tabGetData('panel-fast-add-url') || this.documentGetLocation(aDoc)

			if (placeholder != 'Title' || this.getElement('panel-fast-add-title').value == '')
				this.getElement('panel-fast-add-title').value = this.tabGetData('panel-fast-add-title') || this.autoCorrectTitle(this.documentGetTitle(aDoc), true)

			if (placeholder != 'Editor Note' || this.getElement('panel-fast-add-note').value == '')
				this.getElement('panel-fast-add-note').value = this.tabGetData('panel-fast-add-note') || ''

			if (placeholder != 'Description' || this.getElement('panel-fast-add-description').value == '') {

				if (this.tabGetData('panel-fast-add-description')) {
					this.getElement('panel-fast-add-description').value = this.tabGetData('panel-fast-add-description')
				} else {
					var description = this.documentGetMetaDescription(aDoc)
					if (this.getElement('panel-fast-add-url').value.indexOf('github') != -1) {
						if (description.split(' - ').length == 2) {
							description = description.split(' - ');
							description.shift();
							description = (description.join(' ')).trim();
						}
					}
					this.getElement('panel-fast-add-description').value = this.autoCorrectDescription(description);
				}
			}

			if (placeholder != 'Category' ||  this.getElement('panel-fast-add-category').value == '')
				this.getElement('panel-fast-add-category').value = this.tabGetData('panel-fast-add-category') || lastCategory

			if(this.categoryIsRTL(this.getElement('panel-fast-add-category').value)){
				panel.setAttribute('dir', 'rtl')
			} else {
				panel.setAttribute('dir', 'ltr')
			}

			if(this.tabGetData('panel-fast-add-linked-function'))
				panel.setAttribute('buttons', 'true')
			else
				panel.setAttribute('buttons', 'false')

			if(this.getElement('panel-fast-add-url').value.indexOf('http') === 0 || this.tabGetData('panel-fast-add-linked-function'))
				this.panelFastAddShow(true);
			else
				this.panelFastAddShow(false);
		}
	}

	this.panelFastAddOnPaste = function() {
		this.copyToClipboard(this.autoCorrect(this.getClipboard()))
	}

	this.panelFastAddKeyPress = function (aElement, aEvent) {

		ODPExtension.tabSaveData(aElement.id, aElement.value || aElement.getAttribute('value') || '')

		if (aEvent.keyCode == aEvent.DOM_VK_RETURN || aEvent.currentTarget.id == 'ODPExtension-panel-fast-add-action') {

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
				case 'ODPExtension-panel-fast-add-action':
				case 'ODPExtension-panel-fast-add-note':
					{

						var aFunction = this.tabGetData('panel-fast-add-linked-function')

						if(aFunction && (
						          	 	aEvent.currentTarget.id == 'ODPExtension-panel-fast-add-category' ||
						          	 	aEvent.currentTarget.id == 'ODPExtension-panel-fast-add-note'
						) ) {

							this.getElement('panel-fast-add-action').focus()

						} else {

							setTimeout(function(){
								try{
									ODPExtension.saveAutocomplete(ODPExtension.getElement('panel-fast-add-category'));
									ODPExtension.saveAutocomplete(ODPExtension.getElement('panel-fast-add-note'));
								}catch(e){
									ODPExtension.saveAutocomplete(ODPExtension.getElement('panel-fast-add-category'));
									ODPExtension.saveAutocomplete(ODPExtension.getElement('panel-fast-add-note'));
								}
							}, 0);

							var url = String(this.getElement('panel-fast-add-url').value).trim()
							var title = String(this.getElement('panel-fast-add-title').value).trim()
							var description = String(this.getElement('panel-fast-add-description').value).trim()
							var category = String(this.getElement('panel-fast-add-category').value).trim()
							var note = String(this.getElement('panel-fast-add-note').value).trim()
							var action = String(this.tabGetData('panel-fast-add-action')).trim()

							if (url != '' && title != '' && description != '' && category != '') {

								description = (description + '.').replace(/(\s*\.+)$/, '.').replace(/\s+/g, ' ').trim()
								title = title.replace(/\.+$/, '').replace(/\s+/g, ' ').trim()

								title = title.replace(/^\.+/, '').trim()
								description = this.ucFirst(description.replace(/^\.+/, '').trim())

								lastCategory = category

								if (aEvent.ctrlKey && this.confirm('Add to unreview?'))
									var form_button = 'unrev';
								else
									var form_button = 'update';

								this.panelFastAddVisibilityHide();

								if(!aFunction){
									ODPExtension.tabClose(ODPExtension.tabGetFocused())
									ODPExtension.readURL('http://www.dmoz.org/editors/editurl/doadd?cat=' + this.encodeUTF8(category) + '&url=' + this.encodeUTF8(url) + '&title=' + this.encodeUTF8(title) + '&desc=' + this.encodeUTF8(description) + '&newnote=&contenttype=&newcat=&typecat=' + this.encodeUTF8(category) + '&catselectchild=--select--&mediadate=&operation=' + form_button + '&submit=Update', false, false, false, function (aData) {

										if (aData.indexOf('<form action="login"') != -1) {
											ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
											ODPExtension.tabOpen(url, true)
										} else if (aData.indexOf('javascript:history.back') != -1) {
											ODPExtension.alert('Server busy.. or category too big, try again.')
											ODPExtension.tabOpen(url, true)
										} else {
											setTimeout(function(){
												ODPExtension.notifyTab('"' + url + '" added to "' + form_button + '" in "' + category + '"')
											}, 2500);
										}
									}, true, true);
								} else {
									aFunction(url, title, description, category, note, action);
									ODPExtension.tabClose(ODPExtension.tabGetFocused())
								}
							}
						}
						break;
					}
			}
		}
	}

	return null;

}).apply(ODPExtension);