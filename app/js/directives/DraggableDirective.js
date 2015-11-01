// DraggableDirective.js
angular.module('myApp')
.directive("ddDraggable", ['$timeout', function($timeout) {
  'use strict';
 
    return {
        restrict: "A",
        link: function(scope, element, attributes, ctlr) {
            element.attr("draggable", true);
 
            element.bind("dragstart", function(eventObject) {
                var target_ele = $(eventObject.currentTarget);
                target_ele.popover('hide');
                target_ele.closest('.employee_cont').removeClass('isFilled');
                eventObject.originalEvent.dataTransfer.setData("employee", attributes.obj);
            });
        }
    };
}]);