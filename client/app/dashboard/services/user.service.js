(function () {
  'use strict';

  angular
    .module('appointer')
    .factory('UserService', UserService);

  UserService.$inject = ['$http'];

  function UserService($http) {
    var model = {};

    model.getUserDetails = function (callback) {
      $http.get('dashboard/user').success(callback);
    };

    model.editUserDetails = function (details, callback) {
      $http.post('dashboard/user', { details: details }).success(callback);
    };

    return model;
  }

})();