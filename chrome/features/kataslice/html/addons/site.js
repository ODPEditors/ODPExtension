function _getItem(d, element) {
	var columns = ['title', 'description', 'category', 'url']
	var item = {}
	for (var id in columns) {
		(function (k) {
			item[k] = function (v, note) {
				if (typeof (v) == 'undefined')
					return d['new_' + k] || d[k];
				else {
					v = String(v)
					if (d[k] != v || (d['new_' + k] && d['new_' + k] != v)) {
						d['new_' + k] = v
						element.select('.' + k).text(v);
						if (typeof (note) == 'undefined') {
							item.markModified();
						} else {
							this.note(note)
						}
					}
				}
			}
			item['old' + ODP.ucFirst(k)] = function () {
				return d[k]
			}
		})(columns[id])
	}
	item.note = function (note) {
		if (typeof (note) == 'undefined')
			return d.new_note || d.note;
		else {
			note = String(note).trim()
			d.new_note = ODP.ucFirst(note);
			item.markModified();
		}
	}
	item.status = function () {
		return d.new_action || d.action;
	}
	item.published = function (note) {
		d.new_action = 'reviewed';
		element.attr('action', 'reviewed');
		if (typeof (note) != 'undefined')
			d.new_note = ODP.ucFirst(String(note).trim());
		item.markModified();
	}
	item.unreviewed = function (note) {
		d.new_action = 'unreviewed';
		element.attr('action', 'unreviewed');
		if (typeof (note) != 'undefined')
			d.new_note = ODP.ucFirst(String(note).trim());
		item.markModified();
	}
	item.deleted = function (note) {
		if (typeof (note) != 'undefined' && String(note).trim() != '') {
			d.new_note = ODP.ucFirst(String(note).trim());
			d.new_action = 'deleted';
			element.attr('action', 'deleted');
			item.markModified();
		}
	}

	item.appendHTML = function (aHTML) {
		$(element[0]).append('<small><hr>' + aHTML + '</small>');
	}
	item.appendText = function (aText) {
		$(element[0]).append('<small><hr>' + ODP.h(aText) + '</small>');
	}

	item.isKT = function () {
		return ODP.categoryIsKidsAndTeens(item.category())
	}

	var markModifiedTimeout = false;
	var markModifiedFunction = function () {
		element.classed('modified', true);
		updateTotalsModified();
	}
	item.markModified = function () {
		clearTimeout(markModifiedTimeout);
		markModifiedTimeout = setTimeout(markModifiedFunction, 120);
	}

	item.edit = function () {
		var url = ''
		if (d.area == 'unreviewed')
			url = 'http://www.dmoz.org/editors/editunrev/editurl?urlsubId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000'
		else if (d.area == 'reviewed')
			url = 'http://www.dmoz.org/editors/editurl/edit?urlId=' + d.site_id + '&cat=' + ODP.encodeUTF8(d.category) + '&offset=5000'
		else if (d.area == 'new')
			url = 'http://www.dmoz.org/editors/editurl/add?url=' + item.url() + '&cat=' + ODP.encodeUTF8(d.category())
		ODP.tabOpen(url, true)
	}

	item.item = element
	return item;
}