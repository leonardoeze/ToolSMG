// declare modules of APLICACION
angular.module('libraries',['siTable','ngAnimate','ngMaterial', 'ngMessages', 'material.svgAssetsCache','ngRoute','ngCookies']);
angular.module('AbmPantallaModule',['libraries']);
angular.module('AbmIncidenteModule',['libraries']);
angular.module('HomeModule', ['libraries']);
//declare modules of LOGIN
angular.module('AuthenticationModule', ['libraries']);
angular.module('HttpAuthModule',['libraries']);
angular.module('AppModule', ['HttpAuthModule','AuthenticationModule','HomeModule','AbmIncidenteModule','AbmPantallaModule'])



//BasicHttpAuthExample
//angular.module('BasicHttpAuthExample', ['AuthenticationModule','HomeModule','ngRoute','ngCookies'])
angular.module('HttpAuthModule')
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'AuthenticationController',
            templateUrl: 'aplicacion/modules/login/views/login.html',
            hideMenus: true
        })

        .when('/', {
            controller: 'HomeController',
            templateUrl: 'aplicacion/modules/home/views/home.html'
        })

        .otherwise({ redirectTo: '/login' });
}])

.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);
