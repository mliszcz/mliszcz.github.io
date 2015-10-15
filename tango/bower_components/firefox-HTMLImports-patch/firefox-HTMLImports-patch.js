
/**
 * HTML Imports implementation seems to be broken in Firefox.
 * Enabling dom.webcomponents.enabled adds `import` attribute
 * to the HTMLLinkElement. This makes HTMLImports polyfill to
 * fall-back to native implementation.
 * This patch intercepts `document.createElement()` call from
 * the polyfill, thus needs to be loaded before HTMLImports.js.
 * @see https://github.com/webcomponents/webcomponentsjs/issues/289
 * @author mliszcz<liszcz.michal@gmail.com>
 * @license MIT
 */
(function (window, document, console) {
  'use strict'

  // http://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browser
  var isFirefox = typeof InstallTrigger !== 'undefined';

  if (isFirefox) {

    console.debug('patching document.createElement for HTMLImports');

    var _createElement = document.createElement;
    var callCount = 0;

    // HTMLImports polyfill creates 'link' element and
    // checks for the presence of 'import' attribute.
    document.createElement = function(...args) {

      var element = _createElement.apply(document, args);

      if (callCount++ == 0 && args[0] == 'link' && 'import' in element) {
        console.debug('returning patched link element');
        return {};
      } else {
        return element;
      }
    };

    window.addEventListener('DOMContentLoaded', function() {
      console.debug('restoring document.createElement');
      document.createElement = _createElement;
    });
  }

})(window, document, console);
