(function()
{
	this.urlFlags = {

		parked: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Parked',
			errorStringUserFriendly: 'No Content',
			canDelete: true,
			body:[''
				,"domainname=referer_detect"
				//,"http://www.sedo.com/search/details.php4?domain="
				,"script src=\"http://dsparking.com"
				,'/?fp='
				,'/parked/dns/'
				,'000webhost.com</title>'
				,'200.62.55.254/estilos_parked.css'
				,'<!-- turing_cluster_prod -->'
				,'<form id="parking_form" method="get" action="'
				,'<form id="parking_form"'
				,'<h2>Domain Parked'
				//,'adsense/domains/caf.js'
				,'Enterprise DNS Service.'
				,'display.cfm?domain='
				,'"http://www.searchignited.com'
				,'href="http://www.networksolutions.com/legal/static-service-agreement.jsp'
				,'uying this domain means full control and ownership.'
				,'domain_profile.cfm?d='//domains http://www.hugedomains.com/domain_profile.cfm?d=skypeforandroid&e=com
				,'domainpark/show_afd_ads.js'
				,'domainredirect=1'
				,'frame src="http://onlinefwd.com'
				//NO ,'domainname='
				,'godaddy.com/parked'
				,'google.ads.domains'
				//,'google.com/adsense/domains/caf.js'
				,'href="http://searchdiscovered.com'//src="http://searchdiscovered.com
				,'href="http://searchresultsguide.com'
				,'http://pagead2.googlesyndication.com/apps/domainpark/show_afd_ads.js'
				,'http://www.sedo.com/services/parking.php'
				,'images/parked_layouts'
				,'img.sedoparking.com/templates/'
				,'It has been reserved on gandi.net and parked as unused'
				,'mcc.godaddy.com/parked/park.aspx'
				,'parkedpage/style.css'
				,'quickfwd.com/?dn='
				,'src="http://dompark.'
				,'src="http://searchdiscovered.com'//src="http://searchdiscovered.com
				,'src="http://searchresultsguide.com'
				,'temporary Parking Page for'
				,'This domain is <a href="http://www.hugedomains'
				,'This domain is parked free, courtesy of'
				,'This page parked courtesy of'
				,'This web page is parked FREE, courtesy of GoDaddy.com'
				,'top.location="http://searchresultsguide.com'//http://searchresultsguide.com/?dn=howdoiuseandroid.com&pid=7POAYL1TT
				,'url=/?framerequest=1'
				,'window.location="http://www16.brinkster'
				/* parkeado */
				//	,'sedoparking.com'
				//,'ndparking.com/'
				//,'http://www.ndparking.com/'
				//	,'parklogic.com'
				,'</strong>se encuentra en parking</font>'
				,'<form name="parking_form"'
				,'<title>Parking dns'
				,'El dominio se encuentra en parking'
				,'href="/css/style_park.css">'
				,'href="/css/style_park.marquee4.css"'
				//	,'http://www.bodisparking.com/'
				,'domains.googlesyndication.com/apps/domainpark/'
				,'webregistrada.com.ar/parking.php'
				,'Este dominio esta en parking'
				//	,'PARKINGSPA.COM'
				//,'parkinglot=1'
				//,"googlesyndication.com/apps/domainpark"
				//,"sedoparking"
				//"parkingcrew.net"
				//,"parkpage."
				//,"fastpark.net"
				,'onmouseover="window.status=\'Aparcamiento De Dominios\' return true;" title="Aparcamiento De Dominios">'
				,'parkingcrew.net/sale_form.php?domain_name'
				,'http://parking.redcoruna.com'
				,'This user has not enabled any redirections'
			],
			hash:[''
				,'ddfcb201650fbd2309e015105029375a'
				,'0ba0c55fb14068ab4240e3d87f0346e8'
				,'108948d01ac637197aa4ec672a40d10f'
				,'b1946a29bbde65d8d59b3c19f6ba4232'
				,'7eaf4263ac2fa0b95d86ebf6811ae76b'
				,'4a11beadda8e2361d5893aadf2283832'
			]
		}

		//DONE
		, forSale: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'For Sale',
			errorStringUserFriendly: 'No Content',
			canDelete: true,
			body:[''
				,"domainnamesales.com/lcontact?d="
				,"domainnamesales.com/return_js.php?d="
				,'>Domain for sale'
				,'>Dominio en venta'
				,'Dominio_en_Venta'
				,"This domain may be for sale"
				,'.com is for sale!'
				,'.net is for sale!'
				,'<img src="/images/default/forsale.jpg" alt="For Sale" width="150" height="64" border="0">'
				,'id="a-4sale" onmouseover="window.status=window.defaultStatus;return true;"><u><b>SALE</b>'
				,'The domain is available for purchase'
				,'This domain for SELL'
				,'this domain is for sale'
				,'This domain may be for sale'
				,'This domain maybe for sale'
				,'¡Esta pagina está a la venta!'
				,'In case of trademark issues please contact the domain owner'
			],
			hash:[''
				,''
			]
		}

		//DONE
		, pendingRenew: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Pending Renew',
			errorStringUserFriendly: 'Pending Renew',
			canUnreview: true,
			body:[''
				,"and is pending renewal or deletion"
				,"and is pending renewal or deletion"
				,"This website is currently expired"
				,'has expired. If you owned this domain'
				,'expired/index.php?domain='
				,'has expired.</h2>'
				,'This domain has recently been'
				,'This domain name has expired'
				,' Este dominio se encuentra vencido '
				,'Click here</a> to renew it'
				,'es el titular de este dominio, contáctese por favor'
			],
			hash:[''
				,'2f8db628f9473b665a9a47cf330c3fd0'
				,'e2cc95cd393cd410b0c5dcdd81e84622'
			]
		}

		, gonePermanent: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Gone',
			errorStringUserFriendly: 'Not Found (Gone)',
			canDelete: true,
			body:[''
				,"<TITLE>Movistar.es - Error</TITLE>"
				,"The authors have deleted this site"
				,'msg-hidden">No hay ninguna entrada.</div>' //< blogspot empty
				,'<img src="/error/rcs/pxnada.gif" width="1" height="30">'
				,'<title> No such site available </title>'
				,'<title>Hometown Has Been Shutdown'
				,'is marked private by its owner. If you were invited to view this site'
				,'Blog dado de baja'
				,'Dominio desactivado</font'
				,'dominio se encuentra desactivado'
				,'Due to the market diffculty, we are unable to continue provide the free web hosting service.'
				,'Espacio WEB no existe'
				,'has been removed because it violated Tripod\'s Terms of Service.'
				,'http://iphone.terra.es/error.htm'
				,'inicia.es/home/error'
				,'is now closed</title>'
				,'Location: http://perso.orange.es/error/error_wanadoo.htm'
				,'Location: http://www.abc.es/failover/pagina.html'
				,'miarroba.com/error'
				,'msngroupsclosure'
				,'Unavailable Tripod Directory'
				//,'>Just another WordPress site<'
				//,'Welcome to WordPress. This is your first post'
				,'<h1>Este blog solo admite a lectores invitados'
				,'Sorry, the site you requested has been disabled'
			],
			hash:[''
				,'6c8402f9f7e9546f88da141b9fc7a20f' //no content
				,'e9924c39cb66daf0105e2d96dbca1029'
				,'c014207ca2fd20525e4139d2ca1802c5'
			]
		}


		, notFound: {
			errorCode: 404,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Not Found',
			errorStringUserFriendly: 'Not Found',
			canUnreview: true,
			body:[''
				,"<title>Página no encontrada</title>"
				,"http://www.host.sk/404.php"
				,'The requested resource is not found'
				,'<p>HTTP Error 404'
				,'<title>404 - Not found</title>'
				,'<h1>Not found...</h1>'
				,'Sorry, this content is no longer available.'
				,'You have typed the web address incorrectly'
				,'>Página no encontrada'
				,'La pàgina no existeix'
				,'The page that you are looking for cannot be found.'
				,'La page que vous avez demandée n\'existe pas'
				,'<title>404 Not Found'
				,'Aquesta pàgina no existeix'
				,'404 - Page Not Found'
				,'site you are looking for is not available'
				,"The page you are looking for could not be found"
				,'<h1>Sorry, this page is no longer available</h1>'
				,'<li>Verify the URL was typed correctly.</li>'
				,'<h4 class="errorHeading">404 - Not Found</h4>'
				,'page you are looking for may have been moved'
				,' specific page you are looking for is no longer available '
				,'<TITLE>404 Error page</TITLE>'
				,'<title>404 Not Found</title>'
				,'404/unavailable.jpg'
				,'Page or file not found'
				,'>Page Not Found<'
				,'<title>Page Not Found</title>'
				,'<title>Sorry, We Can\'t Find That Page'
				,'<TITLE>The page cannot be found</TITLE>'
				,'<title>The page is Unavailable'
				,'La página web solicitada no se encuentra disponible en este momento'
				,'The requested object does not exist on this server.'
				,'The requested page could not be found.'
				,'this site is experiencing difficulties at this time'
				,'was not found on this server.</p>'
				,'esta página ya no existe...'
				,'The resource you are looking for has been removed'
				,'página solicitada o la página no existe.'
			],
			hash:[''
				,'a52b513d7244d40895231f5c8f4b4e0c' //galeon.com
				,'b82f1348fe097a8d29ee16fa8db79e96'
			]
		}

		, serverPage: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Server Default Page',
			errorStringUserFriendly: 'No Content',
			canUnreview: true,
			body:[''
				,"cgi-sys/defaultwebpage"
				,'Test Page for the Nginx HTTP Server'
				,"Ferozo Panel de Control de Hosting"
				,'"welcomeText">Server Default page</p>'
				,'0;URL=/cgi-sys/defaultwebpage.cgi'
				,'<b>Welcome to a Brinkster Member\'s site!</b>'
				,'<h1>Default Web Site Page</h1>'
				,'<h1>It works!</h1>'
				,'<h3>Advance Web Hosting Solution'
				,'<title>cPanel'
				,'<TITLE>Default Index</TITLE>'
				,'<title>Default Parallels Plesk Panel Page</title>'
				,'This is the Plesk™ default page'
				,'<title>Default Web Site Page</title>'
				,'<title>Default Web Site Page</title>'
				,'<title>DreamHost</title>'
				,'<title>DreamHost</title>'
				,'<title>Domain Default page'
				,'<title>Free Website Hosting'
				,'<title>HostGator'
				,'<title>IIS7</title>'
				,'<title>Kloxo Control Panel</title>'
				,'Our site is temporarily unavailable, but will be back online shortly'
				,'<title>Manage Domain Name</title>'
				,'<title>Parallels H-'
				,'<title>Test Page for Apache Installation</title>'
				,'<title>Test Page for the Apache'
				,'<title>Apache HTTP Server Test'
				,'<title>Web hosting'
				,'<title>Welcome to DiscountASP.NET Web Hosting</title>'
				,'class="welcomeText">Domain Default page</p>'
				,'Default Parallels Plesk Panel Page'
				,'Esta es la página por defecto del dominio'
				//,'Free Web Hosting Provider'
				,'is the Plesk default page'
				,'ISPmanager control panel'
				,'Media Temple</title>'
				,'myhosting.com/Signup/domainselect.aspx'
				,'No web site is configured at this address.'
				,'Panel de Control de Hosting'
				,'Sign Up for Free Web Hosting'
				,'This page is autogenerated by <a href="http://www.parallels'
				,'To change this page, upload your website into the public_html directory'
				,'Unlugar Web Hosting</a>'
			],
			hash:[''
				,'293ed6f70104994a529c041e768eb909'//it works
				,'c4b05565f1c0888a49f0391c20a2442b'
				,'b1946a29bbde65d8d59b3c19f6ba4232'
				,'3ec9f569e734cbbb4357483e1bcee710'
			]
		}

		//host setup needs upload?
		, noContent: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'No Content',
			errorStringUserFriendly: 'No Content',
			canUnreview: true,
			body:[''
				,'<h1>Your website is up and running!</h1>'
				,'<th>Welcome to your future Web Site Creator</th>'
				,'site has not yet been published.</title>'
				,'The domain owner may currently be creating a great site for this domain'
				,'This domain has just been registered for one of our customers'
				,'This is a default template, indicating that the webmaster has not yet uploaded'
				//,'This is your first post. Edit or delete it'
				,'To create a website, do one of the following'
				,'You can access your hosting account control panel'
				,'<h1>This domain name has been registered with '
				,'<title>The domain '
				,'Si Ud es el administrador del dominio'
				,'Este sitio estara funcionando en breve'
				,'<title>This domain is registered '
				,'>Upload your website to get started'
				,'Bienvenido al dominio '
				,'Joomla! Community Portal</a> is now online'
				,'information of this domain or check other names'
				,'no content has been uploaded'
				,'this web site is now reserve'
				,' Su dominio ya está en funcionamiento '
				,'The web site has been archived, access to the control panel to restore it'
				,'This web site has just been created'
				,'This is the default index page of your website.'
				,'This domain is not configured on this service.'
				,'le informamos que el mismo ya esta registrado y no ha sido delegado aun a los servidores correspondientes'
				,'Diese Seite kann nicht aufgerufen werden, da die Webseite derzeit keine Unterseiten hat'
			],
			hash:[''
				,'99914b932bd37a50b983c5e7c90ae93b' // total empty
				,'9e102d813ede6f725f3012777abac235' //yahoo empty group
				,'135fe587263d965f48cf470017c0dc7d' //image only
				,'1407918bdcb1a5518ba70eba71b8b112' //image only
				,'edc9bf9f5ea4615503c92d4736eb3e28' //empty
				,'e91ba74ca066091f908764402be64276'
				,'6e0c15e36db89f8186af64b348378121'
				,'52e34692785bfe13338ff091cfaf16d3'
				,'743efa7d6721920d02c7b4be073194b0'
				,'94fa9a68095a6339670013a6223b9c7f'
				,'3ee42e9db9175a652a68eea2b8f9c2b4'
			]
		}

		//blogger, yahoo groups, etc
		, requiresLogin: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Requires login',
			errorStringUserFriendly: 'Requires login',
			canUnreview: true,
			body:[''
			],
			hash:[''
				,'60004349c15b40b5f3e1f2e11fe247ae'
			]
		}


		//PAGE ERRORS
		, pageErrors: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Page Error',
			errorStringUserFriendly: 'Page Error',
			canUnreview: true,
			body:[''
				,"<b>Fatal error</b>:  require_once("
				,'Cache_Lite : Unable to write cache file'
				,'(using password: YES)'
				,'<a href=\'function.include\'>function.include</a>'
				,'<b>Fatal error</b>:  Allowed memory size'
				,'Unable to connect to database'
				,'Could not connect to server localhost '
				,'An SQL error has occurred. Please see error.log for details'
				,'DB_DataObject Error: Connect failed'
				,'Error displaying the error page'//LOL
				,'Fatal error: Access to undeclared static property'
				,'Fatal error: Internal Zend error '
				,'Lost connection to MySQL server '
				,'MySQL connection error'
				,'Mysql Server baglantisi saglanamiyor'
				,'application is too busy right now.'
				,'Serwis zosta³ zablokowany' //service has been locked
				,'This site is no longer operational'
				,'<b>Fatal error</b>:  Cannot redeclare'
				,'Cannot modify header information - headers already sent by'
				,'<b>Parse error</b>:  syntax error'
				,'Database Error: Unable to connect'
				,'header already sent.'
				,'Unable to select database'
				,'We were able to connect to the MySQL database server'
				,'INSERT command denied to user'
				,'marked as crashed and should be repaired '
				,'Microsoft OLE DB Provider for SQL Server'
				,'[an error occurred while processing this directive]'
				,'Cannot open database'
				,'Could not select DB:'
				,'Database connection error (2)'
				,'Database Error: Unable to connect to the database'
				,'Deprecated: Assigning the return value'
				,'Faltan parámetros de conexión a la base de datos'
				,'Fatal error: Call to undefined function '
				,'Infinite loop detected in JError'
				,'No configuration file found and no installation code available.'
				,'No se puede conectar a la base de datos'
				,'PHP Fatal error:'
				,'Warning: Cannot modify header information '
				,'session_register() in '
				,'<b>Strict Standards</b>:  Non-static'
				,'FATAL ERROR: register_globals'
				,'Error conectando a la base de datos.'
				,'Template Error: The template file must be given'
				,'Unknown storage engine \'InnoDB\' '
				,'Your host needs to use PHP '
				,'An unexpected error has occurred in pages'
				,'Tu servidor estÃ¡ ejecutando la versiÃ³n'
			],
			hash:[''
				,'b021286b8c0607c83ba1ed0d3c2f7bf4'
				,'12f755b0ff7fcf51f2b4194e00727afb'
			]
		}

		//DONE
		, serverErrors: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Server Error',
			errorStringUserFriendly: 'Server Error',
			canUnreview: true,
			body:[''
				,"<h1>Bad Request (Invalid Hostname)</h1>"
				,'<h1>Forbidden</h1>'
				,"<title>Index of /"
				,'Forbidden</title>'
				,'<title>403 Forbidden</title>'
				,'<title>500 - Internal server error.</title>'
				,'<title>Index of /'
				,'<TITLE>Index of /</TITLE>'
				,'<TITLE>DOMAIN ERROR</TITLE>'
				,'<A HREF="/cgi-bin/">cgi-bin</A>'
				,'Access denied.'
				,'Apache is functioning normally'
				,'>Site Currently Unavailable<'
				,'Service Unavailable'
				,'su acceso ha sido denegado por seguridad'
				,'Error en el servidor al procesar la dirección URL. '
				,'No input file specified.'
				,'<title>Runtime Error</title>'
			],
			hash:[''
				,'590071db26ae1b0040854992f2bf3d55' // simil 404/500/xxx
				,'b4ff138acf7fdd7031c86ff9fbf48d70'
				,'62dbee2f4c4a8d3ac210f693f79792ea' // simil 404/500/xxx
				,'443783b65d23e45563ae17540ef5e2a4'
				,'6c8402f9f7e9546f88da141b9fc7a20f'
				,'95ceda08d46f0c6defaab26f48b3bacd'
				,'4ba26d6933a2b3fcfc1a56f8b7342f68'
				,'7c72e06c777b4311e7d28b3c0a161d22'
				,'fac8191e5f8990631d6cbf4197101734'
				,'c6136172b1a7a79b747eed504e0ec911'
				,'49f1dfa122e446428c432abf92a52609'
				,'467512538e6a22798d1728e950bf77c1'
				,'1600d88822b00ca68778ba224b080406'
				,'4144b914435d933bf2a65a3bffa67e0b'

			]
		}

		//DONE
		, underConstruction: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Under Construction',
			errorStringUserFriendly: 'Under Construction',
			canUnreview: true,
			body:[''
				,"<title>Site under maintenance"
				,"Estamos trabajando. Pronto estaremos de vuelta"
				,"Pagina en mantenimiento"
				,'Siti en mantenança'
				,'le site est en maintenance revenez '
				,'está en construcción :)'
				,'Diese Homepage wird derzeit gewartet'
				,'sito in ricostruzione'
				,'>Under Maintenance<'
				,'site been down for the maintenance purpose'
				,'The site is under Maintenance'
				,'<title ID=titletext>En construcción</title>'
				,'<title>Cette page est en construction</title>'
				,'<title>Sitio fuera de línea'
				,'<title>Under Construction</title>'
				,'服务器维护中，请稍候访问'//server maintenance
				,'论坛维护升级，暂停访问'//Forum maintenance upgrades, suspend access
				,'sistema de foros se encuentra cerrado temporalmente'
				,'<title>Web Page Under Construction</title>'
				,'Be project</b> està en construcció'
				,'El sitio está desactivado por tareas de mantenimiento'
				,'esta actualmente en contrucción...'
				,'This website is currently under construction'
				,'Estamos actualizando la web'
				,'Estamos construyendo nuestra nueva página'
				,'ID=titletext>Under Construction</title>'
				,'project_underconstruction_page_'
				,'>Under Construction<'
				,'>Sitio bajo construccion<'
				,'This page is under construction'
				,'Página en Construcción'
				,'PAGINA EN CONSTRUCCION'
				,'SITIO EN CONSTRUCCION'
				,'Sitio en construcción'
				,'Site closed for maintenance'
				,'This site is under construction'
				,'This site is currently under construction'
				,'underconstruction.networksolutions.com'
				,'img/under_construction'
				,'Estamos en obras en la página'
				,'>En construcción<'
				,'Esta pagina esta en Construcción '
				,'entraram em reformulação. Volte em breve'
				,'la pagina está en remodelación'
				,'ESTAMOS MODIFICANDO LA WEB'
				,'Este Sitio se Encuentra en Mantenimiento'
				,'Site Under Maintenance'
				,'Sitio en mantenimiento.'
				,'SITIO TEMPORALMENTE EN CONSTRUCCION'

				,'we\'re currently undergoing maintenanc'
				,' actualmente nuestro sitio web está bajo mantenimiento'
				,'ration de maintenance afin de vous fournir une meilleure exp'
				,'may be temporarily unavailable, moved'
				,'being setup or not available at this moment'
				,'The site you are trying to view is either'
			],
			hash:[''
				,'c8badc7e23f3e90ca3aa35a34f2c926a'
			]
		}

		//DONE
		, comingSoon: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Coming Soon',
			errorStringUserFriendly: 'Coming Soon',
			canUnreview: true,
			body:[''
				//,'<p>coming soon</p>'
				,'<title>Coming Soon -'
				,'<title>coming soon'
				,'<title>This Web site coming soon</title'
				,'Coming Soon!</h1>'
				,'Real content coming soon'
				,'>Coming Soon Plugin<'
			],
			hash:[''
				,''
			]
		}

		//DONE
		, suspended: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: true,
			errorString: 'Suspended',
			errorStringUserFriendly: 'Suspended',
			canUnreview: true,
			body:[''
				,"cgi-sys/suspendedpage.cgi"
				,'<b>This Account Has Been Suspended</b>'
				,'The web service to this account has been limited temporarily'
				,'<title>Account Suspended</title>'
				,'<title>Servicio suspendido.</title>'
				,'<title>Sitio Suspendido</title>'
				,'<title>Your website has been suspended!</title>'
				,'Bandwidth Limit Exceeded</TITLE>'
				,'suspended.page/">here'
				,'>The requested domain name has been suspended'
				,'suspendida por razones de seguridad</title>'
				,'If you are the site owner, please'
				,'This account has been suspended</title>'
				,'/suspended.page/'
				,'Suspendido, póngase en contacto con administración'
				,'<title>Suspended Domain</title>'
				,'<title>Dominio temporalmente inactivo</title>'
				,'Dominio desactivado'
				,'This account has been suspended'
			],
			hash:[''
				,'8eb192eac8400242e57e007d0fd11a52'
				,'43caffb4795a92dee310eacc211a2a09'
				,'49fffef8d1e9159e8e763adfbc84f757'
			]
		}

		//DONE
		, hacked: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Hacked',
			errorStringUserFriendly: 'Hacked',
			canUnreview: true,
			body:[''
				,'<title>Hacked By '
				//,'title>HaCked By'
			],
			hash:[''
				,''
			]
		}
		, messageFromOwner: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Website Message',
			errorStringUserFriendly: 'Message from website owner',
			canUnreview: false,
			body:[],
			bodyIfMatchHash:[''
				,'puedes visitar la nueva url'
				,'moved to new location'
				,'moved to a new location'
				,'visit new website location'
				,'url moved to'
			],
			hash:[''
				,'869a4716516c5ef5f369913fa60d71b8'
			]
		}

		, hijacked: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Hijacked',
			errorStringUserFriendly: 'No Content',
			canDelete: true,
			body:[''
				,'.credonic.com'
				,'/?fp='
				,'/www.dotearth.com/servlet/DeRedirect'
				,'<div class="relHdr">Related Searches</div>'
				,'<frame name="pp"'
				,'<frame src="http://domain.dot.tk/p/?d='
				,'<title>"Domain-Name.bz"'
				,'Below are sponsored listings for goods and services related to'
				,'class="resMain"><h2>Sponsored listings for'
				,'Disclaimer: Domain owner maintains no relationship with third party advertisers'
				,'hosting24.com/count.php"><'
				,'http://www.searchnut.com/?domain=refererdetect'
				,'iframe src=\'http://cw.gabbly.com/'
				,'iframe src="http://cw.gabbly.com/'
				,'star-domain.jp/'
				,'traffic.ddc.com'
			],
			hash:[''
				,''
			]
		}

		, dirty: {
			errorCode: -8,
			errorCodeApplyOnOKOnly: false,
			errorString: 'Dirty',
			errorStringUserFriendly: 'Dirty',
			canDelete: false,
			canUnreview: true,
			body:[''
				,'viagra'
				,'phentermine'
				,'porn'
				,'casino'
			],
			hash:[''
				,''
			]
		}

		//frames >= 2
		, hasFrameset: [''
			,'5db7da424597447e08e86b3654c3c166'
			,'118c9a447d2f83dc72fb23295bbec3ab'
			,'386aca97ed361cead74c01de619b68f3'
			,'6179ff4d515590c835aec633e099887a'
			,'dfc9cbec3f47864a283a4795b737948d'
			,'3d807b4fb6a5c1fa97008f063d8baa43'
			,'7e1f3343e0d6908cd3fc3ff7dfea4041'
			,'1a3620478142eff409bd425e3363b51a'
			,'d3519e204991d97dbb703babb46c986a'
			,'44568b9a99485442459fa3f39554b880'
			,'cd2f727b4ff1a9e1897226585de85ce8'
			,'cac0753c1ae11591f2878a62e6279c7d'
			,'aa5075340317818fb79b7f4dde337287'
			,'ce4e359b9a13e1f9ef6c7fa3e70d2f02'
			,'01ea428a177a06cd85a5ae1843261ae4'
			,'57f2edf8c9eadbe04e5717007bdbec83'
			,'29502e8b8dd4f30cf03dbf0719258bf3'
			,'b299d877d793c1a929594aa12cb488b4'
			,'c64c6638612f3db40d6220d189488127'
			,'69e33e142674045fa0f766a917fb2a66'
			,'de4922f768901d3bcde3ccaacad26a79'
			,'2387cd8ca910156d970c1c115f2b9fe1'
			,'dd1d4c14ab10bdc45348cc6182ce60a4'
			,'18de8ceccbda2f4faa4ce29d6308d050'
			,'e94797bac59dff038fce73f8b8b5c25f'
			,'a5e6963ceb677ad905062f067ee9da9b'
			,'2097f0ceaae774266bf15a55100d0d63'
			,'80bf68d4e33d7f9bd139afe548e34f00'
			,'4c2f6938c2b62e498021a032eae67a89'
			,'2ff9019c7b9815d9c01600fc14526b83'
			,'620b48e533ee2e9ab60a5d8e317771f0'
			,'397a2cf66fbbf509d7ea899c2580fe8c'
			,'be5d26f3b154fdf5694550afb8bde79d'
			,'0e0fef63a24a85fdc2e2dee95bc0c23f'
			,'5bab3e30bd93eb26feeed89180177959'
			,'f03f9950d7eed619a57b952b2d1e6691'
			,'abf4fbcbf6c3d5b6c0e431ab60d963bf'
			,'f1073770981f210a6b6b1feaa7b9ee09'
			,'f6f908c8f15f0c1af990338502ca8e45'
			,'11cda5241f6f2834abdbe65834f80df0'
			,'9cd58131ed69d484ae4671f2b68590bd'
			,'55ee0b761b8797d6ed5a06af150e443b'
			,'8b964e99efecbc137a959b4827190544'
			,'309368d60a1eee6b4e25e488a0b24c29'
			,'bb0cd1034c1bfd45a763a4d625e3e964'
			,'d60fdc42ce3026e77284a7c3413f64a9'
			,'9262988f144b656d003fe3c0d75427d8'
			,'2463ba8b1a54522277579137a801dc7e'
			,'77545e41fec4ae94269f94f7c5647883'
			,'7b309962a693cdedf411e62a9ded8d0b'
			,'dd5aabc04187e7bce9fe14ca2fec1364'
			,'658b54b76f0ec464fb4eafb4aa0f297b'
			,'a2b38ecd0c440affd06e63057e531394'
			,'5ee97e84a48f3b019e1688632aa94662'
			,'b70a342f6ee04a12ed855438b6474151'
			,'2463ba8b1a54522277579137a801dc7e'
			,'dd5aabc04187e7bce9fe14ca2fec1364'
			,'a5bb53077e10d6dacd927e9330cb41fb'
			,'e0f0fe4cbcf48641b073b0687b0a45b5'
			,'893f6a2196d1a98e9dd4f521f88dad0e'
			,'6fa0599775aabdc767dd8ccce129ff4a'
			,'7b309962a693cdedf411e62a9ded8d0b'
			,'dbd8cfd83c9be698f2c7be1ad2f8b524'
			,'d29552f01acf30d7f78960d469f4b993'
			,'6c598fd0f1a7582993099c61a51d8737'
			,'5241ce5fb52b95e288800c4c3c2ea6e7'
			,'f9c6f14be4581605ae28302188ac85e9'
			,'d60fdc42ce3026e77284a7c3413f64a9'
			,'886c317a0d3144e7e77409ee70dd8f85'
			,'81a05839016b88c59ee7c77ffba78df5'
			,'56a00ade18bc4f6f91ca12b7ff48d5b6'
			,'e5f7d669ddfacad7b769c22ce4db06c2'
			,'e3b4bec86d20c0bcd7db28412e1539f8'
			,'dae00eaa2043f499823f5c6af7b5a632'
			,'987f198ca86ccf048819424430d58010'
			,'8c5a42fb308886bd4dce8767f470a2a8'
			,'53ec56fcfaa4040f5260ad5b410e4be9'
			,'fc81ce421b6fe8594d1f8f6095946afa'
			,'f4caa80a06a2430f5e837f0aa97a9de1'
			,'f2bbb4163823045dc3f3c8ef30e2c321'
			,'ef7fd3653620ffab749b3c5e44db3b85'
			,'eee6c986f695463779935f12093b612b'
			,'dafe4b9400d96ca3ad47ec2a07708c8b'
			,'c8b68be060dde1f141e6a1321c98c54f'
			,'c71de894bc66a2fc0b60554e7f48db7b'
			,'aed1df3fb0a96623fde2e62b9c97438c'
			,'2998a8a8ad46f428e671b5f5f561f716'
			,'13e1b440408bcc4b922ac6a4698797e8'
			,'f7f8f38ae8fa4b861cec77dc919000a0'
			,'f2ddec01d75222819c284e6d665d34db'
			,'f153fe771d6af89cde5d763b69b0075e'
			,'d42fca241c061416bd53f3ac6ea26d98'
			,'89d9a072cce30957d08c66ad37a5fe84'
			,'897178d192fa139e83981becd70c18a6'
			,'886b087f26078a476fe3aae9cfb5169d'
			,'635a538ede957977d93e020764b91786'
			,'5e82fb1b30616662e33b231cee46d971'
			,'55b080285a892e20ee5af5ac814126d3'
			,'39f68b3e011a1423b6fe6d51065444fb'
			,'20fb2a2280fdfdc483e2a1c43d724bf0'
			,'20a7f12e8ccdc4e3a84e430d7210798c'
			//
		]
		//redirect
		, hasFramesetRedirect : [''
			,'0a4a9c4a62cbbcb1b41336ad4b3bae8c'
			,'12a692eea1ed3bafab391965a7d0fe5f'
			,'14aa75367bf3766186ce672f910dc9b9'
			,'16a287493258aba2dcabe0a1c051b57b'
			,'a08e7d1e3185d454f18f91f148e23b8f'
			,'1a7fc69f06acc2befc980d9a8c313ce9'
			,'1f6abc0f29b0b0cc7e7dc694f11730ba'
			,'21828827b4e5f0fef59df13be49e3c22'
			,'23d982ba6b6f8847235e48a790e81ea2'
			,'2a1e4efe12134d3441e80706fe34a515'
			,'b3b6de1ba3d3c284e5f8b0024b1a47ca'
			,'32455c23283b48ac9ad18c871c01b74e'
			,'37bf7b32ca7f80645cd9c5ce1c87d8ec'
			,'8c362dae12126c41c448132e011079e9'
			,'4b2d344b0a2bd1c043f337d65ee22ab6'
			,'ef69fbdb04d5c9c54a77743294bbce0a'
			,'4c852154a2855b68dfb5908e6be750ac'
			,'4e5a9065522e9f307a8ec2292c9f0826'
			,'524a0d52c48a8bfabc60554c4fa67281'
			,'c353e6d9585c5dfc47cc0c3c4463e4e7'
			,'64ea41a1dab5ef2701c794e7a44d84fe'
			,'7b50091125fb2f5b7ff2c5dcef3e60aa'
			,'332fb7f763a598b36ae56e326a6926c6'
			,'6722a9580e8a336bc688cd3bdfac48ff'
			,'76b314ad940f64e0f49342d607e8df2b'
			,'672c1d7ce1578935eaa4c2f29aae9186'
			,'677b9a65d4e97b563930227d4f9accc3'
			,'6ddbdb662342d041b4aabb0397f031a6'
			,'745a7e6e166e63ed28fdf654f414fad7'
			,'7b7c4e6bc3f58cd8850936fadfe79971'
			,'8711b6134ef80ab03303eaa23a446bba'
			,'8ae5521b76f70faca8efe6dc97089caf'
			,'8b7486ff7e071c242862d5437f275628'
			,'8cf659b49c725a1cbec3ab656ab6dd43'
			,'8d269106884c064e33ccead1e259812c'
			,'9795639982c288ea5cd64d455fa69075'
			,'a13e6f2bb4f1c652bf4229a6b0fe27af'
			,'a2335c30660623f4a428e99f8059eb65'
			,'a64a2fd3b940e83aa514db019b08bc7d'
			,'a9d3faea8da3adf870dd69563e82f695'
			,'acfc9a393c0cf1e034a739bc5e737278'
			,'af52f7695d3f5610fda87fc410f555cb'
			,'bdd6d9249f2275e7bcc4f114a3109fa9'
			,'beac15c0b3d7e145d801cb3d0122e384'
			,'c3f0a0873e3c26fc956aed4ba6d5a3dc'
			,'c52e6b14d49a39488d161bea83dc9418'
			,'c71308ffd13780a39417309bc981b36c'
			,'dce7fa62d88418279b6a198168664ef9'
			,'e24dc7cab01b1c90e495b59afe320c59'
			,'eb3ebcd5ce5f19d3c2e36080a6fc058c'
			,'f17350088611962e835fa6a04446890f'
		]
		//known flash
		, hasFlash:[''
			,'446057675417b2d3295a46d07c22d43a'
			,'621d2ab9b6a84e3997bb4ca4d059489a'
			,'6aaa599df6535baafd6d1abeefa0a07c'
			,'5667f108ba37421a176c9edc2286da01'
			,'1889350528b3cd3a8a1d324fef02ba0a'
			,'54f382e6ab90ad35450522c32c8b0f5d'
			,'c247925bb986992dfbde496de9f29493'
			,'434ecdc65952825dcb7192d8bf840798'
			,'ed3563c38ce1b556631313d0f4f14537'
			,'369811f46d61e66071a858da0c8d93e6'
			,'f2e8c4578ed47359cc128f931ae90fc3'
			,'f2bb54f522975301c86fd8d99143e7cf'
			,'40efdc616dca7b9bebff64864e56ee43'
			,'fcc45ded2a69f0fea753cac107f56572'
			,'8cc270e6db4daff6e971c9ceec2ef4f4'
			,'5b79621a2ebb7a0a7600b42be2248a70'
			,'3e91096e13ee2e0ea55b1c0fd3bc97b3'
			,'0fe6e75217560d3b97f36cdbd76eb818'
			,'07eff20cd42cfaa46ca92ddaaad5020a'
			,'ef3e6d5b0e3c6f1160871509d0486f6f'
			,'a92b58c1a3a269655a9440a192ad7c22'
			,'7551fb3c8286055fd45b783832650be6'
			,'63525e08e78152436af2ec886d7e8c09'
			,'24a3468c708f61617d1899bacb5fa315'
			,'4aee39aef93da1eb6a8833977cadff7d'
			,'1a1268f68889a94692871acbbaf03c78'
			,'0d6c72099b668bd0d802ece8d40d366d'
			,'014c909b899a8151cc085ec07b444abb'
		]
		//just known
		, known : [''
			,'be6e318e14ca5aa7e1227808be2f15c9' //design
			,'fc0ca0e30d7f2673fa08c0482ed3f152'//pdf
			,'4829ce6bb0951e966681fe2011b87ace'//rss/atom/xml/rdf
		]
		, hash:[''] //bad boy

	};

	return null;

}).apply(ODPExtension);
