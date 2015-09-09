var myApp = angular.module('myApp', []);

myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
var refresh = function() {
  $http.get('/contactlist').success(function(response) {
    $scope.contactlist = response;
    $scope.contact = "";
  });
};

var init = function() {
  refresh();
};

init();

$scope.addContact = function(){
  $http.post('/contactlist', $scope.contact).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.delete = function(id) {
  console.log(id);
  $http.delete('/contactlist/' + id).success(function(response) {
    console.log(response);
    refresh();
  });
};

$scope.edit = function(id){
  console.log(id);
  $http.get('/contactlist/' + id).success(function(response) {
    console.log(response);
    $scope.contact = response;
  });
};

$scope.update = function() {
  console.log($scope.contact._id);
  $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
    console.log(response);
    refresh();
  });
};

}]);
