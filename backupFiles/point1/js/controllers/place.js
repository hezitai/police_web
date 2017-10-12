controllers.controller('index.place', function($scope, $state, Api) {
	$scope.title = $scope.$parent.$parent.title = "实有房屋信息";
	angular.element('.TreeBox').css('width', parseInt(angular.element('.main').css('width')) - 266);
	$scope.getPlace = function() {
		var id = '';
		if ($scope.value4 != '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value4;
		} else if ($scope.value4 == '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value3;
		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value2;
		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 == '1' && $scope.value1 != '1') {
			id = $scope.value1;
		} else {
			Api.popUp.alert('请选择地址树信息');
			return;
		}
		Api.Storage.set('crumbs', [{
			name: '实有房屋信息',
			stateName: 'place',
		}, {
			name: '实有房屋列表',
			stateName: 'placeList',
			message: {
				'value1': $scope.value1,
				'value2': $scope.value2,
				'value3': $scope.value3,
				'value4': $scope.value4,
				'treeMessage': $scope.treeMessage,
			}
		}]);
		$state.go('index.placeList', {
			'value1': $scope.value1,
			'value2': $scope.value2,
			'value3': $scope.value3,
			'value4': $scope.value4,
			'treeMessage': $scope.treeMessage,
		});
	}
	$scope.placeTypeArray = [{
		name: '全部',
	}, {
		name: '行业场所',
	}, {
		name: '出租房屋',
	}, {
		name: '自有房屋',
	}]
});
controllers.controller('index.placeList', function($scope, $state, Api) {
	$scope.title = $scope.$parent.$parent.title = "实有房屋信息";
	angular.element('.TreeBox').css('width', parseInt(angular.element('.main').css('width')) - 266);
	var crumbs = Api.Storage.get('crumbs');
	$scope.treeMessage = null;
	if (crumbs != null) {
		$scope.treeMessage = crumbs[1].message.treeMessage;
		$scope.value1 = crumbs[1].message.value1;
		$scope.value2 = crumbs[1].message.value2;
		$scope.value3 = crumbs[1].message.value3;
		$scope.value4 = crumbs[1].message.value4;
	};
	$scope.getPlace = function() {
		var id = '';
		if ($scope.value4 != '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value4;
		} else if ($scope.value4 == '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value3;
		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 != '1' && $scope.value1 != '1') {
			id = $scope.value2;
		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 == '1' && $scope.value1 != '1') {
			id = $scope.value1;
		} else {
			Api.popUp.alert('请选择地址树信息');
			return;
		}
	};
	$scope.GoPlaceDetail = function(name, id, isControl) {
		Api.Storage.set('crumbs', [{
			name: '实有房屋信息',
			stateName: 'place',
		}, {
			name: '实有房屋列表',
			stateName: 'placeList',
			message: {
				'value1': $scope.value1,
				'value2': $scope.value2,
				'value3': $scope.value3,
				'value4': $scope.value4,
				'treeMessage': $scope.treeMessage,
			}
		}, {
			name: name,
			stateName: 'placeDetail',
			id: 'c0191a1a-40b5-e611-80c8-001c42a95adf',
			isControl: isControl,
		}]);
		$state.go('index.placeDetail');
	}
	$scope.placeTypeArray = [{
		name: '全部',
	}, {
		name: '行业场所',
	}, {
		name: '出租房屋',
	}, {
		name: '自有房屋',
	}]

});
controllers.controller('index.placeDetail', function($scope, $state, place, Api, ngDialog, download, checkType, optionSites) {
	$scope.title = $scope.$parent.$parent.title = "实有房屋信息";
	var crumbs = Api.Storage.get('crumbs');
	var id = crumbs[2].id;
	$scope.placeMessage = {};
	$scope.documentNames = place.getDocumentNames();
	$scope.isControl = crumbs[2].isControl;
	var placeMessage = {};
	var initPage = function(id) {
		place.getPlaceDetail(id, function(data) {
			$scope.placeMessage = data;
			placeMessage = data;
			place.getPlaceDocument(id, function(data) {
				$scope.placeDocuments = data;
			});
		});
	};
	initPage(id);
	$scope.$on('placeDetail.initPage', function() {
		initPage(id);
	});
	$scope.lookDocuments = function(itemType, crmId) {
		if (itemType.type == 'image') {
			place.getPlaceDocumentByCrmID(crmId, function(data) {
				var subId = data.ds_stub;
				place.getPlaceDocumentByID(subId, function(data) {
					if (data.status == 0) {
						ngDialog.open({
							template: '/manage/template/dialogs/documents.html',
							appendClassName: 'ngdialog-place',
							controller: function($scope, Api, $rootScope) {
								$scope.message = itemType;
								$scope.message.Url = data.resultObj.fileTempPath;
								$scope.message.crmId = crmId;
								$scope.message.subId = subId;
								$scope.isControl = crumbs[2].isControl;
								console.log($scope.isControl);
								$scope.delete = function() {
									Api.popUp.checked('是否删除这个文件?', function() {
										console.log('delete');
										place.deleteDocument($scope.message.subId, $scope.message.crmId, function() {
											$scope.closeThisDialog();
											Api.popUp.alert('删除成功');
											$rootScope.$broadcast('placeDetail.initPage');
										}, function() {
											$scope.closeThisDialog();
											$rootScope.$broadcast('placeDetail.initPage');
										})
									});
								};
								$scope.download = function() {
									download.image($scope.message.Url + '?' + (new Date().getTime()));
								};
								$scope.updata = function() {
									$('#updataDocument').clearFields();
									angular.element('#updataDocument').click();
								};

								$scope.fileChange = function() {
									var oFile = angular.element('#updataDocument')[0].files[0];
									var oReader = new FileReader();
									oReader.onload = function(e) {
										var _image = document.createElement('img');
										_image.src = e.target.result;
										_image.onload = function() {
											var that = _image;
											var w = that.width,
												h = that.height,
												scale = w / h;
											w = 640;
											h = w / scale;
											var canvas = document.createElement('canvas');
											var ctx = canvas.getContext('2d');
											$(canvas).attr({
												width: w,
												height: h
											});
											ctx.drawImage(that, 0, 0, w, h);
											var base64 = canvas.toDataURL('image/jpeg', 0.6);
											Api.popUp.checked('是否上传图片?', function() {
												place.updataDocument({
													id: crumbs[2].id,
													crmId: $scope.message.crmId,
													src: base64,
													type: 'Updata',
													fileType: ".jpeg",
													kind: $scope.message.value,
													fileName: $scope.message.name,
												}, function(_url) {
													Api.popUp.alert('上传成功');
													$('#updataDocument').clearFields();
													$scope.message.Url = _url;
												});
											}, function() {
												$('#updataDocument').clearFields();
											})

										};
									};
									oReader.readAsDataURL(oFile);
								}
							},
						});
					} else {
						Api.popUp.alert(data.message);
					}
				});
			});
		} else if (itemType.type == 'doc') {
			place.getPlaceDocumentByCrmID(crmId, function(data) {
				var subId = data.ds_stub;
				place.getPlaceDocumentByID(subId, function(data) {
					if (data.status == 0) {
						ngDialog.open({
							template: '/manage/template/dialogs/documents.html',
							appendClassName: 'ngdialog-place',
							controller: function($scope, Api, $rootScope) {
								$scope.message = itemType;
								$scope.message.Url = data.resultObj.fileTempPath;
								$scope.message.crmId = crmId;
								$scope.message.subId = subId;
								$scope.isControl = crumbs[2].isControl;
								$scope.delete = function() {
									Api.popUp.checked('是否删除这个文件?', function() {
										console.log('delete');
										place.deleteDocument($scope.message.subId, $scope.message.crmId, function() {
											$scope.closeThisDialog();
											Api.popUp.alert('删除成功');
											$rootScope.$broadcast('placeDetail.initPage');
										}, function() {
											$scope.closeThisDialog();
											$rootScope.$broadcast('placeDetail.initPage');
										})
									});
								};
								$scope.download = function() {
									console.log($scope.message.Url);
									download.doc($scope.message.Url);
								}
								$scope.updata = function() {
									$('#updataDocument').clearFields();
									angular.element('#updataDocument').click();
								};
								$scope.fileChange = function() {
									var oFile = angular.element('#updataDocument')[0].files[0];
									var oReader = new FileReader();
									oReader.onload = function(e) {
										Api.popUp.checked('是否上传文档?', function() {
											place.updataDocument({
												id: crumbs[2].id,
												crmId: $scope.message.crmId,
												src: e.target.result,
												type: 'Updata',
												fileType: ".doc",
												kind: $scope.message.value,
												fileName: $scope.message.name,
											}, function(_url) {
												Api.popUp.alert('上传成功');
												$('#updataDocument').clearFields();
												$scope.message.Url = _url;
											});
										}, function() {
											$('#updataDocument').clearFields();
										})
									};
									oReader.readAsDataURL(oFile);
								}
							},
						});
					} else {
						Api.popUp.alert(data.message);
					}
				});
			});
		} else if (itemType.type == 'recreation') {
			place.getRecreation(crumbs[2].id, function(data) {
				ngDialog.open({
					template: '/manage/template/dialogs/documents.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope) {
						$scope.message = itemType;
						$scope.message.placeMessage = placeMessage;
						$scope.message.detail = data;
					},
				});
			});
		} else if (itemType.type == 'videocamera') {
			place.getVideocamera(crumbs[2].id, function(data) {
				ngDialog.open({
					template: '/manage/template/dialogs/documents.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope) {
						$scope.message = itemType;
						$scope.message.detail = data;
						$scope.message.placeMessage = placeMessage;
					},
				});
			});
		} else if (itemType.type == 'floorPlans') {
			place.getFloorPlansList(crumbs[2].id, function(data) {
				ngDialog.open({
					template: '/manage/template/dialogs/documents.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope) {
						$scope.message = itemType;
						$scope.message.detail = data;
						console.log(data);
						$scope.lookDocuments = function(id) {
							place.getPlaceDocumentByID(id, function(data) {
								download.image(data.resultObj.fileTempPath);
							});
						};
					},
				});
			});
		} else if (itemType.type == 'owner') {
			place.getOwnerMessage(crumbs[2].id, function(data) {
				var detail = data;
				place.getPeopleBackground(data['ds_owner_ref-ds_personid'], function(data) {
					ngDialog.open({
						template: '/manage/template/dialogs/documents.html',
						appendClassName: 'ngdialog-place',
						controller: function($scope) {
							$scope.message = itemType;
							$scope.message.detail = detail;
							$scope.message.backgrounds = data;
							console.log(detail);
							$scope.lookDocuments = function(id) {
								console.log(id);
								place.getPlaceDocumentByID(id, function(data) {
									download.image(data.resultObj.fileTempPath);
								});
							};
						},
					});
				});
			});
		} else if (itemType.type == 'security') {
			place.getSecurityMessage(crumbs[2].id, function(data) {
				var detail = data;
				place.getPeopleBackground(data['ds_securityowner_ref-ds_personid'], function(data) {
					ngDialog.open({
						template: '/manage/template/dialogs/documents.html',
						appendClassName: 'ngdialog-place',
						controller: function($scope) {
							$scope.message = itemType;
							$scope.message.detail = detail;
							$scope.message.backgrounds = data;
							console.log(detail);
							$scope.lookDocuments = function(id) {
								console.log(id);
								place.getPlaceDocumentByID(id, function(data) {
									download.image(data.resultObj.fileTempPath);
								});
							};
						},
					});
				});
			});
		} else if (itemType.type == 'otherpeople') {
			place.getOtherPeopleMessage(crumbs[2].id, function(data) {
				ngDialog.open({
					template: '/manage/template/dialogs/documents.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope) {
						$scope.message = itemType;
						$scope.message.detail = data;
						console.log(data);
						for (var i = 0; i < $scope.message.detail.length; i++) {
							var item = $scope.message.detail[i];
							item.isActive = false;
						};
						$scope.lookPeoples = function(item) {
							place.getPeopleByEmployeeId(item['ds_publicorder_employeeid'], function(data) {
								for (var i = 0; i < $scope.message.detail.length; i++) {
									$scope.message.detail[i].isActive = false;
								};
								item.isActive = true;
								$scope.message.peopleMessage = data;
							});
						};
						$scope.lookDocuments = function(id) {
							console.log(id);
							place.getPlaceDocumentByID(id, function(data) {
								download.image(data.resultObj.fileTempPath);
							});
						}
					},
				});
			});
		}
	};
	$scope.isShowPenaltyRoReward = false;
	$scope.showPenaltyRoReward = function(e) {
		e.stopPropagation();
		$scope.isShowPenaltyRoReward = !$scope.isShowPenaltyRoReward;
	};
	$scope.hidePenaltyRoReward = function(e) {
		e.stopPropagation();
		$scope.isShowPenaltyRoReward = false;
	};
	angular.element('body').click(function(e) {
		$scope.$apply(function() {
			$scope.hidePenaltyRoReward(e);
		})
	});
	$scope.penalty = function() {
		optionSites.publicExam(function(data) {
			console.log(data);
			ngDialog.open({
				template: '/manage/template/dialogs/Penalty.html',
				appendClassName: 'ngdialog-place',
				controller: function($scope) {
					$scope.message = {};
					$scope.penaltyType = data;
					$scope.selectType = "1";
					$scope.options = [];

					// 格式化 select 验证数据
					for (var i = 0; i < $scope.penaltyType.length; i++) {
						$scope.options.push($scope.penaltyType[i].value);
					};
					$scope.options.push("1");
					$scope.inArray = function(value) {
						if ($.inArray(value, $scope.options) != -1) {
							return true;
						} else {
							return false;
						}
					};
					// select 基础数据调用常量
					$scope.updataType = {
						"100000007": {
							'name': '消防检查',
							'value': '100000007',
							'key': 'fire',
						},
						"100000006": {
							'name': "其他情况",
							'value': '100000006',
							'key': 'other',
						},
						"100000005": {
							'name': "检查从业人员",
							'value': '100000005',
							'key': 'employed',
						},
						"100000004": {
							'name': "盗窃案件",
							'value': '100000004',
							'key': 'theft',
						},
						"100000003": {
							'name': "寻衅滋事、殴打",
							'value': '100000003',
							'key': 'beating',
						},
						"100000002": {
							'name': "吸毒（贩毒）",
							'value': '100000002',
							'key': 'DrugUse',
						},
						"100000001": {
							'name': "赌博",
							'value': '100000001',
							'key': 'gambling',
						},
						"100000000": {
							'name': "卖淫嫖娼",
							'value': '100000000',
							'key': 'prostitution',
						},
					}
					$scope.cancel = function () {
						$scope.closeThisDialog();
					};

					// 验证人员信息完整性
					$scope.creatPenalty = function() {
						// 判断条件是否完整 (人员部分)
						var peopleElement = angular.element('.peoples');
						var isComplete = false;
						peopleElement.find('.warning').each(function(){
							if ($(this).css('display') == 'block') {
								isComplete = true;
							};
						});
						if (isComplete) {
							Api.popUp.alert('人员信息未填写完整或不正确,请检查');
							// console.log('检查未通过 ');
							return;
						} else {
							$scope.creatPenalty[$scope.updataType[$scope.selectType].key]();
						};						
					};
					// 检查从业人员 及 接口调用
					$scope.creatPenalty.employed = function () {
						console.log($scope.message.people);

						

					};
				},
			});
		});
	};



});