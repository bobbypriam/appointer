(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('CalendarDetailController', CalendarDetailController);

  CalendarDetailController.$inject = ['$scope', '$window', '$location', '$routeParams', 'CalendarService'];

  function CalendarDetailController($scope, $window, $location, $routeParams, CalendarService) {
    
    // bindable variables
    $scope.calendar = {};
    $scope.isLoadedAppointments = false;

    // bindable functions
    $scope.cancelDelete = cancelDelete;
    $scope.checkTitle = checkTitle;
    $scope.delete = deleteCalendar;
    $scope.redirectToCalendar = redirectToCalendar;
    $scope.togglePublish = togglePublish;

    var calendar = {};

    initiate();

    function initiate() {
      fetchCalendar();
      fetchAppointments();
    }

    function fetchCalendar() {
      $scope.calendar = calendar = $.grep(CalendarService.calendars,
        function (element) {
          return element.url == $routeParams.name;
        })[0];
    }

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

    function redirectToCalendar(url) {
      $window.open(url, '_blank');
    }

    function togglePublish($event) {
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
    }

    function checkTitle() {
      if ($scope.form.title == $scope.calendar.title)
        $('.delete-button').attr('disabled', false);
      else
        $('.delete-button').attr('disabled', true);
    }

    function cancelDelete() {
      $scope.form.title = '';
    }

    function deleteCalendar() {
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
    }
  }
  
})();
