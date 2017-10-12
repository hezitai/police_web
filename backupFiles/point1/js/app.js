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
		templateUrl: "/manage/template/login.html"
	})
	// 页面框架
	.state("index", {
		url: "/index",
		templateUrl: "/manage/template/index.html",
		controller: 'index',
	})
	// 首页
	.state("index.homePage", {
		parent: 'index',
		url: "/homePage",
		controller: 'index.homePage',
		templateUrl: "/manage/template/homePage.html"
	})

	// --> 行业场所
	.state("index.place", {
		parent: 'index',
		url: "/place",
		controller: 'index.place',
		templateUrl: "/manage/template/place.html"
	})
	// 行业场所列表
	.state("index.placeList", {
		parent: 'index',
		url: "/placeList",
		controller: 'index.placeList',
		templateUrl: "/manage/template/placeList.html"
	})
	// 行业场所详情
	.state("index.placeDetail", {
		parent: 'index',
		url: "/placeDetail",
		controller: 'index.placeDetail',
		templateUrl: "/manage/template/placeDetail.html"
	})
	// <-- 行业场所
	
	// 信息中心
	.state("index.message", {
		parent: 'index',
		url: "/message",
		controller: 'index.message',
		templateUrl: "/manage/template/message.html"
	})
	// 发送信息
	.state("index.send", {
		parent: 'index',
		url: "/send",
		controller: 'index.send',
		templateUrl: "/manage/template/send.html"
	})
	// 工作日志
	.state("index.jobs", {
		parent: 'index',
		url: "/jobs",
		controller: 'index.jobs',
		templateUrl: "/manage/template/jobs.html"
	})

	// 关于我们
	.state("index.contactUs", {
		parent: 'index',
		url: "/contactUs",
		controller: 'index.contactUs',
		templateUrl: "/manage/template/contactUs.html"
	})

	// 实有房屋
	.state("index.house", {
		parent: 'index',
		url: "/house",
		controller: 'index.house',
		templateUrl: "/manage/template/house.html"
	})

	// 信息查询
	.state("index.search", {
		parent: 'index',
		url: "/search",
		controller: 'index.search',
		templateUrl: "/manage/template/search.html"
	})

	// 重点人口
	.state("index.point", {
		parent: 'index',
		url: "/point",
		controller: 'index.point',
		templateUrl: "/manage/template/point.html"
	})

	// 巡逻防控
	.state("index.patrol", {
		parent: 'index',
		url: "/patrol",
		controller: 'index.patrol',
		templateUrl: "/manage/template/patrol.html"
	})


	// --> 信息采集
	.state("index.collect", {
		parent: 'index',
		url: "/collect",
		controller: 'index.collect',
		templateUrl: "/manage/template/collect.html"
	})

	.state("index.collectCar", {
		parent: 'index',
		url: "/collectCar",
		controller: 'index.collectCar',
		templateUrl: "/manage/template/collect/collectCar.html"
	})

	.state("index.collectPeople", {
		parent: 'index',
		url: "/collectPeople",
		controller: 'index.collectPeople',
		templateUrl: "/manage/template/collect/collectPeople.html"
	})

	.state("index.collectReality", {
		parent: 'index',
		url: "/collectReality",
		controller: 'index.collectReality',
		templateUrl: "/manage/template/collect/collectReality.html"
	})

	.state("index.collectAddress", {
		parent: 'index',
		url: "/collectAddress",
		controller: 'index.collectAddress',
		templateUrl: "/manage/template/collect/collectAddress.html"
	})
	// <-- 信息采集

	// 工作任务
	.state("index.mission", {
		parent: 'index',
		url: "/mission",
		controller: 'index.mission',
		templateUrl: "/manage/template/mission.html"
	})

	// 信息研判
	.state("index.calculate", {
		parent: 'index',
		url: "/calculate",
		controller: 'index.calculate',
		templateUrl: "/manage/template/calculate.html"
	})

	$urlRouterProvider.when("", "/login");
});