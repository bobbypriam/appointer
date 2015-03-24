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
        CalendarService.getCalendars();
        $('.modal').modal('toggle');
        $location.path('/dashboard/' + $scope.form.url + '/slots');
        $scope.restartForm();
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

function ManageSlotsCtrl($scope, $routeParams, CalendarService) {
  $('tbody').css('height', $(window).height() - 200);

  $scope.days = ['1/2','2/2','3/2','4/2','5/2','6/2','7/2'];
  $scope.times = [];
  for (var i = 0; i < 24; i++) {
    $scope.times.push(i);
  }

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
}

function IndexCtrl($scope, CalendarService) {
  $scope.calendars = CalendarService.calendars;
}

function SettingsCtrl($scope, $http) {
  $scope.form = {};
  $http.get('/dashboard/user').
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