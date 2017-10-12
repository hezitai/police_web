// search
controllers.controller('index.search', function($scope,search,$state,Api,judes,ngDialog,public) {
	$scope.title = $scope.$parent.$parent.title = "信息查询";

	$scope.search={};
	$scope.search.choosetype=0;
	$scope.search.dimSearch=true;
	$scope.search.list = [];
	$scope.search.text = '';

	$scope.submit = function() {

		if (!judes.isNull($scope.search.text)) {
			
			Api.alert( '请填写查询关键字');

			return;
		};
		if ($scope.search.dimSearch == true) {
			if ($scope.search.choosetype==0) {
				
				search.personSearchDim($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						$scope.peopleInfo = function(id) {
							Api.Storage.set('crumbs', [{
								name:'信息查询',
								stateName: 'search',
								searchtext: $scope.search.text,
								searchtype: true,
								choosetype: 0,
								time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
							},{
								name:'人员信息',
								stateName:'searchPeopleInfo',
								item:id
							}]);										
							$state.go('index.searchPeopleInfo');
						};
					}
				});
			}else if($scope.search.choosetype==1){
				search.carSearchDim($scope.search.text, function(result) {
					$scope.search.list=[];
					console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						$scope.carInfo = function(info) {
							ngDialog.open({
								template: '/police_web/template/dialogs/searchCarInfo.html',	
								appendClassName: 'ngdialog-place',				
								controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search) {
									$scope.carInfo=info;
									// console.log(info);
									$scope.driver = {};
									$scope.master = {};
									$scope.picture = [];
									$scope.img = [];

									if (info['ds_driver-ds_personid']) {
										search.getPersonDetail(info['ds_driver-ds_personid'], function(result) {
											$scope.driver = result;										
										})
									};
									if (info['ds_person-ds_personid']) {
										search.getPersonDetail(info['ds_person-ds_personid'], function(result) {
											$scope.master = result;
											// console.log($scope.master);
										})
									};

									if (info['ds_picstubidarray']) {
										$scope.picture = info['ds_picstubidarray'].split(';');
										$scope.getPictrue=function(){
											if($scope.picture.length!=0){
												var imgid={
													id:$scope.picture.pop(),
												};
												common.getSub(imgid.id, function(result) {
													$scope.img.push(result);
													// console.log($scope.img);
													$scope.getPictrue();
												})
											}
											
										};
										$scope.getPictrue();
									};
									$scope.changePic=function($event){  
								        var img=$event.srcElement || $event.target;  
								        angular.element("#bigimage")[0].src=img.src;  
								        angular.element("#js-imgview")[0].style.display="block";  
								        angular.element("#js-imgview-mask")[0].style.display="block";  
								    }  
								  //点击图片时放小显示图片  
								    $scope.closePic =function(){  
								        angular.element("#js-imgview")[0].style.display="none";  
								        angular.element("#js-imgview-mask")[0].style.display="none";  
								          
								    }  
									
								}
							})
						};
					}
				});
			}else if($scope.search.choosetype==2){
				search.caseSearchDim($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						$scope.caseInfo = function(info) {
							ngDialog.open({
								template: '/police_web/template/dialogs/searchCaseInfo.html',	
								appendClassName: 'ngdialog-place',				
								controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search,Api,$filter) {
									// console.log(info);
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
											// console.log(result);

										})
									};
									if ($scope.caseInfo['ds_personlist']) {
										for (var i = 0; i < $scope.caseInfo['ds_personlist'].split(';').length; i++) {
											search.getPersonDetail($scope.caseInfo['ds_personlist'].split(';')[i], function(result) {
												console.log(result);
												$scope.PeopleList.push(result);
											})
										};
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
					}
				});
			}else if($scope.search.choosetype==3){
				search.publicSearchDim($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {

						Api.alert( '暂未找到相关信息');

						return;
					} else {
						$scope.search.list = result;
						$scope.go = function(data) {
							console.log(data);
							Api.Storage.set('crumbs', [{
								name:'信息查询',
								stateName: 'search',
								searchtext: $scope.search.text,
								searchtype: true,
								choosetype: 3,
								time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
							}, {
								name:data['ds_name'],
								stateName:'placeDetail',
								id: data['ds_publicorderid'],
								type: data['ds_businesskind'].split(":")[0],
								fromSearch:true,
							}]);
							$state.go('index.placeDetail'); 
						};
					}
				});
			}else if($scope.search.choosetype==4){
				search.houseSearchDim($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						console.log(result);

						$scope.houseInfo=function(info){
							// console.log(info);
							var houseId=info.ds_realhouseid;
							var data={ 
							  	"commonStr": houseId
							};
							search.houseJudge(data,function(Result){
								console.log(Result);
								if(judes.isNull(Result.businesskind) && Result.businesskind=='100000017'){
									Api.Storage.set('crumbs', [{
										name:'信息查询',
										stateName: 'search',
										searchtext: $scope.search.text,
										searchtype: true,
										choosetype: 4,
										time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
									},{
										name:'房屋信息',
										stateName:'searchCollegeInfo',
										item:info,
										message:Result
									}]);										
									$state.go('index.searchCollegeInfo');
									
								}else{
									Api.Storage.set('crumbs', [{
										name:'信息查询',
										stateName: 'search',
										searchtext: $scope.search.text,
										searchtype: true,
										choosetype: 4,
										time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
									},{
										name:'房屋信息',
										stateName:'searchHouseInfo',
										item:info
									}]);										
									$state.go('index.searchHouseInfo');
								}
							})
							
						}
					}
				});
			}		
	
		} else if ($scope.search.dimSearch == false) {
			if ($scope.search.choosetype==0) {
				
					search.personSearchPrecise($scope.search.text, function(result) {
						$scope.search.list=[];
						// console.log(result);
						if (result.length == 0 || !judes.isNull(result)) {
							Api.alert( '暂未找到相关信息');
							return;
						} else {
							$scope.search.list = result;
							$scope.peopleInfo = function(id) {
								Api.Storage.set('crumbs', [{
									name:'信息查询',
									stateName: 'search',
									searchtext: $scope.search.text,
									searchtype: false,
									choosetype: 0,
									time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
								},{
									name:'人员信息',
									stateName:'searchPeopleInfo',
									item:id
								}]);										
								$state.go('index.searchPeopleInfo');
							};
						}
					})
			}else if($scope.search.choosetype==1){
				search.carSearchPrecise($scope.search.text, function(result) {
						$scope.search.list=[];
						console.log(result);
						if (result.length == 0 || !judes.isNull(result)) {
							Api.alert( '暂未找到相关信息');
							return;
						} else {
							$scope.search.list = result;
							$scope.carInfo = function(info) {
								ngDialog.open({
									template: '/police_web/template/dialogs/searchCarInfo.html',	
									appendClassName: 'ngdialog-place',				
									controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search) {
										$scope.carInfo=info;
										console.log(info);
										$scope.driver = {};
										$scope.master = {};
										$scope.picture = [];
										$scope.img = [];

										if (info['ds_driver-ds_personid']) {
											search.getPersonDetail(info['ds_driver-ds_personid'], function(result) {
												$scope.driver = result;										
											})
										};
										if (info['ds_person-ds_personid']) {
											search.getPersonDetail(info['ds_person-ds_personid'], function(result) {
												$scope.master = result;
												// console.log($scope.master);
											})
										};

										if (info['ds_picstubidarray']) {
											$scope.picture = info['ds_picstubidarray'].split(';');
											$scope.getPictrue=function(){
												if($scope.picture.length!=0){
													var imgid={
														id:$scope.picture.pop(),
													};
													common.getSub(imgid.id, function(result) {
														$scope.img.push(result);
														console.log($scope.img);
														$scope.getPictrue();
													})
												}
												
											};
											$scope.getPictrue();
										};
										$scope.changePic=function($event){  
									        var img=$event.srcElement || $event.target;  
									        angular.element("#bigimage")[0].src=img.src;  
									        angular.element("#js-imgview")[0].style.display="block";  
									        angular.element("#js-imgview-mask")[0].style.display="block";  
									    }  
									  //点击图片时放小显示图片  
									    $scope.closePic =function(){  
									        angular.element("#js-imgview")[0].style.display="none";  
									        angular.element("#js-imgview-mask")[0].style.display="none";  
									          
									    }  
										
									}
								})
							};
						}
					})
			}else if($scope.search.choosetype==2){
				search.caseSearchPrecise($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
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
					}
				})
			}else if($scope.search.choosetype==3){
				search.publicSearchPrecise($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						$scope.go = function(data) {
							// console.log(data);
							Api.Storage.set('crumbs', [{
								name:'信息查询',
								stateName: 'search',
								searchtext: $scope.search.text,
								searchtype: false,
								choosetype: 3,
								time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
							}, {
								name:data['ds_name'],
								stateName:'placeDetail',
								id: data['ds_publicorderid'],
								type: data['ds_businesskind'].split(":")[0],
								fromSearch:true,
							}]);
							$state.go('index.placeDetail'); 
						};
					}
				});
			}else if($scope.search.choosetype==4){
				search.houseSearchPrecise($scope.search.text, function(result) {
					$scope.search.list=[];
					// console.log(result);
					if (result.length == 0 || !judes.isNull(result)) {
						Api.alert( '暂未找到相关信息');
						return;
					} else {
						$scope.search.list = result;
						$scope.houseInfo=function(info){
							Api.Storage.set('crumbs', [{
								name:'信息查询',
								stateName: 'search',
								searchtext: $scope.search.text,
								searchtype: false,
								choosetype: 4,
								time: parseInt(Api.formatDate('z')) + 1000*60*60*24,
							},{
								name:'房屋信息',
								stateName:'searchHouseInfo',
								item:info
							}]);										
							$state.go('index.searchHouseInfo');
						}
					}
				});
			}									
		};
	};

	var crumbs = Api.Storage.get('crumbs');
	if(judes.isNull(crumbs)){
		var now = Api.formatDate('Z');
		if(now < crumbs[0].time){
			$scope.search.dimSearch = crumbs[0].searchtype;
			$scope.search.text = crumbs[0].searchtext;
			$scope.search.choosetype = crumbs[0].choosetype;
			$scope.submit();
		}		
	};
});
controllers.controller('index.searchPeopleInfo', function($scope,search,$state,Api,judes,$stateParams,$filter,options,common,ngDialog) {
		
	var crumbs = Api.Storage.get('crumbs');
	// console.log(crumbs);
	if(crumbs[2]&&crumbs[2].fromPublic){
		$('.daohang').attr('usedlevel',3);
		$scope.personId = crumbs[2].item;	
		
	}else{
		$scope.personId = crumbs[1].item;
	}
	console.log($scope.personId);
	$scope.options = {};
	$scope.detail = {};
	$scope.detail.person = {};
	$scope.detail.house = [];
	$scope.detail.car = [];
	$scope.detail.case = [];
	$scope.detail.haveHouse = false;
	$scope.detail.haveCar = false;
	$scope.detail.haveCase = false;

	function initSelect(value, scopeData, options) {
		if (value) {
			$scope.detail.person[scopeData] = value.split(':')[0];
			// console.log( $scope.detail.person[scopeData]);
			// console.log( $scope.options[options]);
			for (var i = 0; i < $scope.options[options].length; i++) {
				if ($scope.options[options][i].value == $scope.detail.person[scopeData]) {
					$scope.detail.person[scopeData] = $scope.options[options][i].name;
				}
			}
		} else {
			$scope.detail.person[scopeData] = '';
		};
	};

	options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage', 'houseusertype'], function(Result) {
		$scope.options = angular.copy(Result);

		search.getPersonDetail($scope.personId, function(result) {
			// console.log(result);
			$scope.detail.person = result;

			//性别
			if (judes.isNull($scope.detail.person.ds_gender)) {
				$scope.detail.person.sex = $scope.detail.person.ds_gender;
			} else {
				if (judes.isIdCard($scope.detail.person.ds_id)) {
					$scope.detail.person.sex = $filter('idCardNum')($scope.detail.person.ds_id, 'sex') == '1' ? '男' : '女';
				} else {
					$scope.detail.person.sex = '';
				}
			};
			//生日
			if (judes.isNull($scope.detail.person.ds_birth)) {
				$scope.detail.person.birth = $scope.detail.person.ds_birth;
			} else {
				if (judes.isIdCard($scope.detail.person.ds_id)) {
					$scope.detail.person.birth = $filter('idCardNum')($scope.detail.person.ds_id, 'birth');
				} else {
					$scope.detail.person.birth = '';
				}
			};
			//optionset
			initSelect(result.ds_account, 'ds_account', 'familyregister');
			initSelect(result.ds_education, 'ds_education', 'education');
			initSelect(result.ds_nation, 'ds_nation', 'nation');
			initSelect(result.ds_marriage, 'ds_marriage', 'marriage');
			initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype');

			//身份证正反面
			if (judes.isNull($scope.detail.person.ds_idaheadpic)) {
				common.getSub($scope.detail.person.ds_idaheadpic, function(result) {
					$scope.detail.person.headimg = result;
				})
			};
			if (judes.isNull($scope.detail.person.ds_idbackpic)) {
				common.getSub($scope.detail.person.ds_idbackpic, function(result) {
					$scope.detail.person.backimg = result;
				})
			}
		});
		search.getPersonHouse($scope.personId, function(result) {
			console.log(result);
			if (judes.isNull(result)) {
				for (var i = 0; i < result.length; i++) {

					for (var a = 0; a < $scope.options['houseusertype'].length; a++) {
						if ($scope.options['houseusertype'][a].value == result[i].ds_kind) {
							result[i].ds_kind = $scope.options['houseusertype'][a].name;
						}
					};

					result[i].lesseeList = [];
					if (result[i].ds_kind == '出租' || result[i].ds_kind == '日租') {

						search.getHousePeopel(result[i], function(data, result) {
							console.log(data);
							for (var j = 0; j < data.length; j++) {
								if (data[j].ds_liveway.split(':')[0] == '100000002') {
									var lessee = {};
									lessee.lesseeName = data[j]['ds_person_ref-ds_name'];
									lessee.lesseeIdNum = data[j]['ds_person_ref-ds_id'];
									lessee.lesseeid = data[j]['ds_person_ref-ds_personid'];
									result.lesseeList.push(lessee);
								}
							};
							$scope.detail.house.push(result);
							$scope.peopleInfo = function(info) {
								ngDialog.open({
									template: '/police_web/template/dialogs/searchLesseeaInfo.html',	
									appendClassName: 'ngdialog-place',				
									controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search,Api,$filter) {
										$scope.detail={};

										function initSelect(value, scopeData, options) {
											if (value) {
												$scope.detail[scopeData] = value.split(':')[0];
												// console.log( $scope.detail.person[scopeData]);
												// console.log( $scope.options[options]);
												for (var i = 0; i < $scope.options[options].length; i++) {
													if ($scope.options[options][i].value == $scope.detail[scopeData]) {
														$scope.detail[scopeData] = $scope.options[options][i].name;
													}
												}
											} else {
												$scope.detail[scopeData] = '';
											};
										};

										options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage', 'houseusertype'], function(Result) {
											$scope.options = angular.copy(Result);

											search.getPersonDetail(info.lesseeid,function(result){
												$scope.detail=result;
												
												//性别
												if (judes.isNull($scope.detail.ds_gender)) {
													$scope.detail.sex = $scope.detail.ds_gender;
												} else {
													if (judes.isIdCard($scope.detail.ds_id)) {
														$scope.detail.sex = $filter('idCardNum')($scope.detail.ds_id, 'sex') == '1' ? '男' : '女';
													} else {
														$scope.detail.sex = '';
													}
												};
												//生日
												if (judes.isNull($scope.detail.ds_birth)) {
													$scope.detail.birth = $scope.detail.ds_birth;
												} else {
													if (judes.isIdCard($scope.detail.ds_id)) {
														$scope.detail.birth = $filter('idCardNum')($scope.detail.ds_id, 'birth');
													} else {
														$scope.detail.birth = '';
													}
												};
												//照片
												$scope.detail.aheadpic = result.ds_idaheadpic ?'身份证照片.jpeg':"";
												
												$scope.lookImg=function(){
																											
													if(result.ds_idaheadpic){	
														common.getSub(result.ds_idaheadpic, function(url) {
															$scope.detail.imageSrc = url;
															var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
															a = $(a);
															a.find('span').click();														
														});
													
													}else{
														Api.alert( '暂无图片！');
													}							
														
													
												};

												//optionset
												initSelect(result.ds_account, 'ds_account', 'familyregister');
												initSelect(result.ds_education, 'ds_education', 'education');
												initSelect(result.ds_nation, 'ds_nation', 'nation');
												initSelect(result.ds_marriage, 'ds_marriage', 'marriage');
												initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype');
												console.log($scope.detail);
											});
										})
										
									}
								})
							};
						});

					} else {
						$scope.detail.house.push(result[i]);
					};					
				};
			} else {
				$scope.detail.haveHouse = true;
			};

		});
		search.getPeopelCar($scope.personId, function(result) {
			
			if (judes.isNull(result)) {
				for (var i = 0; i < result.length; i++) {

					result[i].createdon = Api.formatDate('zh', result[i].createdon);
					$scope.detail.car.push(result[i]);
					console.log($scope.detail.car);
				};
				$scope.carInfo = function(info) {
					ngDialog.open({
						template: '/police_web/template/dialogs/searchCarInfo.html',	
						appendClassName: 'ngdialog-place',				
						controller: function($scope,$state,common,user,public,address,user,$rootScope,options,search) {
							$scope.carInfo=info;
							console.log(info);
							$scope.driver = {};
							$scope.master = {};
							$scope.picture = [];
							$scope.img = [];

							if (info['ds_driver-ds_personid']) {
								search.getPersonDetail(info['ds_driver-ds_personid'], function(result) {
									$scope.driver = result;										
								})
							};
							if (info['ds_person-ds_personid']) {
								search.getPersonDetail(info['ds_person-ds_personid'], function(result) {
									$scope.master = result;
									// console.log($scope.master);
								})
							};

							if (info['ds_picstubidarray']) {
								$scope.picture = info['ds_picstubidarray'].split(';');
								$scope.getPictrue=function(){
									if($scope.picture.length!=0){
										var imgid={
											id:$scope.picture.pop(),
										};
										common.getSub(imgid.id, function(result) {
											$scope.img.push(result);
											console.log($scope.img);
											$scope.getPictrue();
										})
									}
									
								};
								$scope.getPictrue();
							};
							$scope.changePic=function($event){  
						        var img=$event.srcElement || $event.target;  
						        angular.element("#bigimage")[0].src=img.src;  
						        angular.element("#js-imgview")[0].style.display="block";  
						        angular.element("#js-imgview-mask")[0].style.display="block";  
						    }  
						  //点击图片时放小显示图片  
						    $scope.closePic =function(){  
						        angular.element("#js-imgview")[0].style.display="none";  
						        angular.element("#js-imgview-mask")[0].style.display="none";  
						          
						    }  
							
						}
					})
				};
			} else {
				$scope.detail.haveCar = true;
			}

		});

		search.getPeopelCase($scope.personId, function(result) {
			console.log(result);
			if (judes.isNull(result)) {
				for (var i = 0; i < result.length; i++) {
					$scope.detail.case.push(result[i]);
				};
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
			} else {
				$scope.detail.haveCase = true;
			}


		});

	});

	$scope.go = function(name) {
		$state.go(name);
	};
	$scope.lookPeopleDetail = function(id){
		$state.go('searchPeopleInfo',{

			item:id			
		});
	}
});

