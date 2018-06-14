(function () {
    angular.module('app').controller('VehicleController', [
        '$http',
        '$location',
        'msgs',
        'tabs',
        'selects',              
        VehiclesController
    ])    
    function VehiclesController($http, $location, msg, tabs, selects) {               
        const vm = this                                               
        const url = 'http://localhost:3003/api/vehicles'        
        const webMotorsurl = 'http://localhost:8080/https://www.webmotors.com.br/carro'
        vm.refresh = function () {            
            console.log('oi')
            const page = parseInt($location.search().page) || 1
            $http.get(`${url}?skip=${(page-1)*7}&limit=7`).then(function (response) {                                                               
                vm.vehicle = {
                    brand: {},
                    model: {},
                    specifications: {},                    
                }                
                vm.minYear = {}
                vm.maxYear = {}                                          
                vm.vehicles = response.data                
                $http.get(`${url}/count`).then(function(response) {                                        
                    vm.pages = Math.ceil(response.data.value/7)                      
                    tabs.show(vm, { tabList: true, tabCreate: true })
                    selects.show(vm, {showModel: true, showSpecifications: true })
                })                                                
                $http.get(webMotorsurl + "/marcasativas").then(function (response) {                                    
                    vm.brands = Object.assign([], response.data.Principal, response.data.Common)
                    vm.brandsPrincipal = Object.assign([],response.data.Principal)
                })                
                console.log('hello')
                vm.setValuesMinandMax()                
            })            
        }
        vm.setValuesMinandMax = function () {
            var yearsAvailable = []            
            for(var x = 2019; x>1881; x--){
                yearsAvailable.push({N:x})                
            }
            vm.minYear.selected = {N:1881}
            vm.maxYear.selected = {N:2019}       
            vm.lastMinYear = vm.minYear.selected
            vm.lastMaxYear = vm.maxYear.selected
            vm.years = yearsAvailable                                                 
        }
        vm.brandSelected = function () {                     
            if (vm.vehicle.brand.selected && vm.vehicle.brand.selected != vm.lastbrand){                              
                vm.lastbrand = vm.vehicle.brand.selected
                if (vm.refreshVehicleData) {
                    vm.vehicle.model.selected = null
                    vm.vehicle.specifications.selected = null                    
                    vm.refreshVehicleData = false
                }   
                if(vm.vehicle.brand.selected!=null){                
                $http.get(webMotorsurl + "/modelosativos?marca="+vm.vehicle.brand.selected.N)
                    .then(function (response) {                        
                        vm.models = response.data                    
                        vm.refreshVehicleData = true
                        if(!vm.vehicle.specifications.selected)                   
                        selects.show(vm, {showSpecifications:true})
                })                
            }
            }                                              
        }
        vm.modelSelected = function () {                   
            if( ((vm.vehicle.model.selected!=null && vm.vehicle.model.selected!=vm.lastModel && vm.vehicle.brand.selected!=null))
                || (vm.minYear.selected.N != vm.lastMinYear.N || vm.maxYear.selected.N != vm.lastMaxYear.N)){                                                                       
                vm.lastModel = vm.vehicle.model.selected     
                vm.lastMinYear = vm.minYear.selected
                vm.lastMaxYear = vm.maxYear.selected
                if(vm.refreshVehicleData){                    
                    vm.vehicle.specifications.selected = null
                    vm.refreshVehicleData = false
                }                    
                console.log('Entrou na especificação')                                                                               
                $http.get(webMotorsurl + "/versoesativas?modelo=" + vm.vehicle.model.selected.N 
                +"&anoModeloDe="+vm.minYear.selected.N+"&anoModeloAte="+vm.maxYear.selected.N)
                    .then(function (response) {                                                
                        for (var obj in response.data) {   
                            response.data[obj].N = response.data[obj].Nome                                                     
                        }                        
                        vm.specifications = response.data                                                                                                                        
                        vm.refreshSpecifications = true 
                        vm.refreshVehicleData = true
                        if(vm.specifications.length==0){                            
                            msg.addError(`Não foi possível encontrar especificações para esse modelo entre ${vm.minYear.selected.N} e ${vm.maxYear.selected.N}.`)
                        }
                        console.log(vm.specifications)
                        selects.show(vm, {})
                    })
            }                       
        }        
        vm.create = function () {                 
            vm.vehicle = {
                brand: vm.vehicle.brand.selected.N,
                model: vm.vehicle.model.selected.N,
                specifications: vm.vehicle.specifications.selected.N
            }                   
            $http.post(url, vm.vehicle).then(function (response) {
                vm.refresh()
                msg.addSuccess("Operação realizada com sucesso")                
            }).catch(function (response) {
                msg.addError(response.data.errors)
            })
            console.log('criou')
        }
        vm.showTabUpdate = function (vehicle) {                  
            vm.vehicle = {
                _id: vehicle._id,
                brand: {
                    selected: {N:vehicle.brand}
                },
                model: {
                    selected: {N:vehicle.model}
                },
                specifications: {
                    selected: {N:vehicle.specifications}
                }
            }                      
            vm.refreshVehicleData = false             
            tabs.show(vm, {tabUpdate: true})
            selects.show(vm, {})
        }
        vm.showTabDelete = function (vehicle) {                                                
            vm.vehicle = vehicle            
            tabs.show(vm, {tabDelete: true})
            selects.show(vm, {})
        }
        vm.delete = function () {            
            const deleteUrl = `${url}/${vm.vehicle._id}`
            $http.delete(deleteUrl, vm.vehicle).then(function (response) {
                vm.refresh()
                msg.addSuccess("Operação realizada com sucesso")
            }).catch(function (response) {
                msg.addError(response.data.errors)
            })
        }
        vm.update = function () {                                                
            const updateUrl = `${url}/${vm.vehicle._id}`
            vm.vehicle = {
                _id: vm.vehicle._id,
                brand: vm.vehicle.brand.selected.N,
                model: vm.vehicle.model.selected.N,
                specifications: vm.vehicle.specifications.selected.N
            }                   
            $http.put(updateUrl, vm.vehicle).then(function (response) {
                vm.refresh()
                msg.addSuccess("Operação realizada com sucesso")
            }).catch(function (response) {
                msg.addError(response.data.errors)
            })
        }                
        vm.groupByType = function (item) {            
            if(vm.brandsPrincipal.some(function (el) {
                return el.C == item.C
            })){
                return 'Principais'
            }
            return 'Comum'        
        }
        vm.reverseOrderFilter = function (groups) {
            return groups.reverse()
        }
        vm.refresh()
    }
})()