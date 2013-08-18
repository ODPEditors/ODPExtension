(function()
{

		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;

		//hides or shows the selected languages in the translate context menu, also sets the sort priority of these languages
		
			this.translateMenuUpdate = function()
			{
				//this.dump('translateMenuUpdate:');
				
				//elements
				var menu = this.getElement('context-translate-menu');
				var menupopup = this.getElement('context-translate-menupopup');
				var separator = this.getElement('context-translate-priority-separator');
				
				//list of languages
				var langs = this.shared.translateMenu.languages;

				//flags
				var langWithPriorityAdded = false;
				var langWithoutPriorityAdded = false;
				var langAdded = false;
				var languagesAdded = [];
				
				//reset positions
					for(var id in langs)
					{
					  menupopup.appendChild(this.getElement('context-translate-item-lang-'+langs[id]));
					  //this.dump('reset the position of '+langs[id]);
					 
					}
					
					//finds langs with priority and moves these to the bottom
					for(var id in langs)
					{
						if(
						   this.preferenceGet('ui.context.menu.translate.lang.display.'+langs[id]) &&
						   this.preferenceGet('ui.context.menu.translate.lang.priority.'+langs[id])
						   )
						{
						  	//this.dump('moving to bottom:'+langs[id]);

							langWithPriorityAdded = true;
							langAdded = true;
							languagesAdded[languagesAdded.length] = 'context-translate-item-lang-'+langs[id];
							menupopup.appendChild(this.getElement('context-translate-item-lang-'+langs[id]));
						}
					}
			
				//moves the menuseparator to the bottom
					if(langWithPriorityAdded)
					{
					  //this.dump('langWithPriorityAdded:true');
					  menupopup.appendChild(separator);
					  separator.setAttribute('hidden', false);
					}
					else
					{
					  //this.dump('langWithPriorityAdded:false');
					  separator.setAttribute('hidden', true);
					}
				
				
				//hides or shows the languages, and move the selected by the user(these without priority) to the bottom
					for(var id in langs)
					{
						var item = this.getElement('context-translate-item-lang-'+langs[id]);
						if(this.preferenceGet('ui.context.menu.translate.lang.display.'+langs[id]))
						{
							//move the item if was not moved with priority
							if(!this.preferenceGet('ui.context.menu.translate.lang.priority.'+langs[id]))
							{
								//this.dump('langWithoutPriorityAdded:'+langs[id]);
								menupopup.appendChild(item);
								langWithoutPriorityAdded = true;
								languagesAdded[languagesAdded.length] = 'context-translate-item-lang-'+langs[id];
							}
							langAdded = true;
							item.setAttribute('hidden', false);
							//this.dump('ui.context.menu.translate.lang.display:true:'+langs[id]);
						}
						else
						{
							item.setAttribute('hidden', true);
							//this.dump('ui.context.menu.translate.lang.display:false:'+langs[id]);
						}
					}
				
				//if no items were selected hide the menu or if the menu is disabled
					if(
					   !langAdded ||
					   !this.preferenceGet('ui.context.menu.translate') ||
					   !this.preferenceGet('enabled')
					)
					{
						menu.setAttribute('hidden', true);
						return;
					}
					else
					{
						menu.setAttribute('hidden', false);
					}
					
				//if no items without priority were added hide the separator
					if(langWithoutPriorityAdded && langWithPriorityAdded)
						separator.setAttribute('hidden', false);
					else
						separator.setAttribute('hidden', true);
				
				//customized context menu (the menuitem into a submenu or directly under the context menu)

					if(
					  (
					  	 this.preferenceGet('ui.context.menu.translate.menu.in.sub') ||
					     (
						    this.preferenceGet('ui.context.menu.translate.menu.in.sub.if.to.many') &&
							(
							  languagesAdded.length >=
							  this.preferenceGet('ui.context.menu.translate.menu.in.sub.if.to.many.is')
							)
					     )
					   )
					  && this.preferenceGet('ui.context.menu.translate.menu.not.in.sub') === false
					)
					{
					  //this.dump('customized.1');
						for(var id in languagesAdded)
						{
							var item = this.getElement(languagesAdded[id]);
								item.setAttribute('label', item.getAttribute('original_label'));
								if(item.hasAttribute('oncommand'))
									item.removeAttribute('oncommand');
								if(item.hasAttribute('onclick'))
									item.removeAttribute('onclick');
								//menupopup.appendChild(item);
						}
					}
					else
					{
					  // this.dump('customized.2');
						for(var id in languagesAdded)
						{
							var item = this.getElement(languagesAdded[id]);
								item.setAttribute('label', this.getString('ui.context.menu.translate.to.lang').replace('{LANG}', item.getAttribute('original_label')));
								if(item.hasAttribute('oncommand'))
									item.removeAttribute('oncommand');
								if(item.hasAttribute('onclick'))
									item.removeAttribute('onclick');
								item.setAttribute('oncommand', 'ODPExtension.translate(event)');
								item.setAttribute('onclick', 'checkForMiddleClick(this, event)');
								this.moveNodeBelow(item, menu);
						}
						//the user selected that the languages should be displayed in the context menu and not in a submenu
						menu.setAttribute('hidden', true);
					}
			}
	return null;

}).apply(ODPExtension);
