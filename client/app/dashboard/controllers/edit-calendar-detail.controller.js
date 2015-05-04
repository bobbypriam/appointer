(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('EditCalendarDetailController', EditCalendarDetailController);

  EditCalendarDetailController.$inject = ['$scope', '$location', '$routeParams', 'CalendarService'];

  function EditCalendarDetailController($scope, $location, $routeParams, CalendarService) {
    var calendar = $.grep(CalendarService.calendars,
      function (element) {
        return element.url == $routeParams.name;
      })[0];

    $scope.mockCalendar = {
      title: calendar.title
    };

    $scope.calendar = {
      title: calendar.title,
      description: calendar.description,
      url: calendar.url,
      duration: calendar.duration,
      startDate: calendar.startDate.split('T')[0],
      endDate: calendar.endDate.split('T')[0]
    };

    $scope.submitPost = function () {
      if (!$scope.calendar.title ||
          !$scope.calendar.description ||
          !$scope.calendar.url ||
          !$scope.calendar.duration ||
          !$scope.calendar.startDate ||
          !$scope.calendar.endDate) {
        alert("Fields cannot be empty!");
        $scope.isError = true;
        return;
      } else if ($scope.calendar.endDate < $scope.calendar.startDate) {
        alert('End date should be later than start date. Please check again!');
        return;
      } else if ($scope.urlStatus !== 'Available') {
        alert('URL is not available');
        return;
      }
      $scope.processing = true;
      $scope.isError = false;
      var newCal = {
        id: calendar.id,
        title: $scope.calendar.title,
        description: $scope.calendar.description,
        url: $scope.calendar.url,
        duration: $scope.calendar.duration,
        startDate: $scope.calendar.startDate,
        endDate: $scope.calendar.endDate
      };
      CalendarService.updateCalendar(newCal, function (response) {
        if (response.ok) {
          $scope.mockCalendar.title = newCal.title;
          $scope.processing = false;
          CalendarService.getCalendars(function (calendar) {});
          alert('Success!');
        }
      });
    };

    $scope.checkUrl = function () {
      if (!$scope.calendar.url) {
        $scope.urlStatus = 'URL cannot be empty!';
        return;
      }
      if ($scope.calendar.url === calendar.url) {
        $scope.urlStatus = 'Available';
        return;
      }
      $scope.calendar.url = $scope.calendar.url.replace(/[^\w-]+/g,'');
      $scope.urlStatus = 'Checking...';
      CalendarService.checkUrl($scope.calendar.url, function (response) {
        if (response.ok)
          $scope.urlStatus = 'Available';
        else
          $scope.urlStatus = 'Not available';
      });
    };
  }

})();