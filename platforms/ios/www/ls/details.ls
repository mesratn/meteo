details = angular.module('meteo.details', [])
details.controller 'DetailsCtrl', ($routeParams) ->
  alert $routeParams.name
