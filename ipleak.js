var IpLeak =
{
	torrentHash: "",
	torrentUpdateInterval: 0,
	torrentViewRequest: false,

	start: function()
	{
		IpLeak.initTooltip($("[data-tooltip]"));
  
	  if($("#plugins"))
	  {
	  	$("#system").html(IpLeak.dumpInfoSystem());
	  	$("#screen").html(IpLeak.dumpInfoScreen());
	  	$("#plugins").html(IpLeak.dumpInfoPlugins());
	  	$("#mimetypes").html(IpLeak.dumpInfoMimeTypes());
	  }
	    
	  $(".js_required").fadeIn(1000);
	  
	  if($("#dnsplaceholder_waits").length != 0)
	  {
	  	for(var i=0;i<30;i++)
	  		IpLeak.dnsDetection();
	  }
	  
	  $(".server_result").each(function() {  	
	  	var url = "http://ipleak.net/serverresult.php?c=" + $(this).attr("data-c");  	  	
	  	$(this).load(url);
	  });
	},
	
	dumpKeyValue: function(name, value)
	{
		return "<tr><td>" + name + ": </td><td>" + value + "</td></tr>";
	},
	
	dumpInfoSystem: function()
	{
		html = "";
		html += "<table class=\"properties details\">";	
		html += IpLeak.dumpKeyValue("Platform",navigator.platform);
		html += IpLeak.dumpKeyValue("Cookie enabled",navigator.cookieEnabled);
		html += IpLeak.dumpKeyValue("Java enabled",navigator.javaEnabled());
		if(navigator.taintEnabled)
			html += IpLeak.dumpKeyValue("Taint enabled",navigator.taintEnabled());
		html += IpLeak.dumpKeyValue("Online",navigator.onLine);
		html += "</table>";
		return html;
	},
	
	dumpInfoScreen: function()
	{
		html = "";	
		html += "<table class=\"properties details\">";
		html += IpLeak.dumpKeyValue("Your screen",window.screen.width + " x " + window.screen.height);
		
		html += IpLeak.dumpKeyValue("Available screen",window.screen.availWidth + " x " + window.screen.availHeight);
		html += IpLeak.dumpKeyValue("Color depth", window.screen.colorDepth);
		html += IpLeak.dumpKeyValue("Pixel depth", window.screen.pixelDepth);
		html += "</table>";
		return html;
	},
	
	dumpInfoPlugins: function()
	{
		html = "";
		if( (navigator.plugins) && (navigator.plugins.length>0) )
		{
			html += "<div class=\"maxheight\">";
			html += "<table class=\"properties details\">";
			for (var i = 0; i < navigator.plugins.length ; i++) 
			{
				html += "<tr><td>Name: </td><td>" + navigator.plugins[i].name + "</td></tr>";
				
				if (navigator.plugins[i].filename != "")
					html += "<tr><td>File name: </td><td>" +navigator.plugins[i].filename + "</td></tr>";
					
				if(navigator.plugins[i].description != "")
					html += "<tr><td>Description: </td><td>" + navigator.plugins[i].description + "</td></tr>";
				
				html += "<tr><td class=\"separator\" colspan=\"2\"></td><tr>";
			}
			html += "</table>";
			html += "</div>";
		}
		else
			html += "<div class=\"nodata\">No data available.</div>";
		return html;
	},
	
	dumpInfoMimeTypes: function()
	{
		html = "";
		if( (navigator.mimeTypes) && (navigator.mimeTypes.length>0) )
		{
			html += "<div class=\"maxheight\">";
			html += "<table class=\"properties details\">";
			for (var i = 0; i < navigator.mimeTypes.length ; i++) 
			{
				html += "<tr><td>Mime Type: </td><td>" + navigator.mimeTypes[i].type + "</td></tr>";
				html += "<tr><td>Extensions: </td><td>";
				if (navigator.mimeTypes[i].suffixes != "")
			    html += (navigator.mimeTypes[i].suffixes)
			  else
			    html += (" * ");
			  html += "</td></tr>";
			  
			  if(navigator.mimeTypes[i].description != "")
			  	html += "<tr><td>Description: </td><td>" + navigator.mimeTypes[i].description + "</td></tr>";
			
			  if (navigator.mimeTypes[i].enabledPlugin)
			    html += "<tr><td>Plugin: </td><td>" + navigator.mimeTypes[i].enabledPlugin.name + "</td></tr>";
				
				html += "<tr><td class=\"separator\" colspan=\"2\"></td><tr>";			
			}
			html += "</table>";
			html += "</div>";
		}
		else
			html += "<div class=\"nodata\">No data available.</div>";
		return html;
	},
	
	initTooltip: function(src)
	{
		var moveLeft = 10;
	  var moveDown = 20;
	  src.hover(
	    function(e) {
	      var tooltip = $(this).attr("data-tooltip");
	      $("#root").before('<div id="tooltip"></div>')
	      $("div#tooltip").text(tooltip);
	    },
	    function(e) {
	      $("div#tooltip").remove();
	    }
	  );
	  src.mousemove(function(e) {
	    $("div#tooltip").css('top', e.pageY + moveDown).css('left', e.pageX + moveLeft);
	    $("div#tooltip").fadeIn(500);
	  });
	},
	
	geolocationDetectionStart: function()
  {
  	$('#geolocation_detection_start').slideUp();
  	$('#geolocation_detection_wait').slideDown();
  	
  	if (navigator.geolocation) 
  	{
			navigator.geolocation.getCurrentPosition(IpLeak.geolocationSuccess, IpLeak.geolocationDetectionError);
    }
    else 
    {
			IpLeak.geolocationDetectionErrorMessage("Geolocation is not supported by this browser.");
    }    
  },
  
  geolocationSuccess: function(position)
  {
  	$('#geolocation_detection_wait').slideUp();
  	$('#geolocation_detection_success').slideDown();
  	
  	var box = $('#geolocation_detection_result');
  	
		box.html("<iframe id=\"geolocation_map\" style=\"width:95%;height:30em;\" src=\"https://maps.google.com/?ie=UTF8&amp;ll=" + position.coords.latitude +  "," + position.coords.longitude + "&amp;t=h&amp;z=10&amp;output=embed\"></iframe><br /><small><a href=\"https://maps.google.com/?ie=UTF8&amp;ll=45.65,9.25&amp;spn=0.006892,0.016512&amp;t=h&amp;z=17&amp;source=embed\" style=\"color:#0000FF;text-align:left\">View Larger Map</a></small>");
		
		box.slideDown();
  },
    
  geolocationDetectionError: function(error)
  {
  	$('#geolocation_detection_wait').slideUp();
  	
  	var box = $('#geolocation_detection_result');
  	switch(error.code) {
        case error.PERMISSION_DENIED:
            IpLeak.geolocationDetectionErrorMessage("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            IpLeak.geolocationDetectionErrorMessage("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            IpLeak.geolocationDetectionErrorMessage("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            IpLeak.geolocationDetectionErrorMessage("An unknown error occurred.");
            break;
    }
  },
  
  geolocationDetectionErrorMessage: function(msg)
  {
  	var box = $('#geolocation_detection_result');
  	box.html("<img style='width:16px;' src='/static/images/status/no.png'> " + msg);
  	box.slideDown();
  },
  
  rtcDetection: function()
  {
  	// Based on work by https://github.com/diafygi/webrtc-ips
  	
  	var RTCPeerConnection = IpLeak.rtcGetPeerConnection();
	        
  	if (typeof RTCPeerConnection === 'undefined')
  	{
  		$('#rtc_placeholder').append($("<div><img style='width:16px' src='/static/images/status/yes.png'>No leak, RTCPeerConnection not available.</div>"));
  		return;
  	}
  	
  	$('#rtc_placeholder_private').slideDown();
  	$('#rtc_docs').slideDown();
  	
  	IpLeak.rtcDetectionDo(function(ip)
	  {
	  	if( (ip.substring(0,3) == "10.") || (ip.substring(0,7) == "172.16.") || (ip.substring(0,8) == "192.168.") )
	  		$('#rtc_placeholder_private').append($("<span class='digital'>" + ip + "</span>"));	  		
	  	else
	  		IpLeak.addIpBox(ip,$('#rtc_placeholder'));	  	
	  });	  
  },
  
  rtcGetPeerConnection: function()
  {
  	// Based on work by https://github.com/diafygi/webrtc-ips
  	
		var RTCPeerConnection = window.RTCPeerConnection
		              || window.mozRTCPeerConnection
		              || window.webkitRTCPeerConnection;

		//bypass naive webrtc blocking
		if (!RTCPeerConnection) {
		    var iframe = document.createElement('iframe');
		    iframe.style.display = 'none';
		    document.body.appendChild(iframe);
		    var win = iframe.contentWindow;
		    window.RTCPeerConnection = win.RTCPeerConnection;
		    window.mozRTCPeerConnection = win.mozRTCPeerConnection;
		    window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
		    RTCPeerConnection = window.RTCPeerConnection
		        || window.mozRTCPeerConnection
		        || window.webkitRTCPeerConnection;
		}
		
		return RTCPeerConnection;
  },
  
  
  // Get the IP addresses associated with an account
	// Thanks: https://github.com/diafygi/webrtc-ips
	
	rtcDetectionDo: function(callback)
	{
		// Based on work by https://github.com/diafygi/webrtc-ips
		
	    var ip_dups = {};
	
	    var RTCPeerConnection = IpLeak.rtcGetPeerConnection();
	    
	    var mediaConstraints = {
	        optional: [{RtpDataChannels: true}]
	    };
	
	    //firefox already has a default stun server in about:config
	    //    media.peerconnection.default_iceservers =
	    //    [{"url": "stun:stun.services.mozilla.com"}]
	    var servers = undefined;
	
	    //add same stun server for chrome
	    if(window.webkitRTCPeerConnection)
	        servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};
	
	    //construct a new RTCPeerConnection
	    var pc = new RTCPeerConnection(servers, mediaConstraints);
	
	    //listen for candidate events
	    pc.onicecandidate = function(ice){
	
	        //skip non-candidate events
	        if(ice.candidate){
	
	            //match just the IP address
	            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
	            var ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
	
	            //remove duplicates
	            if(ip_dups[ip_addr] === undefined)
	                callback(ip_addr);
	
	            ip_dups[ip_addr] = true;
	        }
	    };
	
	    //create a bogus data channel
	    pc.createDataChannel("");
	
	    //create an offer sdp
	    pc.createOffer(function(result){
	
	        //trigger the stun server request
	        pc.setLocalDescription(result, function(){}, function(){});
	
	    }, function(){});
	},
	
	dnsDetectionCheck: function(h)
	{
		var url = "http://ipleak.net/?mode=ajax&h=" + h;		
		var objBox = $("<div class=\"dns_box\"></div>");	
		objBox.attr("data-h", h);	
		
		objBox.load(url, function(response, status, xhr) 
		{	
			if (status == "error") {
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
	  	
	  	if(response == "NYA")
	  	{
	  		var h = $(this).attr("data-h");
	  		
	  		//console.log('NYA for ' + h);
	  		
	  		setTimeout(function() 
	    	{
	    		IpLeak.dnsDetectionCheck(h);	      	
	    	}, 5000);
	  	}
	  	else
  		{		  	
		  	var h = $(this).children(":first").attr("data-h");
		  	var i = $(this).children(":first").attr("data-i");
		  	
		  	//console.log('Fetch ok ' + h);
		  	
		  	$("#"+h).fadeOut(1000);
		  	
		  	if($("#"+i).length != 0)
		  	{	
		  		// Already exists  		
		  	}
		  	else
		  	{	  	
		  		$(this).attr("id",i);
					$("#dnsplaceholder_results").append($(this));		  	
					$(this).hide();
		  		$(this).fadeIn(1000);
		  		
		  		IpLeak.initTooltip($(this).find("[data-tooltip]"));
		  	}
		  }		  	
		});	
	},
	
	dnsDetection: function()
	{
		var h = IpLeak.makeID();
		
		var objWait = $("<div class=\"wait\"></div>");
		$("#dnsplaceholder_waits").append(objWait);
		objWait.attr("id", h);
			
		var img = new Image();
		
		$(img).load(function() {
			// Unexpected
		});
		
		$(img).error(function() {			
			setTimeout(function() 
    	{
    		IpLeak.dnsDetectionCheck(h);	      	
    	}, 3000);					
		});
				
		$(img).attr("src","http://"+h+".dnsdetect.net/i.png");			
	},
	
	torrentDetectionSwitchDetails: function()
	{
		IpLeak.torrentViewRequest = !IpLeak.torrentViewRequest;
		IpLeak.torrentDetectionUpdate();
	},
	
	torrentDetectionUpdate: function()
	{	
		if(IpLeak.torrentHash == "")
		{
			var possible = "abcdef0123456789";
	
	    for( var i=0; i < 40; i++ )
	        IpLeak.torrentHash += possible.charAt(Math.floor(Math.random() * possible.length));  
		}
		var url = "/?thash=" + IpLeak.torrentHash + "&details=" + (IpLeak.torrentViewRequest ? "1":"0");	
		jQuery("#torrent_detection").fadeIn(1000);
		jQuery("#torrent_detection").load(url);		
		
		//jQuery("#torrent_detection_refresh").html("Refresh");
		jQuery("#torrent_detection_refresh").fadeOut(1000);
		
		
		
		if(IpLeak.torrentUpdateInterval == 0)
			IpLeak.torrentUpdateInterval = setInterval(function(){IpLeak.torrentDetectionUpdate()},10000);
	},
	
	makeID: function()
	{
	    var text = "";
	    var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
	
	    for( var i=0; i < 40; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));
	
	    return text;
	},
	
	addIpBox: function(ip, container)
  {  	
  	var url = "http://ipleak.net/?mode=ajax&ip=" + ip;		
		var objBox = $("<div class=\"dns_box\"></div>");		
		
		objBox.load(url, function(response, status, xhr) 
		{	
			if (status == "error") {
	    	var msg = "Sorry but there was an error: ";
	    	$("#error").html(msg + xhr.status + " " + xhr.statusText);
	  	}
	  	
	  	var h = $(this).children(":first").attr("data-h");
	  	var i = $(this).children(":first").attr("data-i");
	  	
	  	$(container).append($(this));		  	
			$(this).hide();
  		$(this).fadeIn(1000);
	  		
	  	IpLeak.initTooltip($(this).find("[data-tooltip]"));
	  });	  
  },
}





$(window).load(function() {
  
  IpLeak.start();  
  
});