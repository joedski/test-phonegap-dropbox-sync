angular.module( 'starter.controllers', [] )

.controller( 'DashCtrl', function( $scope, dropboxSync, $location ) {
	$scope.isDropboxLinked = false;
	$scope.isDropboxLinkInProgress = true;

	console.log( 'DashCtrl' );

	checkDropboxLink();

	$scope.$on( 'accountChange', function onAccountChange( event ) {
		console.log( 'DashCtrl: onAccountChange' );
		checkDropboxLink();
	});

	$scope.link = function callDropboxLink() {
		if( $scope.isDropboxLinked ) return;

		startProgress();

		dropboxSync.link()
			.then( checkDropboxLink, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	};

	$scope.unlink = function callDropboxUnlink() {
		if( ! $scope.isDropboxLinked ) return;

		startProgress();

		dropboxSync.unlink()
			.then( checkDropboxLink, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	};

	// $scope.viewFileList = function viewFileList() {
	// 	console.log( "DashCtrl: viewFileList" );
	// 	$location.path( '/files/' );
	// };

	function checkDropboxLink() {
		console.log( "checkDropboxLink" );

		startProgress();

		dropboxSync.checkLink()
			.then( updateDropboxIsLinked, errorCheckingDropboxLink )
			[ 'finally' ]( stopProgress );
	}

	function updateDropboxIsLinked( isLinked ) {
		console.log( 'updateDropboxIsLinked:', isLinked );
		$scope.isDropboxLinked = isLinked;
	}

	function errorCheckingDropboxLink( error ) {
		console.log( "errorCheckingDropboxLink:" );
		console.log( error );
	}

	function startProgress() {
		console.log( "startProgress" );
		$scope.isDropboxLinkInProgress = true;
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
		['finally']( function stopLoading() {
			$scope.isLoading = false;
		});
	}
})

.controller( 'AccountCtrl', function( $scope ) {
});
