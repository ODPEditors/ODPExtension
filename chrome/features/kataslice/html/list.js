function listGetVisible() {
	return ListBody.selectAll('.item:not(.filtered):not(.filtertextboxed)');
}

function listGetSelected(){
	return ListBody.selectAll('.item.selected:not(.filtered):not(.filtertextboxed)');
}