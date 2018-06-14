(function () {
    angular.module('app').component('selector', {
        bindings: {
            id: '@',
            label: '@',
            grid: '@',
            placeholder: '@',            
            model: "=",
            readonly: '=',
            itemselected: '<',
            show: '=',                                   
            groupby: '<', 
            filter: '<',
        },
        controller: [
            'gridSystem',
            function (gridSystem) {
                this.$onInit = () => this.gridClasses = gridSystem.toCssClasses(this.grid)                
            }
        ],
        template: `
        <div class="{{$ctrl.gridClasses}}">
            <div class="form-group">
                <label for="{{$ctrl.id}}">{{$ctrl.label}}</label>     
                <ui-select ng-model="$ctrl.model" on-select="$ctrl.itemselected" ng-disabled="$ctrl.show"> 
                    <ui-select-match placeholder="{{$ctrl.placeholder}}">
                        {{$select.selected.N}}
                    </ui-select-match>
                <ui-select-choices group-by="$ctrl.groupby" group-filter="$ctrl.filter" repeat="item in $ctrl.readonly | filter: $select.search">
                    <span ng-bind="item.N"></span>
                </ui-select-choices>     
                </ui-select>
            </div>
        </div>        
        `                               
    })
})()