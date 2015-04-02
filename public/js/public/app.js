'use strict';

angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/:name', {
        templateUrl: 'partials/index',
        controller: 'IndexCtrl'
      }).
      when('/:name/success', {
        templateUrl: 'partials/success'
      }).
      otherwise({
        redirectTo: function (routeParams) {
          console.log(routeParams);
          return '/'+routeParams.name;
        }
      });
    $locationProvider.html5Mode(true);
  }]);