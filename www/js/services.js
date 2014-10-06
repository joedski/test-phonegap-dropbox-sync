angular.module('starter.services', [])

;

.factory( 'dropbox', [ '$q' ], function( $q ) {
  var dropbox = window.dropbox;
  var ngDropbox = {};
  var slice = [].slice;

  function wrapDropboxCall( originalCall ) {
    return function wrappedCall() {
      var deferred = $q.defer();
      var args = slice.call( arguments, 0 );

      args.push( function promiseCallback( error, result ) {
        if( error ) {
          deferred.reject( error );
        }
        else {
          // result may be nothing.
          deferred.resolve( result );
        }
      });

      originalCall.apply( null, args );

      return deferred.promise();
    }
  }

  for( prop in dropbox ) {
    if( ! dropbox.hasOwnProperty( prop ) ) continue;

    ngDropbox[ prop ] = wrapDropboxCall( dropbox[ prop ] );
  }

  return ngDropbox;
});
