var ODP;
var timer

addEventListener('load', function() {
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		.getService(Components.interfaces.nsIWindowMediator);
	var win = wm.getMostRecentWindow('navigator:browser');
	ODP = win.ODPExtension;
	timer = ODP.timer();
	timer.start('onLoad');

	onLoad();
	addEventListener("hashchange", onQuery, false);
	runQuery()
	onQuery()

}, false);

//sets aSites

var by = [],
	byCount = [],
	aData,
	aColumns,
	aColumnsTitles,
	aTotal = 0,

/*
`version`
`subdomain_id`

`checked`
`processed`
`loading_success`

`date_start`
`date_end`

`content_type`
`check_type`
`site_type`

`hash`
`match`
`match_hash`

`domain`
`subdomain`
`ip`
`ns`
`ids`

`language`
`headers`

`word_count`
`str_length`
`media_count`
`frame_count`
`has_frameset`
`intrusive_popups`
`is_download`

`statuses`
`status_delete`
`status_unreview`
`status_code`
`status_first`
`status_last`
`status_error`

`status_error_string`

`status_suspicious`

`meta_title`
`meta_description`
`meta_keywords`
`meta_author`
`meta_copyright`
`meta_robots`
`meta_generator`
`uri_last`
`uri_link_redirect`

`links_internal_count`
`links_external_count`
`included_total`
`included_broken`
`included_broken_count`
`image_count`
`script_count`
`redirection_count`
`rss_count`
`atom_count`

`load_time`
*/

/*
	STATUSES
		- checked 0 = not visited
		- checked 1 = checked
		- checked 3 = must check with priority
		- checked 4 = must ignore and do not edit
		- processed = 0 not resolved
		- processed = 1 solved
		- processed = 2 noted in ODP
*/

	default_query = ' SELECT distinct(status_error_string), status_code, count(*) as total, uri from uris where checked = 1 and processed = 0 group by status_error_string order by total desc'

	select = 'select status_code, status_error_string, id, uri, uri as html, uri_last,match,match_hash, hash, hash_known, content_type, site_type, str_length, word_count from uris where checked = 1 and processed = 0 and ',

	limit = '  limit 6000';

//create page

function onLoad() {

	//remove loading
	$('.loading').fadeOut();
	$('body').attr('loading', false);
	timer.resetAll();

}

function runQuery() {

	if ($('.query').val() != '' && $('.query').val().trim().indexOf('update') !== 0)
		document.location.hash = encodeURIComponent(encodeURIComponent($('.query').val()));
	else if(document.location.hash == '')
		document.location.hash = encodeURIComponent(encodeURIComponent(default_query))

	onQuery()
}

