'use strict';

/* Services */
angular.module('appointer.services', [])
  .factory('CalendarService', ['$http',
    function ($http) {
      var model = {};

      model.getCalendar = function (id, callback) {
        $http.get(baseurl+'calendar/'+id).success(callback);
      }

      return model;
    }]);