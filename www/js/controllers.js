angular.module( 'starter.controllers', [] )

.controller( 'DashCtrl', function( $scope, dropboxSync, $location ) {
	$scope.isDropboxLinked = false;
	$scope.isDropboxLinkInProgress = true;

	console.log( 'DashCtrl' );

	checkDropboxLink();

	$scope.link = function callDropboxLink() {
		if( $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropboxSync.link()
			.then( checkDropboxLink, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	};

	$scope.unlink = function callDropboxUnlink() {
		if( ! $scope.isDropboxLinked ) return;

		$scope.isDropboxLinkInProgress = true;

		dropboxSync.unlink()
			.then( checkDropboxLink, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	};

	$scope.viewFileList = function viewFileList() {
		$location.path( '/files/' );
	};

	function checkDropboxLink() {
		dropboxSync.checkLink()
			.then( updateDropboxIsLinked, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	}

	function updateDropboxIsLinked( isLinked ) {
		$scope.isDropboxLinked = isLinked;
	}

	function errorCheckingDropboxLink( error ) {
		console.log( "errorCheckingDropboxLink:" );
		console.log( error );
	}

	function stopProgress() {
		console.log( "stopProgress" );
		$scope.isDropboxLinkInProgress = false;
	}
})

.controller( 'FileListCtrl', function( $scope, $stateParams, dropboxSync, normalizePath ) {
	$scope.currentPath = $stateParams.path;

	$scope.fileList = [];
	$scope.isLoading = false;

	showFileListAt( $scope.currentPath );

	// Currently non-interactive...

	function showFileListAt( path ) {
		path = normalizePath( '/' + path );

		$scope.isLoading = true;

		dropboxSync.listFolder()
		.then(
			function showListedFolder( folderContentsList ) {
				$scope.fileList = folderContentsList;
			},
			function errorRetrievingFolderContents( error ) {
				$scope.fileList = [];
				console.log( 'errorRetrievingFolderContents:' );
				console.log( error );
			}
		)
		['finally']( function stopProgress() {
			$scope.isLoading = false;
		});
	}
})

.controller( 'AccountCtrl', function( $scope ) {
});
