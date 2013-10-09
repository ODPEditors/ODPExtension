(function() {
	//sets debuging on/off for this JavaScript file

	var debugingThisFile = true;

	this.rdfFindAltlangsNonReciprocalCategory = function(aCategory) {

		var aMsg = 'Non reciprocal alternative languages on "{CATEGORY}" and on its subcategories ({RESULTS})'; //informative msg and title of document

		var subs = [this.rdfGetCategoryFromCategoryPath(aCategory)];
		var aData = '<li>';
		var results = 0;
		//for each subcategory of aCategory we check if all the altlangs are reciprocal.
		for (var id in subs) {
			//get the altlangs of the selected category
			var altlangsMix = this.rdfGetCategoryAltlangsIDsFromCategoryIDs(subs[id].id);
			altlangsMix = this.rdfGetCategoryAltlangsIDsToCategoryIDs(subs[id].id, altlangsMix);
			//altlangsMix = this.rdfGetCategoryAltlangsIDsToCategoryIDs(altlangsMix, altlangsMix);
			altlangsMix = this.arrayUnique(altlangsMix);

			//if aCategory has outgoing altlangs or incoming altlangs
			if (altlangsMix.length > 0) {
				//now get the altlangs of these altlangs
				/*
							while the altlangs of this category has more altlangs not included in this category,
							find the altlangs of these altlangs until no more differnet altlangs are found
						*/
				altlangsMix.push(subs[id].id);
				altlangsMix = altlangsMix.sort(this.sortLocale);
				var aComparator;
				var aTmp = String(altlangsMix);
				while (true) //love it
				{
					altlangsMix = this.rdfGetCategoryAltlangsIDsFromCategoryIDs(altlangsMix, altlangsMix);
					altlangsMix = this.rdfGetCategoryAltlangsIDsToCategoryIDs(altlangsMix, altlangsMix);
					altlangsMix = this.arrayUnique(altlangsMix).sort(this.sortLocale);
					aComparator = String(altlangsMix);
					if (aTmp == aComparator)
						break;
					aTmp = aComparator;
				}
				//	this.dump(altlangsMix);

				//check in all the altlangs if there is some missing altlang
				var found = false;
				//var aComparator = String(altlangsMix);
				for (var id in altlangsMix) {
					var altlangs = this.rdfGetCategoryAltlangsIDsFromCategoryIDs(altlangsMix[id]);
					altlangs.push(altlangsMix[id]);
					altlangs.sort(this.sortLocale);

					if (aComparator != String(altlangs)) {
						if (!found) {
							aData += '<div><div style="text-align:right;"><a href="javascript://"  onclick="$(this.parentNode.parentNode).find(\'.result\').show();">Show</a> - <a href="javascript://"  onclick="$(this.parentNode.parentNode).find(\'.result\').hide();">Hide</a> - <a  href="javascript://" onclick="$(this.parentNode.parentNode).find(\'.submit\').click();">Fix</a></div>';
						}
						found = true;

						//this.dump(aComparator);
						//this.dump(String(altlangs));
						aData += '<a onclick="$(\'.result' + results + '_' + altlangsMix[id] + '\').toggle()" class="collapse"></a><span>';
						aData += this.rdfGetCategoryFromCategoryID(altlangsMix[id]).category;
						aData += '</span>';

						var newCategories = [];
						var oldCategories = [];
						var item = '';
						for (var id2 in altlangsMix) {
							if (altlangsMix[id2] == altlangsMix[id])
								continue;
							if (this.inArray(altlangs, altlangsMix[id2])) {
								oldCategories[oldCategories.length] = this.rdfGetCategoryFromCategoryID(altlangsMix[id2]).category;
								item += '\t<font color="green">';
							} else
								item += '\t<font color="red">';

							newCategories[newCategories.length] = this.rdfGetCategoryFromCategoryID(altlangsMix[id2]).category;

							item += this.rdfGetCategoryFromCategoryID(altlangsMix[id2]).category;
							item += '</font>';
							item += this.__LINE__;
						}

							aData +=	'<form style="float:left;" action="http://www.dmoz.org/editors/editcat/editrelation?cat='+this.encodeUTF8(this.rdfGetCategoryFromCategoryID(altlangsMix[id]).category)+'&type=altlang" method="post" target="_blank">'+
											  '<input type="hidden" name="cat" value="'+this.rdfGetCategoryFromCategoryID(altlangsMix[id]).category+'" />'+
											  '<input type="hidden" name="type" value="altlang" />'+
											  '<textarea style="display:none" name="altlangs">'+
												 (oldCategories.join("\n"))+
											  '</textarea>'+
											  '<textarea style="display:none" name="newaltlangs">'+
												(newCategories.join("\n"))+
											  '</textarea>'+
											  '<input type="submit" name="submit" class="submit" value="Update" style="display:none;" id="'+altlangsMix[id]+'"/>'+
											'</form>';
						aData += '<div class="result result' + results + '_' + altlangsMix[id] + '">';
						aData += this.__LINE__;
						aData += item;
						aData += '</div>';

						aData += '<br>';

					}
				}

				if (found) {
					results++;
					aData += '</div><!-- end fix all -->';
					aData += '<hr size="1" /><li>';
				}
			}
		}
		if (results > 0) {
			aData = aData.replace(/<li>$/, '');
			aData = '<div><a  href="javascript://" onclick="$(\'.result\').show();">Expand all</a> - <a href="javascript://" onclick="$(\'.result\').hide();">Collapse all</a>' + this.__LINE__ + this.__LINE__ + '</div>' + aData;
		}

		//sets msg
		aMsg = aMsg.replace('{CATEGORY}', aCategory).replace('{RESULTS}', results);

		//display results
		if (results > 0)
			this.tabOpen(this.fileCreateTemporal(
				'RDF.html',
				aMsg,
				'<div class="header">' + aMsg + '</div>' +
				'<pre style="background-color:white !important;padding:2px;"><ol>' + aData +
				'</ol></pre>'), true);
		else
			this.notifyTab(aMsg, 8);
	}
	return null;

}).apply(ODPExtension);