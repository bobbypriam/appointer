(function () {
  'use strict';

  angular
    .module('appointer')
    .controller('SettingsController', SettingsController);

  SettingsController.$inject = ['$scope', '$window', '$interval', 'UserService'];

  function SettingsController($scope, $window, $interval, UserService) {
    
    $scope.form = {};
    $scope.configureGoogleCalendar = configureGoogleCalendar;
    $scope.submitPost = submitPost;
    $scope.integrated = false;

    initiate();

    function initiate() {
      UserService.getUserDetails(function(response) {
        $scope.form.email = response.email;
        if (response.accessToken)
          $scope.integrated = true;
      });
    }

    function configureGoogleCalendar() {
      var baseurl = document.querySelector('base').href;
      var child = $window.open(baseurl + 'oauth', 'Google Calendar Access | Appointer', 'width=800, height=500');
      
      var check;
      function checkChildWindow() {
        if (child && child.closed) {
          $interval.cancel(check);
          $scope.integrated = true;
          alert('Integration success!');
        }
      }
      check = $interval(checkChildWindow, 500);
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