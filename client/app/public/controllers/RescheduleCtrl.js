angular.module('appointer.controllers')

.controller('RescheduleCtrl', ['$scope', '$location', '$timeout', 'CalendarService',
    function RescheduleCtrl($scope, $location, $timeout, CalendarService) {
      var startIdx = 0;
      var endIdx = 6;
      var startDate, endDate, duration;
      var cal;
      var oldAppointment = $scope.oldAppointment = JSON.parse(sessionStorage.appointment);
      $scope.isViewLoading = true;

      CalendarService.getCalendar(sessionStorage.calendarName, function (calendar) {
        $scope.calendar = cal = calendar;
        $scope.slots = calendar.Slots;

        startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
        endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
        duration = calendar.duration;

        populateDays();
        populateTimes();
        populateSelected();
        jQuery('.table').trigger('update');
        $scope.isViewLoading = false;
      });

      $scope.success = false;

      $scope.clickSlot = function (day, time, $event) {
        var target = $($event.target);
        if (!$scope.checkIfSelected(day, time))
          return false;

        $scope.form = {};
        $scope.form.slot = {
          date: day,
          time: time,
          CalendarId: cal.id
        };
        $scope.form.appointmentId = oldAppointment.id;
        $('#reschedule-modal').modal('show');
      };

      $scope.checkIfSelected = function (day, time) {
        return $.grep($scope.selected, function(slot) {
          return slot.date == day && slot.time == time;
        }).length !== 0;
      };

      $scope.floatTheadOptions = {
        scrollContainer: function($table){
            return $table.closest('#calendar');
        }
      };

      $scope.prev = function () {
        shift(-7);
      };

      $scope.next = function () {
        if ($scope.days.length < 7)
          return;
        shift(7);
      };

      $scope.submit = function () {
        $scope.processing = true;
        CalendarService.rescheduleAppointment($scope.form, function(response) {
          if (response.ok) {
            $scope.processing = false;
            redirectSuccess();
          }
        });
      };

      function shift(inc) {
        if (startIdx + inc >= 0) {
          $scope.isViewLoading = true;
          startIdx += inc;
          endIdx += inc;
          populateDays();
          $scope.isViewLoading = false;
        }
      }

      function populateSelected() {
        $scope.selected = [];
        $scope.slots.forEach(function (slot) {
          if (!slot.status)
            $scope.selected.push({
              date: slot.date.split('T')[0],
              time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1]
            });
        });
      }

      function populateDays() {
        $scope.days = [];
        for (var i = startIdx; i <= endIdx; i++) {
          var current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
          current.setTime(startDate.getTime());
          current.setDate(startDate.getDate() + i);
          current = new Date(current.getTime());
          if (current.getTime() <= endDate.getTime()) {
            $scope.days.push(current.getFullYear() + '-' +
                             (current.getMonth() < 10 ? '0' : '') + (current.getMonth() + 1) + '-' +
                             (current.getDate() < 10 ? '0' : '') + current.getDate());
          }
        }
      }

      function populateTimes() {
        var d = new Date();
        d.setHours(7, 0);

        $scope.times = [];
        while (d.getHours() < 21) {
          $scope.times.push((d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes());
          d.setMinutes(d.getMinutes() + duration);
        }
      }

      function redirectSuccess() {
        $scope.success = true;
      }
    }]);