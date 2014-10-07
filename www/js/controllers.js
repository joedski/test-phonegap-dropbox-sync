angular.module( 'starter.controllers', [] )

.controller( 'DashCtrl', function( $scope, dropboxSync ) {
	$scope.isDropboxLinked = false;
	$scope.isDropboxLinkInProgress = true;

	console.log( 'DashCtrl' );

	dropboxSync.checkLink()
		.then( dropboxIsLinked, dropboxIsNotLinked )
		[ 'finally' ]( stopProgress );

	$scope.link = function callDropboxLink() {
		if( $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropboxSync.link()
			.then( dropboxIsLinked, dropboxIsNotLinked )
			[ 'finally' ]( stopProgress );
	};

	$scope.unlink = function callDropboxUnlink() {
		if( ! $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropboxSync.unlink()
			// The fail condition should really be something about errorUnlinking or something.
			.then( dropboxIsNotLinked, dropboxIsLinked )
			[ 'finally' ]( stopProgress );
	};

	function dropboxIsLinked() {
		console.log( "dropboxIsLinked" );
		$scope.isDropboxLinked = true;
	}

	function dropboxIsNotLinked() {
		console.log( "dropboxIsNotLinked" );
		$scope.isDropboxLinked = false;
	}

	function stopProgress() {
		console.log( "stopProgress" );
		$scope.isDropboxLinkInProgress = false;
		// $scope.$apply();
	}
})

.controller( 'AccountCtrl', function( $scope ) {
});
