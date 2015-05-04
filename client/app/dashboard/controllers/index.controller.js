(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'CalendarService'];

  function IndexController($scope, CalendarService) {
    $scope.calendars = CalendarService.calendars;
    $scope.isLoaded = false;
    while(true)
      if ($scope.calendars) {
        $scope.isLoaded = true;
        break;
      }
  }

})();