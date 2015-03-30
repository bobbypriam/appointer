'use strict';

/* Controllers */

angular.module('appointer.controllers', [])
  .controller('MainCtrl', MainCtrl)
  .controller('IndexCtrl', IndexCtrl)
  .controller('CalendarDetailCtrl', CalendarDetailCtrl)
  .controller('ManageSlotsCtrl', ManageSlotsCtrl)
  .controller('SettingsCtrl', SettingsCtrl);

function MainCtrl($scope, $location, CalendarService) {
  CalendarService.getCalendars();
  $scope.calendars = CalendarService.calendars;

  $scope.form = {};
  var step = $scope.step = 1;
  
  $scope.next = function () {
    if ($scope.urlStatus !== 'Available')
      return;

    if (step == 1) {
      step++;
      update(step);
    } else {
      console.log($scope.form);
      CalendarService.postCalendar($scope.form, function (data) {
        if (data.ok) {
          CalendarService.getCalendars();
          $scope.calendars.push(data.calendar);
          $location.path(baseurl+'dashboard/' + $scope.form.url + '/slots');
          $('.modal').modal('toggle');
          $scope.restartForm();
        }
      });
    }
  };

  $scope.back = function () {
    step--;
    update(step);
  };

  $scope.restartForm = function () {
    $scope.form = {};
    $scope.urlStatus = '';
    $scope.step = step = 1;
    show(step);
  };

  $scope.checkUrl = function () {
    if (!$scope.form.url) {
      $scope.urlStatus = 'URL cannot be empty!';
      return;
    }
    $scope.status = 'Checking...'
    CalendarService.checkUrl($scope.form.url, function (response) {
      if (response.ok)
        $scope.urlStatus = 'Available';
      else
        $scope.urlStatus = 'Not available';
    });
  };

  $scope.restartForm();

  // Functions
  function update(step) {
    $scope.step = step;
    show(step);
  }

  function show(step) {
    var steps = ['', 'one', 'two'];
    $('.step-one, .step-two').hide();
    $('.step-' + steps[step]).show();
  }
}

function CalendarDetailCtrl($scope, $routeParams, CalendarService) {
  var result = $.grep(CalendarService.calendars,
    function (element) {
      return element.url == $routeParams.name;
    });

  if (!result) {

  } else {
    $scope.calendar = result[0];
  }
}

function EditCalendarDetailCtrl($scope, $routeParams, CalendarService) {
  var result = $.grep(CalendarService.calendars,
    function (element) {
      return element.url == $routeParams.name;
    });

  if (!result) {

  } else {
    $scope.calendar = result[0];
  }
}

function ManageSlotsCtrl($scope, $routeParams, CalendarService) {
  $('tbody').css('height', $(window).height() - 200);

  var calendar = $scope.calendar = CalendarService.calendars.filter(function(cal) {
    return cal.url == $routeParams.name;
  })[0];

  var startDate = new Date(calendar.startDate.substring(0, calendar.startDate.indexOf('T')));
  var endDate = new Date(calendar.endDate.substring(0, calendar.endDate.indexOf('T')));
  var duration = calendar.duration;
  var startIdx = 0;
  var endIdx = 6;

  populateDays();
  populateTimes();

  $scope.selected = [];

  $scope.toggleSlot = function (day, time, $event) {
    var target = $($event.target);
    target.toggleClass('selected');
    if (target.hasClass('selected')) {
      $scope.selected.push({
        day: day,
        time: time
      });
    } else {
      $scope.selected = $.grep($scope.selected, function(slot) {
        return slot.day !== day || slot.time !== time;
      });
    }
    console.log($scope.selected);
  }

  $scope.checkIfSelected = function (day, time) {
    return $.grep($scope.selected, function(slot) {
      return slot.day == day && slot.time == time;
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

  function populateDays() {
    $scope.days = [];
    for (var i = startIdx; i <= endIdx; i++) {
      var current = new Date();
      current.setTime(startDate.getTime());
      current.setDate(startDate.getDate() + i);
      if (current.getTime() <= endDate.getTime()) {
        $scope.days.push(current.getFullYear() + '-' +
                         (current.getMonth() < 10 ? '0' : '') + current.getMonth() + '-' +
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

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
  }
}

function IndexCtrl($scope, CalendarService) {
  $scope.calendars = CalendarService.calendars;
}

function SettingsCtrl($scope, $http) {
  $scope.form = {};
  $http.get(baseurl+'dashboard/user').
    success(function(data, status, headers, config) {
      $scope.form.email = data.email;
    });
  $scope.saveSettings = function () {

  }
}

function LogoutCtrl($scope, $http) {
  console.log('hehe');
  window.location.href = '/logout';
}