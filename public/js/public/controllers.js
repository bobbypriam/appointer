'use strict';

/* Controllers */

angular.module('appointer.controllers', [])
  .controller('IndexCtrl', IndexCtrl);

function IndexCtrl($scope, $routeParams, CalendarService) {
  var startIdx = 0;
  var endIdx = 6;
  var startDate, endDate, duration;

  CalendarService.getCalendar($routeParams.name, function (calendar) {
    $scope.calendar = calendar;
    $scope.slots = calendar.Slots;

    startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
    endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
    duration = calendar.duration;

    populateDays();
    populateTimes();
    populateSelected();
    jQuery('.table').trigger('update');
  });

  $scope.clickSlot = function (day, time, $event) {
    var target = $($event.target);
    if (!target.hasClass('selected'))
      return false;

    $scope.form = {};
    $scope.form.date = day;
    $scope.form.time = time;
    $('.modal').modal('show');
  }

  $scope.checkIfSelected = function (day, time) {
    return $.grep($scope.selected, function(slot) {
      return slot.date == day && slot.time == time;
    }).length !== 0;
  }

  $scope.floatTheadOptions = {
    scrollContainer: function($table){
        return $table.closest('#calendar');
    }
  }

  $scope.prev = function () {
    shift(-7);
  }

  $scope.next = function () {
    if ($scope.days.length < 7)
      return;
    shift(7);
  }

  function shift(inc) {
    if (startIdx + inc >= 0) {
      startIdx += inc;
      endIdx += inc;
      populateDays();
    }
  }

  function populateSelected() {
    $scope.selected = [];
    $scope.slots.forEach(function (slot) {
      $scope.selected.push({
        date: slot.date.split('T')[0],
        time: slot.time.split(':')[0] + ':' + slot.time.split(':')[1],
        status: slot.status
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
    $scope.times = [];
    var d = new Date();
    d.setHours(7, 0);
    var day = d.getDay();

    while (d.getDay() == day) {
      $scope.times.push((d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes());
      d.setMinutes(d.getMinutes() + duration);
    }
  }
}