'use strict';

var baseurl = '/';

angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when(baseurl+':name', {
        templateUrl: baseurl+'partials/index',
        controller: IndexCtrl
      }).
      otherwise({
        redirectTo: baseurl+':name'
      });
    $locationProvider.html5Mode(true);
  }]);