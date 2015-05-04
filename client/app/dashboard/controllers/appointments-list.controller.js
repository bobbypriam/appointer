(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('AppointmentsListController', AppointmentsListController);

  AppointmentsListController.$inject = ['$scope', '$routeParams', 'CalendarService'];

  function AppointmentsListController($scope, $routeParams, CalendarService) {
    var calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
      return cal.url == $routeParams.name;
    })[0];

    $scope.isLoadedAppointments = false;
    $scope.processing = false;
    fetchAppointments();

    function fetchAppointments() {
      CalendarService.getAppointments(calendar.id, function (response) {
        if (response.ok) {
          var slots = response.slots;
          $scope.appointments = [];
          slots.forEach(function (slot) {
            $scope.appointments.push({
              slotID: slot.id,
              id: slot.Appointment.id,
              date: slot.date.split('T')[0],
              time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
              name: slot.Appointment.name,
              email: slot.Appointment.email,
              phone: slot.Appointment.phone,
              token: slot.Appointment.token,
              rescheduling: false,
              deleting: false
            });
          });
          $scope.isLoadedAppointments = true;
        }
      });
    }

    $scope.seeDetail = function (appointment, $event) {
      $event.preventDefault();

      $scope.appointment = appointment;
      $scope.reset();
      $('#appointment-detail-modal').modal('show');
    };

    $scope.rescheduling = function () {
      $scope.appointment.rescheduling = true;
    };

    $scope.deleting = function () {
      $scope.appointment.deleting = true;
    };

    $scope.postDelete = function () {
      $scope.processing = true;
      var appointment = {
        id: $scope.appointment.id,
        SlotId: $scope.appointment.slotID
      };
      console.log(appointment);
      CalendarService.deleteAppointment(appointment, function (response) {
        if (response.ok) {
          $scope.appointments = $scope.appointments.filter(function (app) {
            return app.id !== appointment.id;
          });
          alert('Successfully deleted');
          $scope.processing = false;
          $('#appointment-detail-modal').modal('hide');
        }
      });
    };

    $scope.postReschedule = function () {
      $scope.processing = true;
      var data = {
        email: $scope.appointment.email,
        reason: $scope.form.reason,
        token: $scope.appointment.token
      };
      CalendarService.postAskForReschedule(data, function (response) {
        if (response.ok) {
          $scope.form = {};
          $scope.reset();
          alert('Successfully sent reschedule notification');
          $scope.processing = false;
        }
      });
    };

    $scope.reset = function () {
      $scope.appointment.rescheduling = false;
      $scope.appointment.deleting = false;
    };
  }

})();