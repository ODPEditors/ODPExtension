(function()
{
	this.urlFlags = {
		parked: {
			errorCode: -8,
			errorString: 'Parked',
			canDelete: true,
			body:[''
				,"domainname=referer_detect"
				,"http://www.sedo.com/search/details.php4?domain="
				,"script src=\"http://dsparking.com"
				,'/?fp='
				,'/parked/dns/'
				,'000webhost.com</title>'
				,'200.62.55.254/estilos_parked.css'
				,'<!-- turing_cluster_prod -->'
				,'<form id="parking_form" method="get" action="'
				,'<form id="parking_form"'
				,'<h2>Domain Parked'
				,'adsense/domains/caf.js'
				,'display.cfm?domain='
				,'domain_profile.cfm?d='//domains http://www.hugedomains.com/domain_profile.cfm?d=skypeforandroid&e=com
				,'domainpark/show_afd_ads.js'
				,'domainredirect=1'
				,'frame src="http://onlinefwd.com'
				,'godaddy.com/parked'
				,'google.ads.domains'
				,'google.com/adsense/domains/caf.js'
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
				//	,'PARKINGSPA.COM'
				//,'parkinglot=1'
				//,"googlesyndication.com/apps/domainpark"
				//,"sedoparking"
				//"parkingcrew.net"
				//,"parkpage."
				//,"fastpark.net"
				,'onmouseover="window.status=\'Aparcamiento De Dominios\' return true;" title="Aparcamiento De Dominios">'
				,'parkingcrew.net/sale_form.php?domain_name'
			]
		}

		, forSale: {
			errorCode: -8,
			errorString: 'For Sale',
			canDelete: true,
			body:[''
				,"domainnamesales.com/lcontact?d="
				,"domainnamesales.com/return_js.php?d="
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
			]
		}

		, pendingRenew: {
			errorCode: -8,
			errorString: 'Pending Review',
			canUnreview: true,
			body:[''
				,"and is pending renewal or deletion"
				,"and is pending renewal or deletion"
				,"This website is currently expired"
				,'has expired. If you owned this domain'
				,'has expired.</h2>'
				,'This domain has recently been'
				,'This domain name has expired'
				,'Click here</a> to renew it'
			]
		}

		, gonePermanent: {
			errorCode: -8,
			errorString: 'Gone',
			canDelete: true,
			body:[''
				,"<title>Blogger: Sign in</title>"
				,"<TITLE>Movistar.es - Error</TITLE>"
				,"The authors have deleted this site"
				,'msg-hidden">No hay ninguna entrada.</div>' //< blogspot empty
				,'<img src="/error/rcs/pxnada.gif" width="1" height="30">'
				,'<title> No such site available </title>'
				,'<title>Hometown Has Been Shutdown'
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
				,'su acceso ha sido denegado por seguridad'
				,'Unavailable Tripod Directory'
				,'Welcome to WordPress. This is your first post'
				,'<h1>Este blog solo admite a lectores invitados'
			]
		}


		, goneTemporal: {
			errorCode: -8,
			errorString: 'Not Found',
			canUnreview: true,
			body:[''
				,"<title>Página no encontrada</title>"
				,"http://www.host.sk/404.php"
				,"The page you are looking for could not be found"
				,'<h1>Sorry, this page is no longer available</h1>'
				,'<h4 class="errorHeading">404 - Not Found</h4>'
				,'<TITLE>404 Error page</TITLE>'
				,'<title>404 Not Found</title>'
				,'<title>Page Not Found</title>'
				,'<title>Sorry, We Can\'t Find That Page'
				,'<TITLE>The page cannot be found</TITLE>'
				,'<title>The page is Unavailable'
				,'La página web solicitada no se encuentra disponible en este momento'
				,'The requested object does not exist on this server.'
				,'The requested page could not be found.'
				,'this site is experiencing difficulties at this time'
				,'was not found on this server.'
				,'was not found on this server.</p>'
			]
		}

		, serverPage: {
			errorCode: -8,
			errorString: 'Server Default Page',
			canUnreview: true,
			body:[''
				,"cgi-sys/defaultwebpage"
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
				,'<title>Default Web Site Page</title>'
				,'<title>Default Web Site Page</title>'
				,'<title>DreamHost</title>'
				,'<title>DreamHost</title>'
				,'<title>Domain Default page'
				,'<title>Free Website Hosting'
				,'<title>HostGator'
				,'<title>IIS7</title>'
				,'<title>Kloxo Control Panel</title>'
				,'<title>Manage Domain Name</title>'
				,'<title>Parallels H-'
				,'<title>Test Page for Apache Installation</title>'
				,'<title>Test Page for the Apache'
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
			]
		}

		, emptyMeaningNoContent: {
			errorCode: -8,
			errorString: 'No Content',
			canUnreview: true,
			body:[''
				,'<h1>Your website is up and running!</h1>'
				,'<th>Welcome to your future Web Site Creator</th>'
				,'site has not yet been published.</title>'
				,'The domain owner may currently be creating a great site for this domain'
				,'This domain has just been registered for one of our customers'
				,'This is a default template, indicating that the webmaster has not yet uploaded'
				,'This is your first post. Edit or delete it'
				,'To create a website, do one of the following'
				,'You can access your hosting account control panel'
				,'<h1>This domain name has been registered with '
			]
		}

		, pageErrors: {
			errorCode: -8,
			errorString: 'Has Errors',
			canUnreview: true,
			body:[''
				,"<b>Fatal error</b>:  require_once("
				,"<h1>Bad Request (Invalid Hostname)</h1>"
				,"<title>Index of /"
				,'(using password: YES)'
				,'<b>Fatal error</b>:  Allowed memory size'
				,'<b>Fatal error</b>:  Cannot redeclare'
				,'<b>Parse error</b>:  syntax error'
				,'<h1>Forbidden</h1>'
				,'<title>403 Forbidden</title>'
				,'<title>500 - Internal server error.</title>'
				,'<title>Index of /'
				,'<TITLE>Index of /</TITLE>'
				,'Database Error: Unable to connect'
				,'Forbidden</title>'
				,'header already sent.'
				,'Microsoft OLE DB Provider for SQL Server'
			]
		}

		, underConstruction: {
			errorCode: -8,
			errorString: 'Under Construction',
			canUnreview: true,
			body:[''
				,"<title>Site under maintenance"
				,"Estamos trabajando. Pronto estaremos de vuelta"
				,"Pagina en mantenimiento"
				,'<title ID=titletext>En construcción</title>'
				,'<title>Cette page est en construction</title>'
				,'<title>Sitio fuera de línea'
				,'<title>Under Construction</title>'
				,'<title>Web Page Under Construction</title>'
				,'Be project</b> està en construcció'
				,'El sitio está desactivado por tareas de mantenimiento'
				,'esta actualmente en contrucción...'
				,'Estamos actualizando la web'
				,'Estamos construyendo nuestra nueva página'
				,'ID=titletext>Under Construction</title>'
				,'Página en Construcción'
				,'PAGINA EN CONSTRUCCION'
				,'SITIO EN CONSTRUCCION'
				,'Sitio en construcción'
				,'Site closed for maintenance'
				,'This site is under construction'
				,'underconstruction.networksolutions.com'
				,'img/under_construction'
				,'Estamos en obras en la página'
				,'>En construcción<'
				,'la pagina está en remodelación'
			]
		}

		, comingSoon: {
			errorCode: -8,
			errorString: 'Coming Soon',
			canUnreview: true,
			body:[''
				,'<p>coming soon</p>'
				,'<title>Coming Soon -'
				,'<title>coming soon'
				,'<title>This Web site coming soon</title'
				,'Coming Soon!</h1>'
				,'Real content coming soon'
			]
		}

		, suspended: {
			errorCode: -8,
			errorString: 'Suspended',
			canUnreview: true,
			body:[''
				,"cgi-sys/suspendedpage.cgi"
				,'<b>This Account Has Been Suspended</b>'
				,'<title>Account Suspended</title>'
				,'<title>Servicio suspendido.</title>'
				,'<title>Sitio Suspendido</title>'
				,'<title>Your website has been suspended!</title>'
				,'Bandwidth Limit Exceeded</TITLE>'
				,'suspended.page/">here'
				,'suspendida por razones de seguridad</title>'
				,'This account has been suspended</title>'
				,'/suspended.page/'
			]
		}

		, hacked: {
			errorCode: -8,
			errorString: 'Hacked',
			canUnreview: true,
			body:[''
				,'<title>Hacked By '
				,'HaCked By Virus-IM'
			]
		}

		, hijacked: {
			errorCode: -8,
			errorString: 'Hijacked',
			canDelete: true,
			body:[''
				,'.credonic.com'
				,'/?fp='
				,'/www.dotearth.com/servlet/DeRedirect'
				,'<div class="relHdr">Related Searches</div>'
				,'<frame name="pp"'
				,'<frame src="http://domain.dot.tk/p/?d='
				,'<html lang="ja"'
				,'<title>"Domain-Name.bz"'
				,'Below are sponsored listings for goods and services related to'
				,'buy phentermine'
				,'class="resMain"><h2>Sponsored listings for'
				,'Disclaimer: Domain owner maintains no relationship with third party advertisers'
				,'hosting24.com/count.php"><'
				,'http://www.searchnut.com/?domain=refererdetect'
				,'iframe src=\'http://cw.gabbly.com/'
				,'iframe src="http://cw.gabbly.com/'
				,'star-domain.jp/'
				,'traffic.ddc.com'
			]
		}
	};

	this.urlFlagSempty = [''
		,'test'
		,'test page'
		,'hello'
		,'hello!'
		,':)'
		,':-)'
		,':'
		,'-'
		,'yes'
		,'no'
		,':-('
		,':('
		,'welcome'
		,'welcome!'
	];


	return null;

}).apply(ODPExtension);
