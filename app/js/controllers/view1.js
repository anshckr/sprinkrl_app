'use strict';

angular.module('myApp.view1', ['ngRoute', 'ngDraggable'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'templates/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', function($scope) {
  /* variables used for iteration */
  $scope.rows = 2;
  $scope.tables = 3;
  $scope.getNumber = function(num) {
    return new Array(num);   
  };

  $scope.employeeList = [
      {
          name: 'Anshul',
          designation: 'Software Engineer',
          team: 'Frontend Eng.',
          project: 'Location-Service'
      },
      {
          name: 'Debanjana',
          designation: 'Designer',
          team: 'Design Team',
          project: 'MIS'
      }
    ];
}]);