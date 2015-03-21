'use strict';

/* Controllers */

function MainCtrl($scope, $http, CalendarServices) {
  CalendarServices.getCalendars($http);
  $scope.calendars = CalendarServices.calendars;
}

function IndexCtrl($scope, $http, CalendarServices) {
  $scope.calendars = CalendarServices.calendars;
}

function SettingsCtrl($scope, $http) {
  $scope.form = {};
  $http.get('/dashboard/user').
    success(function(data, status, headers, config) {
      $scope.form.email = data.email;
    });
  $scope.saveSettings = function () {

  }
}

function LogoutCtrl($scope, $http) {
  console.log('hehe');
  window.location.href = '/logout';
}