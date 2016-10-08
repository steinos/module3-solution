(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController )
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);;

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    },
   controller: NarrowItDownController,
   controllerAs: 'ctrl',
   bindToController: true
  };

  return ddo;
}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService){
  var ctrl = this;

  ctrl.narrowItDown = function(){
    var promise = MenuSearchService.getMatchedMenuItems(ctrl.currentText);
    promise.then(function(response){
      ctrl.found = response;
      console.log(response);
    }).catch(function(error){
      console.log('error: ' + error);
    });
  }

  ctrl.removeItem = function(index){
      ctrl.found.splice(index,1);
  }
}

MenuSearchService.$inject = ['$http'];
function MenuSearchService($http){
  this.getMatchedMenuItems = function(searchTerm){
    return $http({
      method: 'GET',
      url: 'https://davids-restaurant.herokuapp.com/menu_items.json',
    }).then(function (result) {
            // process result and only keep items that match
            var foundItems = []; ;
            for (var i = 0; i < result.data.menu_items.length; i++) {
              if(result.data.menu_items[i].description.indexOf(searchTerm) != -1){
                foundItems.push(result.data.menu_items[i]);
              }
            }
            // return processed items
            return foundItems;
            });
  }
}

})();
