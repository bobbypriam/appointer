(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('GlobalController', GlobalController);

  GlobalController.$inject = ['$scope', '$location', 'CalendarService'];

  function GlobalController($scope, $location, CalendarService) {

    // bindable variables
    $scope.calendars = [];
    $scope.form = {};
    $scope.isStepOneError = false;
    $scope.isStepTwoError = false;
    $scope.isViewLoading = false;
    $scope.step = 1;
    $scope.urlStatus = '';

    // bindable functions
    $scope.back = back;
    $scope.checkUrl = checkUrl;
    $scope.initiate = initiate;
    $scope.next = next;
    $scope.restartForm = restartForm;

    $scope.$on('$routeChangeStart', showLoading);
    $scope.$on('$routeChangeSuccess', hideLoading);

    var step = $scope.step;

    initiate();

    function initiate() {
      CalendarService.getCalendars(function (calendars) {
        $scope.calendars = calendars.filter(function (calendar) {
          return !calendar.closed;
        });
      });

      restartForm();
    }

    function showLoading() {
      $scope.isViewLoading = true;
    }

    function hideLoading() {
      $scope.isViewLoading = false;
    }
    
    function next() {
      if (step == 1) {
        if (!$scope.form.url || !$scope.form.title || !$scope.form.description) {
          alert('Fields cannot be empty!');
          $scope.isStepOneError = true;
          return;
        } else if ($scope.urlStatus !== 'Available') {
          alert('URL is not available');
          $scope.isStepOneError = true;
          return;
        }
        $scope.isStepOneError = false;
        step++;
        update(step);
      } else {
        if (!$scope.form.duration || !$scope.form.start || !$scope.form.end) {
          alert('Fields cannot be empty!');
          $scope.isStepTwoError = true;
          return;
        } else if ($scope.form.end < $scope.form.start) {
          alert('End date should be later than start date. Please check again!');
          return;
        }
        $scope.isStepTwoError = false;
        $scope.processing = true;
        CalendarService.postCalendar($scope.form, function (data) {
          if (data.ok) {
            CalendarService.getCalendars(function (calendar) {
              $scope.processing = false;
              $scope.restartForm();
              $location.path('dashboard/' + data.calendar.url + '/slots');
              $('.modal').modal('toggle');
              $('.modal-backdrop').remove();
            });
          }
        });
      }
    }

    function back() {
      step--;
      update(step);
    }

    function restartForm() {
      $scope.form = {};
      $scope.urlStatus = '';
      $scope.step = step = 1;
      show(step);
    }

    function checkUrl() {
      $scope.form.url = $scope.form.url.replace(/[^\w-]+/g,'');
      if (!$scope.form.url) {
        $scope.urlStatus = 'URL cannot be empty!';
        return;
      }
      $scope.urlStatus = 'Checking...';
      CalendarService.checkUrl($scope.form.url, function (response) {
        if (response.ok)
          $scope.urlStatus = 'Available';
        else
          $scope.urlStatus = 'Not available';
      });
    }

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
  
})();