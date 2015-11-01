angular.module('myApp')
.directive("addFilters", ['$timeout', '$window', function($timeout, $window) {
  'use strict';
  return {
    restrict: "E",
    templateUrl: "templates/directives/add-filters.html",
    scope: {
      employeeTeams: '=',
      employeeDesignations: '='
    },
    controller: function ($scope) {
    },
    replace: true
  };
}]);