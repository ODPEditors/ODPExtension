function action(type){

	var el = $(type);
	var listType = el.parent().attr('type');
	var actionType = el.attr('action');

	switch (listType) {

		case 'selection':
			var items = listGetSelected();
			break;
		case 'visible':
			var items = listGetVisible();
			break;
		default:
			alert('No items selected!');
			return;
	}

	//mark new action
	switch (actionType) {
		case 'unreview': //unreview
			items.each(function(d) {
				d.new_action = 'unreviewed';
				d3.select(this).attr('action', 'unreviewed');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'publish': //publish
			items.each(function(d) {
				d.new_action = 'reviewed';
				d3.select(this).attr('action', 'reviewed');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'delete': //delete
			var note = ODP.prompt('Note')
			if(note){
				items.each(function(d) {
					d.new_note = note;
					d.new_action = 'deleted';
					d3.select(this).attr('action', 'deleted');
					d3.select(this).classed('pending', true);

				});
			}
			break;
		case 'delete-duplicate': //delete
			items.each(function(d) {
				d.new_note = 'Duplicated';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);

			});
			break;
		case 'hijacked': //delete
			items.each(function(d) {
				d.new_note = 'Hijacked';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);

			});
			break;
		case 'gone': //delete
			items.each(function(d) {
				d.new_note = 'Gone';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'poor': //delete
			items.each(function(d) {
				d.new_note = 'Poor';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'no-content': //delete
			items.each(function(d) {
				d.new_note = 'No content';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'MFA': //delete
			items.each(function(d) {
				d.new_note = 'MFA';
				d.new_action = 'deleted';
				d3.select(this).attr('action', 'deleted');
				d3.select(this).classed('pending', true);
			});
			break;
		case 'note': //note
			var note = ODP.prompt('Note')
			if(note){
				items.each(function(d) {
					d.new_note = note;
					d3.select(this).classed('pending', true);
				});
			}
			break;
		case 'open': //open uri
			items.each(function(d) {
				ODP.tabOpen(d.new_url || d.url, false, false, true)
			});
			break;
		case 'listings': //open uri
			items.each(function(d) {
				var item = d3.select(this)
				ODP.subdomainGetListings(d.new_url || d.url, function(aData){
					var txt = ''
					for(var id in aData){
						txt += ODP.h(aData[id].category)+'<br>'
						txt += ODP.h(aData[id].uri)+'<br>'
						txt += '<hr>'
					}
					$(item[0]).find('.tools > .listings').html('<small>'+txt+'</small>');
				})
			});
			break;
		case 'translate': //open uri
			items.each(function(d) {
				var item = d3.select(this)
				ODP.stringTranslate(d.title+' - '+d.description, function(aData){
					$(item[0]).find('.tools > .translate').html('<small>'+ODP.h(aData)+'</small>');
				})
			});
			break;
		case 'edit': //open edit page
			items.each(function(d) {
				if (d.area == 'unreviewed')
					ODP.tabOpen('http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000', false, false, true)
				else if (d.area == 'reviewed')
					ODP.tabOpen('http://www.dmoz.org/editors/editurl/edit?urlId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000', false, false, true)
				else if (d.area == 'new')
					ODP.tabOpen('http://www.dmoz.org/editors/editurl/add?url=' + d.new_url + '&cat=' + ODP.encodeUTF8(d.new_category), false, false, true)
			});
			break;
		case 'open-category': //open category
			var temp = []
			items.each(function(d) {
				temp[temp.length]= d.category
			});
			temp = ODP.arrayUnique(temp);
			for(var id in temp)
				ODP.tabOpen(ODP.categoryGetURLEdit(temp[id]), false, false, true)
			break;
		case 'false-positive':
			var temp = []
				items.each(function(d) {
					temp[temp.length]= d.url
				});
				temp = ODP.arrayUnique(temp);
				ODP.fileWriteAsync('link-checker-false-positives.txt', ODP.fileRead('link-checker-false-positives.txt')+'\n'+(temp.join('\n')) )

			break;
		case 'webarchive':
			items.each(function(d) {
				ODP.tabOpen('http://web.archive.org/'+(d.new_url || d.url));
			});
			break
		case 'link-check-dump': //link checked

			var oRedirectionAlert = ODP.redirectionAlert();

			items.each(function(d) {
				var item = d3.select(this)
				oRedirectionAlert.check(d.url, function(aData, aURL) {
					ODP.dump(aData)
					ODP.fileWriteAsync('tito', JSON.stringify(aData))
				});
			});
			break
		case 'site-data-dump': //link checked
			items.each(function(d) {
				ODP.dump(d)
			});
			break
		case 'link-check': //link checked

			var oRedirectionAlert = ODP.redirectionAlert();

			items.each(function(d) {
				var item = d3.select(this)
				oRedirectionAlert.check(d.url, function(aData, aURL) {

					if (aData.status.error && aData.status.canDelete)
						item.attr('status', 'red')
					else if (aData.status.error && aData.status.canUnreview)
						item.attr('status', 'purple')
					else if (aData.status.suspicious.length)
						item.attr('status', 'orange')
					else if (aData.statuses[aData.statuses.length - 1] == '200' && aData.status.error === false)
						item.attr('status', 'green')
					else
						item.attr('status', 'yellow')

					var text =
						'<small>[' +
							ODP.h(aData.statuses.join(', ') + ' | ' +
							aData.status.code + ' | ' +
							aData.status.errorString + ' | ' +
							aData.ip + ' | ' +
							aData.language + ' | ' +
							aData.checkType +
							'  ')+(aData.urlLast != aData.urlOriginal ? '<br>'+ODP.h(aData.urlOriginal) +'<br>'+ ODP.h(aData.urlLast)+'<br>' : '')+' ] <span type="selection"><span class="click" onclick="action(this)" action="false-positive">false positive</span></small>'
					d.text += text

					// redirect maybe be autofixed
					if(aData.status.code == -1340) {
						d.new_url = aData.urlLast
						$(item[0]).find('.data .url').html(d.new_url);
						item.classed('pending', true)
						entryUpdatePendingCounter();
					}
					$(item[0]).find('.tools > .link-checker').html(text);

				});

			});
			break;
		default:
			break;
	}

	entryUpdatePendingCounter();

}