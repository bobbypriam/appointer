(function () {
  'use strict';

  angular
    .module('appointer')
    .config(['$routeProvider', '$locationProvider', DashboardRouter]);

  function DashboardRouter($routeProvider, $locationProvider) {
    $routeProvider.
      when('/dashboard', {
        templateUrl: 'dashboard/partials/index',
        controller: 'IndexController'
      }).
      when('/dashboard/settings', {
        templateUrl: 'dashboard/partials/settings',
        controller: 'SettingsController'
      }).
      when('/dashboard/:name', {
        templateUrl: 'dashboard/partials/detail',
        controller: 'CalendarDetailController'
      }).
      when('/dashboard/:name/edit', {
        templateUrl: 'dashboard/partials/edit',
        controller: 'EditCalendarDetailController'
      }).
      when('/dashboard/:name/slots', {
        templateUrl: 'dashboard/partials/slots',
        controller: 'ManageSlotsController'
      }).
      when('/dashboard/:name/appointments', {
        templateUrl: 'dashboard/partials/appointments',
        controller: 'AppointmentsListController'
      }).
      otherwise({
        redirectTo: '/dashboard'
      });
    $locationProvider.html5Mode(true);
  }
  
})();