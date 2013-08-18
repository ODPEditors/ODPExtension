(function()
{
	/* 	adds a custom style */
	this.cssAppend = function(name, contentsRule)
	{
		//components
			var sss = this.service('sss');
			
		//checking if this style already exists
		var appliedStyles = this.sharedObjectGet('cssStyles');
			if(appliedStyles[name])
			{
				//removing old style
				if(appliedStyles[name].indexOf('chrome') === 0)
					var uri = this.newURI(appliedStyles[name]);
				else
					var uri = this.newURI("data:text/css,"+this.encodeUTF8(appliedStyles[name]));
				if(sss.sheetRegistered(uri, sss.USER_SHEET))
				  sss.unregisterSheet(uri, sss.USER_SHEET);
			}
			//saving style
			appliedStyles[name] = contentsRule;
		
			//re-apply the style
			if(contentsRule.indexOf('chrome') === 0)
				var uri = this.newURI(contentsRule);
			else
				var uri = this.newURI("data:text/css,"+this.encodeUTF8(contentsRule));
			sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
	}
	/* 	removes a custom style */
	this.cssRemove = function(name)
	{
		//components
			var sss = this.service('sss');
			
		//checking if this style already exists
		var appliedStyles = this.sharedObjectGet('cssStyles');
			if(appliedStyles[name])
			{
				//removing old style
				if(appliedStyles[name].indexOf('chrome') === 0)
					var uri = this.newURI(appliedStyles[name]);
				else
					var uri = this.newURI("data:text/css,"+this.encodeUTF8(appliedStyles[name]));
				if(sss.sheetRegistered(uri, sss.USER_SHEET))
				  sss.unregisterSheet(uri, sss.USER_SHEET);
			}
	}

	return null;

}).apply(ODPExtension);
