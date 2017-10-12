// point
controllers.controller('index.point', function($scope, $state, common, point, Api, ngDialog, getBase64ByFile, judes, user) {
	$scope.title = $scope.$parent.$parent.title = "重点人口";
	$scope.policeList = [];
	$scope.causeList = [];
	$scope.peopleList = [];
	$scope.endDate = '';
	$scope.isShow = false;
	var isPolice = false;
	var policehouse = [];

	$scope.stateGo = function(stateName) {
		$state.go(stateName);
	};
	$scope.formatDate = function(str) {
		return Api.formatDate('zh', str);
	}
	$scope.formatList = function(result) {
		for (var i = 0; i < result.length; i++) {
			var item = result[i];
			if (item['ds_regulatoryreason-ds_name'] == $scope.cause['ds_name']) {
				$scope.peopleList.push(item);
			}
		}

	};
	common.getPoliceHouse(function(result) {

		result.unshift({
			ds_name: '全部',
			ds_team: '1',
			id: '1',
		})
		$scope.policeList = result;
		$scope.policeHouse = result[0];
		console.log($scope.policeList);
		var pointType = '';
		if (isPolice) {
			pointType = 'getUsers';
		} else {
			pointType = 'getAll';
			$scope.isShow = true;
		};
		point.cause(function(result) {

			$scope.causeList = result;
			$scope.cause = result[0];
			point[pointType](function(result) {
				$scope.formatList(result);
				console.log(result);
				policehouse = result;
			});

		});

	});
	$scope.chooseEnd = function(item) {
		if (item['ds_team']) {
			$scope.peopleList = [];
			var pointType = '';
			if (item['ds_team'] == 1) {
				pointType = 'getAll';
				point[pointType](function(result) {
					$scope.formatList(result);
					policehouse = result;
				})
			} else {
				pointType = 'getTeams';
				point[pointType](item['ds_team'].replace(/team/g, ""), function(result) {
					$scope.formatList(result);
					policehouse = result;
				})
			}
		}
	};
	$scope.chooseFinish = function(item) {
		$scope.peopleList = [];
		for (var i = 0; i < policehouse.length; i++) {
			if (policehouse[i]['ds_regulatoryreason-ds_name'] == item['ds_name']) {
				$scope.peopleList.push(policehouse[i]);
			}
		}

	};


	$scope.newPoint = function() {
		ngDialog.open({
			template: '/police_web/template/dialogs/pointNewPop.html',
			controller: function($scope, $rootScope, common, point, Api, getBase64ByFile, judes, user, options) {
				$scope.options = {};
				$scope.options.name = '';
				$scope.options.idCard = '';
				$scope.options.phone = '';

				$scope.options.isCheck = true;
				$scope.options.signtype = 100000000;
				$scope.options.getScope = false;
				$scope.options.getCause = false;

				$scope.options.imageSrc = false;

				$scope.options.drugDangerType = '低危';
				$scope.options.visitgradeDangerType = '低危';

				$scope.options.drugDangerOption = [];
				$scope.options.drugDangerStr = '';
				$scope.options.visitgradeResultText = '';

				point.regulatoryScope(function(result) {
					$scope.regulatory = result;
					$scope.options.getScope = true;
					point.cause(function(result) {
						$scope.cause = result;
						$scope.options.getCause = true;
						options.get(['riskassessmenttype', 'riskassessment', 'visitgrade'], function(result) {
							$scope.options.optionSides = result;
							point.drugDangerOption(function(result) {
								$scope.options.drugDangerOption = result;

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
				$scope.updataImage = function(type, index) {
					document.getElementById('pointManageImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'pointManageImage',
						success: function(base64) {
							$scope.pointImageList = base64;
							$scope.options.imageSrc = base64.substring(23);
						},
						error: function(message) {
							Api.alert(message);
						},
					});
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
				$scope.submit = function() {
					if (!judes.isNull($scope.options.name)) {
						Api.alert('姓名不能为空');
						return;
					};
					if (!judes.isNull($scope.options.idCard)) {
						Api.alert('身份证不能为空');
						return;
					};
					if (!judes.isIdCard($scope.options.idCard)) {
						Api.alert('身份证输入错误');
						return;
					};
					if ($scope.formatData($scope.options.endTime) == 'error') {
						Api.alert('截止时间输入错误');
						return;
					};
					if (!judes.isPhone($scope.options.phone)) {
						Api.alert('手机号输入错误');
						return;
					};
					if ($scope.options.day > 28) {
						Api.alert('日期不能大于28');
						return;
					};
					if ($scope.options.isCheck && !$scope.formatData($scope.options.time) == 'error') {
						Api.alert('签到时间输入错误');
						return;
					};

					function getSignTime() {
						if ($scope.options.time instanceof Date) {
							var str = $scope.options.time.getHours() + ':' + $scope.options.time.getMinutes();
							return str;
						} else {
							return 'error';
						};
					};
					if ($scope.options.signTime == 'error') {
						Api.alert('签到时间输入错误');
						return;
					};
					if (!$scope.options.imageSrc) {
						Api.alert('请上传重点人口照片');
						return;
					};
					common.getPeopleId({
						name: $scope.options.name,
						idCard: $scope.options.idCard,
						isCreate: "true"
					}, function(result) {

						function CreatPeople(id) {
							var postData = {};
							postData.peopleId = result.personId;
							postData.peoplePhone = $scope.options.phone;
							postData.endDate = $scope.formatData($scope.options.endTime);
							postData.needSign = $scope.options.isCheck;
							postData.signType = $scope.options.signtype;
							postData.signTime = getSignTime();
							postData.signDate = $scope.options.day;
							postData.signWeek = $scope.options.week || '';
							postData.reason = $scope.options.regulatoryCause.id;
							postData.scope = $scope.options.regulatoryScope.id;
							postData.policeId = user.getUserMessage().policeCrmId;
							postData.ds_doc = '';
							postData.headPic = $scope.options.imageSrc;
							postData.riskassessmentId = id;
							console.log(postData);
							point.creat(postData, function(result) {
								Api.alert('创建成功');
								// $ionicHistory.goBack();
								$scope.closeThisDialog();
							});
						};

						if ($scope.options.regulatoryCause['ds_name'] == '涉毒') {
							var risData = {
								"name": "ds_riskassessment",
								"attributes": [{
									"name": "ds_risktype",
									"value": ""
								}, {
									"name": "ds_poisonitem",
									"value": ""
								}]
							};
							for (var i = 0; i < $scope.options.optionSides.riskassessmenttype.length; i++) {
								var _$item = $scope.options.optionSides.riskassessmenttype[i];
								if ($scope.options.regulatoryCause['ds_name'] == _$item.name) {
									risData.attributes[0].value = "@code/" + _$item.value;
								}
							}
							risData.attributes[1].value = $scope.options.drugDangerStr.substring(0, $scope.options.drugDangerStr.length - 1);
							point.creatRis(risData, function(result) {
								// console.log(result.value);
								CreatPeople(result.value);
							});
						} else if ($scope.options.regulatoryCause['ds_name'] == '信访') {
							var risData = {
								"name": "ds_riskassessment",
								"attributes": [{
									"name": "ds_risktype",
									"value": ""
								}, {
									"name": "ds_visitgrade",
									"value": ""
								}]
							};
							for (var i = 0; i < $scope.options.optionSides.riskassessmenttype.length; i++) {
								var _$item = $scope.options.optionSides.riskassessmenttype[i];
								if ($scope.options.regulatoryCause['ds_name'] == _$item.name) {
									risData.attributes[0].value = "@code/" + _$item.value;
								}
							}
							risData.attributes[1].value = "@code/" + $scope.options.visitgradeResult.value;
							point.creatRis(risData, function(result) {
								CreatPeople(result.value);
							});
						} else {
							CreatPeople('');
						}
					});
				};
				$scope.close = function() {
					$scope.closeThisDialog();
				}
			}
		})

	};
	$scope.resetPeople = function(id) {
		ngDialog.open({
			template: '/police_web/template/dialogs/pointEditPop.html',
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
												name: '重点人口',
												stateName: 'point',
											}, {
												name: '签到记录',
												stateName: 'pointNewReason',
												id: id,
												personName: resultDetail['ds_person-ds_name'],
												signtype: resultDetail['ds_signtype'].substring(0, 9),

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
				$scope.submit = function() {
					if (!judes.isNull($scope.options.name)) {
						Api.alert('姓名不能为空');
						return;
					};
					if (!judes.isNull($scope.options.idCard)) {
						Api.alert('身份证不能为空');
						return;
					};
					if (!judes.isIdCard($scope.options.idCard)) {
						Api.alert('身份证输入错误');
						return;
					};
					if ($scope.formatData($scope.options.endTime) == 'error') {
						Api.alert('截止时间输入错误');
						return;
					};
					if (!judes.isPhone($scope.options.phone)) {
						Api.alert('手机号输入错误');
						return;
					};
					if (judes.isNull($scope.options.idCard) && !judes.isNumber($scope.options.idCard)) {
						Api.alert('请输入1至28之间的数字');
						return;
					};
					if (judes.isNull($scope.options.idCard) && $scope.options.day > 28) {
						Api.alert('日期不能大于28');
						return;
					};
					if ($scope.options.isCheck && !$scope.formatData($scope.options.time) == 'error') {
						Api.alert('签到时间输入错误');
						return;
					};

					if ($scope.options.signTime == 'error') {
						Api.alert('签到时间输入错误');
						return;
					};

					var postData = {
						"attributes": [{
								"name": "ds_enddate",
								"value": "@dt/" + $scope.options.endTime
							}, {
								"name": "ds_needsignin",
								"value": "@b/" + $scope.options.isCheck
							},


						]
					};
					if (judes.isNull($scope.options.riskassessmentid)) {
						postData.attributes.push({
							"name": "ds_riskassessment_ref",
							"value": "@look/" + $scope.options.riskassessmentid
						})

					};
					if (judes.isNull($scope.options.time)) {
						var time = Api.formatDate('HH:mm', $scope.options.time);
						// Api.formatData('HH:mm',$scope.options.time);   @dt/23:00
						postData.attributes.push({
							"name": "ds_signtime",
							"value": time
						})
					};

					if (judes.isNull($scope.options.signtype)) {
						postData.attributes.push({
							"name": "ds_signtype",
							"value": "@code/" + $scope.options.signtype
						})
						if ($scope.options.signtype == 100000000) {
							if (judes.isNull($scope.options.day)) {
								postData.attributes.push({
									"name": "ds_signdate",
									"value": $scope.options.day
								})
							};
						} else if ($scope.options.signtype == 100000001) {
							if (judes.isNull($scope.options.week)) {
								postData.attributes.push({
									"name": "ds_signweek",
									"value": $scope.options.week
								})
							};
						}
					};
					if (judes.isNull($scope.options.regulatoryCause)) {
						postData.attributes.push({
							"name": "ds_regulatoryreason",
							"value": "@look/" + $scope.options.regulatoryCause.id
						})
					};
					if (judes.isNull($scope.options.regulatoryScope)) {
						postData.attributes.push({
							"name": "ds_regulatoryscope",
							"value": "@look/" + $scope.options.regulatoryScope.id
						})
					};
					console.log(postData);
					point.resetPeople(id, postData, function(result) {
						Api.alert('修改成功');
						$scope.closeThisDialog();
					});
				};
			}
		})
	};
});
controllers.controller('index.pointNewReason', function($scope, ngDialog, getBase64ByFile, Api, point, judes, user, $stateParams) {
	$scope.title = $scope.$parent.$parent.title = "签到记录";
	$scope.fromJudge='';
	if(Api.Storage.get('crumbs')[2]){
		$scope.id = Api.Storage.get('crumbs')[2].id;
		$scope.personName = Api.Storage.get('crumbs')[2].personName;
		$scope.signtype = Api.Storage.get('crumbs')[2].signtype;
		$scope.fromJudge=3;
	}else{
		$scope.id = Api.Storage.get('crumbs')[1].id;
		$scope.personName = Api.Storage.get('crumbs')[1].personName;
		$scope.signtype = Api.Storage.get('crumbs')[1].signtype;
		$scope.fromJudge=2;
	}
		
	$scope.options = {};
	$scope.refresh = 0;
	$scope.peopleList = [];
	$scope.yearArray = [];
	$scope.monthArray = [];
	$scope.date = new Date;
	$scope.year = Api.formatDate('yyyy', $scope.date);
	$scope.month = Api.formatDate('M', $scope.date);

	for (var i = $scope.year; i >= 2010; i--) {

		$scope.yearArray.push(i);	
	};
	$scope.options.year = $scope.yearArray[0]
	for (var i = 1; i <= 12; i++) {
		$scope.monthArray.push(i);
	};
	$scope.options.month = $scope.monthArray[parseInt($scope.month) - 1];


	$scope.getMonth = function() {
		point.getSignBym($scope.id, $scope.options.year, $scope.options.month,function(result) {
			console.log(result);
			$scope.peopleList = [];

			if (result.ds_day != '') {
				result.ds_day = result.ds_day.split(',');
				result.ds_latandlon = result.ds_latandlon.split(',');
				for (var a = 0; a < result.ds_day.length; a++) {
					var days = result.ds_day[a];
					for (var i = 0; i < result.ds_latandlon.length; i++) {
						var data = {};
						var item = result.ds_latandlon[i];

						item = item.split('|');
						data.longitude = item[0];
						data.latitude = item[1];
						data.name = $scope.personName;
						data.day = days;
						data.month = result.ds_month;
						data.year = result.ds_year;
						$scope.peopleList.push(data);
					}
				}

			} else {
				Api.alert('没有签到记录');
			}

			$scope.refresh++;
		});
	};
	$scope.getYear = function() {
		point.getSignByY($scope.id, $scope.options.year , function(result) {
			console.log(result);
			$scope.peopleList = [];

			if (result.ds_day != '') {
				result.ds_day = result.ds_day.split(',');
				result.ds_latandlon = result.ds_latandlon.split(',');
				for (var a = 0; a < result.ds_day.length; a++) {
					var days = result.ds_day[a];
					for (var i = 0; i < result.ds_latandlon.length; i++) {
						var data = {};
						var item = result.ds_latandlon[i];

						item = item.split('|');
						data.longitude = item[0];
						data.latitude = item[1];
						data.name = $scope.personName;
						data.day = days;
						data.month = result.ds_month;
						data.year = result.ds_year;
						$scope.peopleList.push(data);
					}
				}

			} else {
				Api.alert('没有签到记录');
			}

			$scope.refresh++;

		})
	};

	if ($scope.signtype == '100000002' || $scope.signtype == '100000001') {
		$scope.getMonth();

	} else if ($scope.signtype == '100000000') {
		$scope.getYear();

	};


});