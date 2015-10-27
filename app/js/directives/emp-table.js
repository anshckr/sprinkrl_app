angular.module('myApp')
.directive("empTable",['$timeout', function($timeout) {
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
    replace: true,
    link: function (scope, element, attr) {
        $timeout(function () {
            angular.element('.employee').draggable({
              start: function(){
              $(this).data("origPosition", $(this).data("ui-draggable").originalPosition);
            },
            revert : function(event, ui) {
                    // on older version of jQuery use "draggable"
                    // $(this).data("draggable")
                    // on 2.x versions of jQuery use "ui-draggable"
                    // $(this).data("ui-draggable")
                    $(this).data("ui-draggable").originalPosition = {
                        top : 0,
                        left : 0
                    };
                    // return boolean
                    return !event;
                    // that evaluate like this:
                    // return event !== false ? false : true;
                }
          });
          angular.element('.employee_cont').droppable({
              drop: function( event, ui ) {
                var emp_ele = $(event.target).find('.employee');
                var drag_emp_name = emp_ele.data('emp-name');
                if(!!drag_emp_name) {
                  alert('Postion Not Empty!!');
                  ui.draggable.animate(ui.draggable.data().origPosition, "slow");
                  return;
                } else {
                  ui.draggable.removeData('emp-name');
                  emp_ele.addClass("ui-state-highlight");
                  // ui.draggable.css("top", emp_ele.css("top"));
                  // ui.draggable.css("left", emp_ele.css("left"));
                  alert('Moved!!');
                }
              }
            });
        }, 1000);
      }
  };
}]);