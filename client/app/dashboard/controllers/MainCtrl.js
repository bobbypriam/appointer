angular.module('appointer.controllers')

  .controller('MainCtrl', ['$scope', '$location', 'CalendarService',
    function MainCtrl($scope, $location, CalendarService) {
      CalendarService.getCalendars(function (calendars) {});
      $scope.calendars = CalendarService.calendars;

      $scope.form = {};
      var step = $scope.step = 1;

      $scope.isViewLoading = false;
      $scope.$on('$routeChangeStart', function() {
        $scope.isViewLoading = true;
      });
      $scope.$on('$routeChangeSuccess', function() {
        $scope.isViewLoading = false;
      });
      
      $scope.next = function () {
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
    }]);