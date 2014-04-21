var dimensions = [],
	toolbarbuttons = []

	add('onLoad', function () {

		function addonLoader(aFolder, internal) {
			l('addonLoader')

			var _addon = ODP.folderListContent(aFolder, true)
			var loadSubScript = Components.utils['import']

			for (var id in _addon) {

				if (addon[_addon[id]]) {
					alert('duplicated addon "' + _addon[id] + '"')
					continue
				}

				try {
					var item = {
						name: _addon[id],
						id: addons.length,
						enabled: true,
						internal: internal,
						manifest: {},
						source: {}
					}

					aFolder = 'file:///' + ODP.pathSanitize(aFolder).replace(/\\/g, '/');
					var path = aFolder + '/' + item.name + '/'
					if (!ODP.fileExists(path + '@manifest.js', true)) {
						alert('Unable to load addon "' + item.name + '", addon must include a file named "@manifest.js" on its root folder. ')
					} else {

						var html = ''
						if (ODP.fileExists(path + '/includes/', true)) {
							var includes = ODP.folderListContent(path + '/includes/', true)

							for (var i in includes) {
								//import html and css
								if (/\.html$/.test(path + '/includes/' + includes[i]))
									html += '<div>' + ODP.fileRead(path + '/includes/' + includes[i], true) + '</div>'
									//css
								if (/\.css/.test(path + '/includes/' + includes[i]))
									$('body').append('<link type="text/css" media="all" rel="stylesheet" class="a-css-' + item.id + '-' + i + '" href="file:///' + (ODP.pathSanitize(path + '/includes/' + includes[i]).replace(/\\/g, '/')) + '"/>')
									//js
								if (/\.js/.test(path + '/includes/' + includes[i]))
									$('body').append('<script type="text/javascript" class="a-js-' + item.id + '-' + i + '" src="file:///' + (ODP.pathSanitize(path + '/includes/' + includes[i]).replace(/\\/g, '/')) + '"></script>')
							}
						}

						//manifest loads addon information, as author, etc
						loadSubScript(path + '@manifest.js?' + new Date(), item.manifest);
						if (ODP.fileExists(path + 'listeners.js', true))
							loadSubScript(path + 'listeners.js?' + new Date(), item.source);
						if (ODP.fileExists(path + 'toolbarbuttons.js', true))
							loadSubScript(path + 'toolbarbuttons.js?' + new Date(), item.source);
						if (ODP.fileExists(path + 'dimensions.js', true))
							loadSubScript(path + 'dimensions.js?' + new Date(), item.source);
						if (ODP.fileExists(path + 'listeners.js', true))
							loadSubScript(path + 'listeners.js?' + new Date(), item.source);

						if (html != '')
							item.source.api.templates = $(html)

						giveAPIs(item.source);

						addons[addons.length] = item
						addon[_addon[id]] = item.source
					}

				} catch (e) {
					ODP.error(e)
					alert('Unable to load addon "' + item.name + '"\n\n' + e)
				}
			}
		}

		//load the internal addons
		addonLoader(ODP.installLocation + '/@addons/slice/', true)
		addonLoader(ODP.extensionDirectory().path + '/@addons/slice/')
	});