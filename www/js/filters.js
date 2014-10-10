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

		// collapse runs of slashes.
		filePath = filePath.replace( /\/+/g, '/' );

		// Remove trailing slashes.
		filePath = filePath.replace( /(.+)\/*$/, '$1' );

		return filePath;
	};
})

.filter( 'baseName', function( $filter ) {
	return function baseName( filePath ) {
		filePath = $filter( 'normalizePath' )( filePath );
		return (/([^\/]+)$/).exec( filePath )[ 1 ] || '';
	};
})

// dirName is a bit more complicated:
// dirName '/' -> '/'
// dirName '/foo' -> '/'
// dirName 'foo' -> '.'
// dirName 'foo/bar' -> 'foo'
// dirName '/foo/bar' -> '/foo'
.filter( 'dirName', function( $filter ) {
	return function dirName( filePath ) {
		filePath = filePath.replace( /\/+/g, '/' );

		if( /^\/[^\/]*$/.test( filePath ) ) {
			return '/';
		}

		if( /^[^\/]*$/.test( filePath ) ) {
			return '.';
		}

		return $filter( 'normalizePath' )( filePath.replace( /\/[^\/]+$/, '' ) );
	};
});
