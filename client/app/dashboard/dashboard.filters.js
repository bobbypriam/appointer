(function () {
  'use strict';

  angular
    .module('appointer')
    .filter('normalizeTitle', function normalizeTitle() {
      return function(text) {
        if (typeof text !== 'undefined')
          return text.replace(/\s+/g, '-').toLowerCase();
      };
    });
  
})();
