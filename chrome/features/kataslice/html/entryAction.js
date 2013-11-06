function entryAction(type) {

	var el = $(type);
	var listType = el.parent().attr('type');
	var actionType = el.attr('action');

	console.log(listType);
	console.log(actionType);

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
				if (d.action != actionType) {
					d.newAction = actionType;
					d3.select(this).attr('action', actionType);
				}
			});

			break;
		default:
			break;
	}
	console.log(items.size())
}