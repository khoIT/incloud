'use strict';

/**
 * @ngdoc function
 * @name incloudApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the incloudApp
 */
angular.module('incloudApp')
  .factory('dataFactory', function($http){

    var data = function(url, callback){
      $http.get(url).success(function(data){
        callback(data);
      });
    };
    return data;

  })
  .controller('MainCtrl', function ($scope, $http, dataFactory, ngTableParams) {
    var client_url = 'https://gist.githubusercontent.com/lillq/8946c89fac3622efe90e/raw/a393f09b959f947409a4ff73fbab3a00ff5691d2/clients.json';
    var document_url = 'https://gist.githubusercontent.com/lillq/8946c89fac3622efe90e/raw/602cd0d466e62d92a4c3e2276b7e0675d6cff716/documents.json';

    dataFactory(client_url, function(results){
      /*
      $scope.company = {};
      for (var i in results){
        $scope.company[results[i].id] = results[i].name;
      }
      */
      $scope.clients = results;
    });

    dataFactory(document_url, function(results){
      $scope.documents = results;
      $scope.documents.forEach(fillArrayNov);

      sumArray($scope.ServiceContract);
      sumArray($scope.NDA);
      sumArray($scope.TermOfService);
      $scope.clients.forEach(function (ele, index){
        ele.serviceContractSum = $scope.ServiceContract[ele.id]['sum'];
        ele.termServiceSum = $scope.TermOfService[ele.id]['sum'];
        ele.NDA = $scope.NDA[ele.id]['sum'];
        ele.sum = ele.NDA + ele.termServiceSum + ele.serviceContractSum;
      });
    });

    $scope.novAccounts = {};
    $scope.ServiceContract = {};
    $scope.TermOfService = {};
    $scope.NDA = {};
    $scope.finalInvoice = {};

    function sumArray(array){
      for (var doc_key in array){
        var sum = 0;
        for (var key in array[doc_key]){
          sum += array[doc_key][key];
        }
        array[doc_key]['sum'] = sum;
      }
    }

    function fillArrayNov(ele, index, array){
      if (ele.closed_at !== null && ele.executed_at !== null){
        var month = ele.closed_at.split("-")[1];
        if (month === "11"){
          var price = 0;
          if (ele.type === 'Service Contract'){
            ele.rush === false ? price = 175 : price = 275;
            $scope.ServiceContract[ele.client_id] ===  undefined ? $scope.ServiceContract[ele.client_id] = {}:null;
            $scope.ServiceContract[ele.client_id][index] = price;
          }
          else if (ele.type === 'Terms of Service'){
            ele.rush === false ? price = ele.pages * 100 : ele.pages *125;
            if (price < 175){
              price = 175;
            }
            $scope.TermOfService[ele.client_id] ===  undefined ? $scope.TermOfService[ele.client_id] = {}:null;
            $scope.TermOfService[ele.client_id][index] = price;
          }
          else if (ele.type === 'Non Disclosure Agreement'){
            if (ele.rush === false ){
              price = ele.pages*75;
            } else {
              ele.executed_at !== null ? price = ele.pages*150 : price = ele.pages*112.5;
            }
            if (price < 125){
              price = 125;
            }
            $scope.NDA[ele.client_id] ===  undefined ? $scope.NDA[ele.client_id] = {}:null;
            $scope.NDA[ele.client_id][index] = price;
          }

        }
      }
    }


  });
