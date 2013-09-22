
	FIRST README

		general bad english, also very quickly typed so lots of errors. sorry!
		work in progress

	IMPORTANT UNDOCUMENTED FOLDERS AND/OR WORK IN PROGRESS

		_main/
		from-menus/
		listings/

	NOTE

		There is a txt called notes.txt in every subfolder. ( at least that's the intention )
		There is some folder without that file, That's because the implementation of the "feature" is not finished.
		When this work get some stable point I would like to set some mini documentation on how to implement a feature with this code as base.
		There is lots of problems solved that will help to concentrate to JavaScript developers in the feature that they want implement.

	NOTES, THE

		you are at chrome://odpextension/content/js/

		This is the main folder for ODP Extension JavaScript files

		Other JavaScript files outside of this folder including components, extension controllers(in a folder called 'core')
		and these inside a folder called lib are just APIs and controllers that I use in all of my extensions.

		The "controllers" manage the listeners, preferences, and strings for user interface used by JavaScript

	FILES

		preferences.js

			this file set the names of the preferences and the type of the prefernece
			this data is used by the controllers to manage the user preferneces
			also sets the listeners that will listen changes on the prefernces and notify to the extensino of these changes such:

			onPreferencesWindowClosed, onPreferenceSet, onPreferencesSaved, onPreferencesApplied

		_main.js

			this file throw fire from the lines. Need finished first to document, also there is a lot of comments inside