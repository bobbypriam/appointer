(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', 'UserService'];

  function SettingsController($scope, UserService) {
    
    $scope.form = {};
    $scope.submitPost = submitPost;

    initiate();

    function initiate() {
      UserService.getUserDetails(function(response) {
        $scope.form.email = response.email;
      });
    }

    function submitPost() {
      if (!$scope.form.email) {
        alert('Email cannot be empty and should be properly formatted');
        return;
      }
      UserService.editUserDetails($scope.form, function(response) {
        if (response.ok)
          alert('Success!');
      });
    }
  }
  
})();