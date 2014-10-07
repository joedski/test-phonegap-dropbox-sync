angular.module('starter.filters', [])

.filter( 'isEmpty', function() {
	return function isEmpty( object ) {
		return _.isEmpty( object );
	};
})

.filter( 'normalizePath', function() {
	return function normalizePath( filePath ) {
		// replace backslashes with slashes.
		filePath = filePath.replace( /\\/g, '/' );

		// Remove trailing slashes.
		filePath = filePath.replace( /\/*$/, '' );

		// collapse runs of slashes.
		filePath = filePath.replace( /\/+/g, '/' );

		return filePath;
	};
})

.filter( 'baseName', function() {
	return function baseName( filePath ) {
		filePath = normalizePath( filePath );
		return (/([^\/]+)$/).exec( filePath )[ 1 ] || '';
	};
})

.filter( 'dirName', function( normalizePath ) {
	return function dirName( filePath ) {
		filePath = normalizePath( filePath );
		return normalizePath( filePath.replace( (/^(.*?)([^\/]+)$/), '$1' ) );
	};
});
