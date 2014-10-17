angular.module( 'starter.controllers', [] )

.controller( 'DashCtrl', function( $scope, dropboxSync, $state ) {
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

	$scope.viewFileList = function viewFileList() {
		console.log( "DashCtrl: viewFileList" );
		$state.go( 'tab.dash.filelist', { path: '/' } );
	};

	$scope.showScratchFile = function showScratchFile() {
		$state.go( 'tab.dash.filecontent', { path: '/scratch.txt' } );
	};

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

.controller( 'FileListCtrl', function( $scope, $stateParams, $state, dropboxSync, $filter ) {
	console.log( "FileListCtrl" );

	$scope.currentPath = $stateParams.path;

	$scope.fileList = [];
	$scope.isLoading = false;

	$scope.showFile = showFile;

	showFileListAt( $scope.currentPath );

	function showFileListAt( path ) {
		console.log( "FileListCtrl: showFileListAt", path );
		path = $filter( 'normalizePath' )( '/' + path );

		$scope.isLoading = true;

		dropboxSync.listFolder( path )
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

	function showFile( file ) {
		console.log( "FileListCtrl.showFile:", file );

		if( file.isFolder ) {
			$state.go( 'tab.dash.filelist', { path: file.path } );
		}
		else {
			console.log( "showFileContents:", file.path );
		}
	}
})

.controller( 'FileContentCtrl', function( $scope, $stateParams, dropboxSync ) {
	console.log( "FileContentCtrl:", $stateParams.path );

	$scope.path = $stateParams.path;
	$scope.fileContent = '';
	$scope.errorMessage = '';
	// Just assuming text for now.
	$scope.fileType = 'text';

	startLoading();
	readFile();

	function readFile() {
		dropboxSync.readString( $scope.path )
		.then(
			showFile,
			showError
		)
		['finally']( endLoading );
	}

	function showFile( contentString ) {
		$scope.fileContent = contentString;
	}

	function showError( error ) {
		$scope.errorMessage = "Could not load file at '" + String( $scope.path ) + "'.";
	}

	function startLoading() {
		$scope.isLoading = true;
	}

	function endLoading() {
		$scope.isLoading = true;
	}
})

.controller( 'AccountCtrl', function( $scope ) {
});
