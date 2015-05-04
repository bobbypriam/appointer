(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('ManageSlotsController', ManageSlotsController);

  ManageSlotsController.$inject = ['$scope', '$location', '$routeParams', 'CalendarService'];

  function ManageSlotsController($scope, $location, $routeParams, CalendarService) {
    $('tbody').css('height', $(window).height() - 200);

    var calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
      return cal.url == $routeParams.name;
    })[0];

    var startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
    var endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
    var duration = calendar.duration;
    var startIdx = 0;
    var endIdx = 6;

    $scope.processing = true;
    populateSelected();
    populateDays();
    populateTimes();
    $scope.processing = false;

    $scope.toggleSlot = function (day, time, $event) {
      var target = $($event.target);
      target.toggleClass('selected');
      if (target.hasClass('selected')) {
        $scope.selected.push({
          date: day,
          time: time,
          status: false
        });
      } else {
        $scope.selected = $.grep($scope.selected, function(slot) {
          return slot.date !== day || slot.time !== time;
        });
      }
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

    $scope.save = function () {
      submitSlots(calendar.published);
    };

    $scope.saveAndPublish = function () {
      submitSlots(true);
    };

    function submitSlots(published) {
      $scope.processing = true;
      var slots = {
        calendarID: calendar.id,
        slots: $scope.selected,
        published: published
      };
      CalendarService.postSlots(slots, function (response) {
        if (response.ok) {
          CalendarService.getCalendars(function (calendars) {
            $scope.processing = false;
            $location.path('dashboard/'+calendar.url);
          });
        }
      });
    }

    function shift(inc) {
      if (startIdx + inc >= 0) {
        $scope.processing = true;
        startIdx += inc;
        endIdx += inc;
        populateDays();
        $scope.processing = false;
      }
    }

    function populateSelected() {
      $scope.selected = [];
      CalendarService.getSlots(calendar.id, function (response) {
        if (response.ok) {
          response.slots.forEach(function (slot) {
            $scope.selected.push({
              date: slot.date.split('T')[0],
              time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
              status: slot.status
            });
          });
        }
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
  }
  
})();