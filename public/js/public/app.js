'use strict';

var baseurl = '/';

angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when(baseurl+':name', {
        templateUrl: baseurl+'partials/index',
        controller: 'IndexCtrl'
      }).
      when(baseurl+':name/success', {
        templateUrl: baseurl+'partials/success'
      }).
      otherwise({
        redirectTo: function (routeParams) {
          console.log(routeParams);
          return baseurl+routeParams.name;
        }
      });
    $locationProvider.html5Mode(true);
  }]);