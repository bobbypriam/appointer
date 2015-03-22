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
    show(step);
  };

  $scope.checkUrl = function () {
    var url = $scope.form.url;
    console.log(url);
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