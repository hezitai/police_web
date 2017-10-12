// house
controllers.controller('index.house', function($scope, houseServers, ngDialog, $rootScope, Api, user, $state) {
    // 出租房屋管理
    $scope.title = $scope.$parent.$parent.title = "出租房屋管理";
    $scope.houseServers = {};
    $scope.houseServers.showList = [];
    //点击查看信息跳转到房屋信息
    $scope.goHouseRoomMessage = function(item) {
            Api.Storage.set('crumbs', [{
                name: '出租房屋管理',
                stateName: 'house',
            }, {
                name: item.displayName,
                stateName: 'houseRoomMessage',
                crmId: item.crmId
            }]);
            $state.go('index.houseRoomMessage');
        }
        //点击进行模糊查询
    $scope.submit = function(x) {
        // 获取房屋信息
        houseServers.getHouseMessageList({
            "id": user.getUserMessage().policeCrmId,
            "search": x
        }, function(result) {
            $scope.houseServers.showList = result;
        });
    };
    //初始化房屋信息
    $scope.submit('');
});
controllers.controller('index.houseRoomMessage', function($scope, $filter, houseServers, judes, options, common, ngDialog, $rootScope, Api, user) {
    var crumbs = Api.Storage.get('crumbs');
    var id = crumbs[1].crmId;
    // 出租房屋管理
    $scope.title = $scope.$parent.$parent.title = "出租房屋管理";
    // 选项卡
    $scope.Tabs = 'houseRoom';
    $scope.TabsOne = true;
    $scope.options = {};
    $scope.houseList = [];
    $scope.houseServers = {};
    $scope.houseOwner = {};
    $scope.houselivingNewList = [];
    $scope.houseMessage = {};
    $scope.houseLessee = [];
    $scope.tabControl = function(person) {
        if ($scope.Tabs != 'houseRoom' && person == 'houseRoom') {
            // 获取房屋信息调用
            getHouseRoomMessage();
        } else if ($scope.Tabs != 'houseOwner' && person == 'houseOwner') {
            // 获取房主信息调用
            getHouseOwnerMessage();
        } else if ($scope.Tabs != 'houseLivingNow' && person == 'houseLivingNow') {
            getHouseLivingNowMessage();
        } else {
            getLesseeMessage();
        };
        $scope.Tabs = person;
    };
    //获取房屋信息
    var getHouseRoomMessage = function() {
        options.get(['houseusertype'], function(result) {
            $scope.options = result;
            houseServers.getHouseMessage({
                crmId: id
            }, function(result) {
                $scope.houseServers = result;
                if ($scope.houseServers.ds_usingarea) {
                    $scope.houseServers.ds_usingarea = $scope.houseServers.ds_usingarea.substr(0, $scope.houseServers.ds_usingarea.indexOf(".") + 3);
                };
                //房屋类型optionside
                houseOptionSide();
                // //警务责任区类型
                getPoliceOption();
            });
        });
    };
    //房屋类型optionside
    var houseOptionSide = function() {
        for (var i = 0; i < $scope.options.houseusertype.length; i++) {
            var element = $scope.options.houseusertype[i];
            if ($scope.houseServers.ds_kind == element.value) {
                $scope.options.index = element;
                break;
            }
        };
    };
    //警务责任区类型
    var getPoliceOption = function() {
        houseServers.getPolicePlaceKindOption(function(result) {
            $scope.houseList = result;
            for (var i = 0; i < $scope.houseList.length; i++) {
                var element = $scope.houseList[i];
                if ($scope.houseServers['ds_dutyplace-teamid'] == element['ds_team-teamid']) {
                    $scope.houseList.index = element;
                    break;
                }
            }
        })
    };
    // 获取房屋信息调用
    getHouseRoomMessage();
    //初始换Select
    function initSelect(value, scopeData, options, showData, rootData) {
        if (value) {
            rootData[showData][scopeData] = value.split(':')[0];
            for (var i = 0; i < rootData.options[options].length; i++) {
                if (rootData.options[options][i].value == rootData[showData][scopeData]) {
                    rootData[showData][scopeData] = rootData.options[options][i];
                }
            }
        }
    };
    var getOptions = function(data, success) {
        if (!data.nation || !data.bloodtype || !data.education || !data.familyregister || !data.marriage) {
            options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
                success(angular.copy(result));
            });
        } else {
            success(data);
        }
    };
    // 获取房主信息
    var getHouseOwnerMessage = function() {
        houseOwner = $scope.houseServers['ds_houseowner-ds_personid'];
        getOptions($scope.options, function(result) {
            $scope.options = result;
            if (houseOwner) {
                houseServers.getHouseOwner({
                    id: houseOwner
                }, function(result) {
                    $scope.houseOwner = result;
                    console.log($filter('idCardNum')($scope.houseOwner.ds_id, 'birth'));
                    $scope.houseOwner.birth = $filter('idCardNum')($scope.houseOwner.ds_id, 'birth');
                    // $scope.houseOwner.birth = Api.formatDate('zh', $filter('idCardNum')($scope.houseOwner.ds_id,'birth'));
                    $scope.houseOwner.sex = $filter('idCardNum')($scope.houseOwner.ds_id, 'sex') == '1' ? '男' : '女';
                    initSelect(result.ds_account, 'ds_account', 'familyregister', 'houseOwner', $scope);
                    initSelect(result.ds_education, 'ds_education', 'education', 'houseOwner', $scope);
                    initSelect(result.ds_nation, 'ds_nation', 'nation', 'houseOwner', $scope);
                    initSelect(result.ds_marriage, 'ds_marriage', 'marriage', 'houseOwner', $scope);
                    initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype', 'houseOwner', $scope);
                    common.getSub(result.ds_idaheadpic, function(result) {
                        $scope.houseOwner.img = result;
                    })
                })
            }
        });
    };
    //获取现居住人信息
    var getHouseLivingNowMessage = function() {
        houseServers.getHouseLivingNowList(id, function(result) {
            $scope.houselivingNewList = result;
        })
    };
    // 点击查看居住人信息
    $scope.messageLook = function(item) {
        ngDialog.open({
            template: "/police_web/template/dialogs/lookHouseLivingNowMessage.html",
            className: "houseMessagedialog ngdialog-theme-default",
            controller: function($scope, $rootScope) {
                options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
                    $scope.options = angular.copy(result);
                    $scope.houseMessage = item;
                    //获取现居住人详情
                    houseServers.houseUserDetail($scope.houseMessage.id, function(result) {
                        $scope.houseMessage = result;
                        initSelect(result['ds_person_ref-ds_account'], 'ds_person_ref-ds_account', 'familyregister', 'houseMessage', $scope);
                        initSelect(result['ds_person_ref-ds_education'], 'ds_person_ref-ds_education', 'education', 'houseMessage', $scope);
                        initSelect(result['ds_person_ref-ds_nation'], 'ds_person_ref-ds_nation', 'nation', 'houseMessage', $scope);
                        initSelect(result['ds_person_ref-ds_marriage'], 'ds_person_ref-ds_marriage', 'marriage', 'houseMessage', $scope);
                        initSelect(result['ds_person_ref-ds_bloodtype'], 'ds_person_ref-ds_bloodtype', 'bloodtype', 'houseMessage', $scope);
                        $scope.houseMessage['ds_startdate'] = {};
                        $scope.houseMessage['ds_startdate'].data = new Date();
                        $scope.houseMessage['ds_startdate'].show = Api.formatDate('zh', $scope.houseMessage['ds_startdate'].data);
                        $scope.houseMessage['ds_enddate'] = {};
                        $scope.houseMessage['ds_enddate'].data = new Date();
                        $scope.houseMessage['ds_enddate'].show = Api.formatDate('zh', $scope.houseMessage['ds_enddate'].data);
                        console.log($filter('idCardNum')($scope.houseMessage['ds_person_ref-ds_id'], 'birth'));
                        $scope.houseMessage.birth = $filter('idCardNum')($scope.houseMessage['ds_person_ref-ds_id'], 'birth');
                        // $scope.houseMessage.birth = Api.formatDate('zh', $filter('idCardNum')($scope.houseMessage['ds_person_ref-ds_id'], 'birth'));
                        $scope.houseMessage.sex = $filter('idCardNum')($scope.houseMessage['ds_person_ref-ds_id'], 'sex') == '1' ? '男' : '女';
                        common.getSub($scope.houseMessage['ds_person_ref-ds_idaheadpic'], function(result) {
                            $scope.houseMessage.img = result;
                        })
                    })
                })
            }
        })
    };
    // 获取承租人信息
    var getLesseeMessage = function() {
        houseServers.getLesseeList(id, function(result) {
            $scope.houseLessee = result;
        })
    }
});