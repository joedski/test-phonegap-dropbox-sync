angular.module('starter.services', [])

.factory( 'dropboxSync', function( $q ) {
  var prop;
  var dropboxSync = window.dropbox.sync;
  var ngDropboxSync = {};
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

      return deferred.promise;
    };
  }

  for( prop in dropboxSync ) {
    if( ! dropboxSync.hasOwnProperty( prop ) ) continue;

    ngDropboxSync[ prop ] = wrapDropboxCall( dropboxSync[ prop ] );
  }

  return ngDropboxSync;
});
