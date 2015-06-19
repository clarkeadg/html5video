
/* HTML5 Video */

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
            ,adPlays: 0
            ,autoplay: true
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

    var z = this, init, next, previous, loadVideo, _getVid, _build, _initialize, _actions, _events, _lastVideoEnded, _killPlayer, _getBrowserOptions, _getVideoType, _getVideoType, _setupYoutubePlayer, _setupDefaultPlayer, _startVideos, _setupControls, _setupResolutions, _selectResolution, _postData, _makeSource, _makePlayer;

    z.$ = {}; 
    z.$.cont = jcont; 
    z.config = config;
    z.opts = $.extend(true,{},z.config.defaults,opts);          

    init = function() {
        z._inited = true, x = z.config.key;  
        z._build();        
        z._actions();
        if (z.opts.videos.length) {
          z.loadVideo(z.opts.current);
        }
    };

    z.next = function() {
      var z = this;
      if (z.adPlaying) {
        return false;
      }
      z.opts.current++;
      if (z.opts.current > z.opts.videos.length-1) {        
        if (z.opts.loop) {
          z.opts.current = 0;
          z.loadVideo(z.opts.current);
        } else {
          z.opts.current = z.opts.videos.length-1;
        }
      } else {
        z.loadVideo(z.opts.current);
      }
    };

    z.previous = function() {
      var z = this;
      if (z.adPlaying) {
        return false;
      }
      z.opts.current++;
      if (z.opts.current < 0) {        
        if (z.opts.loop) {
          z.opts.current = z.opts.videos.length-1;
          z.loadVideo(z.opts.current);
        } else {
          z.opts.current = 0;          
        }
      } else {
        z.loadVideo(z.opts.current);
      }  
    };

    z.loadVideo = function(id) {
      var z = this, x = z.config.key;           
      if (z.adPlaying) {
        return false;
      }
      
      z.opts.current = id;
      
      z.$.cont.parent().removeClass(x+'-first');
      z.$.cont.parent().removeClass(x+'-last');      
      if (z.opts.current == 0) {
        z.$.cont.parent().addClass(x+'-first');
      }
      if (z.opts.current == z.opts.videos.length-1) {
        z.$.cont.parent().addClass(x+'-last');
      } 

      z._initialize();
    };

    z._build = function() {
        var z = this, x = z.config.key;
        z.$.cont.addClass(x);
        if (z.opts.loop) z.$.cont.addClass(x+'-loop');
        var myHtml = z._makePlayer(z.opts.id) +
            '<div class="'+x+'-replay" href="#" ><a href="#" >'+z.opts.replayText+'</a></div>'; 
        z.$.cont.html(myHtml);
        z.$.video = z.$.cont.find('#'+z.opts.id);
        z.$.btn_replay = z.$.cont.find('div.'+x+'-replay');     
    };

    z._getVid = function() {
      var z = this;

      z.adPlaying = false;  

      if (z.opts.ads) {

        if (!z.opts.playAd) { 
          z.opts.playAd = true;  
          z.opts.adPlays++;
        //  console.log(z.opts.adPlays,z.opts.adCounter)
          if (z.opts.adPlays != z.opts.adCounter) {
            // skip ad
             z.opts.playAd = false;
            return z.opts.videos[z.opts.current]; 
          }   
          if (!z.opts.currentAd) {
            z.opts.currentAd = 0;
          } else {
            z.opts.currentAd++;
            if (z.opts.currentAd > z.opts.ads.length-1) {
              z.opts.currentAd = 0;
            }
          }
          //z.opts.videos.splice(z.opts.current,0,z.opts.ads[z.opts.currentAd]); 
          z.opts.adPlays = 0;    
          z.adPlaying = true;     
          return z.opts.ads[z.opts.currentAd];
        } else {
          z.opts.playAd = false;
        }
      }

      return z.opts.videos[z.opts.current]; 
    }

    z._initialize = function() {
        var z = this;
        if (!z.opts.videos.length) return; 

        if (z.opts.debug) console.log('initialize ',z.opts.current)

        // kill any existing player
        if (z.player) {
            z._killPlayer(); 

            // put a new player
            z.$.cont.prepend(z._makePlayer(z.opts.id));
            z.$.video = z.$.cont.find('#'+z.opts.id);   
        } else {
            // set video types
            if (z.opts.videos) {
              $.each(z.opts.videos,function(i,v){
                  z.opts.videos[i].type = z._getVideoType(v.src[0]);
              });
            }
            if (z.opts.ads) {
              $.each(z.opts.ads,function(i,v){
                  z.opts.ads[i].type = z._getVideoType(v.src[0]);
              });
            }
        }

        z.vid = z._getVid();

        if (!z.vid || !z.vid.type) {
          z._killPlayer();
          return false;
        }

        z.currentType = z.vid.type;

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
            z.loadVideo(0);
        }); 
    };

    z._events = function() {
        var z = this;

        z.player.on('firstplay',function(e){            
            if (z.opts.debug) console.log('firstplay',z.vid); 
            z.$.cont.trigger('firstplay'); 
            // funky stuff going on here because of the resolutions plugin
            if (z.last_vid != z.vid.src ) {                       
              z._postStat('firstplay',z.vid);
            }
        });
        z.player.on('play',function(e){
            z.$.cont.trigger('play');
            z.$.btn_replay.hide();  
            z.last_vid = z.vid.src;
            z.current_video = z.vid;        
        });        
        z.player.on('loadedmetadata',function(e){
            z.$.btn_replay.hide(); 
            z.$.cont.trigger('loadedmetadata');         
        });
        z.player.on('ended',function(e){
            z.$.cont.trigger('ended');
            z.adPlaying = false;
            if (z.opts.debug) console.log('ended',z.vid);
            z._postStat('ended',z.vid);  
            if (!z.opts.playAd) {     
              z.opts.current++;  
            }          
            if (z.opts.current == z.opts.videos.length) { 
              z.$.cont.trigger('lastvideoended');              
                return z._lastVideoEnded();
            };
            z.loadVideo(z.opts.current);
        });         
    };

    z._lastVideoEnded = function() {
        var z = this;
        z.opts.current = 0;
        z.$.btn_replay.show();
        if (z.opts.debug) console.log('lastVideoEnded',z.vid);
        z._postStat('lastVideoEnded',z.vid);
        if (z.opts.loop) {
          z.loadVideo(0);
        }               
    };

    z._killPlayer = function() {
        var z = this;
        if (z.opts.debug) console.log('kill player');
        if (!z.player) return false;
        z.player.pause();
        z.player.dispose();
        z.player = null;        
    };

    z._getVideoType = function(filename) {
        var z = this;
        //console.log(filename);
        if (!filename) return 'video/mp4';
        var type = filename.split('.').pop(),
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

    z._getBrowserOptions = function() {
      var z = this;

      var autoplay = z.opts.autoplay;
      var forceShowControls = false;

      if (bowser.firefox) {
          if (z.opts.debug) { console.log('firefox'); }
          //autoplay = true;                
      }

      if (bowser.chrome) {
          if (z.opts.debug) { console.log('chrome'); }
          //autoplay = true;
      }

      if (bowser.safari) {
          if (z.opts.debug) { console.log('safari'); }
          //autoplay = true;
      }

      if (bowser.ios) {
          if (z.opts.debug) { console.log('ios'); }
          autoplay = false;
          forceShowControls = true;
      }

      if (bowser.android) {
          if (z.opts.debug) { console.log('android'); }
          autoplay = false;
          forceShowControls = true;
      }

      return {
        autoplay: autoplay
        ,forceShowControls: forceShowControls
      };

    };

    z._setupYoutubePlayer = function() {
      var z = this;
      if (z.opts.debug) console.log('_setupYoutubePlayer');

      var opts = z._getBrowserOptions();

      z.current_video = z.vid;

      z.player = videojs(z.opts.id, { 
          "techOrder": ["youtube"]
          ,"src": z.vid.src[0]
          ,"autoplay": opts.autoplay
          //,"playsInline": true
          ,"ytcontrols": true // ytcontrols have to be true to work on ipad
      });
      z.player.ready(function(){
          z._events();
         // z._setupControls(opts.forceShowControls); 
          //z._setupControls(false); // need to hide video js controls or there will be double controls 
          z.player.controls(false);      
      });
    };     

    z._setupDefaultPlayer = function() {
        var z = this;    

        var opts = z._getBrowserOptions();

        vjs(z.opts.id, {
            plugins: {
                resolutions: true
            }
        });
        z.player = videojs(z.opts.id);
        z.player.ready(function(){
            z._events(); 
            z._setupControls(opts.forceShowControls);   
            z._startVideos(); 
            if (opts.autoplay) {
              z.player.play();            
            }                   
        });
    }; 

    z._startVideos = function() {   
        var z = this;
        if (z.opts.debug) console.log(z.vid);
        var sources = z._makeSource(z.vid);
        var mySource = z.player.src(sources).cache_.src; 
       // if (z.opts.debug) console.log('mySource',mySource);
        var myType = z._getVideoType(mySource);
        var rsources = [];
        $.each(sources,function(i,v){
          if (z._getVideoType(v.src) == myType) {
            rsources.push(v);
          }
        });
        if (z.opts.debug) console.log('rsources',rsources);         
        
        if (z.player.resolutions_) { 
          var mySrc = z._selectResolution(rsources);
          z._setupResolutions(); 
          z.current_video = mySrc;
          z.player.src(mySrc.src); 
        } 
    };

    z._setupControls = function(forceShowControls) {
        var z = this;
        if (!z.opts.autoplay)  {
          return z.player.controls(true);
        }    
        z.player.controls(forceShowControls);            
    }; 

    z._setupResolutions = function() {
        var z = this;
        if (z.opts.debug) console.log('_setupResolutions')
        z.resolutionsButton = new ResolutionsButton(z.player);
        z.player.controlBar.addChild(z.resolutionsButton);
    }; 

    z._selectResolution = function(videos) {
        var z = this, 
            source = z.player.resolutions_.selectSource(videos);
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

        var vidSrc = z.player.cache_.src;
        if (vid.type == 'youtube') {
          vidSrc = z.player.options_.src;
        }

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
                    send.DistractionURL = vidSrc;
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
                    send.DistractionURL = vidSrc;
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
                    send.DistractionURL = vidSrc;
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
                    send.DistractionURL = vidSrc;
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

    if (z.opts.postStat && z.opts.postStat instanceof Function) {
      z._postStat = z.opts.postStat;
    }

    if (z.opts.videos instanceof Function) {
      z.opts.videos(function(data){
        z.opts.videos = data;
        init();
      })
    } else {     
      init();
    }
};
