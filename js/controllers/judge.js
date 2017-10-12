controllers.controller('index.judge', function($scope, caseService, $interval, $timeout, judes,common, gather, $state) {
	$scope.title = $scope.$parent.$parent.title = "信息研判";
	$scope.go = function(stateName) {
		$state.go(stateName);
	};
	
});
controllers.controller('index.judgePublic', function($scope, caseService, $interval, $timeout, judes,common, gather, $state,Api) {
	$scope.title = $scope.$parent.$parent.title = "行业场所";
	
	$scope.study = {};
	$scope.study.show = true;
	$scope.study.red = {
		show: false,
		num: 0,
		filter: 2,
		list: [],
	};
	$scope.study.orange = {
		show: false,
		num: 0,
		filter: 1,
		list: [],
	};
	$scope.study.green = {
		show: false,
		num: 0,
		filter: 0,
		list: [],
	};
	$scope.study.all = {
		show: false,
		num: 0,
		filter: '',
		list: [],
	};
	$scope.refresh = 0;

	$scope.study.drug = {
		list: [],
		show: false,
	};
	$scope.study.employee = {
		list: [],
		show: false,
	};
	$scope.study.Other = {
		list: [],
		show: false,
	};
	$scope.study.prostitution = {
		list: [],
		show: false,
	};
	$scope.study.case = {
		list: [],
		show: false,
	};
	$scope.study.realName = {
		list: [],
		show: false,
	};

	$scope.study.gamble = {
		list: [],
		show: false,
	};

	$scope.study.team = {};
	$scope.study.listFilter = '';
	$scope.peopleList = [];

	$scope.initData = function(result) {
		var newResult = angular.copy(result);
		$scope.study.green.num = newResult.greenCount;
		$scope.study.orange.num = newResult.orangeCount;
		$scope.study.red.num = newResult.redCount;
		$scope.study.all.num = newResult.greenCount + newResult.orangeCount + newResult.redCount;
		$scope.study.all.list = [];
		$scope.study.green.list = [];
		$scope.study.orange.list = [];
		$scope.study.red.list = [];
		if(judes.isNull(newResult)){
			for (var i = 0; i < newResult.publicList.length; i++) {
				var publicItem = newResult.publicList[i];
				$scope.study.all.list.push(publicItem);
			};
			for (var i = 0; i < $scope.study.all.list.length; i++) {
				var publicItem = $scope.study.all.list[i];
				if (publicItem.level == 0) {
					$scope.study.green.list.push(publicItem);
				};
				if (publicItem.level == 1) {
					$scope.study.orange.list.push(publicItem);
				};
				if (publicItem.level == 2) {
					$scope.study.red.list.push(publicItem);
				};
			};
			$scope.refreshMap($scope.study.all);
		}else{
			$scope.refreshMap(false);
		};
		
	};

	$scope.refreshMap = function(data) {
		$scope.study.red.show = false;
		$scope.study.orange.show = false;
		$scope.study.green.show = false;
		$scope.study.all.show = false;
		
		if(data){
			data.show = true;
			$scope.peopleList = [];
			for (var i = 0; i < data.list.length; i++) {
				if (data.list[i].longitude && data.list[i].latitiude) {
					var _data = {
						name: data.list[i].name,
						longitude: data.list[i].longitude,
						latitude: data.list[i].latitiude,
						level: data.list[i].level,
					};
					$scope.peopleList.push(_data);
				};
			};
			$scope.refresh++;
			$scope.study.listFilter = data.filter;

			$scope.study.drug.list = [];
			$scope.study.employee.list = [];
			$scope.study.Other.list = [];
			$scope.study.prostitution.list = [];
			$scope.study.case.list = [];
			$scope.study.realName.list = [];
			$scope.study.gamble.list = [];
			$scope.study.drug.show = false;
			$scope.study.employee.show = false;
			$scope.study.Other.show = false;
			$scope.study.prostitution.show = false;
			$scope.study.case.show = false;
			$scope.study.realName.show = false;
			$scope.study.gamble.show = false;

			for (var i = 0; i < data.list.length; i++) {
				var publicItem = data.list[i];

				if (publicItem.isEmployee) {
					$scope.study.employee.list.push(publicItem);
				};
				if (publicItem.isOther) {
					$scope.study.Other.list.push(publicItem);
				};
				if (publicItem.isProstitution) {
					$scope.study.prostitution.list.push(publicItem);
				};
				if (publicItem.isCase) {
					$scope.study.case.list.push(publicItem);
				};
				if (publicItem.isRealName) {
					$scope.study.realName.list.push(publicItem);
				};
				if (publicItem.isDrug) {
					$scope.study.drug.list.push(publicItem);
				};
				if (publicItem.isGamble) {
					$scope.study.gamble.list.push(publicItem);
				};
			};
		}else{
			$scope.peopleList = [];
		}
		
	};
	$scope.refreshData = function() {
		caseService.getPublicListForMap($scope.study.team.value, function(result) {
			$scope.initData(result);
		});
	};

	gather.getPoliceHouse(function(result) {
		$scope.team = result;
		$scope.team.unshift({
			"name": "全部派出所",
			"value": ""
		});
		$scope.study.team = $scope.team[0];
		$scope.refreshData();
	});
	// 切换显示方式
	$scope.changeDisplayMode = function(isShowMap) {
		$scope.study.show = isShowMap;
		$scope.refreshData();
	};
	$scope.go = function(data) {		
		Api.Storage.set('crumbs', [{
			name: '信息研判',
			stateName: 'judge'
		}, {
			name: '行业场所',
			stateName: 'judgePublic',
			
		},{
			name:data.name,
			stateName:'placeDetail',
			id: data.id,
			type: data.type,
			fromJudge:true,
		}]);
		$state.go('index.placeDetail'); 
	};
	
});
controllers.controller('index.judgePeople', function($scope, caseService, $interval, $timeout, judes,common, gather, $state,Api,ngDialog) {
	$scope.study = {};
	$scope.study.show = true;
	$scope.peopleTypes = [{
		name: '取保',
		show: false,
		list: [],
	}, {
		name: '监视居住',
		show: false,
		list: [],
	}, {
		name: '涉毒',
		show: false,
		list: [],
	}, {
		name: '刑满释放',
		show: false,
		list: [],
	}, {
		name: '关注人群',
		show: false,
		list: [],
	}, {
		name: '信访',
		show: false,
		list: [],
	}, {
		name: '高危人群',
		show: false,
		list: [],
	}, {
		name: '其他',
		show: false,
		list: [],
	}];


	$scope.study.red = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.orange = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.green = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.all = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.refresh = 0;
	$scope.study.team = {};
	$scope.study.listFilter = '';
	$scope.peopleList = [];

	$scope.initData = function(result) {
		var newResult = angular.copy(result);
		$scope.study.green.num = newResult.greenCount;
		$scope.study.orange.num = newResult.orangeCount;
		$scope.study.red.num = newResult.redCount;
		$scope.study.all.num = newResult.greenCount + newResult.orangeCount + newResult.redCount;
		$scope.study.all.list = [];
		$scope.study.green.list = [];
		$scope.study.orange.list = [];
		$scope.study.red.list = [];
		for (var i = 0; i < newResult.prioritypeopleList.length; i++) {
			var publicItem = newResult.prioritypeopleList[i];
			$scope.study.all.list.push(publicItem);
		};
		for (var i = 0; i < $scope.study.all.list.length; i++) {
			var publicItem = $scope.study.all.list[i];
			if (publicItem.level == 0) {
				$scope.study.green.list.push(publicItem);
			};
			if (publicItem.level == 1) {
				$scope.study.orange.list.push(publicItem);
			};
			if (publicItem.level == 2) {
				$scope.study.red.list.push(publicItem);
			};
		};
		$scope.refreshMap($scope.study.all);
	};

	$scope.refreshMap = function(data) {
		$scope.study.red.show = false;
		$scope.study.orange.show = false;
		$scope.study.green.show = false;
		$scope.study.all.show = false;

		data.show = true;
		$scope.peopleList = [];
		
		for (var i = 0; i < data.list.length; i++) {
			if (data.list[i].longitude && data.list[i].latitude) {
				var _data = {
					name: data.list[i].name,
					longitude: data.list[i].longitude,
					latitude: data.list[i].latitude,
					level: data.list[i].level,
				};
				$scope.peopleList.push(_data);
			};
		};
		// console.log($scope.peopleList);
		$scope.refresh++;

		for (var i = 0; i < $scope.peopleTypes.length; i++) {
			var item = $scope.peopleTypes[i];
			item.list = [];
			for (var d = 0; d < data.list.length; d++) {
				var Datalist = data.list[d];
				if (item.name == Datalist.regulatoryReason) {
					item.list.push(Datalist);
				}
			};

		};

	};
	$scope.resetPeople = function(id) {
		ngDialog.open({
			template: '/police_web/template/dialogs/judgePerson.html',
			controller: function($scope, $rootScope, $state, common, point, Api, ngDialog, getBase64ByFile, judes, user, options) {
				
				$scope.options = {};
				$scope.options.name = '';
				$scope.options.idCard = '';
				$scope.options.phone = '';
				$scope.options.endTime = '';
				$scope.options.signtype = '';
				$scope.options.day = '';
				$scope.options.isCheck = true;
				$scope.options.week = '';
				$scope.options.time = '';
				$scope.options.regulatoryScope = [];
				$scope.options.riskassessmentid = '';

				$scope.options.drugDangerType = '';
				$scope.options.visitgradeDangerType = '';
				$scope.options.visitgradeResultText = '';

				$scope.options.getScope = false;
				$scope.options.getCause = false;

				$scope.options.drugDangerOption = [];
				$scope.options.drugDangerStr = '';


				point.regulatoryScope(function(resultRegulatory) {
					$scope.regulatory = resultRegulatory;
					console.log($scope.regulatory);
					$scope.options.getScope = true;

					point.cause(function(resultCause) {
						$scope.cause = resultCause;

						$scope.options.getCause = true;
						options.get(['riskassessmenttype', 'riskassessment', 'visitgrade'], function(resultOptions) {
							$scope.options.optionSides = resultOptions;
							point.drugDangerOption(function(resultDrugDangerOption) {
								$scope.options.drugDangerOption = resultDrugDangerOption;

								point.detail(id, function(resultDetail) {


									console.log(resultDetail);
									$scope.options.name = resultDetail['ds_person-ds_name'];
									$scope.options.phone = resultDetail['ds_person-ds_phone'];
									$scope.options.idCard = resultDetail['ds_person-ds_id'];
									$scope.options.endTime = Api.formatDate('/',resultDetail['ds_enddate']);
									if (resultDetail['ds_riskassessment_ref-ds_riskassessmentid']) {
										$scope.options.riskassessmentid = resultDetail['ds_riskassessment_ref-ds_riskassessmentid'];
									};
									if (resultDetail['ds_regulatoryreason-ds_name'] == '信访') {
										point.getRisk(resultDetail['ds_riskassessment_ref-ds_riskassessmentid'], function(resultRisk) {
											console.log(resultRisk);
											if (resultRisk['ds_risktype'] == '100000000') {
												$scope.options.visitgradeDangerType = '低危';
											} else if (resultRisk['ds_risktype'] == '100000001') {
												$scope.options.visitgradeDangerType = '中危';
											} else if (resultRisk['ds_risktype'] == '100000002') {
												$scope.options.visitgradeDangerType = '高危';
											};
											for (var i = 0; i < $scope.options.optionSides.visitgrade.length; i++) {
												var item = $scope.options.optionSides.visitgrade[i];
												if (item['name'] == resultRisk['ds_visitgrade'].substring(10)) {
													$scope.options.visitgradeResult = item;
												}
											};
											$scope.options.visitgradeResultText = resultRisk['ds_visitgrade'].substring(10);

										});

									};

									if (resultDetail['ds_regulatoryreason-ds_name'] == '涉毒') {
										point.getRisk(resultDetail['ds_riskassessment_ref-ds_riskassessmentid'], function(resultRisk) {
											console.log(resultRisk);
											if (resultDetail['ds_riskassessment'].split(':')[0] == '100000000') {
												$scope.options.drugDangerType = '低危';
											} else if (resultDetail['ds_riskassessment'].split(':')[0] == '100000001') {
												$scope.options.drugDangerType = '中危';
											} else if (resultDetail['ds_riskassessment'].split(':')[0] == '100000002') {
												$scope.options.drugDangerType = '高危';
											};
											// console.log(resultRisk);
											if(resultRisk['ds_poisonitem']){
												resultRisk['ds_poisonitem'] = resultRisk['ds_poisonitem'].split(";");	
												for (var i = 0; i < $scope.options.drugDangerOption.length; i++) {
													var items = $scope.options.drugDangerOption[i];
													for (var d = 0; d < resultRisk['ds_poisonitem'].length; d++) {
														if (items.id == resultRisk['ds_poisonitem'][d]) {
															items.isChoose = true;
															break;
														}
													}
												}
											};										
											
										})
									};

									if (resultDetail['ds_needsignin']) {
										if (resultDetail['ds_needsignin'] == 'False') {
											$scope.options.isCheck = false;
										} else {
											$scope.options.isCheck = true;
										}
									};
									if (resultDetail['ds_signtype']) {
										$scope.options.signtype = resultDetail['ds_signtype'].substring(0, 9);
										$scope.stateGo = function(stateName) {
											$state.go(stateName);
											Api.Storage.set('crumbs', [{
												name: '信息研判',
												stateName: 'judge',
											},{
												name: '人员',
												stateName: 'judgePeople',
											},{
												name: '签到记录',
												stateName: 'pointNewReason',
												id: id,
												personName: resultDetail['ds_person-ds_name'],
												signtype: resultDetail['ds_signtype'].substring(0, 9),
												fromJudge:true,
											}]);
											$scope.closeThisDialog();
										};
									};
									if (resultDetail['ds_signdate']) {
										$scope.options.day = resultDetail['ds_signdate'];
									};
									if (resultDetail['ds_signweek']) {
										$scope.options.week = resultDetail['ds_signweek'];

									};
									if (resultDetail['ds_signtime']) {
										$scope.options.time = new Date('1970-01-01 ' + resultDetail['ds_signtime']);

									};
									for (var i = 0; i < $scope.regulatory.length; i++) {
										var item = $scope.regulatory[i];
										if (item['ds_name'] == resultDetail['ds_regulatoryscope-ds_name']) {
											$scope.options.regulatoryScope = item;
										}
									};
									for (var i = 0; i < $scope.cause.length; i++) {
										var item = $scope.cause[i];
										if (item['ds_name'] == resultDetail['ds_regulatoryreason-ds_name']) {
											$scope.options.regulatoryCause = item;
										}
									};
								});
							});
						});

					});
				});
				$scope.visitgradeResultChange = function(data) {
					$scope.options.visitgradeResultText = data.name;
					if (data.value == '100000000') {
						$scope.options.visitgradeDangerType = '低危';
					};
					if (data.value == '100000001') {
						$scope.options.visitgradeDangerType = '中危';
					};
					if (data.value == '100000002') {
						$scope.options.visitgradeDangerType = '高危';
					};
				};
				$scope.formatData = function(data) {
					return Api.formatDate('/', data);
				};
				$scope.chooseEnd = function() {
					var judeStr = [];
					$scope.options.drugDangerStr = '';
					for (var i = 0; i < $scope.options.drugDangerOption.length; i++) {
						var item = $scope.options.drugDangerOption[i];
						if (item.isChoose) {
							$scope.options.drugDangerStr += item.id + ';';
							judeStr.push(item.ds_riskgrade);
						}
					};
					var dangerText = $scope.options.optionSides.riskassessment[0].value;
					for (var i = 0; i < judeStr.length; i++) {
						if (dangerText < judeStr[i]) {
							dangerText = judeStr[i];
						}
					};
					for (var i = 0; i < $scope.options.optionSides.riskassessment.length; i++) {
						var _item = $scope.options.optionSides.riskassessment[i];
						if (_item.value == dangerText) {
							$scope.options.drugDangerType = _item.name
						}
					}
					console.log($scope.options.drugDangerStr);
					// $scope.modal.hide();
				};
			}
		})
	};
	$scope.refreshData = function() {
		caseService.getPeopleListForMap($scope.study.team.value, function(result) {
			$scope.initData(result);
		});
	};

	gather.getPoliceHouse(function(result) {
		$scope.team = result;
		$scope.team.unshift({
			"name": "全部派出所",
			"value": ""
		});
		$scope.study.team = $scope.team[0];
		$scope.refreshData();
	});


	$scope.change = function(data) {
		$scope.study.show = data;
	}
});
controllers.controller('index.judgeFire', function($scope, caseService, $interval, $timeout, judes,common, gather, $state,Api) {
	$scope.study = {};
	$scope.case = {};
	$scope.study.show = true;
	$scope.study.showScreen = false;
	$scope.peopleList = [];

	$scope.publicList = {
		haveProblem: {
			list: [],
			show: false,
		},
		rectification: {
			list: [],
			show: false,
		},
	};

	$scope.study.red = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.orange = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.green = {
		show: false,
		num: 0,
		list: [],
	};
	$scope.study.all = {
		show: false,
		num: 0,
		list: [],
	};

	$scope.refresh = 0;

	$scope.case.end =  Api.formatDate('zh', Api.formatDate('/') + ' 23:59:59');
	
	$scope.case.star = Api.formatDate('zh', Api.formatDate('Z') - (60 * 60 * 24 * 1000 * 30));
	
	$scope.study.screen = {
		"startDate": Api.formatDate('/', $scope.case.star) + ' 00:00:01',
		"endDate": Api.formatDate('/', $scope.case.end) + ' 23:59:59',
		"policeStation": "",
		"caseArea": ""
	};

	$scope.refreshMapData = function() {
		$scope.study.screen.policeStation = $scope.study.team.value;
		$scope.study.screen.startDate = Api.formatDate('/', $scope.case.star) + ' 00:00:01';
		$scope.study.screen.endDate = Api.formatDate('/', $scope.case.end) + ' 23:59:59';
		$scope.initMapData();
		$scope.study.showScreen = false;
	};

	$scope.initMapData = function() {
		caseService.getFireCaseList($scope.study.screen, function(result) {
			console.log(result);
			$scope.peopleList = [];
			for (var i = 0; i < result.caseList.length; i++) {
				if (result.caseList[i].longitude && result.caseList[i].latitiude) {
					var _data = {
						name: result.caseList[i].caseName,
						longitude: result.caseList[i].longitude,
						latitude: result.caseList[i].latitiude,
						level: result.caseList[i].fileLevel,
					};
					$scope.peopleList.push(_data);
					$scope.refresh++;
				};
			};
		});
	};

	$scope.refreshPublicData = function(data) {
		console.log(data);
		$scope.study.red.show = false;
		$scope.study.orange.show = false;
		$scope.study.green.show = false;
		$scope.study.all.show = false;

		data.show = true;

		$scope.publicList.haveProblem.list = [];
		$scope.publicList.rectification.list = [];
		$scope.publicList.haveProblem.show = false;
		$scope.publicList.rectification.show = false;

		for (var i = 0; i < data.list.length; i++) {
			var public = data.list[i];
			if (public.isModified) {
				$scope.publicList.haveProblem.list.push(public);
			} else {
				$scope.publicList.rectification.list.push(public);
			};
		}
	};
	$scope.initPublicData = function() {
		caseService.getFirePublicList($scope.study.team.value, function(result) {
			// console.log(result);
			$scope.study.red.list = [];
			$scope.study.orange.list = [];
			$scope.study.green.list = [];
			$scope.study.all.list = [];

			for (var i = 0; i < result.publicList.length; i++) {
				var public = result.publicList[i];
				$scope.study.all.list.push(public);
				if (public.fileLevel == 0) {
					$scope.study.green.list.push(public);
				} else if (public.fileLevel == 1) {
					$scope.study.orange.list.push(public);
				} else if (public.fileLevel == 2) {
					$scope.study.red.list.push(public);
				};
			};

			$scope.refreshPublicData($scope.study.all);
		});
	};

	gather.getPoliceHouse(function(result) {
		$scope.team = result;
		$scope.team.unshift({
			"name": "全部派出所",
			"value": ""
		});
		$scope.study.team = $scope.team[0];
		$scope.refreshMapData();
	});

	$scope.change = function(data) {
		$scope.study.show = data;
		if (data) {
			$scope.initMapData();
		} else {
			$scope.initPublicData();
		};
	};

	$scope.go = function(data) {
		Api.Storage.set('crumbs', [{
			name: '信息研判',
			stateName: 'judge'
		}, {
			name: '消防火灾',
			stateName: 'judgeFire',
			
		},{
			name:data.name,
			stateName:'placeDetail',
			id: data.id,
			type: data.kind,
			fromJudge:true,
		}]);
		$state.go('index.placeDetail'); 
	};
});
controllers.controller('index.judgeCase', function($scope, caseService, $interval, $timeout, judes,common, gather, $state,Api) {
	$scope.title = $scope.$parent.$parent.title = "案件";

	$scope.case = {};
	$scope.refresh = 0;
	$scope.case.end = Api.formatDate('zh', Api.formatDate('/') + ' 23:59:59');
	$scope.case.star = Api.formatDate('zh', Api.formatDate('Z') - (60 * 60 * 24 * 1000 * 30));
		
	$scope.peopleList = [];
	$scope.caseType = [{
		name: '全部',
		value: '',
		subSet: [{
			name: '全部',
			value: '',
		}],
	}, {
		name: '刑事',
		value: '100000000',
		subSet: [{
			name: '全部',
			value: '',
		}, {
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
			name: '全部',
			value: '',
		}, {
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
	}];

	$scope.study = {};
	$scope.study.show = true;
	$scope.study.showScreen = false;
	$scope.study.screen = {
		"startDate": Api.formatDate('/', $scope.case.star) + ' 00:00:01',
		"endDate": Api.formatDate('/', $scope.case.end) + ' 23:59:59',
		"policeStation": "",
		"caseType": "",
		"caseDetailType": "",
		"caseArea": ""
	};
	$scope.study.list = [];

	$scope.changeDate = function(str) {
		$scope.case[str].show = Api.formatDate('zh', $scope.case[str].data);
	};

	$scope.changeCaseType = function() {
		$scope.study.screen.caseType = $scope.case.Type.value;
		$scope.case.SubType = $scope.case.Type.subSet[0];
		$scope.study.screen.caseDetailType = $scope.case.SubType.value;
	};

	$scope.changeCaseSubSetType = function() {
		$scope.study.screen.caseDetailType = $scope.case.SubType.value;
	};
	$scope.change = function(data) {
		$scope.study.show = data;
	};
	$scope.refreshData = function() {
		$scope.study.screen.policeStation = $scope.study.team.value;
		$scope.study.screen.caseType = $scope.case.Type.value;
		$scope.study.screen.caseDetailType = $scope.case.SubType.value;
		$scope.study.screen.startDate = Api.formatDate('/', $scope.case.star.data) + ' 00:00:01';
		$scope.study.screen.endDate = Api.formatDate('/', $scope.case.end.data) + ' 23:59:59';
		console.log($scope.study.screen);
		caseService.getCaseListForMap($scope.study.screen, function(result) {
			// $scope.initData(result);
			$scope.study.showScreen = false;
			$scope.study.list = result.caseList;
			$scope.initMap($scope.study.list);
			// console.log(result);
		});
	};

	$scope.initMap = function(list) {
		console.log(list);
		for (var i = 0; i < list.length; i++) {
			if (list[i].longitude && list[i].latitiude) {
				var _data = {
					name: list[i].caseTime,
					longitude: list[i].longitude,
					latitude: list[i].latitiude,

				};
				$scope.peopleList.push(_data);
				$scope.refresh++;
			};
		};
	};

	$scope.change = function(data) {
		$scope.study.show = data;
	};
	$scope.go = function(data) {
		$state.go('studyCaseEntry', {
			item: {
				id: data.id
			}
		});
	};

	gather.getPoliceHouse(function(result) {
		$scope.team = result;
		$scope.team.unshift({
			"name": "全部派出所",
			"value": ""
		});
		$scope.study.team = $scope.team[0];
		$scope.case.Type = $scope.caseType[0];
		$scope.case.SubType = $scope.case.Type.subSet[0];

		$scope.refreshData();
	});
	$scope.caseInfo = function(info) {
		ngDialog.open({
			template: '/police_web/template/dialogs/searchCaseInfo.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search,Api,$filter) {
				console.log(info);
				$scope.caseInfo=info;
				$scope.caseInfo.UsedList = [];
				$scope.PeopleList = [];
				$scope.People = {};

				if($scope.caseInfo['ds_receiveddate']){
					$scope.caseInfo['ds_receiveddate'] = Api.formatDate('YYYY年MM月DD日 HH点mm分ss秒',$scope.caseInfo['ds_receiveddate'])
				};
				if($scope.caseInfo['ds_happendate']){
					$scope.caseInfo['ds_happendate'] = Api.formatDate('YYYY年MM月DD日 HH点mm分ss秒',$scope.caseInfo['ds_happendate'])
				}
				if ($scope.caseInfo['ds_caseposition']) {
					$scope.caseInfo['ds_caseposition'] = $scope.caseInfo['ds_caseposition'].split(':')[1];
				};
				if ($scope.caseInfo['ds_casestatus']) {
					switch ($scope.caseInfo['ds_casestatus']) {
						case 'False':
							$scope.caseInfo['ds_casestatus'] = '未结案';
							break;
						case 'True':
							$scope.caseInfo['ds_casestatus'] = '已结案';
							break;
					}
				};
				if ($scope.caseInfo['ds_police_ref-systemuserid']) {
					common.getPoliceByPoliceCRMId($scope.caseInfo['ds_police_ref-systemuserid'], function(result) {
						$scope.caseInfo.UsedList.push(result);
						console.log(result);

					})
				};
				if ($scope.caseInfo['ds_personlist']) {
					for (var i = 0; i < $scope.caseInfo['ds_personlist'].split(';').length; i++) {
						search.getPersonDetail($scope.caseInfo['ds_personlist'].split(';')[i], function(result) {
							console.log(result);
							$scope.PeopleList.push(result);
						})
					}
					$scope.lookpersonInfo=function(info){
						ngDialog.open({
							template: '/police_web/template/dialogs/searchCasePeopelInfo.html',	
							appendClassName: 'ngdialog-place',				
							controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search) {
								$scope.People={};
								$scope.People.detail=info;
							}
						})
					}
				};
			}
		})
	};

})