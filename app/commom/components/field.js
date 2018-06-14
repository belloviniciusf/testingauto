(function () {
    angular.module('app').component('field',{
        bindings: {
            id: '@',
            label: '@',
            grid: '@',
            placeholder: '@',            
            model: "=",
            type: "@",
            readonly: '<',
            change: '<',
        },
        controller:[
            'gridSystem',
            function (gridSystem) {
                this.$onInit = () => this.gridClasses = gridSystem.toCssClasses(this.grid)               
            }            
        ], 
        template: `
        <div class="{{$ctrl.gridClasses}}">
            <div class="form-group">
                <label for="{{$ctrl.id}}">{{$ctrl.label}}</label>
                <input id="{{$ctrl.id}}" class="form-control" placeholder="{{$ctrl.placeholder}}"
                    type="{{$ctrl.type}}" min="1881" max="2019" ng-change="{{$ctrl.change}}" 
                    ng-model="$ctrl.model" ng-readonly="$ctrl.readonly">
            </div>
        </div>        
        `
    })
})()