controllers.controller('index.searchHouseInfo', function($scope,search,$state,Api,judes,$stateParams,$filter,options,common,ngDialog,gather) {
	var crumbs = Api.Storage.get('crumbs');	
	$scope.house = crumbs[1].item;
	var houseId = $scope.house.id;
	var ownerId = $scope.house['ds_houseowner-ds_personid'];
	console.log($scope.house);

	$scope.lookhouseInfo=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/searchHouseInfo.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather) {
				$scope.detail = {};
				$scope.team = [];
				$scope.houseusertype = [];

				gather.getHouseMassage(houseId, function(result) {
					$scope.detail = result;
					console.log($scope.detail);
					$scope.detail.ds_kind = $scope.detail.ds_kind.split(':')[0];

					options.get(['houseusertype'], function(result) {
						$scope.houseusertype = angular.copy(result.houseusertype);
						for (var i = 0; i < $scope.houseusertype.length; i++) {
							if ($scope.detail.ds_kind == $scope.houseusertype[i].value) {
								$scope.detail.ds_kind = $scope.houseusertype[i];
							}
						}
					});
					
				});				
			}
		})
	};
	$scope.lookUserInfo=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/searchHouseMaster.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather,getBase64ByFile,$filter) {
				$scope.detail = {};
				$scope.options = {};				
				
				function initSelect(value, scopeData, options) {
					if (value) {
						$scope.detail[scopeData] = value.split(':')[0];
						for (var i = 0; i < $scope.options[options].length; i++) {
							if ($scope.options[options][i].value == $scope.detail[scopeData]) {
								$scope.detail[scopeData] = $scope.options[options][i].name;
							}
						}
					}else{
						$scope.detail[scopeData] = '';
					} 
				};
					
				options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
					$scope.options = result;
						gather.getPersonMessage(ownerId, function(result) {
							
							$scope.detail = result;
							$scope.detail.birth = $filter('idCardNum')($scope.detail.ds_id, 'birth');
							$scope.detail.sex = $filter('idCardNum')($scope.detail.ds_id, 'sex') == '1' ? '男' : '女';
							$scope.detail.aheadpic = result.ds_idaheadpic ?'身份证照片.jpeg':"";

							initSelect(result.ds_account, 'ds_account', 'familyregister');
							initSelect(result.ds_education, 'ds_education', 'education');
							initSelect(result.ds_nation, 'ds_nation', 'nation');
							initSelect(result.ds_marriage, 'ds_marriage', 'marriage');
							initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype');

							$scope.lookImg=function(){
																	
								if(result.ds_idaheadpic){	
									common.getSub(result.ds_idaheadpic, function(url) {
										$scope.detail.imageSrc = url;
										var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
										a = $(a);
										a.find('span').click();														
									});
								
								}else{
									Api.alert( '未找到图片！');
								}							
																		
							};
						});						
				});				

			}
		})
	};
	$scope.getUserList=function(){
		gather.getUserList(houseId, function(result) {
			$scope.userList=[]
			for (var i = 0; i < result.length; i++) {
				var item=result[i];
				item.date=Api.formatDate('zh',item['ds_startdate']);
				$scope.userList.push(item);
			};
			
		});
	};
		
	$scope.getLesseeList=function(){
		gather.getLesseeList(houseId, function(result) {
			$scope.LesseeList = [];
			for (var i = 0; i < result.length; i++) {
				var item=result[i];
				item.date=Api.formatDate('zh',item['ds_startdate']);
				$scope.LesseeList.push(item);

			};
			console.log($scope.LesseeList);

		});
	};
	$scope.getLesseeList();	
	$scope.getUserList();

	$scope.lookHousePerson=function(person){
		ngDialog.open({
			template: '/police_web/template/dialogs/searchHousePeopleInfo.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather,$filter,getBase64ByFile) {
				$scope.detail = {};
				$scope.options = {};
				var peopleId = '';

				function initSelect(value, scopeData, options) {
					if (value) {
						$scope.detail[scopeData] = value.split(':')[0];
						for (var i = 0; i < $scope.options[options].length; i++) {
							if ($scope.options[options][i].value == $scope.detail[scopeData]) {
								$scope.detail[scopeData] = $scope.options[options][i].name;
							}
						}
					} else {
						$scope.detail[scopeData] ='';
					};
				};

				options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
					$scope.options = result;
					gather.houseUserDetail(person.id, function(result) {
						$scope.detail = angular.copy(result);
						// console.log($scope.detail);
						$scope.detail.birth = $filter('idCardNum')($scope.detail['ds_person_ref-ds_id'], 'birth');
						$scope.detail.sex = $filter('idCardNum')($scope.detail['ds_person_ref-ds_id'], 'sex') == '1' ? '男' : '女';
						$scope.detail.aheadpic = $scope.detail['ds_person_ref-ds_idaheadpic'] ?'身份证照片.jpeg':"";

						peopleId = result['ds_person_ref-ds_personid'];

						initSelect(result['ds_person_ref-ds_account'], 'ds_person_ref-ds_account', 'familyregister');
						initSelect(result['ds_person_ref-ds_education'], 'ds_person_ref-ds_education', 'education');
						initSelect(result['ds_person_ref-ds_nation'], 'ds_person_ref-ds_nation', 'nation');
						initSelect(result['ds_person_ref-ds_marriage'], 'ds_person_ref-ds_marriage', 'marriage');
						initSelect(result['ds_person_ref-ds_bloodtype'], 'ds_person_ref-ds_bloodtype', 'bloodtype');

						$scope.detail['ds_startdate'] = {};
						
						$scope.detail['ds_startdate'] = Api.formatDate('zh', result['ds_startdate']);

						$scope.detail['ds_enddate'] = {};
						
						$scope.detail['ds_enddate'] = Api.formatDate('zh', result['ds_enddate']);

						
						$scope.lookImg=function(){								
							if(result['ds_person_ref-ds_idaheadpic']){	
								common.getSub(result['ds_person_ref-ds_idaheadpic'], function(url) {
									$scope.detail.imageSrc = url;
									var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
									a = $(a);
									a.find('span').click();														
								});
							
							}else{
								Api.alert( '暂无图片！');
							}							
															
						};
					});
				});

			}
		})
	};
	

});
controllers.controller('index.searchCollegeInfo', function($scope,search,$state,Api,judes,$stateParams,$filter,options,common,ngDialog,gather,public) {
	var crumbs = Api.Storage.get('crumbs');	
	var house = crumbs[1].item;
	var houseId = house.id;
	var houseMessage = crumbs[1].message;

	$scope.studentlist=[];

	public.getStudentList(houseId,function(Data){
		console.log(Data);
		for(var i=0;i<Data.length;i++){
			$scope.studentlist.push(Data[i]);
		};

		$scope.lookStudent = function(id){
			ngDialog.open({
				template: '/police_web/template/dialogs/searchStudents.html',	
				appendClassName: 'ngdialog-place',				
				controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather) {
					$scope.detail = {};
					public.getStudentDetail(id,function(result){
						$scope.detail=result;
					})
										
				}
			})
		}

	});
	$scope.lookDormitoryInfo = function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/searchdormitoryInfo.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather) {
				
				$scope.detail = {};
				$scope.detail.publicordername = houseMessage.publicordername;
				$scope.detail.ds_address = house.ds_address;
				$scope.detail.roomName = house.ds_floor + '楼' + house.ds_roomfigure +'寝';
				$scope.detail.ds_floor = house.ds_floor;
				$scope.detail.ds_roomfigure = house.ds_roomfigure;		
			}
		})
	};


});