(function() {

	//update the position of the icon
	this.addListener('userInterfaceLoad', function() {
		//every extension(that uses urlbaricon)  installed after this extension will cause to our icon to move to the left
		//then and I want the icon to the rigth! (to avoid icon moves when switching tabs that hide some urlbaricons but keep our icon show)
		setTimeout(function() {
			ODPExtension.getBrowserElement('urlbar-icons').appendChild(ODPExtension.getElement('extension-icon'));
		}, 500);
	});

	return null;

}).apply(ODPExtension);