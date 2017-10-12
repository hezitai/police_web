var app = angular.module('manage', ['manage.controllers', 'manage.services', 'ui.router', 'ngResource', 'ngDialog']);
app.run(function($rootScope, $templateCache) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        if (typeof(current) !== 'undefined') {
            $templateCache.remove(current.templateUrl);
        }
    });
});
app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // 登录
        .state("login", {
            url: "/login",
            controller: 'login',
            templateUrl: "/police_web/template/login.html"
        })
        // 页面框架
        .state("index", {
            url: "/index",
            templateUrl: "/police_web/template/index.html",
            controller: 'index',
        })


    // 首页
    .state("index.homePage", {
            parent: 'index',
            url: "/homePage",
            controller: 'index.homePage',
            templateUrl: "/police_web/template/homePage.html"
        })
        .state("index.demo", {
            parent: 'index',
            url: "/demo",
            controller: 'index.demo',
            templateUrl: "/police_web/template/demo.html"
        })
        // --> 行业场所
        .state("index.place", {
            parent: 'index',
            url: "/place",
            controller: 'index.place',
            templateUrl: "/police_web/template/place.html"
        })
        // 行业场所列表
        .state("index.placeList", {
            parent: 'index',
            url: "/placeList",
            controller: 'index.placeList',
            templateUrl: "/police_web/template/placeList.html"
        })
        //添加行业场所
        .state("index.addPublic", {
            parent: 'index',
            url: "/addPublic",
            controller: 'index.addPublic',
            templateUrl: "/police_web/template/addPublic.html"
        })
        // 行业场所详情
        .state("index.placeDetail", {
            parent: 'index',
            url: "/placeDetail",
            controller: 'index.placeDetail',
            templateUrl: "/police_web/template/placeDetail.html"
        })
        //实名制
        .state("index.realnameLogistics", {
            parent: 'index',
            url: "/realnameLogistics",
            controller: 'index.realnameLogistics',
            templateUrl: "/police_web/template/realnameLogistics.html"
        })
        .state("index.realnameLogisticsSearch", {
            parent: 'index',
            url: "/realnameLogisticsSearch",
            controller: 'index.realnameLogisticsSearch',
            templateUrl: "/police_web/template/realnameLogisticsSearch.html"
        })
        .state("index.publicRealNameWaste", {
            parent: 'index',
            url: "/publicRealNameWaste",
            controller: 'index.publicRealNameWaste',
            templateUrl: "/police_web/template/publicRealNameWaste.html"
        })
        .state("index.publicRealNameHotel", {
            parent: 'index',
            url: "/publicRealNameHotel",
            controller: 'index.publicRealNameHotel',
            templateUrl: "/police_web/template/publicRealNameHotel.html"
        })
        .state("index.publicRealNameMetal", {
            parent: 'index',
            url: "/publicRealNameMetal",
            controller: 'index.publicRealNameMetal',
            templateUrl: "/police_web/template/publicRealNameMetal.html"
        })
        .state("index.publicRealNamePhone", {
            parent: 'index',
            url: "/publicRealNamePhone",
            controller: 'index.publicRealNamePhone',
            templateUrl: "/police_web/template/publicRealNamePhone.html"
        })
        // <-- 行业场所
        //警情信息
        .state("index.policeInfo", {
            parent: 'index',
            url: "/policeInfo",
            controller: 'index.policeInfo',
            templateUrl: "/police_web/template/policeInfo.html"
        })
        //民警定位
        .state("index.policeLocation", {
            parent: 'index',
            url: "/policeLocation",
            controller: 'index.policeLocation',
            templateUrl: "/police_web/template/policeLocation.html"
        })
        // 信息中心
        .state("index.message", {
            parent: 'index',
            url: "/message",
            controller: 'index.message',
            templateUrl: "/police_web/template/message/message.html"
        })
        // 发送信息
        .state("index.send", {
            parent: 'index',
            url: "/send",
            controller: 'index.send',
            templateUrl: "/police_web/template/send.html",
            catch: false
        })
        // 警员管理
        .state("index.policeManagement", {
            parent: 'index',
            url: "/policeManagement",
            controller: 'index.policeManagement',
            templateUrl: "/police_web/template/policeManagement.html"
        })
        // 工作日志
        .state("index.jobs", {
            parent: 'index',
            url: "/jobs",
            controller: 'index.jobs',
            templateUrl: "/police_web/template/jobs.html"
        })

    // 关于我们
    .state("index.contactUs", {
        parent: 'index',
        url: "/contactUs",
        controller: 'index.contactUs',
        templateUrl: "/police_web/template/contactUs.html"
    })

    // 实有房屋
    .state("index.house", {
        parent: 'index',
        url: "/house",
        controller: 'index.house',
        templateUrl: "/police_web/template/house.html"
    })

    //房屋信息
    .state("index.houseRoomMessage", {
            parent: 'index',
            url: "/houseRoomMessage",
            controller: 'index.houseRoomMessage',
            templateUrl: "/police_web/template/houseRoomMessage.html"
        })
        .state("index.searchCollegeInfo", {
            parent: 'index',
            cache: true,
            params: {
                item: null
            },
            url: "/searchCollegeInfo",
            controller: 'index.searchCollegeInfo',
            templateUrl: "/police_web/template/search/searchCollegeInfo.html"
        })


    // 信息查询
    .state("index.search", {
            parent: 'index',
            cache: true,
            url: "/search",
            controller: 'index.search',
            templateUrl: "/police_web/template/search/search.html"
        })
        .state("index.searchPeopleInfo", {
            parent: 'index',
            cache: true,
            params: {
                item: null
            },
            url: "/searchPeopleInfo",
            controller: 'index.searchPeopleInfo',
            templateUrl: "/police_web/template/search/searchPeopleInfo.html"
        })
        .state("index.searchHouseInfo", {
            parent: 'index',
            cache: true,
            params: {
                item: null
            },
            url: "/searchHouseInfo",
            controller: 'index.searchHouseInfo',
            templateUrl: "/police_web/template/search/searchHouseInfo.html"
        })

    // 重点人口
    .state("index.point", {
        parent: 'index',
        url: "/point",
        controller: 'index.point',
        templateUrl: "/police_web/template/point.html"
    })

    // 重点人口签到
    .state("index.pointNewReason", {
        parent: 'index',
        url: "/pointNewReason",
        controller: 'index.pointNewReason',
        templateUrl: "/police_web/template/pointNewReason.html"
    })

    // 巡逻防控
    .state("index.patrol", {
        parent: 'index',
        url: "/patrol",
        controller: 'index.patrol',
        templateUrl: "/police_web/template/patrol.html"
    })

    //警务排班
    .state("index.duty", {
            parent: 'index',
            url: "/duty",
            controller: 'index.duty',
            templateUrl: "/police_web/template/duty.html"
        })
    //查询记录
    .state("index.queryLog", {
        parent:'index',
        url:"/queryLog",
        controller:'index.queryLog',
        templateUrl:"/police_web/template/queryLog.html"
    })
        // --> 信息采集
        .state("index.collect", {
            parent: 'index',
            url: "/collect",
            controller: 'index.collect',
            templateUrl: "/police_web/template/collect.html"
        })
        // //车辆采集
        .state("index.collectCar", {
            parent: 'index',
            url: "/collectCar",
            controller: 'index.collectCar',
            templateUrl: "/police_web/template/collect/collectCar.html"
        })
        // //人员盘查
        .state("index.collectPeople", {
            parent: 'index',
            url: "/collectPeople",
            controller: 'index.collectPeople',
            templateUrl: "/police_web/template/collect/collectPeople.html"
        })
        // //三实信息
        .state("index.collectReality", {
            parent: 'index',
            url: "/collectReality",
            controller: 'index.collectReality',
            templateUrl: "/police_web/template/collect/collectReality.html"
        })
        .state("index.collectRealHouseInfo", {
            parent: 'index',
            url: "/collectRealHouseInfo",
            controller: 'index.collectRealHouseInfo',
            templateUrl: "/police_web/template/collect/collectRealHouseInfo.html"
        })
        // //地址树管理
        .state("index.collectAddress", {
            parent: 'index',
            url: "/collectAddress",
            controller: 'index.collectAddress',
            templateUrl: "/police_web/template/collect/collectAddress.html"
        })
        //社会资源信息
        .state("index.collectSocialResource", {
            parent: 'index',
            url: "/collectSocialResource",
            controller: 'index.collectSocialResource',
            templateUrl: "/police_web/template/collect/collectSocialResource.html"
        })
        // <-- 信息采集

    // 工作任务
    .state("index.mission", {
        parent: 'index',
        url: "/mission",
        controller: 'index.mission',
        templateUrl: "/police_web/template/mission.html"
    })

    // 信息研判
    .state("index.judge", {
            parent: 'index',
            url: "/judge",
            controller: 'index.judge',
            templateUrl: "/police_web/template/judge/judge.html"
        })
        .state("index.judgePublic", {
            parent: 'index',
            url: "/judgePublic",
            controller: 'index.judgePublic',
            templateUrl: "/police_web/template/judge/judgePublic.html"
        })
        .state("index.judgePeople", {
            cache: true,
            parent: 'index',
            url: "/judgePeople",
            controller: 'index.judgePeople',
            templateUrl: "/police_web/template/judge/judgePeople.html"
        })
        .state("index.judgeFire", {
            parent: 'index',
            url: "/judgeFire",
            controller: 'index.judgeFire',
            templateUrl: "/police_web/template/judge/judgeFire.html"
        })
        .state("index.specialPeople", {
            parent: 'index',
            url: "/specialPeople",
            controller: 'index.specialPeople',
            templateUrl: "/police_web/template/judge/specialPeople.html"
        })
        .state("index.caseInput", {
            parent: 'index',
            url: "/caseInput",
            controller: 'index.caseInput',
            templateUrl: "/police_web/template/judge/caseInput.html"
        })
        .state("index.disputeInput", {
            parent: 'index',
            url: "/disputeInput",
            controller: 'index.disputeInput',
            templateUrl: "/police_web/template/judge/disputeInput.html"
        })
        .state("index.judgeCase", {
            parent: 'index',
            url: "/judgeCase",
            controller: 'index.judgeCase',
            templateUrl: "/police_web/template/judge/judgeCase.html"
        })

    // 地图Demos
    .state('index.mapDemo', {
            parent: 'index',
            url: "/mapDemo",
            controller: 'index.mapDemo',
            templateUrl: "/police_web/template/map/mapDemo.html",
        })
        // 地图Demos
        .state('index.chooseBox', {
            parent: 'index',
            url: "/chooseBox",
            controller: 'index.chooseBox',
            templateUrl: "/police_web/template/map/chooseBox.html",
        })
        //危爆物品管理
        .state('index.dangerous', {
            parent: 'index',
            url: "/dangerous",
            controller: 'index.dangerous',
            templateUrl: "/police_web/template/dangerous.html",
        })
        .state('index.dangerousDetail', {
            parent: 'index',
            url: "/dangerousDetail",
            controller: 'index.dangerousDetail',
            templateUrl: "/police_web/template/dangerousDetail.html",
        })
        //不稳定信息库
        .state('index.unsteadinessMessage', {
            parent: 'index',
            url: "/unsteadinessMessage",
            controller: 'index.unsteadinessMessage',
            templateUrl: "/police_web/template/unsteadinessMessage.html",
        })


    $urlRouterProvider.when("", "/login");
});