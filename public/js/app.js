'use strict';

var baseurl = '/';

angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when(baseurl+'dashboard', {
        templateUrl: baseurl+'dashboard/partials/index',
        controller: IndexCtrl
      }).
      when(baseurl+'dashboard/settings', {
        templateUrl: baseurl+'dashboard/partials/settings',
        controller: SettingsCtrl
      }).
      when(baseurl+'dashboard/:name', {
        templateUrl: baseurl+'dashboard/partials/detail',
        controller: CalendarDetailCtrl
      }).
      when(baseurl+'dashboard/:name/slots', {
        templateUrl: baseurl+'dashboard/partials/slots',
        controller: ManageSlotsCtrl
      }).
      otherwise({
        redirectTo: baseurl+'dashboard'
      });
    $locationProvider.html5Mode(true);
  }]);