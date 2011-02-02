(function( global ){

  var slice = Array.slice 
           || ( Array.slice = function ( ar, from, to ){
                                return [].slice.apply( ar, [].slice.apply(argument, 1));
                              })
  
  // A library to contain all the stuff I want in JS

  function xtd( dest, src /*, src */){
    var srcs = slice( arguments, 2 )
      , prop;
    
    for(prop in src){ 
      dest[prop] = src[prop];
    }
    return !srcs.length ? dest
                        : xtd.apply( null, [dest].concat( srcs ) );
  }


  Array.prototype.reduce = function reduce( fn, acc, scope ){
    var i, l;
    // for( i = 0, l = this.length; i<l; ++i){
    //   acc = scope ? fn.call( scope || this
    //                        , acc
    //                        , this[i]
    //                        , i
    //                        , this );
    // }
    return acc;
  }
  
  
  
  
  Object.extend  = xtd
  Object.provide = function( path ){
                      var parts = path.split('.')
                        , part
                        , scope = global;
                      
                      while( part = parts.shift() ){ 
                        scope = scope[part] ? scope[part] 
                                            : scope[part] = {};
                      }
                      return scope;
                    }
  
  if( ! Object.keys ){
         // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
    Object.keys = function(o) {
                    var result = [];
                    for(var name in o) {
                        if (o.hasOwnProperty(name)){ result.push(name);}
                    }
                    return result;
                  }
  }
  if( !Object.create ){
    Object.create = function( prototype ){
                      // Checking for forward compatibility with ES5
                      if( arguments.length > 1 ){ throw new Error( "ajstd.js' Object.create can emulate ES5's second parameter" ); } 
                      function F(){}
                      F.prototype = prototype
                      return new F();
                    }
  }
  
 
  xtd( Function
          
     , { I : function(i){ return i; }
       , K : function(k){ return function(){ return k;} }
       , S : function(f,g){ return function( args ){ return f.call(this, g.apply(this, slice(arguments))); } }
       })
  Function.nil = Function.K();
  


  
  xtd( Function.prototype
        // FIXME: partial and bind are essentially the smae thing, DRY them up
     , { partial    : function(){
                        var args = slice( arguments, 0 )
                          , fn   = this;
                        return  function(){
                                  return fn.apply( this, args.concat(slice(arguments,0)) )
                                }
                      }
       , bind       : function( scope ){
                        var args = slice( arguments, 1 )
                          , fn   = this;
                        return  function(){
                                  return fn.apply( scope, args.concat(slice(arguments,0)) )
                                }
                      }
       , wrap       : function( wrapper ){
                        var fn = this
                        return  function(){
                                  return  wrapper.apply( this, [fn].concat(slice(arguments,0)) )
                                }
                      }
       , intercept  : function( interceptor ){
                        var args = slice(arguments,0)
                      }
       , reverse    : function(){} // Reverse args
       , skip       : function(){} // Skip arguments indexes  : fn.skip(2,4)(A,B,C,D,E) => fn(A,B,D)
       , keep       : function(){} // Skip's inverse          : fn.keep(2,4)(A,B,C,D,E) => fn(C,E)
       , slice      : function(){} // fn.slice(1,2) => fn( arguments.slice(1,2) )
       , compose    : function(){} // f.compose(g)(1,2) => f(g(1,2));
       , sequence   : function(){} 
       , toMethod   : function(){} // toMethod
       , toFunction : function(){} // toFunction
       
       })
  
  
  xtd( Array.prototype
     , { first    : function(){ return this[0]; }   
       , head     : function(){ return this.slice(0,1) }// head
       , tail     : function(){ return this.slice(1); }
       , last     : function(){ return this[this.length-1]; } 
       , reduce   : function(){}
       , reduceRight   : function(){}
       , map      : function(){}
       , forEach  : function(){}
       , indexOf  : function(){}
       , filter   : function(){}  
       , every    : function(){}  // all
       , some     : function(){}  // any
       , contains : function( value, equals ){}
       , reverse  : function(){}
       , union    : function( ar, equals ){} // [1,4,4].union( [1,5,7] ) => [1,4,5,7]  | equals : true to allow cohersion or predicate(a,b) 
       , intersect: function( ar, equals ){} // [1,2,3] intersect([2,3,4]) => [2,3]
       , unique   : function( equals ){} // [3,3,4,5,'5'].unique() => [3,4,5,'5',6]
       , flatten  : function( deep ){} // [[1,2], [1,[2,3]]].flatten() => [1,2,1,[2,3]] . If deep true => [1,2,1,2,3] 
       , lastIndexOf  : function(){}
       , pluck        : function(){}
       , invoke       : function(){}
       , min          : function(){}
       , max          : function(){}
       , find         : function(){}
       , coherse      : function(){}
       
       });
       
  xtd( String.prototype
     , { trim     : function(){ return this.replace(/^\s+|\s+$/g, ''); }
       , format   : function(){}
       , words    : function(){}
       , isEmpty  : function(){}
       , isBlank  : function(){}
       , isDigits : function(){}
       , isNumeric: function(){}
       , capitalize : function(){}
       //, resolve  : function( path, root){}
       }) 
       
       
  xtd( Number.prototype 
     , { times  : function( fn ){
                    var l = this;
                    while(l--){ fn(); }
                  } 
       })
            
}( this ));


// This should go in another file as an additional module Date utilities
// (function( global ){
// 
//   var xtd = Object.extend
//     ;
// 
//   xtd( Number.prototype
//      , { days     : function(){ return this * 24 * 3600 * 1000 }
//        , hours    : function(){ return this * 3600 * 1000 }
//        , minutes  : function(){ return this * 60000 }
//        , seconds  : function(){ return this} 
// }( this ))