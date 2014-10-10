angular.module('starter.services', [])

.factory( 'dropboxSync', function( $q ) {
  var prop;
  var dropboxSync = window.dropbox.sync;
  var ngDropboxSync = {};
  var slice = [].slice;

  function wrapDropboxCall( originalCall ) {
    var __ocName = String( originalCall ).replace( /\n.*$/gm, '' ) + '...';

    return function wrappedCall() {
      var deferred = $q.defer();
      var args = slice.call( arguments, 0 );

      console.log( 'wrapDropboxCall: call to', __ocName );

      args.push( function promiseCallback( error, result ) {
        if( error ) {
          console.log( 'wrapDropboxCall: error returned by ', __ocName, ':' );
          console.log( error );
          deferred.reject( error );
        }
        else {
          console.log( 'wrapDropboxCall: success returned by ', __ocName, result ? ':' : '(empty result)' );
          if( result )
            console.log( 'result =', result );
          // result may be nothing.
          deferred.resolve( result );
        }
      });

      originalCall.apply( null, args );

      return deferred.promise;
    };
  }

  // Handle the event things first because they don't need to be wrapped.
  // Note: ngDropboxSync does NOT get separate callbacks from dropbox.sync.
  // That is to say, they both have the exact same list of callbacks.
  // Calling dropboxSync.on( 'someEvent', cb ) will result in window.dropbox.sync.trigger( 'someEvent' )
  // calling cb.
  ngDropboxSync.trigger = dropboxSync.trigger;
  ngDropboxSync.off = dropboxSync.off;
  ngDropboxSync.on = dropboxSync.on;

  for( prop in dropboxSync ) {
    if( ! dropboxSync.hasOwnProperty( prop ) ) continue;

    if( ! ngDropboxSync[ prop ] )
      ngDropboxSync[ prop ] = wrapDropboxCall( dropboxSync[ prop ] );
  }

  return ngDropboxSync;
});
