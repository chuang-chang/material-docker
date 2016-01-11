'use strict';

define(['angular','modal','markdown','highlight','socket'],function(angular,modal,markdown,highlight,io){
	return angular.module("ThCofAngSeed.publicip_ctrl",['ThCofAngSeed.services'])
	.controller('publicipctrl',['$rootScope','$scope','$http','$timeout','$location','$window','$filter','$mdBottomSheet','$compile','restful','Notify','instance','$routeParams',
		function($rootScope, $scope, $http,$timeout, $location, $window, $filter,$mdBottomSheet,$compile,restful,Notify,instance,$routeParams){
            var pools = restful.action(null,$scope.baseurl+"ippool");
            var h = pools.get(function(){
                if(typeof h.metadata=="string")h.metadata = JSON.parse(h.metadata);
                Notify.showSimpleToast("公网IP池列表请求成功",1);

                $scope.headers = [{
                    name:'名称',
                    field:'name',
                },{
                    name:'总数',
                    field:'number',
                },{
                    name:'可用个数',
                    field:'available',
                },{
                    name:'掩码',
                    field:'cidr',
                }];

                var sourcedata = h.metadata;
                $scope.content = [];
                for(var i =0;i<sourcedata.length;i++){
                    var s = sourcedata[i];
                    $scope.content.push(s);
                }
                console.log($scope.content);
                $scope.custom = {name: 'bold',number:'grey',available:'grey',cidr:'grey'};
                $scope.sortable = ['name','number','available','cidr'];
                $scope.count = 100;
                $scope.selected = [];
                var code = $compile('<md-table headers="headers" content="content" sortable="sortable" filters="search" custom-class="custom" thumbs="thumbs" action="action" count="count" isselect="true" selected="selected" links="links" func="func"></md-table>')($scope);
                $("#pools").html(code);
            });


            var usedip = restful.action({used:"@used"},$scope.baseurl+"ippool?used=:used");
            var u = pools.get({used:1},function(){
                if(typeof u.metadata=="string")u.metadata = JSON.parse(u.metadata);
                Notify.showSimpleToast("已使用IP池列表请求成功",1);

                $scope.theaders = [{
                    name:'名称',
                    field:'name',
                },{
                    name:'总数',
                    field:'number',
                },{
                    name:'可用个数',
                    field:'available',
                },{
                    name:'掩码',
                    field:'cidr',
                }];

                var sourcedata = u.metadata;
                $scope.tcontent = [];
                for(var i =0;i<sourcedata.length;i++){
                    var s = sourcedata[i];
                    $scope.tcontent.push(s);
                }
                console.log($scope.tcontent);
                $scope.tcustom = {name: 'bold',number:'grey',available:'grey',cidr:'grey'};
                $scope.tsortable = ['name','number','available','cidr'];
                $scope.tcount = 100;
                $scope.tselected = [];
                var code = $compile('<md-table headers="theaders" content="tcontent" sortable="tsortable" filters="search" custom-class="tcustom" thumbs="thumbs" action="action" count="tcount" isselect="true" selected="tselected" links="links" func="func"></md-table>')($scope);
                $("#pool_used").html(code);
            });
        }
    ])
    .controller('createipsctrl',['$rootScope','$scope','$http','$timeout','$location','$window','$filter','$mdBottomSheet','$compile','restful','Notify','instance','$routeParams',
        function($rootScope, $scope, $http,$timeout, $location, $window, $filter,$mdBottomSheet,$compile,restful,Notify,instance,$routeParams){
            $scope.ips = {};
            var pools = restful.action(null,$scope.baseurl+"ippool");
            $scope.createips = function(){
                var pool = pools.save(null,$scope.ips,function(){
                    if(pool.message=="Success"){
                        Notify.showSimpleToast("创建成功",1);
                        $location.path("/volumes")
                    }else{
                        Notify.showSimpleToast("创建失败",-1);
                    }
                })
            }
        }
    ])
})