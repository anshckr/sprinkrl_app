angular.module('myApp')
.directive("addEmployee", ['$timeout', 'FirebaseService', function($timeout, FirebaseService) {
  'use strict';
  return {
    restrict: "E",
    templateUrl: "templates/directives/add-employee.html",
    controller: function ($scope) {
    },
    replace: true,
    link: function(scope, element, attributes, ctlr) {
      /**
     * [showHideForm used to show/hide the form to add an employee]
     */
      scope.showHideForm = function() {
        var form_ele = $('form');
        if (form_ele.hasClass('hide')) {
          form_ele.addClass('white_content');
          $('.main_container').addClass('black_overlay');
        } else {
          $('.white_content').removeClass('white_content');
          $('.black_overlay').removeClass('black_overlay');
        }
        form_ele.toggleClass('hide');
      };
      /**
       * [add function used to save an employee to the firebase database]
       */
      scope.add = function() {
        var save = FirebaseService.all().push().set({
          name: scope.name,
          designation: scope.designation,
          team: scope.team,
          project: scope.project
        });
        /* reset all the details */
        scope.name = '';
        scope.designation = '';
        scope.team = '';
        scope.project = '';
      };
    }
  };
}]);