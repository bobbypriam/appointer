'use strict';

/* Services */
angular.module('appointer.services', [])
  .factory('CalendarServices', function () {
    var model = { calendars: [] };

    model.getCalendars = function ($http) {
      $http.get('/dashboard/calendars').
        success(function(data, status, headers, config) {
          angular.copy(data.calendars, model.calendars);
        });
    }

    return model;
  });