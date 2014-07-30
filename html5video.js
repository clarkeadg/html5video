/*
  Requires:
  - jQuery (http://jquery.com)
  - Bowser (https://github.com/ded/bowser)
  - VideoJS (http://videojs.com) (https://github.com/videojs)  	
  - VideoJS Plugins (https://github.com/videojs/video.js/wiki/Plugins) 	
  	- video-js-resolutions (https://github.com/vidcaster/video-js-resolutions)
  	- videojs-youtube (https://github.com/eXon/videojs-youtube) 

  Video Types:
  	- youtube
  	- video/mp4
  	- video/webm 

  Tracking Events:
  	- firstplay
  	- play
  	- ended
  	- lastVideoEnded

  ToDo:
    - have 2 videos on a page working, change whole thing to a function
    - setup examples 		
*/

function html5video(jcont,opts) {

	var config = {
		key: 'html5video'
		,defaults: { 
			id: 'video'
			,width: 640
			,height: 390
			,statsApi: '//example.com/api/stats'
			,enableStats: false 
			,replayText: 'Replay Videos ?'
			,videos: []
			,current: 0
			,autoplay: true  // do not set this to false if first video is youtube
			,loop: false
			,debug: false
			,AppSettings: {
				UserID: null
	    		,AccountID: null
	    		,Version: null
	    		,AppPlatform: null
	    		,Skin: null
			}
		}
	};

	var z = this, init, _build, _initialize, _actions, _events, _lastVideoEnded, _killPlayer, _getVideoType, _getVideoType, _setupYoutubePlayer, _setupDefaultPlayer, _startVideos, _setupControls, _setupResolutions, _selectResolution, _postData, _makeSource, _makePlayer;

    z.$ = {}; 
    z.$.cont = jcont; 
    z.config = config;
    z.opts = $.extend(true,{},z.config.defaults,opts);        

    var init = function() {
    	z._inited = true;
    	z._build();
    	z._initialize();
    	z._actions();
    };

    z._build = function() {
    	var z = this, x = z.config.key;
    	z.$.cont.addClass(x);
    	var myHtml = z._makePlayer(z.opts.id) +
    		'<div class="'+x+'-replay" href="#" ><a href="#" >'+z.opts.replayText+'</a></div>';	
		z.$.cont.html(myHtml);
		z.$.video = z.$.cont.find('#'+z.opts.id);
		z.$.btn_replay = z.$.cont.find('div.'+x+'-replay');		
    };

    z._initialize = function() {
    	var z = this;
    	if (!z.opts.videos.length) return; 

    	if (z.opts.debug) console.log('initialize ',z.opts.current)

    	// kill any existing player
    	if (z.player) {
    		z.opts.autoplay = true;
    		z._killPlayer(); 
    		// put a new player
    		z.$.cont.prepend(z._makePlayer(z.opts.id));
			z.$.video = z.$.cont.find('#'+z.opts.id);	
    	} else {
	    	// set video types
	    	$.each(z.opts.videos,function(i,v){
	    		v.type = z._getVideoType(v.src[0]);
	    	});
	    }

    	z.currentType = z.opts.videos[z.opts.current].type;

    	// make a new player
    	if (z.currentType == 'youtube') {
    		z._setupYoutubePlayer();
    	} else {
			z._setupDefaultPlayer();
		}
    };

    z._actions = function() {
		var z = this, x = z.config.key;
		z.$.btn_replay.find('a').bind('click',function(e){
    		e.preventDefault();
    		z.$.btn_replay.hide();
    		z.opts.current = 0;
    		z._initialize();
    	});	
	};

    z._events = function() {
    	var z = this;	
		z.player.on('firstplay',function(e){
			if (z.opts.debug) console.log('firstplay',z.vid);			
			z._postStat('firstplay',z.vid);
		});
		z.player.on('play',function(e){
			z.$.btn_replay.hide();			
		});
		z.player.on('ended',function(e){
			if (z.opts.debug) console.log('ended',z.vid);
			z._postStat('ended',z.vid);
			z.opts.current++;			
			if (z.opts.current == z.opts.videos.length) {				
				return z._lastVideoEnded();
			};
			z._initialize();
		});			
    };

    z._lastVideoEnded = function() {
    	var z = this;
    	z.$.btn_replay.show();
    	if (z.opts.debug) console.log('lastVideoEnded',z.vid);
    	z.postStat('lastVideoEnded',z.vid);
    	if (z.opts.loop) {
    		z.opts.current = 0;
    		return z._initialize();
    	}    			
    };

    z._killPlayer = function() {
		var z = this;
		if (z.opts.debug) console.log('kill player');
		z.player.pause();
		z.player.dispose();
		z.player = null;		
	};

    z._getVideoType = function(filename) {
    	var z = this,
    		type = filename.split('.').pop(),
    		filetypes = ['mp4','webm'],
    		match = false;
    	$.each(filetypes,function(i,v){
    		if (type == v) {
    			type = 'video/'+v;
    			match = true;
    			return false;
    		}
    	});
    	if (!match) type = 'youtube';
    	return type;
    };

    z._setupYoutubePlayer = function() {
    	var z = this;
    	if (z.opts.debug) console.log('_setupYoutubePlayer');
    	z.vid = z.opts.videos[z.opts.current]; 

    	var autoplay = z.opts.autoplay;

    	// set autoplay controls so youtube video can actually be playable
    	if (window.bowser) {

	    	if (bowser.firefox) {
	    		if (z.opts.debug) console.log('firefox');
	    		autoplay = true;
	    	}

	    	if (bowser.chrome) {
	    		if (z.opts.debug) console.log('chrome')
	    		autoplay = true;
	    	}

	    	if (bowser.safari) {
	    		if (z.opts.debug) console.log('safari')
	    		autoplay = true;
	    	}

	    	if (bowser.ios) {
	    		if (z.opts.debug) console.log('ios')
	    		autoplay = false;
	    	}

	    	if (bowser.android) {
	    		if (z.opts.debug) console.log('android')
	    		autoplay = false;
	    	}
	    }

		z.player = videojs(z.opts.id, { 
			"techOrder": ["youtube"]
			,"src": z.vid.src[0]
			,"autoplay": autoplay
		});
		z.player.ready(function(){
			z._events();
			z._setupControls();
		});
    }; 

    z._setupDefaultPlayer = function() {
    	var z = this;  	 
		vjs(z.opts.id, {
			plugins: {
				resolutions: true
			}
		});
		z.player = videojs(z.opts.id);
		z.player.ready(function(){
			z._events();	
			z._startVideos();
		});
    }; 

    z._startVideos = function() {	
    	var z = this;
		z.vid = z.opts.videos[z.opts.current];
		if (z.opts.debug) console.log(z.vid);
		var sources = z._makeSource(z.vid);
		z.player.src(sources);	
		z.player.resolutions_.options_['sourceResolutions'] = sources;
		z._setupResolutions();	
		setTimeout(function() {
			z._setupControls();
		},500);
		if (z.opts.autoplay) {
			z.player.play();			
		} 
	};

	z._setupControls = function() {
		var z = this;
		if (z.vid.controls) {
			z.player.controls(true);
		} else {
			z.player.controls(false);
		}
	}; 

    z._setupResolutions = function() {
		var z = this;
		if (z.opts.debug) console.log('_setupResolutions')
		z.resolutionsButton = new ResolutionsButton(z.player);
		z.player.controlBar.addChild(z.resolutionsButton);
	}; 

	z._selectResolution = function() {
		var z = this, 
			source = z.player.resolutions_.selectSource(z.player.options_['sources']);
		return source;
	}; 

	z._postStat = function(event_id,vid) {
        var z = this, error = false;
        if (!z.opts.enableStats) return false;
        if (z.opts.debug) console.log("postStat",event_id,vid);
        var send = {};   
        send.users_id = z.opts.AppSettings.UserID;
        send.account_id = z.opts.AppSettings.AccountID;     
        send.Version = z.opts.AppSettings.Version
        send.medium = z.opts.AppSettings.AppPlatform;
        send.skin = z.opts.AppSettings.Skin;    
        switch(event_id) {
            case "firstplay":
                if (z.opts.debug) console.log("ad",vid.isAd)
                if (vid.isAd) {
                    send.Action = "Play Ad";
                    send.content_type = vid.video_type;
                    send.LocationDesc = "";
                    send.LocationURL = "";
                    send.LocationType = "";
                    send.InstructorDesc = "";
                    send.InstructorURL = "";
                    send.DistractionDesc = ""
                    send.DistractionURL = z.player.options_.src;
                    send.DistractionType = "";
                    send.contents_id = vid.id;  
                } else {
                    send.Action = "Start School Video";
                    send.content_type = vid.video_type;
                    send.LocationDesc = "";
                    send.LocationURL = "";
                    send.LocationType = "";
                    send.InstructorDesc = "";
                    send.InstructorURL = "";
                    send.DistractionDesc = vid.description;
                    send.DistractionURL = z.player.options_.src;
                    send.DistractionType = "";
                    send.contents_id = vid.id;  
                }
            break;
            case "ended":
                if (z.opts.debug) console.log("ad",vid.isAd)
                if (vid.isAd) {
                    send.Action = "Ad Finished";
                    send.content_type = vid.video_type;
                    send.LocationDesc = "";
                    send.LocationURL = "";
                    send.LocationType = "";
                    send.InstructorDesc = "";
                    send.InstructorURL = "";
                    send.DistractionDesc = ""
                    send.DistractionURL = z.player.options_.src;
                    send.DistractionType = "";
                    send.contents_id = vid.id;
                } else {
                    send.Action = "Complete School Video";
                    send.content_type = vid.video_type;
                    send.LocationDesc = "";
                    send.LocationURL = "";
                    send.LocationType = "";
                    send.InstructorDesc = "";
                    send.InstructorURL = "";
                    send.DistractionDesc = vid.description;
                    send.DistractionURL = z.player.options_.src;
                    send.DistractionType = "";
                    send.contents_id = vid.id;  
                }
            break;          
            default:
                error = true;
            break;
        }
        if (error) return;
        z._postData(z.opts.statsApi, send,function(err,data){
            if (z.opts.debug) console.log(err,data);
        })  
    };

    z._postData = function(url,opts,cb) {
    	var z = this;
    	if (z.opts.debug) console.log("sendStat",opts);
    	$.ajax({
		  type: "POST", 
		  data: opts, 
		  url: url, 
		  dataType: "json", 
		  success: function(data){
		    cb(false,data)	   
		  },
		  error: function(err) {
		  	cb(err)
		  }
		});	
    }; 

    z._makeSource = function(item) {
    	var z = this
    		,rs = []
    		,opts = {};
    	if (z.opts.debug) console.log('_makeSource')
    	for(var i=0,c=item.src.length;i<c;i++) {
    		opts = {
				"data-res": "SD"
				,src : item.src[i]
				,type: z._getVideoType(item.src[i])
				,controls: (item.controls) ? true : false
				,isAd: (item.isAd) ? true : false
				,vid: item
			};
    		rs.push(opts);
    	}
    	for(var i=0,c=item.srcHD.length;i<c;i++) {
    		opts = {
				"data-res": "HD"
				,src : item.srcHD[i]
				,type: z._getVideoType(item.srcHD[i])
				,controls: (item.controls) ? true : false
				,isAd: (item.isAd) ? true : false
				,vid: item
			};
    		rs.push(opts);
    	}
    	if (z.opts.debug) console.log('_makeSource done',rs)
    	return rs;
    };

    z._makePlayer = function(id) {
    	var z = this, myHtml = '\
    	<video id="'+id+'" class="video-js vjs-default-skin" controls preload="auto" width="'+z.opts.width+'" height="'+z.opts.height+'" data-setup=\'{ \"autoplay\": '+z.opts.autoplay+' }\' ></video>\
		';	
		return myHtml;
    };
    
    init();
};

