(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('CalendarDetailController', CalendarDetailController);

  CalendarDetailController.$inject = ['$scope', '$window', '$location', '$routeParams', 'CalendarService'];

  function CalendarDetailController($scope, $window, $location, $routeParams, CalendarService) {
    var calendar = $scope.calendar = $.grep(CalendarService.calendars,
      function (element) {
        return element.url == $routeParams.name;
      })[0];
    $scope.isLoadedAppointments = false;
    fetchAppointments();

    function fetchAppointments() {
      CalendarService.getAppointments(calendar.id, function (response) {
        if (response.ok) {
          var slots = response.slots;
          $scope.appointments = [];
          slots.forEach(function (slot) {

            if(new Date(
                (new Date(slot.date.split('T')[0]))
                  .setHours(slot.time.split(':')[0], 
                            slot.time.split(':')[1])).getTime() > (new Date()).getTime())
              $scope.appointments.push({
                date: slot.date.split('T')[0],
                time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
                name: slot.Appointment.name
              });
          });
          $scope.isLoadedAppointments = true;
        }
      });
    }

    $scope.redirectToCalendar = function (url) {
      $window.open(url, '_blank');
    };

    $scope.togglePublish = function ($event) {
      $event.preventDefault();
      var newCal = {
        id: calendar.id,
        published: !calendar.published
      };
      CalendarService.updateCalendar(newCal, function (response) {
        if (response.ok) {
          CalendarService.getCalendars(function (calendar) {});
          calendar.published = !calendar.published;
        }
      });
    };

    $scope.checkTitle = function () {
      if ($scope.form.title == $scope.calendar.title)
        $('.delete-button').attr('disabled', false);
      else
        $('.delete-button').attr('disabled', true);
    };

    $scope.cancelDelete = function () {
      $scope.form.title = '';
    };

    $scope.delete = function () {
      var calendar = {
        id: $scope.calendar.id,
        title: $scope.form.title
      };
      CalendarService.deleteCalendar(calendar, function (response) {
        if (response.ok) {
          CalendarService.getCalendars(function (calendar) {
            $('.modal-backdrop').remove();
            $location.path('dashboard');
          });
        }
      });
    };
  }
  
})();
