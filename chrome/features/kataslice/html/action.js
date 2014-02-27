function action(type) {

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
		case 'U': //unreview
		case 'P': //publish
		case 'D': //delete
			items.each(function(d) {
				d.newAction = actionType;
				d3.select(this).attr('action', actionType);
			});
			break;
		case 'N': //delete
			var note = ODP.prompt('Note')
			items.each(function(d) {
				d.newNote = note;
			});
			break;
		case 'O': //open uri
			items.each(function(d) {
				ODP.tabOpen(d.url)
			});
			break;
		case 'E': //open uri
			items.each(function(d) {
				if (d.area == 'unrev')
					ODP.tabOpen('http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000')
				else if (d.area == 'rev')
					ODP.tabOpen('http://www.dmoz.org/editors/editurl/edit?urlId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000')
				else if (d.area == 'new')
					ODP.tabOpen('http://www.dmoz.org/editors/editurl/add?url=' + d.newUrl + '&cat=' + ODP.encodeUTF8(d.newCategory))
			});
			break;
		case 'C': //open category
			var temp = []
			items.each(function(d) {
				temp[temp.length]= d.category
			});
			temp = ODP.arrayUnique(temp);
			for(var id in temp)
				ODP.tabOpen(ODP.categoryGetURLEdit(temp[id]))
			break;
		case 'LC': //link checked

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

					$(item[0]).find('.link-checker').html(
						'<small>[' +
							aData.statuses.join(', ') + ' | ' +
							aData.status.code + ' | ' +
							aData.status.errorString + ' | ' +
							aData.ip + ' | ' +
							aData.language + ' | ' +
							aData.checkType +
						'] <br> '+aData.urlRedirections[aData.urlRedirections.length - 1]+'</small>'
					);

				});

			});
			break;
		default:
			break;
	}
}