(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('CalendarDetailController', CalendarDetailController);

  CalendarDetailController.$inject = ['$rootScope', '$scope', '$window', '$location', '$routeParams', 'CalendarService'];

  function CalendarDetailController($rootScope, $scope, $window, $location, $routeParams, CalendarService) {
    
    // bindable variables
    $scope.calendar = {};
    $scope.isLoadedAppointments = false;

    // bindable functions
    $scope.cancelDelete = cancelDelete;
    $scope.checkTitle = checkTitle;
    $scope.delete = deleteCalendar;
    $scope.redirectToCalendar = redirectToCalendar;
    $scope.togglePublish = togglePublish;
    $scope.toggleClose = toggleClose;

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
      toggleCalendar($event, true);
    }

    function toggleClose($event) {
      toggleCalendar($event, false);
    }

    function toggleCalendar($event, publish) {
      $event.preventDefault();
      var newCal = {
        id: calendar.id,
        published: publish ? !calendar.published : calendar.published,
        closed: publish ? calendar.closed : !calendar.closed
      };

      CalendarService.updateCalendar(newCal, function (response) {
        if (response.ok) {
          CalendarService.getCalendars(function (calendar) {});
          calendar.published = newCal.published;
          calendar.closed = newCal.closed;
          refreshMyCalendar();
        }
      });
    }

    function refreshMyCalendar() {
      var globalControllerElement = document.querySelector('.body');
      var globalControllerScope = angular.element(globalControllerElement).scope();
      globalControllerScope.initiate();
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
