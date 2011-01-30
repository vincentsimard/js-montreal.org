// bruno-c
// neonskimmer@gmail.com
// js-montreal.org plugin - javascript links
// It gets a bunch of js related links from reddit, ajaxian, etc
// using a yahoo pipe and displays them leisurely, without a care in the world.
// One page resume / crappy site at http://brunocarriere.com
 
$(function(){

  var colors  = ['blue', 'green', 'yellow', 'purple']
    , ol      = $('<ol/>', { id: 'fun', class: 'fun' }).insertAfter("#bd")
    // Lies damn lies, you can't handle the truth, etc.
    , lies    = colors.map( function(c){ return $('<li/>', { class: c }).appendTo(ol); });

// Returns a shiny new link.
  function jslink( title, href ){
    return $( '<a/>', { class   : "jslink"
                      , target  : "_new"
                      , title   : title
                      , href    : href
                      , text    : title });
  }
  
  function refresh( links ){
    
    for ( var i = 0; i < 4; i++ ){

      var link = links.next()
        , a    = jslink(link.title, link.link).hide();

// Replace the HTML of each link list item

      $( lies[i] ).html( a );
      
// Fade in the links one a time with some delay between them

      setTimeout( function(a){ a.fadeIn('slow'); }, 300 * (i+1), a );
    }

// Get another batch each 30s

    setTimeout( refresh, 30000, links );
  }
  
  
// Fetch data from the yahoo pipe
// The pipe contains good shit.

  $.getJSON( 'data/js-links', function(feed){		
    
    if (feed.length === 0) return;
    
    var jslinks = (function(){
          
      var arr = feed
        , idx = -1;

// Clever girl.

      arr.next = function(){ 
        return this[ ++idx % this.length ];
      };
      
      return arr;
      
    }());
    
    refresh( jslinks );
  });
  
});