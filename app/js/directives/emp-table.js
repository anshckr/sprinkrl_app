angular.module('myApp')
.directive("empTable", ['$timeout', function($timeout) {
  'use strict';
  return {
    restrict: "E",
    templateUrl: "templates/directives/emp-table.html",
    scope: {
      rows: '='
    },
    controller: function ($scope) {
      $scope.rows = _.range(1,3);
    },
    replace: true
  };
}]);