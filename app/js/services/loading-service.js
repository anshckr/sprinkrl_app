'use strict';
angular.module('myApp')
.factory('LoadingService', function () {
    return {
        // Functions for starting and stopping loading screens
        start_loading: function() {
          $('#loading').show();
        },

        stop_loading: function() {
          $('#loading').hide();
        }
    };
});