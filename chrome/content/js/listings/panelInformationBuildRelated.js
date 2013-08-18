(function()
{

		//builds the related content of the informative panel ( other listed uris with information about categories and titles )
			this.panelInformationBuildRelated = function(aSelected)
			{
				if(!this.preferenceGet('ui.informative.panel.categories.titles.urls'))
				{
					//so, do you wanted to completely hide the informative panel
					if(
						!this.preferenceGet('ui.informative.panel.url') &&
						!this.preferenceGet('ui.informative.panel.description') &&
						!this.preferenceGet('ui.informative.panel.title')
					)
					{
						this.preferenceSet('ui.informative.panel', false);
						this.getElement('panel').hidePopup();
					}

					this.getElement('panel-related').setAttribute('hidden', true);
				}
				else
				{
					this.getElement('panel-related').setAttribute('hidden', false);

					var site, title, uri, category, urlPretty;

					for( var i=0;i<this.listingInformationData.length;i++ )
					{
						site = this.listingInformationData[i];

						urlPretty = this.removeSchema(this.decodeUTF8Recursive(site.url)).replace(/\/$/, '');

						title = this.getElement('panel-related-titles-'+i);
						uri = this.getElement('panel-related-uris-'+i);
						category = this.getElement('panel-related-categories-'+i);

						title.setAttribute('value', (site.mediadate != '' ? '('+site.mediadate+') ' : '')+site.title);
						title.setAttribute('url', site.url);
						title.setAttribute('type', site.type+'-'+site.cool);
						title.setAttribute('tooltiptext', urlPretty);

						uri.setAttribute('value', urlPretty);
						uri.setAttribute('url', site.url);
						uri.setAttribute('type', site.type+'-'+site.cool);
						uri.setAttribute('tooltiptext', urlPretty);

						category.setAttribute('value', this.categoryAbbreviate(site.category));
						category.setAttribute('category', site.category);
						category.setAttribute('type', site.type+'-'+site.cool);
						category.setAttribute('tooltiptext', site.category);

						title.removeAttribute('hidden');
						uri.removeAttribute('hidden');
						category.removeAttribute('hidden');

						if(i==aSelected)
							this.panelInformativeRelatedWriteSelectedSite(aSelected);
					}
					//hidding all empty or old data
					for(;i<32;i++)
					{
						this.getElement('panel-related-titles-'+i).setAttribute('hidden', true);
						this.getElement('panel-related-uris-'+i).setAttribute('hidden', true);
						this.getElement('panel-related-categories-'+i).setAttribute('hidden', true);
					}
				}
			}

	return null;

}).apply(ODPExtension);
