angular.module('meteo', ['ionic', 'meteo.controllers', 'meteo.details'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  function addRoute(name, url, ctrl) {
    $stateProvider.state('app.' + name, {
      cache: false,
      url: url,
      views: {
        menuContent: {
          templateUrl: 'templates/' + name + '.html',
          controller: ctrl
        }
      }
    });
  }

  $stateProvider
    .state('app', {
      cache: false,
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppController'
    })
  addRoute('files-list', '/files', 'FileController');
  addRoute('details', '/details/:name', 'DetailsCtrl');

  $urlRouterProvider.otherwise('/files');
});
