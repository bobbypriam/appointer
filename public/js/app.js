'use strict';

angular.module('appointer', ['appointer.services']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'dashboard/partials/index',
        controller: IndexCtrl
      }).
      when('/dashboard/settings', {
        templateUrl: 'partials/settings',
        controller: SettingsCtrl
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
    $locationProvider.html5Mode(true);
  }]);