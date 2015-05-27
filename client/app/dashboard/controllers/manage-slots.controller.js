(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('ManageSlotsController', ManageSlotsController);

  ManageSlotsController.$inject = ['$scope', '$location', '$routeParams', 'CalendarService'];

  function ManageSlotsController($scope, $location, $routeParams, CalendarService) {

    // bindable variables
    $scope.calendar = {};
    $scope.floatTheadOptions = {};
    $scope.processing = false;

    // bindable functions
    $scope.checkBusy = checkBusy;
    $scope.checkIfBusy = checkIfBusy;
    $scope.checkIfSelected = checkIfSelected;
    $scope.next = next;
    $scope.prev = prev;
    $scope.save = save;
    $scope.saveAndPublish = saveAndPublish;
    $scope.toggleSlot = toggleSlot;

    var calendar;
    var startDate;
    var endDate;
    var duration;
    var startIdx;
    var endIdx;

    var busyTimes = [];

    initiate();

    function initiate() {
      $scope.processing = true;
      fetchCalendar();
      populateCalendar();
      initiateFloatThead();
      $scope.processing = false;
    }

    function fetchCalendar() {
      calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
        return cal.url == $routeParams.name;
      })[0];

      startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
      endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
      duration = calendar.duration;
      startIdx = 0;
      endIdx = 6;
    }

    function fetchBusyTimes(callback) {
      $scope.isLoadingBusyTimes = true;
      CalendarService.getBusyTimes(calendar.id, function (response) {
        if (response.ok) {
          busyTimes = response.busy;
        } else {
          alert('failed retrieving data.');
        }

        $scope.isLoadingBusyTimes = false;
        callback();
      });
    }

    function populateCalendar(callback) {
      populateSelected();
      populateDays();
      populateTimes();
    }

    function initiateFloatThead() {
      $('tbody').css('height', $(window).height() - 200);

      $scope.floatTheadOptions = {
        scrollContainer: function($table){
            return $table.closest('#calendar');
        }
      };
    }

    function toggleSlot(day, time, $event) {
      var target = $($event.target);
      if (target.hasClass('busy'))
        return;
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
    }

    function checkBusy() {
      fetchBusyTimes(function () {
        $('.slot').each(function() {
          var $this = $(this);
          var day = $this.data('day');
          var time = $this.data('time');
          var busy = checkIfBusy(day, time);
          console.log(busy);
          if (busy)
            $this.addClass('busy');
        });
      });
    }

    function checkIfBusy(day, time) {
      var concatenatedDateTime = day + 'T' + time + ':01+07:00';
      for (var i = 0; i < busyTimes.length; i++) {
        if (busyTimes[i].start < concatenatedDateTime &&
            busyTimes[i].end > concatenatedDateTime) {
          return true;
        }
      }
      return false;
    }

    function checkIfSelected(day, time) {
      return $.grep($scope.selected, function(slot) {
        return slot.date == day && slot.time == time;
      }).length !== 0;
    }

    function prev() {
      shift(-7);
    }

    function next() {
      if ($scope.days.length < 7)
        return;
      shift(7);
    }

    function save() {
      submitSlots(calendar.published);
    }

    function saveAndPublish() {
      submitSlots(true);
    }

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