// bruno-c
// neonskimmer@gmail.com
// js-montreal.org plugin - javascript links
// It gets a bunch of js related links from reddit, ajaxian, etc
// using a yahoo pipe and displays them leisurely, without a care in the world.
// http://brunocarriere.com
 
$(function(){

  var colors  = ['blue', 'green', 'yellow', 'purple']
    , jsfeed  = {}
    , timeout;

// Returns a shiny new link.
  function jslink( link ){
    return $( '<a/>', { class   : "jslink"
                      , target  : "_new"
                      , title   : link.title
                      , href    : link.link
                      , text    : link.title });
  }
  
  function refresh( links ){

    for ( var i = 0; i < 4; i++ ){

      var a = jslink( links.next() ).hide();
      
      a.appendTo( $( $("#fun > li").eq(i) ).empty() );

// Fade in links one at a time
      
      setTimeout( function(a){ a.fadeIn('slow'); }, 300 * (i+1), a );
    }

// Get another batch each 30s

    timeout = setTimeout( refresh, 30000, links );
  }
  

// Fetch data from the yahoo pipe
  
  $.extend( jsfeed, {
    
    init : function(){

      var ol = $( '<ol/>', { id: 'fun', class: 'fun' } ).insertAfter( "#bd" ).hide();
      
      // Create the list items
      $( colors.map( function(c){ 
                       return $('<li/>', { class: c }); 
                     })).appendTo(ol);
      
      $.getJSON( 'data/js-links', 
        
        function( feed ){		
    
          if (feed.length === 0) return;
    
          var jslinks = (function(){

            var arr = feed, idx = -1;

            arr.next = function(){ 
              return this[ ++idx % this.length ];
            };
      
            return arr;
          }());
        
          refresh( jslinks );

          ol.slideDown();        
        });
    }

  , destroy: function(){ clearTimeout(timeout); $('#fun').remove(); }
    
  });
 
//    name    : your name or nick or whatever
//    module  : an object with init and destroy functions in it to start and cleanup after your thing
//    email   : (optional) your email
//    twitter : (optional) your twitter handle
//    url     : (optional) your website or whatever
//    blurb   : (optional) something you wanna show on the badge. keep it short.   
  
  JSM.register({ name     : 'Bruno Carriere'
               , module   : jsfeed
               , email    : 'neonskimmer@gmail.com'
               , twitter  : '@neonskimmer'
               , url      : 'http://brunocarriere.com'
               , blurb    : 'Shows some JS related links at the bottom of the page.'
               });
  
// TEMPORARY: Start this one manually right away
  JSM.signatures['Bruno Carriere'].init();

});