(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('ClosedCalendarsController', ClosedCalendarsController);

  ClosedCalendarsController.$inject = ['$scope', 'CalendarService'];

  function ClosedCalendarsController($scope, CalendarService) {
    $scope.calendars = CalendarService.calendars.filter(function (calendar) {
      return calendar.closed;
    });
    $scope.isLoaded = true;
  }

})();