(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('AppointmentsListController', AppointmentsListController);

  AppointmentsListController.$inject = ['$scope', '$routeParams', 'CalendarService'];

  function AppointmentsListController($scope, $routeParams, CalendarService) {
    
    // bindable variables
    $scope.calendar = {};
    $scope.isLoadedAppointments = false;
    $scope.processing = false;

    // bindable functions
    $scope.deleting = deleting;
    $scope.postDelete = postDelete;
    $scope.postReschedule = postReschedule;
    $scope.rescheduling = rescheduling;
    $scope.reset = reset;
    $scope.seeDetail = seeDetail;

    var calendar = {};

    initiate();

    function initiate() {
      fetchCalendar();
      fetchAppointments();
    }

    function fetchCalendar() {
      $scope.calendar = calendar = CalendarService.calendars.filter(function(cal) {
        return cal.url == $routeParams.name;
      })[0];
    }

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

    function seeDetail(appointment, $event) {
      $event.preventDefault();

      $scope.appointment = appointment;
      $scope.reset();
      $('#appointment-detail-modal').modal('show');
    }

    function rescheduling() {
      $scope.appointment.rescheduling = true;
    }

    function deleting() {
      $scope.appointment.deleting = true;
    }

    function postDelete() {
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
    }

    function postReschedule() {
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
    }

    function reset() {
      $scope.appointment.rescheduling = false;
      $scope.appointment.deleting = false;
    }
  }

})();