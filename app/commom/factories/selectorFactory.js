(function () {
    angular.module('app').factory('selects', [TabsFactory])
    function TabsFactory() {
        function show(owner, {
            showBrand = false,
            showModel = false,
            showSpecifications = false,            
        }) {
            owner.showBrand = showBrand
            owner.showModel = showModel
            owner.showSpecifications = showSpecifications            
        }
        return { show }
    }
})()