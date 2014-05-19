function toolbarbuttonCreate(toolbarbutton, addon) {

	//header toolbar
	if (toolbarbutton.toolbar == 'header') {
		if (!$('.header-toolbar .' + toolbarbutton.id).length)
			$('.header-toolbar').append('<span title="' + ODP.h(toolbarbutton.title) + '" class="click no-underline header-toolbar-item fa ' + toolbarbutton.id + '">' + ODP.h(toolbarbutton.icon).trim() + '</span>');
		var button = $('.header-toolbar .' + toolbarbutton.id)
	} else {
		var position = toolbarbutton.position || 'left';
		if (position != 'right' && position != 'left')
			position = 'right'
		var add = ''
		if (toolbarbutton.include_separator)
			add = '<span class="toolbarbutton separator">|</span>';

		if (!$('.toolbarbuttons .' + position + ' .' + toolbarbutton.id).length)
			$('.toolbarbuttons .' + position).append('<span class="toolbarbutton-container" title="' + ODP.h(toolbarbutton.title) + '" position="' + ODP.h(addon.name + '-' + toolbarbutton.name).replace(/\./g, '-').toLowerCase() .trim() + '"><span class="toolbarbutton ' + toolbarbutton.id + '" ><i style="color:' + ODP.h(toolbarbutton.icon_color) + '">' + ODP.h(toolbarbutton.icon).trim() + '</i> <span class="label narrow">' + ODP.h(toolbarbutton.label).trim() + '</span></span>' + add + '</span>');
	}
}

function toolbarbuttonMove(toolbarbutton, addon) {

	if (toolbarbutton.parent && toolbarbutton.parent != '') {

		var parent = $($('.toolbarbuttons span[position="' + toolbarbutton.parent + '"]').get(0))
		if(parent) {
			var button = $($('.toolbarbutton.' + toolbarbutton.id).parent().get(0))

			if(!parent.find('.toolbarbutton-menu').length)
				parent.append('<span class="toolbarbutton-menu-container"><div class="toolbarbutton-menu"></div><span class="clear"></span></span>')

			$(parent.find('.toolbarbutton-menu').get(0)).prepend(button);
		}

	}

}

function toolbarbuttonReposition(toolbarbutton, addon) {

	var button = $('.toolbarbutton.' + toolbarbutton.id).parent()

	if (toolbarbutton.insert_before && toolbarbutton.insert_before != '') {
		var sibling = $('.toolbarbuttons span[position="' + toolbarbutton.insert_before + '"]')
		if (sibling)
			sibling.before(button);
	} else if (toolbarbutton.insert_after && toolbarbutton.insert_after != '') {
		var sibling = $('.toolbarbuttons span[position="' + toolbarbutton.insert_after + '"]')
		if (sibling)
			sibling.after(button);
	}

}

function toolbarbuttonSet(toolbarbutton, addon) {
	var toolbarOutput = $('.header-toolbar-output')

	var button = $('.toolbarbutton.' + toolbarbutton.id)
	//set handy button functions

	toolbarOutput.hash_panel = false;
	toolbarbutton.writeToPanel = function (html) {
		toolbarOutput.hash_panel = true;

		toolbarOutput.empty()
		toolbarOutput.append('<h3 class="no-selection click no-underline"><i class="fa">' + ODP.h(toolbarbutton.icon) + '</i> ' + ODP.h(toolbarbutton.title) + '</h3><hr/><div class="clear"></div>');
		toolbarOutput.append('<div class="' + toolbarbutton.id + '"><div>' + html + '</div></div>');

		toolbarOutput.find('h3.no-selection.click.no-underline').on('click', function () {
			toolbarbutton.close();
		});
		return toolbarOutput.find('.' + toolbarbutton.id)
	}
	toolbarbutton.opened = false
	toolbarbutton.open = function () {
		if (!this.opened) {
			this.opened = true;
			if (this.onopen)
				this.onopen();
			toolbarOutput.slideDown('fast')
			$('body').on('click', function (event) {
				var target = $(event.target);
				if (
					target.parents('.header-toolbar').length ||
					target.hasClass('header-toolbar-output') ||
					target.parents('.header-toolbar-output').length ||
					target.hasClass('toolbar') ||
					target.parents('.toolbarbuttons').length
				) {} else {
					$('body').unbind(event);
					toolbarbutton.close();
				}
			});
		}
	}
	toolbarbutton.close = function () {
		if (this.opened) {
			this.opened = false;
			if (this.onclose)
				this.onclose();
			toolbarOutput.slideUp('fast', function () {
				toolbarOutput.empty()
			})
		}
	}

	if (toolbarbutton.onclick)
		button.on('mousedown', function (event) {
			if (toolbarbutton.opened && toolbarOutput.hash_panel)
				toolbarbutton.close(event)
			else {
				toolbarbutton.onclick(event)
				toolbarbutton.opened = true;
			}
		})
	if (toolbarbutton.onmouseover)
		button.on('mouseover', function (event) {
			toolbarbutton.onmouseover(event)
		})
	if (toolbarbutton.onmouseout)
		button.on('mouseout', function (event) {
			toolbarbutton.onmouseout(event)
		})
}