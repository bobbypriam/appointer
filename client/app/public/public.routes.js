(function () {
  'use strict';

  angular
    .module('appointer')
    .config(['$routeProvider', '$locationProvider', PublicRouter]);

  function PublicRouter($routeProvider, $locationProvider) {
    $routeProvider.
      when('/reschedule/success', {
        templateUrl: 'partials/reschedule-success'
      }).
      when('/:name', {
        templateUrl: 'partials/index',
        controller: 'IndexController'
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
  }
  
})();