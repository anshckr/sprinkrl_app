// DraggableDirective.js
angular.module('myApp')
.directive("ddDropTarget", ['$timeout', '$window', function($timeout, $window) {
  'use strict';
 
    return {
        restrict: "A",
        link: function (scope, element, attributes, ctlr) {
 
            element.bind("dragover", function(eventObject){
                eventObject.preventDefault();
            });
 
            element.bind("drop", function(eventObject) {
                 
                // invoke controller/scope move method
                var emp_obj = JSON.parse(eventObject.originalEvent.dataTransfer.getData("employee"));
                scope.moveToBox(emp_obj);
                var container_ele = $(this);
                if (container_ele.hasClass('isFilled')){
                    $window.alert('That seat is already occupied!!');
                    return;
                } else {
                    var ele_to_append = $(scope.moved_ele[0]).css('background-color', 'black');
                    var table_num = container_ele.closest('.team_area').find('span.title').text().trim();
                    container_ele.html(ele_to_append);
                    container_ele.addClass('isFilled');
                    if (ele_to_append.attr('seated_at') !== undefined && ele_to_append.attr('seated_at') !== table_num) {
                        scope.newAlert(emp_obj.name + ' was moved from ' + ele_to_append.attr('seated_at') +' to ' + table_num + '. A mail regarding this has been sent to ' + emp_obj.name);
                    } else if (ele_to_append.attr('seated_at') === undefined) {
                        scope.newAlert(emp_obj.name + ' was moved to ' + table_num + '. A mail regarding this has been sent to ' + emp_obj.name);
                    }
                    ele_to_append.attr('seated_at', table_num);
                }
                // cancel actual UI element from dropping, since the angular will recreate a the UI element
                eventObject.preventDefault();
            });
        }
    };
}]);