# bookmark-it

> This example uses APIs that are available from Firefox 47 onwards.

## What it does

Displays a simple button in the menu bar that toggles a bookmark for the currently active tab.

To display the button, the extension registers a [browserAction](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction) in the manifest.

A background script will listen for tab events and update the browserAction icon correspondingly. It also listens for `browserAction.onClicked` events to create or remove a bookmark when the user has clicked the icon.

## What it shows

* how to use the various `bookmarks` functions
  * create a bookmark
  * remove a bookmark
  * search bookmarks by url
* how to register a browserAction
* how to listen for tab changes

Compress graphic by <a href="http://www.freepik.com/">Freepik</a> from <a href="http://www.flaticon.com/">Flaticon</a> is licensed under <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC BY 3.0</a>. Made with <a href="http://logomakr.com" title="Logo Maker">Logo Maker</a>
