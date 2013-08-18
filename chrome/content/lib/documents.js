(function()
{
	//returns the current focused location-TODO:REVIEW
	this.documentFocusedGetLocation = function()
	{
		return String(window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument.location);
	}
	//returns the current focused document-REVIEW
	this.documentGetFocused = function()
	{
		return window.top.getBrowser().browsers[window.top.getBrowser().mTabBox.selectedIndex].contentDocument;
	}
	//gets the title of the  aTab-REVIEW
	this.documentGetFromTab = function(aTab)
	{
		return this.browserGetFromTab(aTab).contentDocument;
	}
	//returns a location for a document
	this.documentGetLocation = function(aDoc)
	{
		return String(aDoc.location);
	}
	//returns the  content of the meta description of a document 
	this.documentGetMetaDescription = function(aDoc)
	{
		return this.trim(this.stripTags(this.htmlEntityDecode(this.stripTags(this.documentGetRAWMetaDescription(aDoc), ' ')), ' '));	
	}
	//returns the  content of the meta description of a document 
	this.documentGetRAWMetaDescription = function(aDoc)
	{
		var tobj = aDoc.evaluate("//*/meta[translate(@name, 'DESCRIPTION', 'description') = 'description']", aDoc, null, XPathResult.ANY_TYPE, null);

		var metaTag = tobj.iterateNext();
		if(metaTag)
		{
			return metaTag.getAttribute('content');
		}
		else
		{
			var tobj = aDoc.evaluate("//*/meta[translate(@http-equiv, 'DESCRIPTION', 'description') = 'description']", aDoc, null, XPathResult.ANY_TYPE, null);
	
			var metaTag = tobj.iterateNext();
			if(metaTag)
			{
				return metaTag.getAttribute('content');
			}
			else
			{
				return '';
			}
		}
	}
	//gets the title of the  aTab-REVIEW
	this.documentGetTitle = function(aDoc)
	{
		return this.trim(this.stripTags(this.htmlEntityDecode(String(aDoc.title))));
	}
	//returns the TOP document
	this.documentGetTop = function(aDoc)
	{
		if(!aDoc.defaultView)
			return aDoc;
		else
			return aDoc.defaultView.top.document;
	}
	//returns true if the document has a frameset
	this.documentHasFrameSet = function()
	{
		var aDoc = this.documentGetFocused();
		if(aDoc.body && String(aDoc.body).indexOf('FrameSet') != -1)
			return true;
		else
			return false;
	}

	return null;

}).apply(ODPExtension);
