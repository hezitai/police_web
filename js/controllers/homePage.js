// 首页
controllers.controller('index.homePage', function($scope, homePageServers, ngDialog, $rootScope, Api, user, $state, $http) {
    $scope.userManage = user.getUserMessage();

    $scope.homePageServers = {};
    $scope.homePageServers.allPolice = [];
    $scope.homePageServers.select = {};
    $scope.homePageServers.dutyPolice = {};
    $scope.caseYesterday = [];
    $scope.rentHouseMessage = {};
    $scope.public = {};
    $scope.importantPeople = {};

    //警局列表
    homePageServers.getAllPolice(function(result) {
        $scope.homePageServers.allPolice = result;
        $scope.homePageServers.select = $scope.homePageServers.allPolice[0];
        // console.log($scope.homePageServers.allPolice);
        $scope.getDuty();
        $scope.dutyLoading = true;
    });
    //警务排班
    $scope.changeSelect = function() {
        // console.log($scope.homePageServers.select);
        $scope.getDuty();
    };
    //获取指定派出所排班信息
    $scope.getDuty = function() {
        homePageServers.getDuty({
            "id": $scope.homePageServers.select["ds_team-teamid"]
        }, function(result) {
            if (!!result) {
                // console.log(angular.fromJson(result.ds_json));
                $scope.homePageServers.dutyPolice = angular.fromJson(result.ds_json);
                $scope.show = true;
            } else {
                // 暂无排班信息
                $scope.show = false;
            }
        })
    };
    // 案件查询-昨日发生案件
    homePageServers.getCaseYesterday({
        // "date": '2017/08/11',
        "date": Api.formatDate('/', new Date().getTime() - 24 * 60 * 60 * 1000)
    }, function(result) {
        console.log(result);
        var listArray = [];

        for (var i = 0; i < result.length; i++) {
            var element = result[i];
            if (listArray.length == 0) {
                listArray.push({ type: element['ds_casetype-ds_name'], list: [element['ds_caseid']] });
            } else {
                var isHave = false;
                for (var j = 0; j < listArray.length; j++) {
                    // console.log(element);
                    if (listArray[j].type == element['ds_casetype-ds_name']) {
                        listArray[j].list.push(element['ds_caseid']);
                        isHave = true;
                        break;
                    };
                };
                if (!isHave) {
                    listArray.push({ type: element['ds_casetype-ds_name'], list: [element['ds_caseid']] });
                };
            }
        };

        $scope.caseYesterday = listArray;
        console.log($scope.caseYesterday);

        var sum = 0;
        for (var i = 0; i < listArray.length; i++) {
            sum += listArray[i].list.length;
        }
        $scope.caseYesterday.total = sum;
        $scope.caseLoading = true;
    });
    // 出租屋查询-昨日新增/总数
    homePageServers.getRentHouseMessage(function(result) {
        $scope.rentHouseMessage = result;
        // console.log(result);
        if (result.totalCount == '0') {
            $scope.yesterdayWidth = { "width": "0%" };
            $scope.totalWidth = { "width": "0%" };
        } else {
            $scope.yesterdayWidth = { "width": ($scope.rentHouseMessage.yesterdayRentCount / $scope.rentHouseMessage.totalCount) * 100 + "%" };
            $scope.totalWidth = { "width": ($scope.rentHouseMessage.rentCount / $scope.rentHouseMessage.totalCount) * 100 + "%" };
        }
        $scope.rentLoading = true;

    });
    // 行业场所图
    homePageServers.getPublicListForMap({}, function(result) {
        $scope.public = result;
        if (result.publicList.length == 0) {
            $scope.redWidth = { "width": "0%" };
            $scope.orangeWidth = { "width": "0%" };
            $scope.greenWidth = { "width": "0%" };
        } else {
            $scope.redWidth = { "width": ($scope.public.redCount / $scope.public.publicList.length) * 100 + "%" };
            $scope.orangeWidth = { "width": ($scope.public.orangeCount / $scope.public.publicList.length) * 100 + "%" };
            $scope.greenWidth = { "width": ($scope.public.greenCount / $scope.public.publicList.length) * 100 + "%" };
        }
        $scope.publicLoading = true;
    });

    // 重点人口图
    homePageServers.getPeopleListForMap({}, function(result) {
        $scope.importantPeople = result;
        if (result.prioritypeopleList.length == 0) {
            $scope.gaoWidth = { "height": "0%" };
            $scope.zhongWidth = { "height": "0%" };
            $scope.diWidth = { "height": "0%" };
        } else {
            $scope.gaoWidth = { "height": ($scope.importantPeople.redCount / $scope.importantPeople.prioritypeopleList.length) * 100 + "%" };
            $scope.zhongWidth = { "height": ($scope.importantPeople.orangeCount / $scope.importantPeople.prioritypeopleList.length) * 100 + "%" };
            $scope.diWidth = { "height": ($scope.importantPeople.greenCount / $scope.importantPeople.prioritypeopleList.length) * 100 + "%" };
        }
        $scope.importantLoading = true;

    });





















})