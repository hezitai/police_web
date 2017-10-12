// 案件录入
controllers.controller('index.caseInput', function($scope, caseInputServers, options, ngDialog, $rootScope, Api, user, $state, $http) {
    console.log(Api.Storage.get('manageUser'));
    $scope.user = Api.Storage.get('manageUser');
    $scope.CaseType = [];
    $scope.CaseTypeList = [];
    $scope.caseposition = [];
    $scope.CaseCourseType = [];
    // $scope.caseMessage = {};



    // 案件类别
    $scope.CaseType = [{
        name: '刑事',
        value: '100000000',
        subSet: [{
            name: '盗窃',
            value: 'ba226075-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '诈骗',
            value: 'bb226075-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '涉毒',
            value: 'bc226075-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '寻衅滋事',
            value: 'bd226075-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '其他',
            value: 'be226075-5528-e711-80f9-708bcd7cc924',
        }],
    }, {
        name: '民事',
        value: '100000001',
        subSet: [{
            name: '盗窃',
            value: 'a72e807c-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '诈骗',
            value: 'a82e807c-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '涉毒',
            value: '45102b83-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '寻衅滋事',
            value: '46102b83-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '殴打他人',
            value: '47102b83-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '毁财',
            value: '48102b83-5528-e711-80f9-708bcd7cc924',
        }, {
            name: '其他',
            value: '49102b83-5528-e711-80f9-708bcd7cc924',
        }]
    }, {
        name: '消防',
        value: '100000002',
        subSet: [{
            name: '火灾',
            value: 'f5905789-5528-e711-80f9-708bcd7cc924',
        }]
    }];
    // 案件状态
    $scope.CaseCourseType = [{
        "name": '未结案',
        "value": false,
    }, {
        "name": '已结案',
        "value": true,
    }];

    // 案件类别选择
    $scope.btnCaseSelect = function(kind) {
        if (kind == "刑事") {
            $scope.CaseType.index = $scope.CaseType[0]
        } else if (kind == "民事") {
            $scope.CaseType.index = $scope.CaseType[1]
        } else {
            $scope.CaseType.index = $scope.CaseType[2]
        }
        $scope.caseSelectShow = true;
        for (var i = 0; i < $scope.CaseType.length; i++) {
            var element = $scope.CaseType[i];
            if ($scope.CaseType.index.name == element.name) {
                $scope.CaseTypeList = element.subSet
            }
        }
        $scope.CaseTypeList.index = $scope.CaseTypeList[0];
        // 接警时间(初始)
        $scope.laydateNow = Api.formatDate('YYYY-MM-DD');
        $scope.laytimeNow = Api.formatDate('hh:mm:ss');
        // 发案时间(初始)
        $scope.laydateStart = Api.formatDate('YYYY-MM-DD');
        $scope.laytimeStart = Api.formatDate('hh:mm:ss');
        // 案件状态(初始)
        $scope.CaseCourseType.index = $scope.CaseCourseType[0];
        // 发案部位
        options.get(['caseposition'], function(result) {
            $scope.caseposition = result.caseposition;
            $scope.caseposition.index = $scope.caseposition[0];
        });
        // 发案地区
        $scope.address = '双阳区';
    };
    // 点击进入地图
    $scope.btnCaseAddressMap = function() {
        $scope.caseMap = true;
        $scope.setAddress = function(str, position) {
            Address = str;
            Position = position;
            $scope.caseMap = false;
        };
    }





    $scope.submit = function() {





        // var postData = [{
        //         "name": "ds_address",
        //         "value": "案件地址"
        //     },
        //     {
        //         "name": "ds_caselocation",
        //         "value": "双阳区"
        //     },
        //     {
        //         "name": "ds_caseposition",
        //         "value": "@code/"
        //     },
        //     {
        //         "name": "ds_casestatus",
        //         "value": "@b/案件状态"
        //     },
        //     {
        //         "name": "ds_description",
        //         "value": "简要案情"
        //     },
        //     {
        //         "name": "ds_happendate",
        //         "value": "@dt/发案时间"
        //     },
        //     {
        //         "name": "ds_name",
        //         "value": "案件名称"
        //     },
        //     {
        //         "name": "ds_personlist",
        //         "value": "涉案人员集合';'分割"
        //     },
        //     {
        //         "name": "ds_pic",
        //         "value": "照片集合';'分割"
        //     },
        //     {
        //         "name": "ds_police_ref",
        //         "value": "@look/当前民警id"
        //     },
        //     {
        //         "name": "ds_policestation_ref",
        //         "value": "@look/当前警局id"
        //     },
        //     {
        //         "name": "ds_receiveddate",
        //         "value": "@dt/接警时间"
        //     },
        //     {
        //         "name": "ds_longitude",
        //         "value": "经度"
        //     },
        //     {
        //         "name": "ds_latitude",
        //         "value": "纬度"
        //     },
        //     {
        //         "name": "ds_helppolice",
        //         "value": "协助民警，用';'分割"
        //     }
        // ]
        // caseInputServers.createCrm(postData, function(result) {
        //     console.log(result);
        // })
    };

})