function _(id)
	{
		return document.getElementById(id);
	}
	function emptyNode(id)
	{
		while(_(id).firstChild)
			_(id).removeChild(_(id).firstChild);
	}
	function removeNode(id)
	{
		_(id).parentNode.removeChild(_(id));
	}
	function removeElement(id)
	{
		id.parentNode.removeChild(id);
	}
	function collapse(aValue)
	{
		var divs = document.getElementsByTagName('div');
			for(var i=0;i<divs.length;i++)
			{
				if(divs[i].hasAttribute('level') && divs[i].getAttribute('level') == aValue )
				{
					divs[i].style.display = 'none';
				}
			}
	}
	function expand(aValue)
	{
		var divs = document.getElementsByTagName('div');
			for(var i=0;i<divs.length;i++)
			{
				if(divs[i].hasAttribute('level') && divs[i].getAttribute('level') == aValue )
				{
					divs[i].style.display = 'block';
				}
			}

	}
	function flip(id, item)
	{
		flipElement(_(id), item)
	}
	function flipElement(item, element)
	{
		if(!item.style || !item.style.display || item.style.display == 'block')
		{
			item.style.display = 'none';
			element.setAttribute('opened', false);
		}
		else
		{
			item.style.display = 'block';
			element.setAttribute('opened', true);
		}
	}
	function show(id)
	{
		_(id).style.display = 'block';
	}
	function hide(id)
	{
		_(id).style.display = 'none';
	}