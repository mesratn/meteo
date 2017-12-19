angular.module('meteo.controllers', [])
.controller('AppController', function ($scope) {
})
.controller('FileController', function ($scope, $http, $window) {
  //fonction save sert a sauvgarder les fichiers en mettant a jour le localstorage
  function save() {
    localStorage.setItem('files', angular.toJson($scope.files || []));
  }
  $scope.files = loadFiles();

  $scope.form = {
    uploadUrl: 'data/1_ENHANCED_01.his'
  };
  //upload sert a valider le formulaire et ajouter le fichier a la liste
  $scope.upload = function () {
    if (!$scope.form.uploadUrl) {
      alert("No name");
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
          alert("Date already uploaded");
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
  //remove sert a suuprimer un fichier de la liste
  $scope.remove = function (idx) {
    removeAt($scope.files, idx);
    save();
  };
});
