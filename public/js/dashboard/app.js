'use strict';

angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'dashboard/partials/index',
        controller: 'IndexCtrl'
      }).
      when('/dashboard/settings', {
        templateUrl: 'dashboard/partials/settings',
        controller: 'SettingsCtrl'
      }).
      when('/dashboard/:name', {
        templateUrl: 'dashboard/partials/detail',
        controller: 'CalendarDetailCtrl'
      }).
      when('/dashboard/:name/edit', {
        templateUrl: 'dashboard/partials/edit',
        controller: 'EditCalendarDetailCtrl'
      }).
      when('/dashboard/:name/slots', {
        templateUrl: 'dashboard/partials/slots',
        controller: 'ManageSlotsCtrl'
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
    $locationProvider.html5Mode(true);
  }]);