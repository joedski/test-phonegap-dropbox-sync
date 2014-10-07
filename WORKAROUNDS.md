Workarounds
===========

A file listing various issues I've had to work around to get this project working,
documented for future posterity (and so I don't have to wonder what I did to fix something.)



Getting deviceReady events before plugins were loaded on first launch of app
----------------------------------------------------------------------------

When trying to use the dropbox plugin, I was getting hangs that would only occur the first time an app is launched, and not when it's already loaded in memory, as well as not when you reload it from Safari's dev console.

[A method that worked](https://github.com/driftyco/ng-cordova/issues/8#issuecomment-48703042), suggested by a Natsu on Github, was to manually start the app, which meant removing the ng-app directive from the app container:

```html
<body ng-app="starter" animation="slide-left-right-ios7">
```

became

```html
<body animation="slide-left-right-ios7">
```

and an additional `<script>` was added to `<head>`:

```html
<script>
window.ionic.Platform.ready( function startApp() {
  angular.bootstrap( document, [ 'starter' ] );
});
</script>
```

`'starter'` being the name of the app's angular module, of course.
