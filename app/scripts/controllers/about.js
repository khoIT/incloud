'use strict';

/**
 * @ngdoc function
 * @name incloudApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the incloudApp
 */
angular.module('incloudApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
