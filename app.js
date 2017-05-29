(function () {
'use strict';

var app = angular.module('NarrowItDownApp', []);

app.controller('NarrowItDownController', ['$scope', 'MenuSearchService', function($scope, MenuSearchService) {
    $scope.searchTerm = ''; //add word to start search on load

    $scope.search = function(searchTerm) {
      console.log('Searched: ' + searchTerm);
      // The service executes asynchronously, to create a callback in order to store the results then() has to be used
      MenuSearchService.getMatchedMenuItems(searchTerm).then(function(foundItems) {
           $scope.results = foundItems;
      });
    };

    $scope.search($scope.searchTerm);
}]);

app.service('MenuSearchService', ['$http', function($http) {
    var service = this;
    service.getMatchedMenuItems = function(searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        return $http({
                method: 'GET',
                url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
            })
            .then(function(response) {
                var result = response.data.menu_items;
                console.log('Result: ' + result.length);
                var foundItems = [];
                result.forEach(function(obj) {
                    if (searchTerm != '') {
                        if ((obj.name.indexOf(searchTerm) != -1) || (obj.description.indexOf(searchTerm) != -1)) {
                            foundItems.push(obj);
                        }
                    }
                })
                console.log('Number of items found: ' + foundItems.length)
                return foundItems;

            }, function(error) {
                console.log('Error in $http' + error);
            });
    }
         service.removeItem = function(index){
        service.getMatchedMenuItems(index).splice(index, 1);
    }
}]);

app.directive('foundItems', function() {
    var ddo = {
      restrict: 'E', //It is a directive and not a component, so its type has to be defined. <found-items> is an element therefore E  
      templateUrl: 'directive.html', //cannot be viewed in Chrome as it needs https before any url
      scope: {
          items: '<' // one-way binding
      },
      controller: function ($scope) {
        $scope.remove = function (item) {
          var index = $scope.items.indexOf(item);
          if(index >= 0) {
            $scope.items.splice(index, 1);
          }
        }
      }
    }
    return ddo;
});

})();