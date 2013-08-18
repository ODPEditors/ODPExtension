(function()
{


	this.testCategoryDetection = function()
	{

		var aCategories = [
						   //ALL PASS


						  //files names
						  'Test/Tools_for_Editors/New_Editors/faq.html#42',
						  'Computers/Software/Internet/Clients/WWW/Browsers/Firefox/Add-ons/Web Design_and_Development/?',
						  'Test/Tools_for_Editors/New_Editors/faq.html',
						  'Test/Tools_for_Editors/New_Editors/edicat.cgi?some=algo&nose=true',
						  'Test/Tools_for_Editors/New_Editors/edicat.cgi',
						  'World/_Português/Artes/Música/Estilos&server=dmoz8080',
						  'Computers/some/servers/robots.txt',

						  //text mode categories
						  'World:+Chinese+Simplified:+购物:+家居与园艺:+电器',
						  ':World:+Chinese+Simplified:+科学:+科技:+电子工程/',
						  'World : Español : Regional :Europa :Reino Unido  :  Inglaterra',
						  'World:Español:Regional:Europa:Reino Unido:Inglaterra:Condados:Londres:Economía y negocios',
						  'World / Euskara / Hezkuntza',
						  '  * World: Català: Arts i cultura  (4,427)',
						  '  * World: Català: Arts i cultura  [4,427]',
						  '  * World: Català: Arts i cultura  -> World: Català: Arts i algo ',
						  '# Computers: Software: Internet: Clients: WWW: Browsers: Firefox  (352, 33 [4]) ',
						  'World/Russian/Игры/Компьютерные_игры/Action -> ',
						  ' World/Russian/Игры/Компьютерные_игры/Action -> World/Russian/Игры/Компьютерные_игры/Экшен  ',
						  ' World/Russian/Игры/Компьютерные_игры/Action->World/Russian/Игры/Компьютерные_игры/Экшен  ',
						  '  Modify  World/Español/Computadoras/Programación/Lenguajes/PHP/Comunidades  [24/Sep/2005 11:56:48 GMT-3] ',
						  '  World/Español/Computadoras/Programación/Lenguajes (edits: 330/77/77/2) ',
						  '  Computers: Software: Internet: Clients: WWW: Browsers: Firefox  (352) ',


						  //strange but posible
						  'World_/_Euskara_/_Hezkuntza',
						  'World_/ Euskara / Hezkuntza',
						  'Bookmarks/D/development_',
						  'Bookmarks/D/development _',
						  'Bookmarks/D/development /_',
						  'Bookmarks/D/_development /',
						  'Bookmarks/D/devel_opment_/',
						  'Bookmarks/D/development/ ,',
						  'Bookmarks/D/development,/',
						  'Bookmarks/D/ development ,////',

						  //NORMAL
						  'World/日本語',
						  'World/Sinhala/සාප්පු_ස‍වාරි',
						  'Arts',
						  'Bookmarks/D/development/Computers.Software.Freeware.Music_and_Audio',

						  //BAD ENCODED CATEGORIES
						  'Test/Help_Wanted/World/Rom%e2n%e3',
						  'World/Espa%F1ol/Artes/Animaci%F3n',
						  'Computers/Software/Internet/Clients/WWW/Browsers/Firefox%2',

						  //VERY STRANGE
						  'World/Español/?World/Español',
						  'World/Español/Juegos/Cartas</td>',

						  //IN PREVIOUS VERSION I WAS TAKING THE ã AS A BAD ENCODED STRING, BAD ME!
						  'World/Português/Artes/Animação/Animes',

						  //AMPERSANDS
						  'Bookmarks/D/development/Bandas_y_artistas/Caj_Karlsson_&_Världens_Bästa_Band',
						  'Bookmarks/D/development/Bandas_y_artistas/Caj_Karlsson_&amp;_Världens_Bästa_Band',


						  'Kids_and_Teens/International/Español/Diversión/Animación/Dibujos_animados/Simpson,_Los'
						  ];

		for(var id in aCategories)
			this.dump('ORIGINAL:\n'+aCategories[id]+'\n\nDetected:\n'+this.categoryGetFromURL(aCategories[id]));
	}



	return null;

}).apply(ODPExtension);
