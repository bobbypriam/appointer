'use strict';

/* Services */
angular.module('appointer.services', [])
  .factory('CalendarService', ['$http',
    function ($http) {
      var model = { calendars: [] };

      model.getCalendars = function () {
        $http.get('/dashboard/calendars').
          success(function(data, status, headers, config) {
            angular.copy(data.calendars, model.calendars);
          });
      }

      model.postCalendar = function (calendar, callback) {
        $http.post('/dashboard/calendars/new', calendar).success(callback);
      }

      return model;
    }]);