'use strict';

/* Services */
angular.module('appointer.services', [])
  .factory('CalendarService', ['$http',
    function ($http) {
      var model = { calendars: [] };

      model.getCalendars = function (callback) {
        $http.get('dashboard/calendars').
          success(function(data, status, headers, config) {
            angular.copy(data.calendars, model.calendars);
            callback(model.calendars);
          });
      }

      model.postCalendar = function (calendar, callback) {
        $http.post('dashboard/calendars/new', calendar).success(callback);
      }

      model.updateCalendar = function (calendar, callback) {
        $http.post('dashboard/calendars/edit', { calendar: calendar }).success(callback);
      }

      model.deleteCalendar = function (calendar, callback) {
        $http.post('dashboard/calendars/delete', { id: calendar.id, title: calendar.title }).success(callback);
      }

      model.checkUrl = function (url, callback) {
        $http.post('dashboard/checkurl', { url: url }).success(callback);
      }

      model.getSlots = function (id, callback) {
        $http.get('dashboard/slots/get/'+id).success(callback);
      }

      model.postSlots = function (slots, callback) {
        $http.post('dashboard/slots/post', slots).success(callback);
      }

      model.getAppointments = function (id, callback) {
        $http.get('dashboard/appointments/get/'+id).success(callback);
      }

      return model;
    }])
  .factory('UserService', ['$http',
    function ($http) {
      var model = {};

      model.getUserDetails = function (callback) {
        $http.get('dashboard/user').success(callback);
      }

      model.editUserDetails = function (details, callback) {
        $http.post('dashboard/user', { details: details }).success(callback);
      }

      return model;
    }]);