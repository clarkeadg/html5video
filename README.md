Cross-browser HTML5 Video Player made with video-js.
Supports all major browsers plus iOS and Android.

Thanks to:
  - jQuery (http://jquery.com)
  - Bowser (https://github.com/ded/bowser)
  - VideoJS (http://videojs.com) (https://github.com/videojs)  	
  - VideoJS Plugins (https://github.com/videojs/video.js/wiki/Plugins) 	
  	- video-js-resolutions (https://github.com/vidcaster/video-js-resolutions)
  	- videojs-youtube (https://github.com/eXon/videojs-youtube) 

Features
  - playlists
  - video resolutions (switch between hd and sd)
  - stat tracking
  - show/hide controls
  - autoplay
  - loop
  - end of video playlist overlay with replay button
  - multiple video players on 1 page
  - video types
      - All types supported by VideoJs (mp4, webm, ogg, flv)
      - youtube

Example:
```
<!DOCTYPE html>
<html>
<head>  
  <title>html5videoplayer.js | HTML5 Video Player</title>
  <link href="video-js/video-js.css" rel="stylesheet" type="text/css">
  <link href="video-js/video-js-resolutions.css" rel="stylesheet" type="text/css">  
  <link href="html5video.css" rel="stylesheet" type="text/css"> 
</head>
<body> 
  <div id="video1">&nbsp;</div>
  <script src="video-js/jquery.min.js"></script>
  <script src="video-js/bowser.min.js"></script>
  <script src="video-js/video.dev.js"></script>  
  <script src="video-js/video-js-resolutions.js"></script>
  <script src="video-js/video-js-youtube.js"></script> 
  <script src="html5video.js"></script>
  <script type="text/javascript">
    $(function() {        
      videojs.options.flash.swf = "video-js/video-js.swf";
      
      var video1 = new html5video($('#video1'),{
        id: 'video-1' //must have a unique idea if you want more than 1 video on a page
        ,width: 640
        ,height: 390
        ,statsApi: 'http://laravel.brainbreaks.net/api/stats/?Version=v2'
        ,enableStats: false        
        ,replayText: 'Replay ?'
        ,autoplay: true 
        ,loop: false
        ,debug: false
        ,AppSettings: {
          UserID: "brian"
            ,AccountID: 1
            ,Version: '1.4.6'
            ,AppPlatform: 'html5'
            ,Skin: 'web'
        } 
        ,videos: [  
          {
            "id":"ad1"
            ,"name":"Ad 1"
            ,"contentpack_id":"ad1"
            ,"father_id":null
            ,"description":"Ad 1"
            ,"thumbnail":"ContentPacks\/brewers\/brewers_thumb.jpg"
            ,"filename":""
            ,"contents_sort_order":"1"
            ,"video_type":"Ad"
            ,"duration":"0"
            ,"tags":""
            ,"intensity":"1"
            ,"enabled":"1"
            ,src: [
              'videos/TBBBTYB_hopsports.mp4'
              //,'videos/TBBBTYB_hopsports.webm'
            ]
            ,srcHD: [
              'videos/ADA_BEST1.mp4'
              //,'videos/ADA_BEST1.webm'
            ]
            ,type: "video/mp4"
            ,poster : 'http://localhost/html5player/videos/TBBBTYB_hopsports.jpg'
            ,title : 'Ad 1'  
            ,isAd: true
            ,controls: false 
          }
          ,{
            "id":"OyYoyYoy"
            ,"name":"OyYoyYoy"
            ,"contentpack_id":"OyYoyYoy"
            ,"father_id":null
            ,"description":"OyYoyYoy"
            ,"thumbnail":"ContentPacks\/brewers\/brewers_thumb.jpg"
            ,"filename":""
            ,"contents_sort_order":"1"
            ,"video_type":"School"
            ,"duration":"0"
            ,"tags":""
            ,"intensity":"1"
            ,"enabled":"1"
            ,src: [
              'http://www.youtube.com/watch?v=f9aMmSzIHnI' //oy yoy yoy
            ]
            ,srcHD: [
              'http://www.youtube.com/watch?v=f9aMmSzIHnI'
            ]
            ,poster : 'http://localhost/html5player/videos/TBBBTYB_hopsports.jpg'
            ,title : 'Ad 1'  
            ,isAd: false
            ,controls: true 
          }
          ,{
            "id":"ad2"
            ,"name":"Ad 2"
            ,"contentpack_id":"ad1"
            ,"father_id":null
            ,"description":"Ad 1"
            ,"thumbnail":"ContentPacks\/brewers\/brewers_thumb.jpg"
            ,"filename":""
            ,"contents_sort_order":"1"
            ,"video_type":"Ad"
            ,"duration":"0"
            ,"tags":""
            ,"intensity":"1"
            ,"enabled":"1"
            ,src: [
              'videos/TBBBTYB_hopsports.mp4'
            ]
            ,srcHD: [
              'videos/TBBBTYB_hopsports.mp4'
            ]
            ,poster : 'http://localhost/html5player/videos/TBBBTYB_hopsports.jpg'
            ,title : 'Ad 1'  
            ,isAd: true
            ,controls: false 
          } 
        ]
      });

    });
  </script>
</body>
</html>
```
