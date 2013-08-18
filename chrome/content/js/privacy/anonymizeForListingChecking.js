(function()
{
		//sets debuging on/off for this JavaScript file

			var debugingThisFile = true;


			//this function removes lots of thing that maybe are private 
			//but remove too things that not make sense to sent to the listings server
			
			this.anonymizeForListingChecking = function(aURL)
			{
				var aDomain = this.getDomainFromURL(aURL);
				var aSubdomain = this.removeWWW(this.getSubdomainFromURL(aURL));

				/*mutimedia files*/
					/*images*/
					aURL = aURL.replace(/\/[^\/]*\.jpg$/i, '/').replace(/\/[^\/]*\.jpeg$/i, '/');
					aURL = aURL.replace(/\/[^\/]*\.gif$/i, '/').replace(/\/[^\/]*\.png$/i, '/');
					/*videos*/
					aURL = aURL.replace(/\/[^\/]*\.mpg$/i, '/').replace(/\/[^\/]*\.mpeg$/i, '/');
					aURL = aURL.replace(/\/[^\/]*\.mov$/i, '/').replace(/\/[^\/]*\.wmv$/i, '/');
					/*flash*/
					aURL = aURL.replace(/\/[^\/]*\.flv$/i, '/').replace(/\/[^\/]*\.swf$/i, '/');
					/*music*/
					aURL = aURL.replace(/\/[^\/]*\.mp3$/i, '/').replace(/\/[^\/]*\.wav$/i, '/');
					aURL = aURL.replace(/\/+$/, '/');
					
				if(aURL.indexOf('?') != -1)
				{
					/*q= privacy*/
						aURL = aURL.replace(/q\=[^\&]*\&/gi, '').replace(/q\=[^\&]*$/i, '');
					/*session privacy*/
						aURL = aURL.replace(/cfid\=[^\&]*\&/gi, '').replace(/cfid\=[^\&]*$/i, '');
						aURL = aURL.replace(/cftoken\=[^\&]*\&/gi, '').replace(/cftoken\=[^\&]*$/i, '');
						aURL = aURL.replace(/phpsessid\=[^\&]*\&/gi, '').replace(/phpsessid\=[^\&]*$/i, '');
						aURL = aURL.replace(/session\=[^\&]*\&/gi, '').replace(/session\=[^\&]*$/i, '');
						aURL = aURL.replace(/sessid\=[^\&]*\&/gi, '').replace(/sessid\=[^\&]*$/i, '');
						aURL = aURL.replace(/sess\=[^\&]*\&/gi, '').replace(/sess\=[^\&]*$/i, '');
						aURL = aURL.replace(/sid\=[^\&]*\&/gi, '').replace(/sid\=[^\&]*$/i, '');
						
					/*email privacy*/
						aURL = aURL.replace(/email\=[^\&]*\&/gi, '').replace(/email\=[^\&]*$/i, '');
						aURL = aURL.replace(/mail\=[^\&]*\&/gi, '').replace(/mail\=[^\&]*$/i, '');
						
					/*forums privacy*/
						/*hilos y post*/
						aURL = aURL.replace(/showthread\.php.*$/i, "showthread.php");
						aURL = aURL.replace(/forumdisplay\.php.*$/i, "forumdisplay.php");
						aURL = aURL.replace(/viewforum\.php.*$/i, "viewforum.php");
						aURL = aURL.replace(/viewtopic\.php.*$/i, "viewtopic.php");
						/*members*/
						aURL = aURL.replace(/member\.php.*$/i, "member.php");
						aURL = aURL.replace(/profile\.php.*$/i, "profile.php");
						/*replys*/
						aURL = aURL.replace(/newreply\.php.*$/i, '');
						aURL = aURL.replace(/posting\.php.*$/i, '');
						aURL = aURL.replace(/privmsg\.php.*$/i, '');
						aURL = aURL.replace(/newthread\.php.*$/i, '');
						aURL = aURL.replace(/sendmessage\.php.*$/i, '');
						aURL = aURL.replace(/private\.php.*$/i, '');
						
					/*pages-counts*/
						aURL = aURL.replace(/page\=[0-9]+/gi, '');
						aURL = aURL.replace(/start\=[0-9]+/gi, '');

						if(aDomain.indexOf('yahoo.') != -1 || aDomain.indexOf('google.') != -1)
						{
							aURL = aURL.replace(/\/accounts\?.*$/i, "/accounts");
							aURL = aURL.replace(/\/search\?.*$/i, "/search");
							aURL = aURL.replace(/\/results\?.*$/i, "/results");
							aURL = aURL.replace(/\/imghp\?.*$/i, "/imghp");
							aURL = aURL.replace(/\/grphp\?.*$/i, "/grphp");
							aURL = aURL.replace(/\/nwshp\?.*$/i, "/nwshp");
							aURL = aURL.replace(/\/dirhp\?.*$/i, "/dirhp");
							aURL = aURL.replace(/\/webhp\?.*$/i, "/webhp");
							aURL = aURL.replace(/\/news\?.*$/i, "/news");
							aURL = aURL.replace(/\/blogsearch\?.*$/i, "/blogsearch");
							aURL = aURL.replace(/\/preferences\?.*$/i, "/preferences");
							aURL = aURL.replace(/\/language\?.*$/i, "/language");
							aURL = aURL.replace(/\/advanced\?.*$/i, "/advanced");
							aURL = aURL.replace(/\/advsearch\?.*$/i, "/advsearch");
							aURL = aURL.replace(/\/alerts\?.*$/i, "/alerts");
							aURL = aURL.replace(/\/books\?.*$/i, "/books");
							aURL = aURL.replace(/\/scholar\?.*$/i, "/scholar");
							aURL = aURL.replace(/\/images\?.*$/i, "/images");
							aURL = aURL.replace(/\/groups\?.*$/i, "/groups");
							aURL = aURL.replace(/\/imgres\?.*$/i, "/imgres");
							aURL = aURL.replace(/\/maps\?.*$/i, "/maps");
							aURL = aURL.replace(/\/maphp\?.*$/i, "/maphp");
							aURL = aURL.replace(/\/videosearch\?.*$/i, "/videosearch");
							aURL = aURL.replace(/\/ig\?.*$/i, "/ig");
							aURL = aURL.replace(/\/\?ncl.*$/i, "/?ncl");
							aURL = aURL.replace(/\/videoplay\?.*$/i, "/videoplay");

							aURL = aURL.replace(/\/mail\/.*$/i, "/mail");
							aURL = aURL.replace(/\/group\/.*$/i, "/group");
							aURL = aURL.replace(/\/adsense\/.*$/i, "/adsense");
							
							//stupid redirects
							aURL = aURL.replace(/\/url\?.*$/i, "/url");
						}
						
						if(aSubdomain.indexOf('search.msn') != -1 || aSubdomain.indexOf('search.blogger') != -1)
						{
							aURL =  aURL.replace(/\?.*$/, '');
						}
						
						if(aDomain.indexOf('hotmail.') != -1 || aSubdomain.indexOf('.live.com') != -1)
						{
							aURL = aURL.replace(/\/cgi-bin\/.*$/i, '/');
							aURL = aURL.replace(/\?.*$/, '');
						}
						
						if(aSubdomain.indexOf('apps.facebook.') != -1)
						{
							aURL = aURL.replace(/\?.*$/, '');
						}
						
						if(aDomain.indexOf('youtube.') != -1)
						{
							aURL = aURL.replace(/\/results\?.*$/i, "/results");
						}
						
						if(aSubdomain.indexOf('.bing') != -1)
						{
							aURL = aURL.replace(/\?.*$/i, "");
						}
						
						if(aSubdomain == 'search.dmoz.org')
						{
							aURL = aURL.replace(/\/cgi-bin\/search.*$/i, '/cgi-bin/search');
						}

					/*duplicate simbols*/
						aURL = aURL.replace(/\&+/g, "&").replace(/\&$/, '').replace(/\?$/, '');
				}
				
				//the "face"
				if(aDomain.indexOf('facebook.') != -1)
				{
					aURL = aURL.replace(/\#.*$/, '');
				}
				//wordpress
				if(aURL.indexOf('/wp-admin/') != -1)
				{
					aURL = aURL.replace(/\/wp-admin\/.*$/, '');
				}

				aURL = aURL.replace(/\/+$/, '/');

				return aURL;
			}
	return null;

}).apply(ODPExtension);
