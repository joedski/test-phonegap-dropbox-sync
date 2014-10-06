angular.module( 'starter.controllers', [] )

.controller( 'DashCtrl', function( $scope, dropbox ) {
	$scope.isDropboxLinked = false;
	$scope.isDropboxLinkInProgress = true;

	dropbox.checkLink()
		.done( function dropboxIsLinked() {
			$scope.isDropboxLinked = true;
		})
		.fail( function dropboxIsNotLinked() {
			$scope.isDropboxLinked = false;
		})
		[ 'finally' ]( function stopProgress() {
			$scope.isDropboxLinkInProgress = false;
		});

	$scope.link = function callDropboxLink() {
		if( $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropbox.link()
			.done( function dropboxIsLinked() {
				$scope.isDropboxLinked = true;
			})
			.fail( function dropboxIsNotLinked() {
				$scope.isDropboxLinked = false;
			})
			[ 'finally' ]( function stopProgress() {
				$scope.isDropboxLinkInProgress = false;
			});
	};

	$scope.unlink = function callDropboxUnlink() {
		if( ! $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropbox.unlink()
			.done( function dropboxIsNotLinked() {
				$scope.isDropboxLinked = false;
			})
			.fail( function dropboxIsLinked() {
				$scope.isDropboxLinked = true;
			})
			[ 'finally' ]( function stopProgress() {
				$scope.isDropboxLinkInProgress = false;
			});
	};
})

.controller( 'AccountCtrl', function( $scope ) {
});
