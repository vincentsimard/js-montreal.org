$(function(){
  
  var $ol = $("#fun")
    , $lies_damn_lies = $("li", $ol);


  function jslink(title, href){
    return $( '<a class="jslink" target="_new" title="'
            + title + '" href="' + href + '">'
            + title + '</a>');
  }
  
  function refresh(links){
    
    for (var i=0; i<4; i++){
      
      var link = links.next()
        , a    = jslink(link.title, link.link).hide();
        
// Replace the HTML of each link list item

      $( $lies_damn_lies[i] ).html( a );
      
// Fade in the links one a time with some delay between them

      setTimeout( function(a){ a.fadeIn('slow'); }, 300 * (i+1), a );
    }

// Get another batch each 30s

    setTimeout( refresh, 30000, links );
  }
  
  
// Fetch data from the yahoo pipe

  $.getJSON('data/js-links', function(feed){		
    
    if (feed.length === 0){
      return;
    }
    
    var jslinks = (function(){
    
      var arr = feed
        , idx = -1;
      
      arr.next = function(){
        return arr[ ++idx % this.length ];
      };
      
      return arr;			
    
    })();
    
    refresh(jslinks);
  });
  
});