var lastQuery = ''
function onQuery() {

	var aQuery = decodeURIComponent(document.location.hash.trim().replace(/^#/, '')).trim()
	if (aQuery != '' && lastQuery != aQuery) {
		lastQuery = aQuery
		setTimeout(function(){
			lastQuery = ''
		}, 2000)
		var db = ODP.afroditaDatabaseOpen();
		$('.query').val(aQuery)
		try {
			aQuery = aQuery.replace(/and\s?$/, '')
			aQuery = aQuery.trim()
			if(aQuery.indexOf('limit') === -1 && aQuery.toLowerCase().indexOf('update') !== 0)
				aQuery = aQuery+' '+limit
			var query = db.query(aQuery)
			if(aQuery.toLowerCase().indexOf('update') === 0){
				query.execute()
				return
			}
		} catch (e) {
			alert(ODP.getError())
		}

		var row = query.fetchObjects();

		aColumns = []
		aColumnsTitles = []
		aTotal = 0;

		for (var id in row) {
			aColumns[aColumns.length] = {
				name: id,
				title: ODP.ucFirst(id
					.replace(/_/g, ' ')
					.replace(/-/g, ' ')
					.replace(/uri/gi, 'URI')
					.replace(/rss/gi, 'RSS')
					.replace(/pdf/gi, 'PDF')
					.replace(/url/gi, 'URL')
					.replace(/id/gi, 'ID')
					.replace(/html/gi, 'HTML')
					.replace(/ip/gi, 'IP')
					.replace(/txt/gi, 'TXT')
					.replace(/ns/gi, 'NS')
					.replace(/^c /i, ''))
			}
		}
/*
		$('.sort-by .links').empty()
		for (var id in aColumns){
			$('.sort-by .links').append('<span class="click" onclick="listSortBy(this)" order="desc" name="' + ODP.h(aColumns[id].name) + '">' + ODP.h(aColumns[id].title) + '</span>, ')
		}*/

		$('.toggle .links').empty()
		for (var id in aColumns){
			$('.toggle .links').append('<span class="click" onclick="listToggleColumn(this)" column="' + ODP.h(aColumns[id].name) + '">' + ODP.h(aColumns[id].title) + '</span>, ')
		}

		aData = []
		do {
			row.text = '';
			aData[aTotal] = row;
			for (var id in row)
				aData[aTotal].text += row[id] + ' ';
			aTotal++;

		} while (row = query.fetchObjects())

		listRender();
		update();

		timer.display()

		//remove loading
		$('.loading').fadeOut();
		$('body').attr('loading', false);
	}
}

var ListBody, listRows, listRowsVisible;

function listRender() {

	timer.start('listRender');

	$('.list').empty();

	var List = d3.select(".list")
		.attr('sort-by', 'date')
		.attr('sort-order', 'desc');

	var table = List.append("table")
	var thead = table.append("thead")
	ListBody = table.append("tbody");

	// append the header row
	thead.append("tr")
		.selectAll("th")
		.data(aColumns)
		.enter()
		.append("th")
		.attr("column", function(column){ return column.name; })
		.attr("order", 'desc')
		.attr("class", 'click no-select')
		.on('click', function(d){
			ODP.dump(d3.select(this))
			listSortBy(d3.select(this)[0][0])
		})
		.text(function(column) {
		return column.title;
	})

	// create a row for each object in the data
	listRows = ListBody.selectAll("tr")
		.data(aData)
		.enter()
		.append("tr")
		.attr('class', 'item')
		.on('click', function(d){
			entryClick(this);
		});

	// create a cell in each row for each column
	var cells = listRows.selectAll("td")

	.data(function(row) {
		return aColumns.map(function(column) {
			return {
				column: column.title,
				value: row[column.name],
				name: column.name
			};
		});
	})
	.enter()
	.append("td")
	.attr("column", function(d){ return d.name;})
	.on('click', function(d) {

		switch (d.name) {
			case 'html':
				//ODP.tabOpen('view-source:data:text/html;charset=UTF-8,' + ODP.encodeUTF8(JSON.parse(ODP.uncompress(d.value)).htmlTab), false);
				ODP.tabOpen('view-source:'+d.value, false);
				break;
			default:
				if(d3.event.ctrlKey && d3.event.originalTarget.tagName != 'A' && d.name.indexOf('(') == -1){
					ODP.tabOpen('chrome://odpextension/content/features/SQLiteRAW/html/index.html#' + select + ' ' + d.name + ' = "' + (String(d.value).replace(/"/g, '\"')) + '" ' + limit, false);
				}
				break;

		}
	})
	.html(function(d) {
		var value = String(d.value);

		if (d.name == 'txt')
			return ODP.h(JSON.parse(ODP.uncompress(d.value)).txt.slice(0, 255))
		else if (d.name == 'html' || value.indexOf('<html') != -1)
			return '<a>view-source</a>';
		else if (value.indexOf('http') === 0)
			return '<a href="' + ODP.h(value) + '" target="_blank">' + ODP.h(value) + '</a>';
		else
			return ODP.h(value).trim();
	});

	timer.stop('listRender');
}

function update() {
	filterFreeText();
	updateTotals();
	timer.display();
}

function updateTotals() {
	timer.start('updateTotals');
	listRowsVisible = ListBody.selectAll('.item:not(.filtered):not(.filtertextboxed)')
	$('.totals .filtered').text(listRowsVisible.size())

	if (listRowsVisible.size() < 1)
		$('.list-no-results').attr('results', false);
	else
		$('.list-no-results').attr('results', true);
	timer.stop('updateTotals');
}

function listToggleColumn(item){
	$('td[column="'+item.getAttribute('column')+'"]').toggle()
	$('th[column="'+item.getAttribute('column')+'"]').toggle()
}
function listSortBy(item, by, order) {

	if ( !! item) {
		item = $(item);
		by = item.attr('column')
		order = item.attr('order')
		if (order == 'asc')
			item.attr('order', 'desc');
		else
			item.attr('order', 'asc');
		order = item.attr('order');
	} else {
		by = $('.list').attr('sort-by')
		order = $('.list').attr('sort-order')
	}

	listRows.sort(function(a, b) {
		if (order == 'desc')
			return d3.descending(a[by], b[by]);
		else
			return d3.ascending(a[by], b[by]);
	});
}


var filterFreeTextTimeout = false;

function filterFreeText(timedout) {
	clearTimeout(filterFreeTextTimeout);
	if ( !! timedout)
		filterFreeTextTimeout = setTimeout(function() {
			filterFreeTextFilter();
			update()
		}, 300);
	else
		filterFreeTextFilter();
}

function filterFreeTextFilter() {
	var item = $('.filtertextbox');
	var filterFreeTextLastText = item.val().trim();
	ListBody.selectAll('.item:not(.filtered)').each(function(d) {
		if (filterFreeTextLastText == '' || ODP.searchEngineSearch(filterFreeTextLastText, d.text))
			d3.select(this).classed('filtertextboxed', false)
		else
			d3.select(this).classed('filtertextboxed', true)
	});
}

function listGetVisible() {
	return ListBody.selectAll('.item:not(.filtered):not(.filtertextboxed)');
}

function listGetSelected(){
	return ListBody.selectAll('.item.selected:not(.filtered):not(.filtertextboxed)');
}

function entryAction(type) {

	var el = $(type);
	var listType = el.parent().attr('type');
	var actionType = el.attr('action');

	var db = ODP.afroditaDatabaseOpen();

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

	var copy = []

	//mark new action
	switch (actionType) {

		case 'copy_urls':
			items.each(function(d) {
				copy[copy.length] = d.uri;
			});
			break;

		case 'copy_txts':
			items.each(function(d) {
				copy[copy.length] = JSON.parse(ODP.uncompress(d['txt'])).txt.trim()
			});
			break;

		case 'open_urls':
			items.each(function(d) {
				ODP.tabOpen(d.uri);
			});
			break;
		case 'open_view_source':
			items.each(function(d) {
				ODP.tabOpen('view-source:'+d.uri, false);
			});
			break;
		case 'open_urls_new':
			items.each(function(d) {
				ODP.tabOpen(d['uri_last']);
			});
			break;

		case 'copy_tabulated':
			items.each(function(d) {
				var t = '';
				aColumns.map(function(column) {
					t += d[column.name]+'\t'
				});
				copy[copy.length] = t.trim();
			});
			break;

		case 'copy_urls_with_new':
			items.each(function(d) {
				copy[copy.length] = d['uri']+'\t'+d['uri_last'];
			});
			break;

		case 'copy_new_urls':
			items.each(function(d) {
				copy[copy.length] = $(this).find('a').attr('newurl');
			});
			break;
		case 'mark_recheck':
			items.each(function(d) {
				if(d.id && String(d.id) != ''){
					db.executeSimple('update uris set checked = 3 where id = "'+d.id+'"')
				}
			});
			break;
		case 'mark_noted':
			items.each(function(d) {
				if(d.id && String(d.id) != ''){
					ODP.dump(d.id)
					db.executeSimple('update uris set processed = 2 where id = "'+d.id+'"')
				}
			});
			break;
		case 'mark_done':
			items.each(function(d) {
				if(d.id && String(d.id) != ''){
					db.executeSimple('update uris set processed = 1 where id = "'+d.id+'"')
				}
			});
			break;
		case 'whitelist_hash':
			items.each(function(d) {
				if(d.hash && String(d.hash) != ''){
					db.executeSimple('update uris set hash_known = 1 , match_hash = 1 where hash = "'+d.hash+'"')
				}
			});
			break;
		case 'dump_site':
			items.each(function(d) {
				if(d.hash && String(d.hash) != ''){
					var cacheID = ODP.sha256(d.uri)
					ODP.dump(JSON.parse(ODP.uncompress(ODP.fileRead('/LinkChecker/'+cacheID[0]+'/'+cacheID[1]+'/'+cacheID))));
				}
			});
			break;

		default:
			break;

	}
	if(copy.length)
		ODP.copyToClipboard(copy.join("\n"))
}

function entryClick(item, event){

	item = $(item);

	//select item
	$('.item.selected').each(function() {
		$(this).removeClass('selected');
	});

	item.addClass('selected');

	$('.totals .selected').text($('.item.selected').length);
}