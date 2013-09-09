(function()
{

			var debugingThisFile = true;

		//holds in memory data that is shared by all the windows of this browser instance.

			this.preferencesLoadGlobal = function()
			{
				//ACA TIENE QUE VACIAR TODOS LOS ELEMENTOS DE LAS VARIABLES GLOBALES SI LA EXTENSION ESTA APAGADA
				//this.categoryBrowserCategories
				//this.dump('preferencesLoadGlobal', debugingThisFile);

				//if the object not exists, creates the object, this is true when a new firefox profile is openened
				if(!this.sharedObjectExists('shared'))
				{

					var shared = {};

					//translate menu
						shared.translateMenu = {};
						shared.translateMenu.languages = ['af','sq','ar','be','bg','ca','zh-CN','zh-TW','hr','cs','da','nl','en','et','tl','fi','fr','gl','de','el','ht','iw','hi','hu','is','id','ga','it','ja','ko','lv','lt','mk','ms','mt','no','fa','pl','pt','ro','ru','sr','sk','sl','es','sw','sv','th','tr','uk','vi','cy','yi'];


						shared.category = {};
						shared.categories = {};

					//category abbreviation

						shared.category.abbreviation = {};
						shared.category.abbreviation.languages = {};

						//language abbreviations : cant' rememeber from where
						shared.category.abbreviation.languages.find = ['Íslenska','Česky','Afrikaans','Arabic','Armenian','Asturianu','Azerbaijani','Bahasa_Indonesia','Bahasa_Melayu','Bangla','Belarusian','Bosanski','Brezhoneg','Bulgarian','Català','Chinese_Simplified','Chinese_Traditional','Cymraeg','Dansk','Deutsch','Eesti','Español','Esperanto','Euskara','Føroyskt','Farsi','Français','Frysk','Gàidhlig','Gaeilge','Galego','Greek','Gujarati','Hebrew','Hindi','Hrvatski','Interlingua','Italiano','Japanese','Kannada','Kaszëbsczi','Kazakh','Kiswahili','Korean','Kurdî','Lëtzebuergesch','Latviski','Lietuvių','Lingua_Latina','Magyar','Makedonski','Marathi','Nederlands','Norsk','Occitan','Polska','Português','Punjabi','Română','Rumantsch','Russian','Sardu','Shqip','Sicilianu','Slovensko','Slovensky','Srpski','Suomi','Svenska','Türkçe','Tagalog','Taiwanese','Tamil','Tatarça','Telugu','Thai','Ukrainian','Vietnamese', 'Arts/', 'Business/', 'Computers/', 'Games/', 'Health/', 'Home/', 'News/', 'Recreation/', 'Reference/', 'Science/', 'Shopping/', 'Society/', 'Sports/', 'Adult/', '/Open_Directory_Project', 'Kids_and_Teens/', 'Regional/', 'Bookmarks/', 'World_Test/', 'Test/', 'United_States/', 'North_America/', 'Internet/', 'Industries/', '/Business_and_Economy', 'Localities/', '/Computers_and_Internet', 'Government/', 'Development', 'Search_Engines', '/Ciencia_y_tecnología', '/Computación_e_Internet', '/Deportes_y_tiempo_libre', '/Economía_y_negocios', '/Guías_y_directorios', '/Noticias_y_medios', '/Viajes_y_turismo', '/Medios_de_comunicación', '/Argentina', '/Bolivia', '/Chile', '/Colombia', '/Costa_Rica', '/Cuba', '/Ecuador', '/España', '/Estados_Unidos', '/Guatemala', '/Guinea_Ecuatorial', '/Honduras', '/México', '/Nicaragua', '/Panamá', '/Paraguay', '/Perú', '/Puerto_Rico', '/El_Salvador', '/Uruguay', '/Venezuela', '/Departamentos', '/Provincias', '/América', '/Europa', '/Gobierno', '/Educación', '/Universidades', '/Facultades_y_Escuelas', '/Software', '/Education'];
						shared.category.abbreviation.languages.replace = ['IS','CS','AF','AR','HY','AST','AZ','ID','MS','Bangla','BE','BS','BR','BG','CA','CHS','CHT','CY','DA','DE','ET','ES','EO','EU','FO','Farsi','FR','FY','GD','GA','GL','EL','GU','HE','HI','HR','IA','IT','JA','KN','CSB','KK','SW','KO','KU','LB','Latviski','LT','Lingua_Latina','HU','Makedonski','MR','NL','NO','OC','PL','PT','PA','RO','RM','RU','SC','SQ','SCN','Slovensko','Slovensky','SH','FI','SV','TR','TL','Taiwanese','TA','TT','TE','TH','UK','VI','Ar/', 'Bus/', 'C/', 'G/', 'He/', 'Ho/', 'N/', 'Rec/', 'Ref/', 'Sci/', 'Sh/', 'Soc/', 'Sp/', 'Ad/', '/ODP', 'K&T/', 'R/', 'B/', 'WT/', 'T/', 'USA/', 'NA/', 'I/', 'Ind/', '/B&E', 'Loc/', '/Comp&Int', 'Gov/', 'Dev', 'SE', '/CyT', '/CeI', '/D&TL', '/EyN', '/GyD', '/NyM', '/VyT', '/MdC', '/AR', '/BO', '/CL', '/CO', '/CR', '/CU', '/EC', '/ES', '/USA', '/GT', '/GQ', '/HN', '/MX', '/NI', '/PA', '/PY', '/PE', '/PR', '/SV', '/UY', '/VE', '/Dptos', '/Prov', '/Amé', '/Eur', '/Gob', '/EDU', '/Univer', '/FyE', '/Soft', '/EDU']

						shared.category.top  = {}
						shared.category.top.categories = ['Acquisti_Online','Actividades_escolares','Actualité','Actualité_et_médias','Actualités','Ados','Affari','Affari_e_Economia','Aileniz','Amusement','Arte','Arte_e_Intrattenimento','Artes','Artes_e_Entretenimento','Arts','Arts_and_Entertainment','Arts_et_culture','Basın_ve_Yayın','Bedrijven_en_Economie','Bildung','Bilgisayar','Boutiques_en_ligne','Buscando_en_Internet','Business_and_Economy','Casa','Ciencia_y_tecnología','Ciência','Ciência_e_Meio_Ambiente','Commerce_et_économie','Compras','Computación_e_Internet','Computadoras','Computer','Computers','Consultazione','Deportes','Deportes_y_aficiones','Deportes_y_tiempo_libre','Desportos','Diversión','Divertissements','Domov_a_rodina','Economía_y_negocios','Educación','Education','Educação','El_tiempo','Employment','Emprego','Enfants_et_ados','Enseignement_et_formation','Estado_e_Governo','Etat_et_politique','Eğlence','Familie','Formation','Freizeit','Gastgewerbe','Gesellschaft','Gesundheit','Gezondheid','Gidsen_en_Indexen','Giochi','Gobierno','Government','Guias_e_Directórios','Guias_e_Diretórios','Guides_and_Directories','Guías_y_directorios','Health','Hogar','Home_and_Garden','Hry','Huis_en_Tuin','Imóveis','Informatique','Informática','Informática_e_Internet','Institutions_et_administrations','Internet','Istruzione','Jeugd','Jeux','Jogos','Juegos','Jóvenes','Kaarten_en_Panorama\'s','Karten_und_Bilder','Kinder_und_Teens','Kultur','Kultura_a_umění','Kunst','Kunst_en_Amusement','Kültür_ve_Sanat','Lar','Leute_und_Gesellschaft','Lidé_a_společnost','Loisirs','Maatschappij','Maison','Mapas_e_Vistas','Mapas_y_vistas','Mappe_e_Vedute','Maps_and_Views','Medien','Medios_de_comunicación','Mens_en_Maatschappij','Meteo','Nachrichten_und_Medien','Naslag','Natur_und_Umwelt','Negocios','Negócios','Negócios_e_Economia','News_and_Media','Nieuws','Nieuws_en_Media','Noticias_y_medios','Notizie','Notizie_e_Media','Notícias','Notícias_e_Media','Notícias_e_Mídia','Okul_Zamanı','Onderwijs','Online-Shops','Overheid','Oyunlar','Passatempos','Passatempos_e_Desportos','Petite_enfance','Peuters_en_Kleuters','Počítače','Preescolar','Property','Pubblica_Amministrazione','Předškoláci','Real_Estate','Recreatie','Recreatie_en_Sport','Recreation_and_Sports','Referencia','Referência','Reise_und_Tourismus','Reizen_en_Toerisme','Rozcestníky','Références','Répertoires','Salud','Salute','Santé','Saúde','Sağlık','School','Schulzeit','Science_and_Environment','Sciences','Scienza','Scolaire','Shopping','Sociedad','Sociedad_y_gente','Sociedade','Sociedade_e_Cultura','Society_and_Culture','Società','Società_e_Cultura','Société','Spellen','Spiele','Spor_ve_Hobi','Sport','Sport_e_Tempo_Libero','Sport_en_Hobby\'s','Sport_und_Hobby','Sports','Sports_et_loisirs','Sporty_a_zájmy','Staat','Teens','Tempo','Tempo_Libero','Tiempo_libre','Tieners','Toplum','Transport','Transportation','Transportes','Transports','Trasporti','Travel_and_Tourism','Tu_familia','Turismo','Unterhaltung','Verkehr','Verzeichnisse_und_Portale','Viagens_e_Turismo','Viajes_y_turismo','Votre_famille','Voyages_et_tourisme','Weather','Webwinkelen','Weer','Wetenschap','Wetenschap_en_Milieu','Wetter','Wirtschaft','Wissen','Wissenschaft','Zakelijk','Zdraví','Zoeken_op_het_Net','Zprávy_a_média','Zuhause','Zábava','Škola','Život_mladých','Бизнес','Бизнес_и_экономика','Государство','Дети_и_подростки','Дом','Досуг','Здоровье','Игры','Интернет','Искусство','Искусство_и_развлечения','Источники_информации','Карты_и_виды_местности','Компьютеры','Наука','Наука_и_природа','Недвижимость','Новости_и_СМИ','Образование','Общество','Общество_и_культура','Отдых_и_спорт','Пассажирский_транспорт','Погода','Покупки','Путеводители_и_каталоги','Путешествия_и_туризм','Спорт','Торговля','Трудоустройство','ようちえん','アート','アート・娯楽','エンターテインメント','オンラインショップ','ガイドとディレクトリ','キッズとティーンズ','ゲーム','コンピュータ','ショップ','スポーツ','ディレクトリ','ニュース','ニュースとメディア','ビジネス','ビジネス・経済','レクリエーション','レクリエーションとスポーツ','不動産','交通','交通运输','交通運輸','人と社会','休閒','休閒與運動','休闲','休闲与体育','体育','健康','儿童及青少年','兒童與青少年','勉強','十代の話題','参考','參考','各種資料','商业','商业与经济','商業','商業與經濟','地図・景観','地图与图像','天气','家居','家庭','家族','就业','就業','房地产','政府','教育','新聞','新聞與媒體','新闻','新闻与媒体','旅游','旅行・観光','旅遊','游戏','目录与指南','目錄與指南','社会','社会・文化','社会与文化','社會','社會與文化','科学','科学・環境','科学与环境','科學','科學與環境','艺术','艺术与娱乐','藝術','藝術與娛樂','行政','计算机','購物','购物','趣味・スポーツ','遊戲','運動','電腦'];
					//categories.txt
						shared.categories.txt = {};
						shared.categories.txt.lock = false;
						shared.categories.txt.exists = false;
					//

					//session categories, categories that has been opened in this browser session
						shared.categories.session = {};
						shared.categories.session.categories = [];

					//sisters categories
						shared.categories.sisters = {};
					//sisters categories, categories that doenst have a sister category
						shared.categories.sisters.focused = {}
						shared.categories.sisters.focused.no = []
					//categories without subcategories and  sisters
						shared.categories.sisters.no = [];

					//holds categories which no contains ancestors with the same or aproximated name
						shared.categories.ancestors = {};
						shared.categories.ancestors.no = [];

					//holds categories which no contains childs with the same or aproximated name
						shared.categories.childs = {};
						shared.categories.childs.no = [];

					//categories that are currently in the category browser menu
						shared.categories.category = {};
						shared.categories.category.browser = {};
						shared.categories.category.browser.categories = [];

					//privacy - continue below
						shared.privacy = {};
						shared.privacy.odp = {};
						shared.privacy.odp.subdomains = [
														  'editors.dmoz.org',
														  'forums.dmoz.org'
													  ];

						shared.privacy.odp.domains = [];

					//editors

						shared.editors = {};
						shared.editors.nicknames = [];

					//building a reference
						this.shared = this.sharedObjectGet('shared', shared);
				}
				else//, else get a reference
				{

					//getting the reference
						this.shared = this.sharedObjectGet('shared');
				}

				if(!this.preferenceGet('enabled'))
				{

				}
				else
				{
					this.forumsGetStrings();
				}


				//privacy
					//no referrer
						if(this.preferenceGet('privacy.no.referrer'))
							this.startComplexListener('onModifyRequest');
						else
							this.stopComplexListener('onModifyRequest');
				//advanced

					//correction of the extension directory
						this.extensionDirectory();

				//performance boost for preferences

					//privacy
					this.shared.privacy.noReferrer = this.trim(this.preferenceGet('advanced.urls.odp.private.no.referrer')).split('\n');
					this.shared.privacy.excluded = {};
					this.shared.privacy.excluded.domains = this.trim(this.preferenceGet('privacy.queries.exclude.domains').replace(/\./g, '\\.').replace(/\*/g, '.*')).split('\n');
					this.shared.privacy.excluded.strings = this.trim(this.preferenceGet('privacy.queries.exclude.strings')).split('\n');
					for(var id in this.shared.privacy.excluded.strings)
					{
						this.shared.privacy.excluded.strings[id] = this.trim(this.shared.privacy.excluded.strings[id]).toLowerCase();
					}

			}

	return null;

}).apply(ODPExtension);
