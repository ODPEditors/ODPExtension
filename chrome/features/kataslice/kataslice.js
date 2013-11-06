(function() {

	this.kataslice = function(aCategory, aFunction) {

		if ( !! aCategory) {

			var aURL = this.categoryGetURLEditUS(this.categoryGetFromURL(aCategory));

			this.readURL('file:///S:/desktop/listurl.htm', false, false, false, function(aData) {

				if (aData.indexOf('<form action="login"') != -1)
					ODPExtension.alert('You must be logged in to your dashboard to use this tool.');
				else if(aData.indexOf('javascript:history.back') != -1)
					ODPExtension.alert('Server busy.. or category too big, try again, F5 and give time.. or choose a smaller category')
				else
					aFunction(ODPExtension.categoryParserGetCategoryUS(aData, aURL));

			}, true, true);
		}
	}
	return null;

}).apply(ODPExtension);