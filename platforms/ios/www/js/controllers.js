angular.module('meteo.controllers', [])
.controller('AppController', function ($scope) {
})
.controller('FileController', function ($scope, $http, $window) {

  /*
  ionic.Platform.ready(function () {
    var requestFS = $window.requestFileSystem;
    if (!requestFS) {
      //alert("Your platform doesn't have a file system");
      return;
    }
    alert("ok");
  });
  */

  function save() {
    localStorage.setItem('files', angular.toJson($scope.files || []));
  }
  $scope.files = loadFiles();

  $scope.form = {
    uploadUrl: 'data/1_ENHANCED_01.his'
  };
  $scope.upload = function () {
    if (!$scope.form.uploadUrl) {
      alert("Pas de nom");
      return;
    }

    $http
      .get($scope.form.uploadUrl)
      .success(function (unparsed) {
        var name, error = "";
        var parsed = simpleParseHis(unparsed);
        if (!parsed.length) {
          error = "Empty file";
        } else if (parsed.length < 2) {
          error = "No data";
        } else if (!parsed[0].length) {
          error = "Header is empty";
        } else if (!parsed[1].length) {
          error = "First line is empty";
        } else if (parsed[0][0] != "CREATEDATE") {
          error = "Expecting first header row to be 'CREATEDATE'";
        } else if (!parsed[1][0].length) {
          error = "First value in first line is empty";
        } else {
          name = parsed[1][0];
        }
        if (error) {
          alert("Error: " + error);
          return;
        }

        if (exists('name', name, $scope.files)) {
          alert("Date deja uploadee");
          return;
        }

        var file = {};
        file.url = $scope.form.uploadUrl;
        file.name = name;
        $scope.files.push(file);
        save();
      })
      .error(function (err) {
        alert(err);
      });
  };
  $scope.removeFile = function (idx) {
    removeAt($scope.files, idx);
    save();
  };
});










/*
.controller('AppController', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
})
*/
