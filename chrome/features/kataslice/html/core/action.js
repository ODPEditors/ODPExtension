function action(type) {
	/*
		should wait for "click" to fire first.
		Issue:
			- User has selected entry 1
			- User click "delete" in entry 2
			- The selected entry still is 1...
			- Then we hold the action, waiting for the entryClick event to fire first.
			- Selected entry is now 2
			- Action is applied to desired entry 2
	*/
	setTimeout(function () {
		_action(type)
	}, 0);
}

function _action(type) {
	var el = $(type);
	var listType = el.attr('type') || el.parents('[type]').attr('type');
	var actionType = el.attr('action');

	switch (listType) {

	case 'selection':
		var items = listGetSelected();
		break;
	case 'visible':
		var items = listGetVisible();
		break;
	default:
		alert('The selection is unknown, please select something');
		return;
	}
}