angular.module('myApp')
  .directive("addFilters", ['$timeout', '$window',
    function($timeout, $window) {
      'use strict';
      return {
        restrict: "E",
        templateUrl: "templates/directives/add-filters.html",
        controller: function($scope) {},
        replace: true,
        link: function(scope, element, attributes, ctlr) {
          /**
           * [showHideFilters function to execute when side filter is clicked]
           */
          scope.showHideFilters = function() {
            $('.add_filters').toggleClass('hide');
          };
          /**
           * [clearFilters removes all the applied fitlers]
           */
          scope.clearFilters = function() {
            $('.searched').removeClass('searched');
            $('input:checked').attr('checked', false);
            $('.teams').addClass('hide');
            $('.designations').addClass('hide');
            scope.nameFilter = '';
            scope.teamFilter = {};
            scope.designationFilter = {};
            scope.filtered_employees = [];
            $('.add_filters').addClass('hide');
          };
          /* events binded to side filters i.e. teams and designations */
          $('input[name="teams"], input[name="designations"]').on('change', function(e) {
            scope.applySideFilters($(e.currentTarget));
          });
          /**
           * [applySideFilters show/hide and applies the checked values in side filters]
           * @param  {DOM Element} ele element which was checked
           */
          scope.applySideFilters = function(ele) {
            if (!ele.is(':checked')) {
              scope.clearChecks(ele.attr('name'));
              $('.' + ele.attr('name')).addClass('hide');
            } else {
              $('.' + ele.attr('name')).removeClass('hide');
            }
            scope.highlight(true);
          };
          /**
           * [clearChecks clears unchecked filters]
           */
          scope.clearChecks = function(name) {
            $('.' + name).find('input:checked').attr('checked', false);
            if (name === 'teams') {
              scope.teamFilter = {};
            } else if (name === 'designations') {
              scope.designationFilter = {};
            }
          };
          /**
           * [highlight highlights the employees who pass the match criteria]
           */
          scope.highlight = function(hideAlertFlag) {
            $('.searched').removeClass('searched');
            scope.filtered_employees = scope.filterEmployees();
            scope.highlightSearched(scope.filtered_employees);
            if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
              scope.$digest();
            }
            if (!scope.filtered_employees.length && !hideAlertFlag) {
              scope.newAlert('No Matching Results Found!!');
            };
          };
          /**
           * [filterEmployees helper function used to filter employees]
           * @return {Array} list of employees who passed the search criteria
           */
          scope.filterEmployees = function() {
            var arr = [];
            _.each(scope.employeeList, function(employee) {
              if (scope.searchFilterName(employee) || scope.searchFilterTeam(employee) || scope.searchFilterDesignation(employee)) {
                arr.push(employee);
              }
            });
            return arr;
          };
          /**
           * [highlightSearched helper function used to highlight the above fetched employees]
           * @param  {Array} arr list of employees to be hightlighted
           */
          scope.highlightSearched = function(arr) {
            _.each(arr, function(employee) {
              $('[emp-name=\'' + employee.name + '\']').addClass('searched');
            });
          };
          /**
           * [searchFilterName used to filter employee based on name]
           * @param  {Object} employee
           * @return {Boolean} true/false based on whether employee's name matches the searched string
           */
          scope.searchFilterName = function(employee) {
            if (!scope.nameFilter) {
              return false;
            }
            var keyword = new RegExp(scope.nameFilter, 'i');
            return keyword.test(employee.name);
          };
          /**
           * [searchFilterTeam used to filter employee based on their teams]
           * @param  {Object} employee
           * @return {Boolean} true/false based on whether employee's teams matches the checked team
           */
          scope.searchFilterTeam = function(employee) {
            /* return true if matched else false */
            if (_.isEmpty(scope.teamFilter)) {
              return false;
            }
            var values = _.values(scope.teamFilter);
            var all_empty = _.every(values, function(val, index) {
              return !val;
            });
            if (all_empty) {
              return false;
            } else {
              /* returns true if any teams matches employee's team */
              return _.some(values, function(val, index) {
                return val == employee.team;
              });
            }
          };
          /**
           * [searchFilterDesignation used to filter employee based on their desigations]
           * @param  {Object} employee
           * @return {Boolean} true/false based on whether employee's designation matches the checked designation
           */
          scope.searchFilterDesignation = function(employee) {
            /* return true if matched else false */
            if (_.isEmpty(scope.designationFilter)) {
              return false;
            }
            var values = _.values(scope.designationFilter);
            var all_empty = _.every(values, function(val, index) {
              return !val;
            });
            if (all_empty) {
              return false;
            } else {
              /* returns true if any desinations matches employee's designation */
              return _.some(values, function(val, index) {
                return val == employee.designation;
              });
            }
          };
        }
      };
    }
  ]);