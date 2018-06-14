angular.module('app').config([
    '$stateProvider', 
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state('dashboard', { 
            url: "/dashboard", 
            templateUrl: "dashboard/dashboard.html"
        }).state('vehicle', {
            url:"/vehicles?page",
            templateUrl: "vehicle/tabs.html"
        })
        $urlRouterProvider.otherwise('/dashboard')
    }
])