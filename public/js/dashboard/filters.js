'use strict';

/* Filters */

angular.module('appointer.filters', []).
  filter('normalizeTitle', function() {
    return function(text) {
      if (typeof text !== 'undefined')
        return text.replace(/\s+/g, '-').toLowerCase();
    };
  });
