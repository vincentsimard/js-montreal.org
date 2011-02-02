$(function(){
  
  window.JSM = JSM = {};

  JSM.signatures = {};


// Registers a 'jsm signature' handler
// options:

//    name    : your name or nick or whatever
//    module  : an object with init and destroy functions in it to start and cleanup after your thing
//    email   : (optional) your email
//    twitter : (optional) your twitter handle
//    url     : (optional) your website or whatever
//    blurb   : (optional) something you wanna show on the badge. keep it short.
  
  JSM.register = function( options ){

// You must comply

    var islegit = options.name 
               && options.module
               && ( 'init' in options.module ) 
               && ( 'destroy' in options.module );
    
    console.assert( islegit, 'You were eaten by a grue.' );

    $('<option/>', { text: options.name } )
      .data( 'sig', options )
      .appendTo( "#sigs" );

    JSM.signatures[ options.name ] = options.module;
  };
  
  var sig = undefined;
  $('#sigs').change( function(e){
    if (sig) sig.module.destroy();
    sig = $('option:selected', this).data('sig');
    if (sig) sig.module.init();
  });

});