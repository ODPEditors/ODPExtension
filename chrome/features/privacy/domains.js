(function() {

	this.addListener('preferencesLoadGlobal', function() {
		ODPExtension.shared.privacy.excluded = {};
		ODPExtension.shared.privacy.excluded.domains = ODPExtension.trim(ODPExtension.preferenceGet('privacy.queries.exclude.domains').replace(/\./g, '\\.').replace(/\*/g, '.*')).split('\n');
		ODPExtension.shared.privacy.excluded.strings = ODPExtension.trim(ODPExtension.preferenceGet('privacy.queries.exclude.strings')).split('\n');
		for (var id in ODPExtension.shared.privacy.excluded.strings)
			ODPExtension.shared.privacy.excluded.strings[id] = ODPExtension.trim(ODPExtension.shared.privacy.excluded.strings[id]).toLowerCase();
	});

	return null;

}).apply(ODPExtension);