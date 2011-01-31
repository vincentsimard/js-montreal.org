// Example signature plugin
// Takes the H1 and does funny color stuff with it.

// Because JSM.register plays with the DOM, make
// sure it is called after document:ready. Or you
// simply build your entire plugin in document:ready,
// like I did here.  Keep everything in a closure, 
// anyways. I don't want your dried fruits in my
// cereals.

$(function(){
  
  var example = {}
    , title   = $('h1').text()
    , roygbiv = [ "#FF0000"    
                , "#FFA500"
                , "#FFFF00"
                , "#008000"
                , "#0000FF"
                , "#4B0082"
                , "#EE82EE" ];

// init method
// called to initialize
                
  example.init = function(){
    
    var speed = 1000
      // Cache the color cycle array length
      , len   = roygbiv.length
      // Convert the H1 text into a bunch of spans
      , spans = title.split('').map(
          function(letter){
            return $( '<span/>', { text: letter } );
          });

    $( spans ).appendTo( $('h1').empty() );
    
    function rainbow( i, offset ){
      
      var anim = { color: roygbiv[ (i + offset) % len ] };

      // Holy shit animation eats up all CPU.
      spans[i].animate( anim
                      , speed
                      , function(){
                          rainbow( ++i % title.length 
                                 , i === title.length ? ++offset : offset );
                        });

    }
    
    rainbow( 0, 0 );
  };

  example.destroy = function(){

    // Clear jQuery's animation queue
    $('h1 > span').clearQueue();
    
    // Restore the original title
    $('h1').empty().text( title );
  };
  
  JSM.register({
    
    name    : 'Example'
  , module  : example   
    
  });
  
});