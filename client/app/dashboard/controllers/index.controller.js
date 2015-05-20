(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'CalendarService'];

  function IndexController($scope, CalendarService) {
    $scope.calendars = [];
    $scope.isLoaded = false;
    $scope.isLoadedAppointments = false;
    $scope.todaysAppointments = [];

    initialize();

    function initialize() {
      fetchCalendars();
      fetchTodaysAppointment();
    }

    function fetchCalendars() {
      CalendarService.getCalendars(function (calendars) {
        $scope.calendars = calendars.filter(function (calendar) {
          return !calendar.closed;
        });
        $scope.isLoaded = true;
      });
    }

    function fetchTodaysAppointment() {
      CalendarService.getTodaysAppointment(function (response) {
        if (response.ok) {
          var slots = response.slots;
          $scope.todaysAppointments = [];
          slots.forEach(function (slot) {
            $scope.todaysAppointments.push({
              date: slot.date.split('T')[0],
              time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
              name: slot.Appointment.name
            });
          });
          $scope.isLoadedAppointments = true;
        }
      });
    }
  }

})();