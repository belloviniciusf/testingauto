(function () {
    angular.module('app').controller('DashboardCtrl', [        
        '$http',
        DashboardController
    ])
    function DashboardController($http) {
        const vm = this
        vm.getSummary = function () {            
            const url = 'http://localhost:3003/api'        
            $http.get(url+"/vehicles/count").then(function (response) {                                       
                vm.cars = response.data.value                
            })
            $http.get(url+"/vehicleDashboard").then(function (response) {                                                                         
                console.log(response.data.value)
                if(response.data.value.length==0){
                    vm.max_brand = "Ainda não há"
                    return
                }
                vm.max_brand = response.data.value[0]._id + ` (${response.data.value[0].total_vehicles})`                                
            })
        }
        vm.getSummary()
    } 
})()
