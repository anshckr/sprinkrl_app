angular.module('myApp')
.directive("addEmployee", ['$timeout', function($timeout) {
  'use strict';
  return {
    restrict: "E",
    templateUrl: "templates/directives/add-employee.html",
    controller: function ($scope) {
    },
    replace: true
  };
}]);