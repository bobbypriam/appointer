angular.module('appointer.controllers')

.controller('IndexCtrl', ['$scope', 'CalendarService', 
    function IndexCtrl($scope, CalendarService) {
      $scope.calendars = CalendarService.calendars;
      $scope.isLoaded = false;
      while(true)
        if ($scope.calendars) {
          $scope.isLoaded = true;
          break;
        }
    }]);