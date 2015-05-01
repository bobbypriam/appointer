angular.module('appointer.controllers')

.controller('SettingsCtrl', ['$scope', 'UserService', 
    function SettingsCtrl($scope, UserService) {
      $scope.form = {};
      
      UserService.getUserDetails(function(response) {
        $scope.form.email = response.email;
      });

      $scope.submitPost = function () {
        if (!$scope.form.email) {
          alert('Email cannot be empty and should be properly formatted');
          return;
        }
        UserService.editUserDetails($scope.form, function(response) {
          if (response.ok)
            alert('Success!');
        });
      };
    }]);