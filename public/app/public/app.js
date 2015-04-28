angular.module('appointer', ['ngRoute', 'floatThead', 'appointer.controllers', 'appointer.services', 'appointer.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/reschedule/success', {
        templateUrl: 'partials/reschedule-success'
      }).
      when('/:name', {
        templateUrl: 'partials/index',
        controller: 'IndexCtrl'
      }).
      when('/:name/success', {
        templateUrl: 'partials/success'
      }).
      otherwise({
        redirectTo: function (routeParams) {
          return '/'+routeParams.name;
        }
      });
    $locationProvider.html5Mode(true);
  }]);