controllers.controller('index.place', function($scope, $state, Api, address, public, $stateParams) {
	$scope.title = $scope.$parent.$parent.title = "行业场所";
	// angular.element('.TreeBox').css('width', parseInt(angular.element('.main').css('width')) - 266);

	$scope.publicList = [];
	$scope.addressList =[];
	$scope.refresh = 0;
	$scope.public={};
	$scope.public.show=false;
	var userManage = Api.Storage.get('manageUser');
	// console.log(userManage);
	
	var data={
		"commonstr": userManage.teamId,
		"type":1		
	};
	public.getList(data,function(result) {
		
		$scope.publicList = [];
		for (var i = 0; i < result.resultObj.length; i++) {
			var data = {};
			data.title = result.resultObj[i].name;
			data.id = result.resultObj[i].id;
			data.position = [result.resultObj[i].longituide, result.resultObj[i].latitude];
			data.type = result.resultObj[i].type;
			$scope.publicList.push(data);
		};
		$scope.refresh++;
	});
	$scope.addPublic=function(){
		Api.Storage.set('crumbs', [{
			name: '行业场所',
			stateName: 'place'
		}, {
			name: '添加行业场所',
			stateName: 'addPublic',
			
		}]);
		$state.go('index.addPublic');
	};
	$scope.change=function(){
		$scope.public.show=true;
	};
	$scope.publicDetail = function(public){
		Api.Storage.set('crumbs', [{
			name: '行业场所',
			stateName: 'place'
		}, {
			name: public.title,
			stateName: 'placeDetail',
			id: public.id,
			type:public.type,
			
		}]);
		$state.go('index.placeDetail');
	};


});
//添加行业场所
controllers.controller('index.addPublic', function($scope, $state, Api, address, public, $stateParams,ngDialog,user,options,judes,common) {
		var crumbs = Api.Storage.get('crumbs');	
		// var publicId = crumbs[1].id;
		var name = crumbs[1].name;
		// var type = crumbs[1].type;
		$scope.title = $scope.$parent.$parent.title = name;
		var userMessage = user.getUserMessage();

		$scope.ds_owner_ref = {
			ds_name: '穆松鹤',
			ds_phone: '13630985996',
			ds_id: '220381198909221115',
			ds_address: '啊实打实大师多',
		};
		// 治安负责人object
		$scope.ds_securityowner_ref = {
			ds_name: '穆松鹤',
			ds_phone: '13630985996',
			ds_phone2: '13630985996',
			ds_id: '220381198909221115',
			ds_address: '啊实打实大师多',
		};
		// 详情object
		$scope.options = {};
		$scope.options.position = 'none';

		$scope.dormitoryList = [];


		$scope.options.ds_name = '测试行业场所';
		// 详情object
		$scope.case = {};
		$scope.caseMaps = {};
		$scope.caseMaps.showCaseMap = false
		$scope.options.addressName = '选择地址';

		options.get(['businesskind', 'buildingtype'], function(result) {
			$scope.businesskind = result.businesskind;
			$scope.buildingtype = result.buildingtype;
			$scope.options.businesskind = $scope.businesskind[0];
		});
		var dormitoryhouseName = '';
		var dormitoryhouseNameid = '';
		
		$scope.$on('setAddress.show',function(){
			$scope.options.addressName=dormitoryhouseName;
			$scope.options.address=dormitoryhouseNameid;
		});
		$scope.showAddressTree=function(){
			ngDialog.open({
					template: '/police_web/template/dialogs/addPublicAddressTree.html',					
					controller: function($scope,$state,common,getBase64ByFile,user,public,address,user,$rootScope) {
						$scope.options = {};
						$scope.options.addressName = '选择地址';

						$scope.addressList =[];
						$scope.address = {};
						$scope.address.ready = false;
						// 地址树原始数据
						$scope.address.data = [];
						// 地址树逐级列表
						$scope.address.list = [
							[],
							[],
							[],
							[]
						];
						// 地址树选择序号
						$scope.address.index = [0, 0, 0];
						// 地址树选择结果
						$scope.address.result = [{}, {}, {}];

						var formattingAddress = function(data, toData) {
							for (var i = 0; i < data.length; i++) {

								var _data = {};
								_data.name = data[i].name;
								_data.id = data[i].id;
								_data.index = i;
								toData.push(_data);
							};
						};
						address.get(function(result) {
							console.log(result);
							$scope.address.data = result;

							$scope.address.list = [
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}]
							];
							$scope.address.result[0] = $scope.address.list[0][0];
							$scope.address.result[1] = $scope.address.list[1][0];
							$scope.address.result[2] = $scope.address.list[2][0];
							$scope.address.result[3] = $scope.address.list[3][0];
							formattingAddress(result, $scope.address.list[0]);
							// $scope.address.result[0] = $scope.address.list[0][0];
							// $scope.address.result[1] = $scope.address.list[1][0];
							// $scope.address.result[2] = $scope.address.list[2][0];
							// $scope.address.result[3] = $scope.address.list[3][0];
							// formattingAddress(result, $scope.address.list[0]);

						});
						$scope.address.change = function(index) {
							
							$scope.address.index = [$scope.address.result[0].index, $scope.address.result[2].index, $scope.address.result[3].index];
							console.log($scope.address.index);
							if (index == 0) {
								$scope.address.list[1] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[1] = $scope.address.list[1][0];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName = '';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models, $scope.address.list[1]);
							};
							if (index == 1) {
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName='';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[$scope.address.result[1].index].address3Models, $scope.address.list[2]);
							};
							if (index == 2) {
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[3] = $scope.address.list[3][0];
								if($scope.address.list[2][$scope.address.result[2].index + 1].id){
									address.last($scope.address.list[2][$scope.address.result[2].index + 1].id, function(result) {
										formattingAddress(result, $scope.address.list[3]);
										$scope.address.ready = true;
										
									});
								}
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
										
							};
							if(index == 3){
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
								
							};
						}; 

						$scope.setAddressTree = function() {
							if ($scope.address.result[3].id!=1) {

								dormitoryhouseNameid = $scope.address.result[3].id;
								dormitoryhouseName = $scope.address.result[3].name;
								$rootScope.$broadcast('setAddress.show');
								$scope.closeThisDialog();
								
							}else if($scope.address.result[3].id==1 && $scope.address.result[2].id!=1){
								dormitoryhouseNameid = $scope.address.result[2].id;
								dormitoryhouseName = $scope.address.result[2].name;
								$rootScope.$broadcast('setAddress.show');
								$scope.closeThisDialog();
								
							}
							else {
								Api.alert('请选择地址树<br>或在地址树管理中添加');
							};
						};
					} 
				})
			
		};
		var Position='';
		var Address = '';
		$scope.$on('choosePosition.show',function(){
			$scope.case.address = Address;
			$scope.options.position = Position;
		});
		$scope.choosePosition=function(){
			ngDialog.open({
				template: '/police_web/template/dialogs/addPublicPosition.html',	
				appendClassName: 'ngdialog-place',				
				controller: function($scope,$state,common,getBase64ByFile,user,public,address,user,$rootScope) {
					$scope.caseMaps = {};
					$scope.caseMaps.showCaseMap = true;
					$scope.setAddress = function(str, position) {
						Address = str;
						Position = position;
						$scope.caseMaps.showCaseMap = false;
						$rootScope.$broadcast('choosePosition.show');
						$scope.closeThisDialog();						
					};
				}
			})
		};
		var dormitoryList=[];
		$scope.$on('chooseDormitory.show',function(){
			$scope.dormitoryList = dormitoryList;
		});
		$scope.showDormitory = function() {
			ngDialog.open({
				template: '/police_web/template/dialogs/addPublicDormitory.html',				
				controller: function($scope,$state,common,getBase64ByFile,user,public,address,user,$rootScope) {
						$scope.addressList =[];
						$scope.address = {};
						$scope.address.ready = false;
						// 地址树原始数据
						$scope.address.data = [];
						// 地址树逐级列表
						$scope.address.list = [
							[],
							[],
							[],
							[]
						];
						// 地址树选择序号
						$scope.address.index = [0, 0, 0];
						// 地址树选择结果
						$scope.address.result = [{}, {}, {}];

						var formattingAddress = function(data, toData) {
							for (var i = 0; i < data.length; i++) {

								var _data = {};
								_data.name = data[i].name;
								_data.id = data[i].id;
								_data.index = i;
								toData.push(_data);
							};
						};
						address.get(function(result) {
							console.log(result);
							$scope.address.data = result;

							$scope.address.list = [
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}]
							];
							$scope.address.result[0] = $scope.address.list[0][0];
							$scope.address.result[1] = $scope.address.list[1][0];
							$scope.address.result[2] = $scope.address.list[2][0];
							$scope.address.result[3] = $scope.address.list[3][0];
							formattingAddress(result, $scope.address.list[0]);

						});
						$scope.address.change = function(index) {

							$scope.address.index = [$scope.address.result[0].index, $scope.address.result[2].index, $scope.address.result[3].index];
							console.log($scope.address.index);
							if (index == 0) {
								$scope.address.list[1] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[1] = $scope.address.list[1][0];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName='';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models, $scope.address.list[1]);
							};
							if (index == 1) {
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName='';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[$scope.address.result[1].index].address3Models, $scope.address.list[2]);
							};
							if (index == 2) {
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[3] = $scope.address.list[3][0];
								if($scope.address.list[2][$scope.address.result[2].index + 1].id){
									address.last($scope.address.list[2][$scope.address.result[2].index + 1].id, function(result) {
										formattingAddress(result, $scope.address.list[3]);
										$scope.address.ready = true;
										
									});
								}
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
										
							};
							if(index == 3){
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
								
							};
						}; 

						$scope.setDormitory=function(){
							console.log($scope.address.result[3]);
							var isCreate = true;
							for (var i = 0; i < dormitoryList.length; i++) {
								var item = dormitoryList[i];
								if (item.id == $scope.address.result[3].id) {
									isCreate = false;
									break;
								}
							};
							if (isCreate) {
								if($scope.address.result[3].id!=1){
									dormitoryList.push($scope.address.result[3]);
									$rootScope.$broadcast('chooseDormitory.show');
									$scope.closeThisDialog();
								}else if($scope.address.result[3].id ==1 && $scope.address.result[2].id!=1){
									dormitoryList.push($scope.address.result[2]);
									$rootScope.$broadcast('chooseDormitory.show');
									$scope.closeThisDialog();
								}								
							};
						};

				}
			})
		};


		$scope.submit = function() {
		if ($scope.options.addressName == '选择地址') {
			Api.alert(
				 '请选择地址树'
			);
			return;
		};
		if ($scope.options.position == 'none') {
			Api.alert(
				 '请填选择行业场位置'
			);
			return;
		};
		if (!judes.isNull($scope.case.address)) {
			Api.alert(
				'请填选行业场所详细位置'
			);
			return;
		};
		if (!judes.isNull($scope.options.ds_name)) {
			Api.alert(
				'请填写行业场所名称'
			);
			return;
		};
		if (!judes.isNull($scope.ds_owner_ref.ds_name)) {
			Api.alert(
				'请填写法人姓名'
			);
			return;
		};
		if (!judes.isNull($scope.ds_owner_ref.ds_phone)) {
			Api.alert(
				'请填写法人联系电话'
			);
			return;
		};
		if (!judes.isPhone($scope.ds_owner_ref.ds_phone)) {
			Api.alert(
				'法人联系电话有误'
			);
			return;
		};
		if (!judes.isNull($scope.ds_owner_ref.ds_id)) {
			Api.alert(
				'请填写法人身份证号'
			);
			return;
		};
		if (!judes.isIdCard($scope.ds_owner_ref.ds_id)) {
			Api.alert(
				'法人身份证有误'
			);
			return;
		};
		if (!judes.isNull($scope.ds_owner_ref.ds_address)) {
			Api.alert(
				'请填写法人家庭住址'
			);
			return;
		};
		if (!judes.isNull($scope.ds_securityowner_ref.ds_name)) {
			Api.alert(
				'请填写治安防卫负责人姓名'
			);
			return;
		};
		if (!judes.isNull($scope.ds_securityowner_ref.ds_phone)) {
			Api.alert(
				'请填写治安防卫负责人联系电话'
			);
			return;
		};
		if (!judes.isPhone($scope.ds_securityowner_ref.ds_phone)) {
			Api.alert(
				'治安防卫负责人联系电话有误'
			);
			return;
		};
		if (!judes.isNull($scope.ds_securityowner_ref.ds_id)) {
			Api.alert(
				'请填写治安防卫负责人身份证号'
			);
			return;
		};
		if (!judes.isIdCard($scope.ds_securityowner_ref.ds_id)) {
			Api.alert(
				'治安防卫负责人身份证有误'
			);
			return;
		};
		if (!judes.isNull($scope.ds_securityowner_ref.ds_address)) {
			Api.alert(
				'请填写治安防卫负责人家庭住址'
			);
			return;
		};
		if (!judes.isNull($scope.ds_securityowner_ref.ds_phone2)) {
			Api.alert(
				'请填写治安防卫负责人联系电话'
			);
			return;
		};
		if (!judes.isPhone($scope.ds_securityowner_ref.ds_phone2)) {
			Api.alert(
				'治安防卫负责人联系电话有误'
			);
			return;
		};

		var ownerData = {
			name: $scope.ds_owner_ref.ds_name,
			idCard: $scope.ds_owner_ref.ds_id,
			isCreate: "true"
		};
		var securityData = {
			name: $scope.ds_securityowner_ref.ds_name,
			idCard: $scope.ds_securityowner_ref.ds_id,
			isCreate: "true"
		};

		common.getPeopleId(ownerData, function(result) {
			var ownerId = result.personId;
			public.upDataPeopleMessageForAddPublic({
				id: ownerId,
				name: $scope.ds_owner_ref.ds_name,
				phone: $scope.ds_owner_ref.ds_phone,
				address: $scope.ds_owner_ref.ds_address
			});

			common.getPeopleId(securityData, function(result) {
				var securityId = result.personId;
				public.upDataPeopleMessageForAddPublic({
					id: securityId,
					name: $scope.ds_securityowner_ref.ds_name,
					phone: $scope.ds_securityowner_ref.ds_phone,
					address: $scope.ds_securityowner_ref.ds_address
				});

				var data = {
					"ds_businesskind": $scope.options.businesskind.value,
					"ds_districtpolicestation_name": userMessage.teamId,
					"ds_name": $scope.options.ds_name,
					"ds_owner_ref": ownerId,
					"ds_securityowner_ref": securityId,
					"ds_latitude":$scope.options.position[1],
					"ds_longitude":$scope.options.position[0],
					"ds_address_tree": $scope.options.address,
					"ds_collectperson": userMessage.policeCrmId,
					"ds_charger": userMessage.policeCrmId,
					"ds_address": $scope.case.address,
				};
				console.log($scope.options.position);
				console.log(data);
				public.AddPublic(data, function(result) {
					var publicID = result;
					if ($scope.options.businesskind.value == '100000017') {
						function AddDormitory() {
							if ($scope.dormitoryList.length != 0) {
								var dormitoryObject = $scope.dormitoryList.shift();
								var _data = {
									"name": "ds_publicorder_address_l4",
									"attributes": [{
										"name": "ds_address_l4_ref",
										"value": "@look/" + dormitoryObject.id
									}, {
										"name": "ds_publicorder_ref",
										"value": "@look/" + result
									}]
								};
								public.CreatUniversity(_data, function() {
									AddDormitory();
								});
							} else {
								Api.alert('创建成功');
								
							};
						};
						AddDormitory();
					} else {
						Api.alert('创建成功');
						
					}
				});
			});
		});

	};
		

});
// controllers.controller('index.placeList', function($scope, $state, Api) {
// 	$scope.title = $scope.$parent.$parent.title = "实有房屋信息";
// 	angular.element('.TreeBox').css('width', parseInt(angular.element('.main').css('width')) - 266);
// 	var crumbs = Api.Storage.get('crumbs');
// 	$scope.treeMessage = null;
// 	if (crumbs != null) {
// 		$scope.treeMessage = crumbs[1].message.treeMessage;
// 		$scope.value1 = crumbs[1].message.value1;
// 		$scope.value2 = crumbs[1].message.value2;
// 		$scope.value3 = crumbs[1].message.value3;
// 		$scope.value4 = crumbs[1].message.value4;
// 	};
// 	$scope.getPlace = function() {
// 		var id = '';
// 		if ($scope.value4 != '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
// 			id = $scope.value4;
// 		} else if ($scope.value4 == '1' && $scope.value3 != '1' && $scope.value2 != '1' && $scope.value1 != '1') {
// 			id = $scope.value3;
// 		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 != '1' && $scope.value1 != '1') {
// 			id = $scope.value2;
// 		} else if ($scope.value4 == '1' && $scope.value3 == '1' && $scope.value2 == '1' && $scope.value1 != '1') {
// 			id = $scope.value1;
// 		} else {
// 			Api.alert('请选择地址树信息');
// 			return;
// 		}
// 	};
// 	$scope.GoPlaceDetail = function(name, id, isControl) {
// 		Api.Storage.set('crumbs', [{
// 			name: '实有房屋信息',
// 			stateName: 'place',
// 		}, {
// 			name: '实有房屋列表',
// 			stateName: 'placeList',
// 			message: {
// 				'value1': $scope.value1,
// 				'value2': $scope.value2,
// 				'value3': $scope.value3,
// 				'value4': $scope.value4,
// 				'treeMessage': $scope.treeMessage,
// 			}
// 		}, {
// 			name: name,
// 			stateName: 'placeDetail',
// 			id: '79050300-3fb5-e611-80c8-001c42a95adf',
// 			isControl: isControl,
// 		}]);
// 		$state.go('index.placeDetail');
// 	}
// 	$scope.placeTypeArray = [{
// 		name: '全部',
// 	}, {
// 		name: '行业场所',
// 	}, {
// 		name: '出租房屋',
// 	}, {
// 		name: '自有房屋',
// 	}]

// });
controllers.controller('index.placeDetail', function($scope, $state, Api, ngDialog, download,public,options,getBase64ByFile,common) {

	var crumbs = Api.Storage.get('crumbs');
	// console.log(crumbs);
	if (crumbs[1].formMap) {
		var publicId = crumbs[1].id;
		var name = crumbs[1].name;
		var type = crumbs[1].type;
		$scope.title = $scope.$parent.$parent.title = name;
	}else if(crumbs[2]){
		if(crumbs[2].fromJudge){
			var publicId = crumbs[2].id;
			var name = crumbs[2].name;
			var type = crumbs[2].type;
			$scope.title = $scope.$parent.$parent.title = name;
		}else if(crumbs[2].fromfirst){
			var publicId = crumbs[2].id;
			var name = crumbs[2].publicName;
			var type = crumbs[2].type;
			$scope.title = $scope.$parent.$parent.title = name;
		}else if(crumbs[2].fromPublic){
			var publicId = crumbs[1].id;
			var name = crumbs[1].name;
			var type = crumbs[1].type;
			$scope.title = $scope.$parent.$parent.title = name;
		}		
	}else {
		var publicId = crumbs[1].id;
		var name = crumbs[1].name;
		var type = crumbs[1].type;
		$scope.title = $scope.$parent.$parent.title = name;
	};
	// console.log(publicId,name,type);
	$scope.detail = {};
	$scope.placeMessage = {};
	$scope.check ={};
	$scope.dangerList =[];
	$scope.dormitoryList=[];
	$scope.checkList=[];
	$scope.detail.publicDocName = '行业场所治安管理档案';
	$scope.detail.showPeopleList = true;
	$scope.detail.showStudents = false;
	$scope.detail.showFire = true;
	$scope.detail.showLogistics = false;
	$scope.detail.showpublic =true;
	$scope.detail.realname = false;

	if (type == '100000011' || type == '100000006' || type == '100000002' || type == '100000018' || type == '100000009') {
		$scope.detail.realname = true;
	};
	$scope.detail.stateName = '';
	switch (type) {
		case "100000011":
			$scope.detail.realname = true;
			$scope.detail.stateName = 'index.publicRealNameHotel'
			break;
		case "100000006":
			$scope.detail.realname = true;
			$scope.detail.stateName = 'index.publicRealNameMetal'
			break;
		case "100000002":
			$scope.detail.realname = true;
			$scope.detail.stateName = 'index.publicRealNameWaste'
			break;
		case "100000018":
			$scope.detail.realname = true;
			$scope.detail.stateName = 'index.realnameLogistics'
			break;
		case "100000009":
			$scope.detail.realname = true;
			$scope.detail.stateName = 'index.publicRealNamePhone'
			break;
	};
	
	
	//实名制
		$scope.goRealName=function(){
			$state.go($scope.detail.stateName);
			Api.Storage.set('crumbs', [{
				name:'行业场所',
				stateName: 'place',
			},{
				name:name,
				stateName:'placeDetail',
				id: publicId,
				type:type,
				
			},{
				name:'实名制',
				stateName:$scope.detail.stateName,
				id:publicId,
				type:type,
				publicName:name,
				fromfirst:true,
			}]);
		}
	switch (type) {
		case "100000017":
			$scope.detail.publicDocName = '党政机关、企业、事业单位安全保卫工作档案';
			$scope.detail.showpublic =true;
			$scope.detail.showLogistics = false;
			$scope.detail.showPeopleList = false;
			$scope.detail.showStudents = true;
			$scope.detail.showFire = false;
			break;
		case "100000012":
			$scope.detail.publicDocName = '党政机关、企业、事业单位安全保卫工作档案';
			$scope.detail.showpublic =true;
			$scope.detail.showLogistics = false;
			$scope.detail.showPeopleList = false;
			$scope.detail.showStudents = false;
			$scope.detail.showFire = false;
			break;
		case "100000018":
			$scope.detail.publicDocName = '物流寄递行业治安管理档案';
			$scope.detail.showpublic =false;
			$scope.detail.showLogistics = true;
			$scope.detail.showPeopleList = true;
			$scope.detail.showStudents = false;
			$scope.detail.showFire = true;
			break;
		default:
			$scope.detail.publicDocName = '行业场所治安管理档案';
			$scope.detail.showpublic =true;
			$scope.detail.showLogistics = false;
			$scope.detail.showPeopleList = true;
			$scope.detail.showStudents = false;
			$scope.detail.showFire = true;
	};
	public.getInfor(publicId,function(result){
		// console.log(result);
		$scope.placeMessage=result;
		$scope.Show={};
		$scope.Show.student=false;
		$scope.Show.danger=false;
		$scope.Show.form=true;
		$scope.Show.singin=false;

		$scope.Browse = {};
		$scope.Detail = {};

		//下载模板
		$scope.downloadTemplate=function(){
			
			if(type=="100000017"||type=="100000012"){
				var data={
					"fileName": "党政机关、企业、事业单位安全保卫工作档案",
				};
			}else if(type=="100000018"){
				var data={
					"fileName": "物流寄递行业治安管理档案",
				};
			}else{
				var data={
					"fileName": "行业场所治安管理档案",
				};
			};
			public.downloadTemplate(data,function(url){
				download.doc(url.resultObj.filePath);
			})

		};

		//上传文档
		$scope.uploadfile = function() {
			$('#uploadfile').clearFields();				
			document.getElementById('uploadfile').click();
		};
		$scope.fileChange = function() {
			getBase64ByFile({
				fileType: 'doc', // image or doc
				elementId: 'uploadfile',
				success: function(data) {					
					common.upDataSub({
						"fileName": $scope.detail.publicDocName,
						"fileType": ".doc",
						"tempFileStream": data.replace(/data:application\/msword\;base64\,/g, "").replace(/data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document\;base64\,/g, "")
					}, function(result) {
						
						public.uploadDocument(result,publicId,function(){
							Api.alert('上传成功',function(){
								location.reload();
							});
						});
						$('#uploadfile').clearFields();	
						location.reload();
					});
					
				},
				error: function(message) {
					Api.alert(message);
				},
			});
		};
		//下载文档
		$scope.downloadFile=function(){
			if($scope.placeMessage['ds_stub']){
				public.downloadDocument($scope.placeMessage['ds_stub'],function(url){
					
					download.doc(url.resultObj.fileTempPath);
				})
			}else{
				Api.alert("暂无文档，请先上传文档！");
			}

		};

		//下载消防档案模板
		$scope.downloadFireTemplate=function(){
						
			var data={
				"fileName": "消防档案",
			};			
			public.downloadTemplate(data,function(url){
				download.doc(url.resultObj.filePath);
			})

		};
		//上传消防档案
		$scope.uploadFirefile = function() {
			$('#uploadFirefile').clearFields();				
			document.getElementById('uploadFirefile').click();
		};
		$scope.fileFireChange = function() {
			getBase64ByFile({
				fileType: 'doc', // image or doc
				elementId: 'uploadFirefile',
				success: function(data) {					
					common.upDataSub({
						"fileName": "消防档案",
						"fileType": ".doc",
						"tempFileStream": data.replace(/data:application\/msword\;base64\,/g, "").replace(/data:application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document\;base64\,/g, "")
					}, function(result) {
						
						public.uploadfireDocument(result,publicId,function(){
							Api.alert('上传成功',function(){
								location.reload();
							});
						});

						$('#uploadFirefile').clearFields();	
						
					});
					
				},
				error: function(message) {
					Api.alert(message);
				},
			});
		};
		//下载消防文档
		$scope.downloadFireFile=function(){
			if($scope.placeMessage['ds_firestub']){
				public.downloadDocument($scope.placeMessage['ds_firestub'],function(url){					
					download.doc(url.resultObj.fileTempPath);
				})
			}else{
				Api.alert("暂无文档，请先上传文档！");
			}

		};
		$scope.Browse.changeType = function(str) {
			if ($scope.Browse.haveOld) {
				return;
			} else {
				$scope.Browse.type = str;
			}
		};
		options.get(['firelevel'], function(result) {
			$scope.firelevel = result.firelevel;
			public.getInfor(publicId, function(result) {
				$scope.Detail = result;
				// console.log($scope.Detail);
				if (!$scope.Detail.ds_issmall) {
					$scope.Detail.ds_issmall = 'False';
				};
				if($scope.Detail['ds_firelevel']){
					$scope.Detail['ds_firelevel'] = $scope.Detail['ds_firelevel'].split(':')[0];
				};				
				public.GetBrowse(publicId, result.ds_businesskind.split(':')[0], function(result) {
					$scope.Browse.id = result.ds_browsehistoryId;
					$scope.Browse.type = result.ds_viewtype;
					$scope.Browse.haveOld = !!result.ds_viewtype;
				});
			});
		});
		$scope.submitChoose = function() {
			public.upData(publicId, {
				firelevel: $scope.Detail['ds_firelevel'],
				issmall: $scope.Detail['ds_issmall'] ? $scope.Detail['ds_issmall'] : 'No',
			}, function() {
				if (!$scope.Browse.haveOld && !!$scope.Browse.type) {
					public.upDataBrowse($scope.Browse.id, $scope.Browse.type);
				}
			});
		};
		$scope.lookDocuments = function(publicorderid) {
				
				ngDialog.open({
					template: '/police_web/template/dialogs/employeeInfo.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope,$state,common,getBase64ByFile,user,public,judes) {
						$scope.message = {};
						$scope.emptyShow=false;
						public.getPeopleList(publicorderid.id,function(result){
							
							if(!judes.isNull(result)||result.length==0){
								$scope.emptyShow=true;
							};
							$scope.message.detail = result;
							for (var i = 0; i < $scope.message.detail.length; i++) {
								var item = $scope.message.detail[i];
								item.isActive = false;
							};
							$scope.lookPeoples = function(item) {
								public.getPeopleDetail(item['ds_publicorder_employeeid'], function(data) {
									for (var i = 0; i < $scope.message.detail.length; i++) {
										$scope.message.detail[i].isActive = false;
									};
									item.isActive = true;
									$scope.message.peopleMessage = data;
									$scope.peopleInfo = function(id) {
										
										Api.Storage.set('crumbs', [{
											name:'行业场所',
											stateName: 'place',
											
										},{											
											name:name,
											stateName:'placeDetail',
											id: publicId,
											type:type,										
										},{
											name:'人员信息',
											stateName:'searchPeopleInfo',
											item:id,
											fromPublic:true,
										}]);
																				
										$state.go('index.searchPeopleInfo');
										$scope.closeThisDialog();
									};
								});

								$scope.lookDocuments = function() {
									if($scope.message.peopleMessage['ds_employee-ds_idaheadpic']){
										common.getSub($scope.message.peopleMessage['ds_employee-ds_idaheadpic'], function(result) {
											
											var a = '<a href="' + result + '" target="_blank"><span> </span></a>';
											a = $(a);
											a.find('span').click();
									
										}, function() {
											Api.alert('身份证正面照片获取失败');
										});
									}else{
										Api.alert('暂无照片');
									}
									
									
								};
							};							

						})
						
					},
				});			
		};

		//从业人员签到
		$scope.getsinginList = function(){

			$scope.Show.danger=false;
			$scope.Show.student=false;
			$scope.Show.form=false;
			$scope.Show.signin = true;

			$scope.options = {};			
			$scope.options.year = [];
			$scope.options.month = [];
			$scope.options.signinStats = false;
			$scope.selectValue = {
				year: {},
				month: {}
			};

			var year = parseInt(Api.formatDate('YYYY'));
			for (var i = year - 2; i < year + 3; i++) {
				$scope.options.year.push({
					name: i + '年',
					value: i
				});
			};

			var month = parseInt(Api.formatDate('M'));
			for (var i = 1; i < 13; i++) {
				$scope.options.month.push({
					name: i + '月',
					value: i
				});
			};

			for (var i = 0; i < $scope.options.year.length; i++) {
				var item = $scope.options.year[i];
				if (year == item.value) {
					$scope.selectValue.year = $scope.options.year[i];
				}
			}

			for (var i = 0; i < $scope.options.month.length; i++) {
				var item = $scope.options.month[i];
				if (month == item.value) {
					$scope.selectValue.month = $scope.options.month[i];
				}
			}

			// $scope.submit = function() {
			// 	var type = $scope.options.signinStats;
			// 	var confirmPopup = $ionicPopup.confirm({
			// 		title: '提示',
			// 		template: '是否' + (type ? '开启' : '关闭') + '签到?',
			// 		cancelText: '取消',
			// 		okText: '确定',
			// 	});
			// 	confirmPopup.then(function(res) {
			// 		if (res) {
			// 			public.updatePublicSigninStats($stateParams.item.id, {
			// 				attributes: [{
			// 					name: 'ds_ischekcin',
			// 					value: '@b/' + type.toString(),
			// 				}]
			// 			}, function() {
			// 				$scope.options.signinStats = !type;
			// 				$ionicPopup.alert({
			// 					template: '签到已' + (type ? '开启' : '关闭')
			// 				});
			// 			});
			// 		};
			// 	});
			// }

			// $scope.getPublicSigninStats = function() {
			// 	public.getPublicSigninStats($stateParams.item.id, function(result) {
			// 		$scope.options.signinStats = !(result.ds_ischekcin == 'True');
			// 	});
			// }

			$scope.search = function() {
				data = {
					"commonStr":publicId,
					"year": $scope.selectValue.year.value,
					"month": $scope.selectValue.month.value,
				};
				public.getPublicSigninList(data, function(result) {
					$scope.list = result;
				});
			};
			$scope.search();
			$scope.lookSignin = function(item){
				ngDialog.open({
					template: '/police_web/template/dialogs/signinRecord.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope,$state,common,user,public,judes,Api) {	
						// console.log(item);
						 $scope.showmap =false;
						if(item){
							$scope.list = item;
							$scope.formatDate = function(str) {
								if(str){
									return Api.formatDate('D日 HH:mm', str.replace('Z', '').replace('T', ' '));
								}							
							};

							$scope.lookMap = function(item) {
								$scope.position = [item.longitude,item.latitude];
								$scope.isShow = true;
								$scope.showmap =true;
								$scope.refresh++;								
							};		
						}else{

						}									
					},
				});
			}
		};
		//危爆物品管理
		$scope.get = function(){
			public.getDangerList(result.id,function(result){
				$scope.dangerList =[];
				for(var i=0;i<result.length;i++){
					var time=Api.formatDate('-',result[i].createdon);
					result[i].time=time;
					$scope.dangerList.push(result[i]);
				};				

			});
			$scope.Show.danger=true;
			$scope.Show.student=false;
			$scope.Show.form=false;
			$scope.Show.signin = false;
		};
		$scope.deleteDanger = function(id,e){
			e.stopPropagation();
			Api.checked('确定删除吗？',function(){
				public.deleteDanger(id,function(){
					Api.alert('删除成功');
					$scope.get();
				})
			})
			
		};
		$scope.lookDangers = function(item){
			ngDialog.open({
				template: '/police_web/template/dialogs/dangersInfo.html',
				appendClassName: 'ngdialog-place',
				controller: function($scope,$state,common,getBase64ByFile,user,public,judes) {
					
					public.getDangerDetail(item.id,function(result){
						$scope.dangermessage = {};
						$scope.imgData="";
						// console.log(result);
						$scope.dangermessage.name = result['ds_name'];
						$scope.dangermessage.person = result['ds_charge-ds_name'];
						$scope.dangermessage.phone = result['ds_charge-ds_phone'];
						$scope.dangermessage.id = result['ds_charge-ds_id'];
						$scope.dangermessage.type = result['ds_type'];
						$scope.dangermessage.location = result['ds_location']
						$scope.dangermessage.description = result['ds_description'];
						$scope.dangermessage.condition = result['ds_condition'];
						$scope.dangermessage.measure = result['ds_measure'];
						$scope.dangermessage.disposeplan = result['ds_disposeplan'];
						$scope.dangermessage.aheadpic = result['ds_picstub']?'危爆物品照片.jpeg':"";
						$scope.dangermessage.personid = result['ds_charge-ds_personid'];
						
						$('.look').unbind().bind('click',function(){
							if(result['ds_picstub']){	
								common.getSub(result['ds_picstub'], function(url) {
									$scope.dangermessage.imageSrc = url;
									var a = '<a href="' + $scope.dangermessage.imageSrc + '" target="_blank"><span> </span></a>';
									a = $(a);
									a.find('span').click();
										
								});
							
							}else{
								Api.alert( '未找到图片！');
							}
							
						});
						$scope.close = function(){
							$scope.closeThisDialog();
						};
						$scope.updataImage = function() {
							
							document.getElementById('uploadImage').click();
						};
						$scope.fileChange = function() {
							getBase64ByFile({
								fileType: 'image', // image or doc
								elementId: 'uploadImage',
								success: function(base64) {
									$scope.dangermessage.aheadpic = angular.element('#uploadImage')[0].files[0].name;
									$('.look').unbind().bind('click',function(){

										var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
										a = $(a);
										a.find('span').click();											
									})	
									$scope.imgData = base64;
								},
								error: function(message) {
									Api.alert(message);
								},
							});
						};
						$scope.resetDanger=function(){
							if (!judes.isNull($scope.dangermessage.name)) {
								Api.alert( '请填写危爆物品名称');
								return;
							};
							if (!judes.isNull($scope.dangermessage.person)) {
								Api.alert( '请填写负责人姓名');
								return;
							};
							if (!judes.isNull($scope.dangermessage.phone)) {
								
								Api.alert('请填写负责人电话号');
								return;
							};
							if (!judes.isPhone($scope.dangermessage.phone)) {
								Api.alert('负责人电话号输入错误');
								return;
							};
							if (!judes.isNull($scope.dangermessage.type)) {
								
								Api.alert('危爆物品类型不能为空');
								return;
							};
							if (!judes.isNull($scope.dangermessage.location)) {
								
								Api.alert('危爆物品存放位置不能为空');
								return;
							};
							
							function upData(subId) {
								var pustData = {
									"attributes": [{
										"name": "ds_name",
										"value": $scope.dangermessage.name
									}, {
										"name": "ds_type",
										"value": $scope.dangermessage.type
									},{
										"name": "ds_location",
										"value": $scope.dangermessage.location
									}]
								};
								if (subId) {
									pustData.attributes.push({
										"name": "ds_picstub",
										"value": subId
									});
								};
								if (judes.isNull($scope.dangermessage.description)) {
									pustData.attributes.push({
										"name": "ds_description",
										"value": $scope.dangermessage.description
									});
								};
								if (judes.isNull($scope.dangermessage.condition)) {
									pustData.attributes.push({
										"name": "ds_condition",
										"value": $scope.dangermessage.condition
									});
								};
								if (judes.isNull($scope.dangermessage.measure)) {
									pustData.attributes.push({
										"name": "ds_measure",
										"value": $scope.dangermessage.measure
									});
								};
								if (judes.isNull($scope.dangermessage.disposeplan)) {
									pustData.attributes.push({
										"name": "ds_disposeplan",
										"value": $scope.dangermessage.disposeplan
									});
								};
								common.upDataPeopleMessage($scope.dangermessage.personid, $scope.dangermessage.person, $scope.dangermessage.phone);
								public.upDataDangerDetail(item.id, pustData, function() {
									Api.alert('修改成功');
									$scope.closeThisDialog();
								});
							};
							if ($scope.imgData!='') {
								common.upDataSub({
									"fileName": "危爆物品图片",
									"fileType": ".jpg",
									"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
								}, function(result) {
									upData(result);
								});
							} else {
								upData(false);
							}

						}
						
					})
					
				},
			});			
		};

		$scope.addDangers = function(Id){
			ngDialog.open({
				template: '/police_web/template/dialogs/addDangers.html',
				appendClassName: 'ngdialog-place',
				controller: function($scope,$state,common,getBase64ByFile,user,public,judes) {
					
					
						$scope.dangermessage = {};
						$scope.imgData="";
						$scope.dangermessage.name = '';
						$scope.dangermessage.person = '';
						$scope.dangermessage.phone = '';
						$scope.dangermessage.id = '';
						$scope.dangermessage.type = '';
						$scope.dangermessage.location = '';
						$scope.dangermessage.description = '';
						$scope.dangermessage.condition = '';
						$scope.dangermessage.measure = '';
						$scope.dangermessage.disposeplan = '';
						$scope.dangermessage.aheadpic = "";
						$scope.dangermessage.personid = '';
						
						
						$scope.close = function(){
							$scope.closeThisDialog();
						};
						$scope.updataImage = function() {
							
							document.getElementById('uploadImage').click();
						};
						$scope.fileChange = function() {
							getBase64ByFile({
								fileType: 'image', // image or doc
								elementId: 'uploadImage',
								success: function(base64) {
									$scope.dangermessage.aheadpic = angular.element('#uploadImage')[0].files[0].name;
									$('.look').unbind().bind('click',function(){

										var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
										a = $(a);
										a.find('span').click();											
									})	
									$scope.imgData = base64;
								},
								error: function(message) {
									Api.alert(message);
								},
							});
						};
						$scope.submitDanger=function(){
							if (!judes.isNull($scope.dangermessage.name)) {
								Api.alert( '请填写危爆物品名称');
								return;
							};
							if (!judes.isNull($scope.dangermessage.person)) {
								Api.alert( '请填写负责人姓名');
								return;
							};
							if (!judes.isNull($scope.dangermessage.id)) {
								Api.alert( '请填写负责人身份证号');
								return;
							};
							if (!judes.isIdCard($scope.dangermessage.id)) {
								Api.alert( '请填写正确的负责人身份证号');
								return;
							};
							if (!judes.isNull($scope.dangermessage.phone)) {
								
								Api.alert('请填写负责人电话号');
								return;
							};
							if (!judes.isPhone($scope.dangermessage.phone)) {
								Api.alert('负责人电话号输入错误');
								return;
							};
							if (!judes.isNull($scope.dangermessage.type)) {
								
								Api.alert('危爆物品类型不能为空');
								return;
							};
							if (!judes.isNull($scope.dangermessage.location)) {
								
								Api.alert('危爆物品存放位置不能为空');
								return;
							};
							
							function upData(subId, peopleId) {
								var pustData = {
									"name": "ds_dangerousgoods",
									"attributes": [{
										"name": "ds_publicorder",
										"value": "@look/" + Id
									}, {
										"name": "ds_name",
										"value": $scope.dangermessage.name
									}, {
										"name": "ds_charge",
										"value": "@look/" + peopleId,
									}, {
										"name": "ds_type",
										"value": $scope.dangermessage.type
									},{
										"name": "ds_location",
										"value": $scope.dangermessage.location
									}]
								};
								if (subId) {
									pustData.attributes.push({
										"name": "ds_picstub",
										"value": subId
									});
								};
								if (judes.isNull($scope.dangermessage.description)) {
									pustData.attributes.push({
										"name": "ds_description",
										"value": $scope.dangermessage.description
									});
								};
								if (judes.isNull($scope.dangermessage.condition)) {
									pustData.attributes.push({
										"name": "ds_condition",
										"value": $scope.dangermessage.condition
									});
								};
								if (judes.isNull($scope.dangermessage.measure)) {
									pustData.attributes.push({
										"name": "ds_measure",
										"value": $scope.dangermessage.measure
									});
								};
								if (judes.isNull($scope.dangermessage.disposeplan)) {
									pustData.attributes.push({
										"name": "ds_disposeplan",
										"value": $scope.dangermessage.disposeplan
									});
								};
								common.upDataPeopleMessage(peopleId, $scope.dangermessage.person, $scope.dangermessage.phone);
								public.CreatDangerDetail(pustData, function() {
									Api.alert('创建成功');
									$scope.closeThisDialog();
									$scope.get();
								});
							};
							common.getPeopleId({
								"name": $scope.dangermessage.person,
								"idCard": $scope.dangermessage.id,
								"isCreate": "true"
							}, function(result) {
								var peopleId = result.personId;
								if(judes.isNull($scope.imgData)){
									common.upDataSub({
										"fileName": "危爆物品图片",
										"fileType": ".jpg",
										"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
									}, function(result) {
										upData(result, peopleId);
									});
								}else{
									upData(false, peopleId);
								}
								
							});

						};
					
				}					
			});			
		};

		//学生寝室管理
		
		$scope.getDormitoryList=function(){
			public.getDormitoryList(result.id,function(result){
			
				$scope.dormitoryList=[];
				$scope.dormitoryList=result;
				console.log($scope.dormitoryList);
			});
			$scope.Show.danger=false;
			$scope.Show.student=true;
			$scope.Show.form=false;
			$scope.Show.signin = false;
		};
		
		$scope.deleteHouse=function(id,e){
			e.stopPropagation();
			Api.checked('确定删除吗？',function(){
				public.deleteDormlist(id,function(){
					Api.alert('删除成功');
					$scope.getDormitoryList();
				})
			})			
		};
		//添加公寓
		$scope.addDormitoryHouse=function(){
			ngDialog.open({
					template: '/police_web/template/dialogs/addDormitoryHouse.html',
					controller: function($scope,$state,common,getBase64ByFile,user,public,judes,address) {

						$scope.addressList =[];
						$scope.address = {};
						$scope.address.ready = false;
						// 地址树原始数据
						$scope.address.data = [];
						// 地址树逐级列表
						$scope.address.list = [
							[],
							[],
							[],
							[]
						];
						// 地址树选择序号
						$scope.address.index = [0, 0, 0];
						// 地址树选择结果
						$scope.address.result = [{}, {}, {}];

						var formattingAddress = function(data, toData) {
							for (var i = 0; i < data.length; i++) {

								var _data = {};
								_data.name = data[i].name;
								_data.id = data[i].id;
								_data.index = i;
								toData.push(_data);
							};
						};
						address.get(function(result) {
							console.log(result);
							$scope.address.data = result;

							$scope.address.list = [
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}],
								[{
									name: '-请选择-',
									id: 1,
								}]
							];
							$scope.address.result[0] = $scope.address.list[0][0];
							$scope.address.result[1] = $scope.address.list[1][0];
							$scope.address.result[2] = $scope.address.list[2][0];
							$scope.address.result[3] = $scope.address.list[3][0];
							formattingAddress(result, $scope.address.list[0]);

						});
						$scope.address.change = function(index) {

							$scope.address.index = [$scope.address.result[0].index, $scope.address.result[2].index, $scope.address.result[3].index];
							console.log($scope.address.index);
							if (index == 0) {
								$scope.address.list[1] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[1] = $scope.address.list[1][0];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName='';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models, $scope.address.list[1]);
							};
							if (index == 1) {
								$scope.address.list[2] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[2] = $scope.address.list[2][0];
								$scope.address.result[3] = $scope.address.list[3][0];
								$scope.dormitoryhouseName='';
								formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[$scope.address.result[1].index].address3Models, $scope.address.list[2]);
							};
							if (index == 2) {
								$scope.address.list[3] = [{
									name: '-请选择-',
									id: 1,
								}];
								$scope.address.result[3] = $scope.address.list[3][0];
								if($scope.address.list[2][$scope.address.result[2].index + 1].id){
									address.last($scope.address.list[2][$scope.address.result[2].index + 1].id, function(result) {
										formattingAddress(result, $scope.address.list[3]);
										$scope.address.ready = true;
										
									});
								}
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
								$scope.dormitoryhouseName=$scope.addressList[1];			
							};
							if(index == 3){
								$scope.addressList =[];
								$scope.addressList =[$scope.address.result[1],$scope.address.result[2],$scope.address.result[3]];
								console.log($scope.addressList);
								$scope.dormitoryhouseName=$scope.addressList[2];

							};
							

						}; 
						$scope.create = function() {
							var _data = {
								"name": "ds_publicorder_address_l4",
								"attributes": [{
									"name": "ds_address_l4_ref",
									"value": "@look/" + $scope.dormitoryhouseName.id
								}, {
									"name": "ds_publicorder_ref",
									"value": "@look/" + publicId
								}]
							};
							public.CreatUniversity(_data, function() {
								Api.alert('创建成功');
								$scope.closeThisDialog();
								$scope.getDormitoryList();
							});
						};     

					}
			})
		};
		$scope.lookDormitory=function(treeId){
				ngDialog.open({
					template: '/police_web/template/dialogs/dormitory.html',
					appendClassName: 'ngdialog-place',
					controller: function($scope,$state,common,getBase64ByFile,user,public,judes) {
						$scope.dormitoryHouse=[];
						$scope.studentList=[];
						$scope.stuMessage={};
						$scope.addstudent={};
						$scope.stuMessage.peopleMessage=[];
						$scope.options={};
						$scope.items={};
						$scope.isShow={};
						$scope.isShow.showdorm=false;
						$scope.isShow.showStudent=false;
						$scope.isShow.showAddStu = false;
						$scope.isShow.addStu = false;


						function getDormlist(){
							public.getDormlist(treeId,function(result){
							
								$scope.dormitoryHouse=result;
								console.log($scope.dormitoryHouse);							

							});
						};
						getDormlist();
						
						$scope.deleteDormitory=function(id,e){
							e.stopPropagation();
							Api.checked('确定删除吗？',function(){
								public.deleteStudentList(id,function(){
									Api.alert('删除成功');
									$scope.isShow.showAddStu = false;
									$scope.isShow.addStu = false;
									$scope.isShow.showStudent=false;
									getDormlist();
								})
							})
						};
						//添加寝室
						var user = user.getUserMessage();						
						$scope.addDormitory =function(){							
							$scope.isShow.showdorm=true;
							$scope.isShow.showStudent=false;
							$scope.isShow.addStu = false;
							$scope.submitdormitory = function() {
								console.log(user);
								if (!judes.isNull($scope.options.floor)) {
									Api.alert('请填写楼层数');
									return;
								};

								if (!judes.isNull($scope.options.roomfigure)) {
									Api.alert('请填写楼房间数');
									return;
								};

								var data = {
									"name": "ds_realhouse",
									"attributes": [{
										"name": "ds_floor",
										"value": $scope.options.floor,
									}, {
										"name": "ds_roomfigure",
										"value": $scope.options.roomfigure,
									}, {
										"name": "ds_address_tree",
										"value": "@look/" + treeId,
									}, {
										"name": "ds_dutypolice",
										"value": "@look/" + user.policeCrmId,
									}, {
										"name": "ds_dutyplace",
										"value": "@look/" + user.teamId,
									}, {
										"name": "ds_address",
										"value": $scope.options.floor + '楼' + $scope.options.roomfigure + '寝'
									}]
								};

								public.dormitoryDetailAdd(data, function() {
									Api.alert('创建成功');
									getDormlist();
								});
							}
						};

						$scope.getStudent=function(dormdata){
							$scope.isShow.showStudent=true;
							$scope.isShow.showdorm=false;
							$scope.isShow.showAddStu =true;
							$scope.isShow.addStu = false;
							$scope.items.floor=dormdata['ds_floor'];
							$scope.items.dormitory=dormdata['ds_roomfigure'];

							function getStudentList(){
								public.getStudentList(dormdata.id,function(result){
									$scope.studentList=result;
									// console.log($scope.studentList);
									for (var i = 0; i < $scope.studentList.length; i++) {
										var item = $scope.studentList[i];
										item.isActive = false;
									};
									
								});
							};
							getStudentList();
							//查看学生信息
							$scope.lookstudentInfo=function(item){
								public.getStudentDetail(item['ds_person_ref-ds_personid'],function(result){
									for (var i = 0; i < $scope.studentList.length; i++) {
										$scope.studentList[i].isActive = false;
									};
									item.isActive = true;
									$scope.stuMessage.peopleMessage = result;
									console.log($scope.stuMessage.peopleMessage);
									
								})
							};
							//删除学生
							$scope.deleteStudent=function(item,e){
								e.stopPropagation();
								Api.checked('确定删除吗？',function(){
									public.deleteStudent(item.id,function(){
										Api.alert('删除成功');
										getStudentList();
									})
								})								
							};
							//修改学生信息
							$scope.upDataStudent = function(Id) {
								if (!judes.isNull($scope.stuMessage.peopleMessage['ds_name'])) {
									
									Api.alert('请填写学生姓名');
									return;
								};
								if (!judes.isNull($scope.stuMessage.peopleMessage['ds_phone'])) {
									Api.alert('请填写电话号码');
									return;
								};
								if (!judes.isPhone($scope.stuMessage.peopleMessage['ds_phone'])) {
								
									Api.alert('电话号输入错误');
									return;
								};
								if (!judes.isNull($scope.stuMessage.peopleMessage['ds_nativeplace'])) {
									
									Api.alert('请填写学生籍贯');
									return;
								};

								public.upDataStudent(Id,$scope.stuMessage.peopleMessage, function() {
									Api.alert('更新成功');
									getStudentList();
								});
							};
							//取消事件
							$scope.cancel= function(item){
								item.isActive = false;
							};
							//添加学生
							$scope.addStudent=function(){
								$scope.isShow.addStu = true;
								$scope.isShow.showStudent=false;
								$scope.isShow.showdorm=false;
								$scope.addstudent['ds_name']='';
								$scope.addstudent['ds_id']='';
								$scope.addstudent['ds_phone']='';
								$scope.addstudent['ds_nativeplace']='';

								$scope.submit = function() {
									$scope.isShow.showStudent=false;
									$scope.isShow.showdorm=false;
									$scope.isShow.showAddStu =true;
									

									if (!judes.isNull($scope.addstudent['ds_name'])) {
										Api.alert(
											 '请填写学生姓名'
										);
										return;
									};
									if (!judes.isNull($scope.addstudent['ds_id'])) {
										Api.alert(
											'请填写学生身份证号码'
										);
										return;
									};
									if (!judes.isIdCard($scope.addstudent['ds_id'])) {
										Api.alert(
											'学生身份证号输入错误'
										);
										return;
									};
									if (!judes.isNull($scope.addstudent['ds_phone'])) {
										Api.alert(
											'请填写电话号码'
										);
										return;
									};
									if (!judes.isPhone($scope.addstudent['ds_phone'])) {
										Api.alert(
											'电话号输入错误'
										);
										return;
									};
									if (!judes.isNull($scope.addstudent['ds_nativeplace'])) {
										Api.alert(
											 '请填写学生籍贯'
										);
										return;
									};
									common.getPeopleId({
										"name": $scope.addstudent['ds_name'],
										"idCard": $scope.addstudent['ds_id'],
										"isCreate": "true"
									}, function(result) {
										var personId = result.personId;
										public.upDataStudent(personId, $scope.addstudent);
										var data = {
											"name": "ds_residentsassociation",
											"attributes": [{
												"name": "ds_person_ref",
												"value": "@look/" + personId
											}, {
												"name": "ds_realhouse_ref",
												"value": "@look/" + dormdata.id
											}]
										}
										public.upDataStudentAboutRealHouse(data, function() {
											Api.alert('创建成功');
											$scope.isShow.addStu = false;
											$scope.isShow.showStudent=true;
											getStudentList();
										});
									});
								};
							};
							
						};
												
					},
				});			
		};
						
	});
	
	//检查项
	$scope.getCheckList=function(){
		public.getCheckList(publicId,function(result){
			$scope.check.buckleScore=0;
			$scope.checkList=[];
			for(var i=0;i<result.length;i++){
				var time=Api.formatDate('zh',result[i]['ds_date']);
				result[i].time=time;
				$scope.checkList.push(result[i]);
			};
			// console.log($scope.checkList);
			for (var i = 0; i < $scope.checkList.length; i++) {
				if ($scope.checkList[i].ds_lostscore) {
					$scope.check.buckleScore += parseInt($scope.checkList[i].ds_lostscore);
				};
			};
		});
	};
	$scope.getCheckList();		
	
	$scope.add = function() {
		var date = Api.formatDate('-')
		var _data = {
			"name": "ds_checkitem_person",
			"attributes": [{
				"name": "ds_date",
				"value": "@dt/" + date,
			}, {
				"name": "ds_publicorder_ref",
				"value": "@look/" + publicId,
			}]
		};
		public.CreatCheckItem(_data, function(result) {
			console.log(result);
			Api.alert('创建检查项成功');
			$scope.getCheckList();
			
		});		
	};
	$scope.lookCheckItem=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/addCheckItem.html',
			controller: function($scope,$state,common,user,public,judes,address) {
				$scope.detail={};
				$scope.businesskind = '10000000';
				public.getCheckItemListDetail(item.id,function(data){
					console.log(data);
					// public.getPublicBusinesskind(publicId, function(result) {
					// 	$scope.businesskind = result.ds_businesskind.split(':')[0];
					// });
					public.getPublicBusinesskind(publicId, function(result) {
						$scope.businesskind = result.ds_businesskind.split(':')[0];
					});
					$scope.editCheckItem=function(){
						console.log($scope.detail.select);
						if($scope.detail.select==1){
							ngDialog.open({
								template: '/police_web/template/dialogs/checkFire.html',
								appendClassName: 'ngdialog-place',
								controller: function($scope,$state,common,user,public,judes,address) {
									console.log(data);
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									var checkType = 'null';
									if (data.fireCheckModel) {
										checkType = 'update';
										$scope.options = data.fireCheckModel;

										$scope.options.ds_reviewdate = new Date($scope.options.ds_reviewdate);
									} else {
										checkType = 'create';
										$scope.options = {
												// ds_gapcsrcxfjdjcjl_bh: "检查记录编号",
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk1: false,
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk2: "100000000",
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk3: "100000000",
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk4: false,
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk5: false,
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk6: false,
												ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk7: false,
												ds_gapcsrcxfjdjcjl_jzfh1: "100000000",
												ds_gapcsrcxfjdjcjl_jzfh2: "100000000",
												ds_gapcsrcxfjdjcjl_jzfh3: "100000000",
												ds_gapcsrcxfjdjcjl_jzfh4: "100000000",
												ds_gapcsrcxfjdjcjl_jzfh5: "100000000",
												// ds_gapcsrcxfjdjcjl_jzfh6: "建筑防火6_其他情况",
												ds_gapcsrcxfjdjcjl_xfss1: "100000000",
												ds_gapcsrcxfjdjcjl_xfss2: "100000000",
												ds_gapcsrcxfjdjcjl_xfss3: "100000000",
												ds_gapcsrcxfjdjcjl_xfss4: false,
												// ds_gapcsrcxfjdjcjlb_bz: "备注",
												// ds_gapcsrcxfjdjcjlb_dwxz: "单位性质",
												// ds_gapcsrcxfjdjcjlb_dwzgryqm: "单位主管人员（签名）",
												ds_gapcsrcxfjdjcjlb_hfx1sfys: false,
												// ds_gapcsrcxfjdjcjlb_hfx1wh: "合法性1文号",
												// ds_gapcsrcxfjdjcjlb_hfx2bah: "合法性2备案号",
												ds_gapcsrcxfjdjcjlb_hfx2sfba: false,
												// ds_gapcsrcxfjdjcjlb_hfx3wh: "合法性3文号",
												ds_gapcsrcxfjdjcjlb_jcrq: "2017/02/04",
												// ds_gapcsrcxfjdjcjlb_jdjcryqm: "监督检查人员（签名）",
												// ds_gapcsrcxfjdjcjlb_jzcs: "建筑层数",
												// ds_gapcsrcxfjdjcjlb_jzgd: "建筑高度",
												// ds_gapcsrcxfjdjcjlb_jzmj: "建筑面积",
												ds_gapcsrcxfjdjcjlb_sfaqjc: false,
												ds_gapcsrcxfjdjcjlb_wfxw: "100000000",
												ds_gapcsrcxfjdjcjlb_xfaqgl1: "100000000",
												ds_gapcsrcxfjdjcjlb_xfaqgl2: false,
												ds_gapcsrcxfjdjcjlb_xfaqgl3: false,
												ds_gapcsrcxfjdjcjlb_xfaqgl4: "100000000",
												ds_gapcsrcxfjdjcjlb_xfaqgl5: false,
												// ds_gapcsrcxfjdjcjlb_xfaqgl6: "消防安全管理6_其他情况",
												// ds_gapcsrcxfjdjcjlb_zlgzqk: "责令改正情况",
												// ds_gapcsrcxfjdjcjlb_zyfzr: "主要负责人",
											}
											// $scope.options.ds_reviewdate = new Date();


									};
									$scope.submit = function() {
										if (!judes.isNull($scope.options.ds_reviewdate)) {
											Api.alert( '请输选择查时间');
											return;
										};
										var data = {
											"name": "ds_gapcsrcxfjdjcjl",
											"attributes": [{
												"name": "ds_reviewdate",
												"value": "@dt/" + Api.formatDate('-', $scope.options.ds_reviewdate)
											}, {
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_jcrq",
												"value": "@dt/" + Api.formatDate('-',item.time)
											}, {
												"name": "ds_check_ref",
												"value": "@look/" + item.id,
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_hfx1sfys",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_hfx1sfys.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_hfx2sfba",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_hfx2sfba.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_sfaqjc",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_sfaqjc.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_xfaqgl1",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl1
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_xfaqgl2",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl2.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_xfaqgl3",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl3.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_xfaqgl4",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl4
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_xfaqgl5",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl5.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_jzfh1",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_jzfh1
											}, {
												"name": "ds_gapcsrcxfjdjcjl_jzfh2",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_jzfh2
											}, {
												"name": "ds_gapcsrcxfjdjcjl_jzfh3",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_jzfh3
											}, {
												"name": "ds_gapcsrcxfjdjcjl_jzfh4",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_jzfh4
											}, {
												"name": "ds_gapcsrcxfjdjcjl_jzfh5",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_jzfh5
											}, {
												"name": "ds_gapcsrcxfjdjcjl_xfss1",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_xfss1
											}, {
												"name": "ds_gapcsrcxfjdjcjl_xfss2",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_xfss2
											}, {
												"name": "ds_gapcsrcxfjdjcjl_xfss3",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_xfss3
											}, {
												"name": "ds_gapcsrcxfjdjcjl_xfss4",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_xfss4.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk1",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk1.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk2",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk2
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk3",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk3
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk4",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk4.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk5",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk5.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk6",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk6.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk7",
												"value": "@b/" + $scope.options.ds_gapcsrcxfjdjcjl_cmwyhlxxfaqzzqk7.toString()
											}, {
												"name": "ds_gapcsrcxfjdjcjlb_wfxw",
												"value": "@code/" + $scope.options.ds_gapcsrcxfjdjcjlb_wfxw
											}]
										};

										if (checkType == 'update') {

											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jdjcryqm)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jdjcryqm",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jdjcryqm
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jdjcryqm",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_zyfzr)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zyfzr",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_zyfzr
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zyfzr",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_dwzgryqm)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwzgryqm",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_dwzgryqm
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwzgryqm",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjl_bh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_bh",
													"value": $scope.options.ds_gapcsrcxfjdjcjl_bh
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_bh",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_zlgzqk)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zlgzqk",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_zlgzqk
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zlgzqk",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_bz)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_bz",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_bz
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_bz",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjl_jzfh6)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_jzfh6",
													"value": $scope.options.ds_gapcsrcxfjdjcjl_jzfh6
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_jzfh6",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl6)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_xfaqgl6",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl6
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_xfaqgl6",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx3wh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx3wh",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx3wh
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx3wh",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx2bah)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx2bah",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx2bah
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx2bah",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx1wh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx1wh",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx1wh
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx1wh",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_dwxz)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwxz",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_dwxz
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwxz",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzmj)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzmj",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzmj
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzmj",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzcs)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzcs",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzcs
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzcs",
													"value": 'null'
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzgd)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzgd",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzgd
												});
											} else {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzgd",
													"value": 'null'
												});
											};



											public.upDataFireCheckFrom($scope.options.id, data, function(result) {
												Api.alert('修改成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {



											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jdjcryqm)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jdjcryqm",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jdjcryqm
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_zyfzr)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zyfzr",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_zyfzr
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_dwzgryqm)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwzgryqm",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_dwzgryqm
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjl_bh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_bh",
													"value": $scope.options.ds_gapcsrcxfjdjcjl_bh
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_zlgzqk)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_zlgzqk",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_zlgzqk
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_bz)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_bz",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_bz
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjl_jzfh6)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjl_jzfh6",
													"value": $scope.options.ds_gapcsrcxfjdjcjl_jzfh6
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl6)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_xfaqgl6",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_xfaqgl6
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx3wh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx3wh",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx3wh
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx2bah)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx2bah",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx2bah
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_hfx1wh)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_hfx1wh",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_hfx1wh
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_dwxz)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_dwxz",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_dwxz
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzmj)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzmj",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzmj
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzcs)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzcs",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzcs
												});
											};
											if (judes.isNull($scope.options.ds_gapcsrcxfjdjcjlb_jzgd)) {
												data.attributes.push({
													"name": "ds_gapcsrcxfjdjcjlb_jzgd",
													"value": $scope.options.ds_gapcsrcxfjdjcjlb_jzgd
												});
											};



											public.CreatFireCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									}

								}
							})
						}else if($scope.detail.select==2){
							ngDialog.open({
								template: '/police_web/template/dialogs/employeeCheck.html',
								appendClassName: 'ngdialog-place',
								controller: function($scope,$state,common,user,public,judes,address,$filter) {
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									$scope.peopleList = [];
									$scope.options = {};

									public.getPeopleList(publicId, function(result) {
										$scope.peopleList = result;
										for (var i = 0; i < $scope.peopleList.length; i++) {
											var item = $scope.peopleList[i];
											item.isActive = false;
										};

									});
									// public.getPeopleList(publicId, function(result) {
									// 	$scope.peopleList = result;
									// 	for(var i = 0; i < $scope.peopleList.length; i++) {
									// 		var item = $scope.peopleList[i];
									// 		item.isActive = false;
									// 	}
									// });
									if (data.employeeCheckModel) {
										checkType = 'update';
										$scope.options = data.employeeCheckModel;
									} else {
										checkType = 'create';
										$scope.options.ds_numberofpeople = 0;
										$scope.options.ds_offlinepersonnum = 0;
									};
									// if(data.employeeCheckModel) {
									// 	checkType = 'update';
									// 	$scope.options = data.employeeCheckModel;
									// } else {
									// 	checkType = 'create';
									// 	$scope.options.ds_numberofpeople = 0;
									// 	$scope.options.ds_offlinepersonnum - 0;
									// }
									$scope.People = {};
									$scope.People.show = function(people) {
										public.getPeopleDetail(people.id, function(result) {

											for (var i = 0; i < $scope.peopleList.length; i++) {
												$scope.peopleList[i].isActive = false;
											};
											people.isActive = true;
											$scope.People.detail = result;
											// console.log($scope.People.detail);
											$scope.People.detail['ds_employee-ds_birth'] = $filter('idCardNum')($scope.People.detail['ds_employee-ds_id'], 'birth');
											$scope.People.detail['ds_employee-ds_birth'] = Api.formatDate('zh', $scope.People.detail['ds_employee-ds_birth']);
											$scope.People.detail['ds_employee-ds_gender'] = $filter('idCardNum')($scope.People.detail['ds_employee-ds_id'], 'sex');
											common.getSub($scope.People.detail['ds_employee-ds_idaheadpic'], function(result) {
												$scope.People.detail.img = result;
											}, function() {
												Api.alert('身份证正面照片获取失败');
											});
										});
									};
									$scope.submit = function() {
		
										if (!judes.isInteger($scope.options.ds_numberofpeople)) {
											Api.alert("未登记人数只能输入数字");
											return;
										};
										if (!judes.isInteger($scope.options.ds_offlinepersonnum)) {
											Api.alert("登记不在岗人数只能输入数字");
											return;
										};

										var data = {
											"name": "ds_employeecheck",
											"attributes": []
										};
										if (checkType == 'update') {
											if (judes.isNull($scope.options.ds_numberofpeople)) {
												data.attributes.push({
													"name": "ds_numberofpeople",
													"value": "@wn/" + $scope.options.ds_numberofpeople,
												});
											} else {
												data.attributes.push({
													"name": "ds_numberofpeople",
													"value": "@wn/0"
												});
											};
											if (judes.isNull($scope.options.ds_offlinepersonnum)) {
												data.attributes.push({
													"name": "ds_offlinepersonnum",
													"value": "@wn/" + $scope.options.ds_offlinepersonnum,
												});
											} else {
												data.attributes.push({
													"name": "ds_offlinepersonnum",
													"value": "@wn/0"
												});
											};
											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description,
												});
											} else {
												data.attributes.push({
													"name": "ds_description",
													"value": "null"
												});
											};

											public.upDataPeopleCheckFrom($scope.options.id, data, function(result) {
												Api.alert('修改成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {
											if (judes.isNull($scope.options.ds_numberofpeople)) {
												data.attributes.push({
													"name": "ds_numberofpeople",
													"value": "@wn/" + $scope.options.ds_numberofpeople,
												});
											};
											if (judes.isNull($scope.options.ds_offlinepersonnum)) {
												data.attributes.push({
													"name": "ds_offlinepersonnum",
													"value": "@wn/" + $scope.options.ds_offlinepersonnum,
												});
											};
											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description,
												});
											};

											data.attributes.push({
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											});
											data.attributes.push({
												"name": "ds_check_ref",
												"value": "@look/" + item.id
											});

											public.CreatPeopleCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									};

								}
							})
						}else if($scope.detail.select==6){
							ngDialog.open({
								template: '/police_web/template/dialogs/caseCheck.html',
								appendClassName: 'ngdialog-place',
								controller: function($scope,$state,common,user,public,judes,address,options,$rootScope,caseService) {
									console.log(user.getUserMessage());

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
											name: '寻隙滋事',
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
											name: '寻隙滋事',
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
											value: '49102b83-5528-e711-80f9-708bcd7cc924',
										}]
									}];
									$scope.CaseCourseType = [{
										"name": '未结案',
										"value": false,
									}, {
										"name": '已结案',
										"value": true,
									}];
									$scope.picture = {};
									$scope.picture.mask = false;
									$scope.picture.pictureMask = false;
									$scope.picture.images = [];
									$scope.picture.casual = {};

									$scope.caseposition = [];
									$scope.Police = {};
									$scope.Police.UsedList = [];
									$scope.case = {};
									$scope.People = {};
									$scope.PeopleList=[];
									$scope.case.ds_personlist = [];
									$scope.case.Type = {};
									$scope.case.SubType = {};
									$scope.case.name = '';
									$scope.caseMaps = {};
									$scope.caseMaps.showCaseMap = false;
									$scope.options = {};
									$scope.formType = 'null';
									$scope.showForm = false;

									$scope.close=function(){
										$scope.closeThisDialog();
									};
									$scope.setAddressTree = function() {
										if ($scope.address.result[3]) {
											$scope.AddressTreeModal.hide();
											$scope.address.showName = $scope.address.result[3].name;
										} else {
											Api.alert({
												template: '请选择地址树<br>或在地址树管理中添加'
											});
										};
									};

									$scope.getDay = function(date, showObjKey, saveObjKey) {
										$scope.case[showObjKey] = Api.formatDate('zh', date);
										$scope.case[saveObjKey] = Api.formatDate('/', date);
									};

									$scope.getTime = function(date, showObjKey, saveObjKey) {
										$scope.case[showObjKey] = Api.formatDate('HH时mm分', date);
										$scope.case[saveObjKey] = Api.formatDate('HH:mm', date);
									};

									$scope.refreshCaseName = function(oldStr, newStr) {
										if (($scope.case.name.indexOf(oldStr) != -1) || $scope.case.name == '') {
											$scope.case.name = $scope.case.showReceptionDay + newStr + $scope.case.SubType.name + '案';
											$scope.case.address = newStr;
										} else {
											$scope.case.address = newStr;
										}
									};

									$scope.getType = function(type, SubType) {
										$scope.showForm = true;
										$scope.case.Type = type;
										$scope.case.SubType = SubType;
										$scope.refreshCaseName($scope.case.address, $scope.case.address);
									};

									

									

									options.get(['caseposition'], function(result) {
										$scope.caseposition = result.caseposition;

										common.getAllPloice(function(result) {
											$scope.Police.list = result;

											if (data.caseCheckModel) {
												$scope.formType = 'update';
												$scope.showForm = true;
												$scope.options = data.caseCheckModel;
												public.getCaseDetail($scope.options.ds_case_ref, function(result) {
													console.log(result);
													$scope.case.name = result.ds_name;
													$scope.case.position = [];
													$scope.case.position[1] = result.ds_latitude;
													$scope.case.position[0] = result.ds_longitude;

													if (result.ds_casestatus == "False") {
														$scope.case.CaseCourseType = $scope.CaseCourseType[0];
													};
													if (result.ds_receiveddate && result.ds_happendate) {
														$scope.getDay(new Date(result.ds_receiveddate), 'showReceptionDay', 'saveReceptionDay');
														$scope.getTime(new Date(result.ds_receiveddate), 'showReceptionTime', 'saveReceptionTime');
														$scope.getDay(new Date(result.ds_happendate), 'showStartDay', 'saveStartDay');
														$scope.getTime(new Date(result.ds_happendate), 'showStartTime', 'saveStartTime');
													};

													for (var i = 0; i < $scope.caseposition.length; i++) {
														if ($scope.caseposition[i].value == result.ds_caseposition.split(':')[0]) {
															$scope.case.caseposition = $scope.caseposition[i];
														}
													}

													for (var i = 0; i < $scope.CaseType.length; i++) {
														var item = $scope.CaseType[i];
														for (var d = 0; d < item.length; d++) {
															if (item[d].value == result.ds_casetype) {
																$scope.case.SubType = item[d];
																$scope.case.Type = $scope.CaseType[i];
															}
														}
													}

													$scope.case.address = result.ds_address;
													if (result.ds_personlist) {
														$scope.case.ds_personlist = result.ds_personlist.split(';');
														initPeopleList($scope.case.ds_personlist);
													};
													if (result.ds_helppolice) {
														$scope.case.ds_helppolice = result.ds_helppolice.split(';');
														initPoliceList($scope.case.ds_helppolice);
													};
													// Error 警员列表 缺少接口
												});

											} 
											// else {
											// 	// 获取经纬度
											// 	Api.Loading.show();
											// 	caseService.getAddress(function(str, position) {
											// 		Api.Loading.hide();
											// 		$scope.case.position = position;
											// 		$scope.refreshCaseName($scope.case.address, str);
											// 		$scope.$apply(function() {
											// 			$scope.formType = 'create';
											// 			$scope.showForm = false;
											// 			$scope.getDay(new Date(), 'showReceptionDay', 'saveReceptionDay');
											// 			$scope.getTime(new Date(), 'showReceptionTime', 'saveReceptionTime');
											// 			$scope.getDay(new Date(), 'showStartDay', 'saveStartDay');
											// 			$scope.getTime(new Date(), 'showStartTime', 'saveStartTime');
											// 			$scope.case.caseposition = $scope.caseposition[0];
											// 			$scope.case.CaseCourseType = $scope.CaseCourseType[0];
											// 			$scope.Police.UsedList.push(angular.copy(user.getUserMessage()));
											// 			// console.log(User);
											// 		});
											// 	});
											// };

										})											
									});

									var casePosition='';
									var casestr='';
									$scope.$on('casePosition.show',function(){
										
										$scope.case.position = casePosition;
										$scope.refreshCaseName($scope.case.address,casestr);
									});
									$scope.showCaseMap = function() {
										ngDialog.open({
											template: '/police_web/template/dialogs/choosePosition.html',
											appendClassName: 'ngdialog-place',
											controller: function($scope,$state,common,getBase64ByFile,user,public,judes,options,$rootScope) {
												$scope.caseMaps={};
												$scope.caseMaps.showCaseMap = true;
												$scope.setAddress = function(str, position) {
													$scope.caseMaps.showCaseMap = false;
													casePosition = position;
													casestr = str;
													$rootScope.$broadcast('casePosition.show');
													$scope.closeThisDialog();
													
												};
											}
										})
									};
									$scope.Police.add = function() {										
										ngDialog.open({
											template: '/police_web/template/dialogs/addPoliceName.html',
											appendClassName: 'ngdialog-place',
											controller: function($scope,$state,common,getBase64ByFile,user,public,judes,options,$filter,$rootScope) {
												$scope.Police={};
												$scope.Police.list = {};
												common.getAllPloice(function(result) {
													$scope.Police.list = result;
												});
												$scope.Police.setPeople = function(Police) {
													var isUsed = false;
													for (var i = 0; i < PoliceUsedList.length; i++) {
														if (PoliceUsedList[i].policeCrmId == Police.policeCrmId) {
															isUsed = true;
														}
													};
													if (!isUsed) {
														PoliceUsedList.push(Police);
														$rootScope.$broadcast('addPoliceName.show');
														$scope.closeThisDialog();
													};
													
												}
											}
										})
										
									};
									$scope.changeCaseType = function() {
										$scope.case.SubType = $scope.case.Type.subSet[0];
										$scope.refreshCaseName($scope.case.address, $scope.case.address);
									};

									$scope.changeCaseSubSetType = function() {
										$scope.refreshCaseName($scope.case.address, $scope.case.address);
									};

									function initPeopleList(idList) {
										var newList = angular.copy(idList);
										$scope.PeopleList=[];
										function initPeopleList() {
											var id = newList.shift();											
											public.getPeopleBriefMessage(id, function(result) {

												$scope.PeopleList.push(result);
												if (newList.length != 0) {
													initPeopleList();
												}
											})
										};
										initPeopleList();
									};

									function initPoliceList(idList) {
										var newList = angular.copy(idList);

										function initPoliceList() {
											var id = newList.shift();
											common.getPoliceByPoliceCRMId(id, function(result) {
												$scope.Police.UsedList.push(result);
												if (newList.length != 0) {
													initPoliceList();
												}
											})
										};
										initPoliceList();
									};

									var PoliceUsedList = [];
									$scope.$on('addPoliceName.show',function(){
										
										$scope.Police.UsedList = PoliceUsedList;
										
									});
									

									var casePersonlist = $scope.case.ds_personlist;
									$scope.People.add = function() {
										$scope.People.detail = {};
										ngDialog.open({
											template: '/police_web/template/dialogs/addcasePeople.html',
											
											controller: function($scope,$state,common,getBase64ByFile,user,public,judes,options,$rootScope) {
													$scope.People={};
													$scope.People.detail = {};
													$scope.People.setPeople = function() {
													if (!judes.isNull($scope.People.detail['ds_name'])) {
														Api.alert(
															'请填姓名'
														);
														return;
													};
													if (!judes.isNull($scope.People.detail['ds_id'])) {
														Api.alert(
															 '请填身份证号'
														);
														return;
													};
													if (!judes.isIdCard($scope.People.detail['ds_id'])) {
														Api.alert(
															'身份证号输入错误'
														);
														return;
													};

													if (!judes.isNull($scope.People.detail['ds_phone'])) {
														Api.alert(
															'请填写电话号'
														);
														return;
													};
													if (!judes.isPhone($scope.People.detail['ds_phone'])) {
														Api.alert(
															'电话号输入错误'
														);
														return;
													};
													if (!judes.isNull($scope.People.detail['ds_address'])) {
														Api.alert(
															'请填住址'
														);
														return;
													};
													common.getPeopleId({
														"name": $scope.People.detail['ds_name'],
														"idCard": $scope.People.detail['ds_id'],
														"isCreate": "true"
													}, function(result) {
														var peopleId = result.personId;
														public.updatePeopleBriefMessage(peopleId, {
															name: $scope.People.detail['ds_name'],
															phone: $scope.People.detail['ds_phone'],
															address: $scope.People.detail['ds_address'],
														}, function() {
															if ($.inArray(peopleId, casePersonlist) == -1) {
																casePersonlist.push(peopleId);
																$scope.PeopleList = [];
																initPeopleList(casePersonlist);
																$scope.closeThisDialog();
															} else {
																initPeopleList(casePersonlist);
																$scope.closeThisDialog();
															};
														});
													});
												};
											}
										})
										
									};

									$scope.People.delete = function(data, event, index) {
										event.stopPropagation();
										Api.checked('确定删除' + data.ds_name + '吗？',function(){
											$scope.case.ds_personlist.splice($.inArray(data.id, $scope.case.ds_personlist), 1);
										 	$scope.PeopleList.splice(index, 1);
										})		
									};

									
									$scope.People.show = function(people) {
										ngDialog.open({
											template: '/police_web/template/dialogs/addcasePeople.html',											
											controller: function($scope,$state,common,getBase64ByFile,user,public,judes,options,$rootScope) {
												$scope.People={};
												$scope.People.detail = people;
											}
										})
										
									};

									
									$scope.Police.delete = function(data, event, index) {
										console.log(data);
										event.stopPropagation();

										Api.checked('确定删除' + data.name + '吗？',function(){
											$scope.Police.UsedList.splice(index, 1);
										})	
									};


										$scope.submit = function() {
											if ($scope.formType == 'update') {

											} else if ($scope.formType == 'create') {
												var personlistStr = '';
												for (var i = 0; i < $scope.case.ds_personlist.length; i++) {
													personlistStr += $scope.case.ds_personlist[i] + ';';
												};
												personlistStr = personlistStr.substring(0, personlistStr.length - 1);

												var helppolice = '';
												for (var i = 0; i < $scope.Police.UsedList.length; i++) {
													helppolice += $scope.Police.UsedList[i] + ';';
												};
												helppolice = helppolice.substring(0, helppolice.length - 1);

												var data = {
													"name": "ds_case",
													"attributes": [{
														"name": "ds_address",
														"value": $scope.case.address
													}, {
														"name": "ds_caselocation",
														"value": "双阳区"
													}, {
														"name": "ds_caseposition",
														"value": "@code/" + $scope.case.caseposition.value
													}, {
														"name": "ds_casestatus",
														"value": "@b/" + $scope.case.CaseCourseType.value.toString()
													}, {
														"name": "ds_happendate",
														"value": "@dt/" + Api.formatDate('-', $scope.case.StartDay) + ' ' + Api.formatDate('HH:mm', $scope.case.StartTime)
													}, {
														"name": "ds_name",
														"value": $scope.case.name
													}, {
														"name": "ds_police_ref",
														"value": "@look/" + user.getUserMessage().policeCrmId
													}, {
														"name": "ds_receiveddate",
														"value": "@dt/" + Api.formatDate('-', $scope.case.ReceptionDay) + ' ' + Api.formatDate('HH:mm', $scope.case.ReceptionTime)
													}, {
														"name": "ds_latitude",
														"value": $scope.case.position[1].toString(),
													}, {
														"name": "ds_longitude",
														"value": $scope.case.position[0].toString(),
													}, {
														"name": "ds_casetype",
														"value": "@look/" + $scope.case.SubType.value
													}]
												};

												if (judes.isNull($scope.case.ds_description)) {
													data.attributes.push({
														"name": "ds_description",
														"value": $scope.case.ds_description
													});
												};
												if (judes.isNull(personlistStr)) {
													data.attributes.push({
														"name": "ds_personlist",
														"value": personlistStr
													});
												};
												if (judes.isNull(helppolice)) {
													data.attributes.push({
														"name": "ds_helppolice",
														"value": helppolice
													});
												};

												console.log(data);
												public.CreatCase(data, function(result) {
													var creatData = {
														"name": "ds_theft_exam",
														"attributes": [{
															"name": "ds_publicorder_ref",
															"value": "@look/" + publicId
														}, {
															"name": "ds_check_ref",
															"value": "@look/" + item.id,
														}, {
															"name": "ds_case_ref",
															"value": "@look/" + result.value
														}]
													}
													public.CreatCaseCheckFrom(creatData, function() {
														Api.alert('创建成功');
														$scope.closeThisDialog();
													});
												});
											} else {
												console.log('error');
											}
										};

								}
							})
						}else if($scope.detail.select==3){
							ngDialog.open({
								template: '/police_web/template/dialogs/prostitution.html',
								controller: function($scope,$state,common,user,public,judes,address) {
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									$scope.options = {};
									$scope.People = {};
									$scope.people={};
									$scope.people.show = false;
									$scope.PeopleList = [];
									function initPeopleList(idList) {
										var newList = angular.copy(idList);

										function initPeopleList() {
											var id = newList.shift();
											public.getPeopleBriefMessage(id, function(result) {
												$scope.PeopleList.push(result);
												for (var i = 0; i < $scope.PeopleList.length; i++) {
													var item = $scope.PeopleList[i];
													item.isActive = false;
												};
												if (newList.length != 0) {
													initPeopleList();
												}
											})
										};
										initPeopleList();
									};
									var checkType = 'null';
									if (data.prostitutionCheckModel) {
										$scope.options = data.prostitutionCheckModel;
										checkType = 'update';
										if ($scope.options.ds_personlist) {
											$scope.options.ds_personlist = $scope.options.ds_personlist.split(';');
											initPeopleList($scope.options.ds_personlist);
										} else {
											$scope.options.ds_personlist = [];
										}
									} else {
										checkType = 'create';
										$scope.options.ds_personlist = [];
									};
									$scope.People.add = function() {
										$scope.People.detail = {};
										$scope.people.show = true;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
									};
									$scope.People.delete = function(data,index) {
										Api.checked('确定删除吗？',function(){
											
												$scope.options.ds_personlist.splice($.inArray(data.id, $scope.options.ds_personlist), 1);
												$scope.PeopleList.splice(index, 1);
										})
									};
									$scope.People.show = function(people) {
										$scope.People.detail = people;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
										people.isActive = true;
										$scope.people.show = false;
									};
									$scope.People.setPeople = function() {

										if (!judes.isNull($scope.People.detail['ds_name'])) {
											Api.alert( '请填姓名');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_id'])) {
											Api.alert( '请填身份证号');
											return;
										};
										if (!judes.isIdCard($scope.People.detail['ds_id'])) {
											Api.alert( '身份证号输入错误');
											return;
										};

										if (!judes.isNull($scope.People.detail['ds_phone'])) {
											Api.alert( '请填写电话号');
											return;
										};
										if (!judes.isPhone($scope.People.detail['ds_phone'])) {
											Api.alert('电话号输入错误');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_address'])) {
											Api.alert('请填住址');
											return;
										};

										common.getPeopleId({
											"name": $scope.People.detail['ds_name'],
											"idCard": $scope.People.detail['ds_id'],
											"isCreate": "true"
										}, function(result) {
											var peopleId = result.personId;
											public.updatePeopleBriefMessage(peopleId, {
												name: $scope.People.detail['ds_name'],
												phone: $scope.People.detail['ds_phone'],
												address: $scope.People.detail['ds_address'],
											}, function() {
												if ($.inArray(peopleId, $scope.options.ds_personlist) == -1) {
													$scope.options.ds_personlist.push(peopleId);
													$scope.PeopleList = [];
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												} else {
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												};
											});
										});
									};
									$scope.submit = function() {
										var personlistStr = '';
										for (var i = 0; i < $scope.options.ds_personlist.length; i++) {
											personlistStr += $scope.options.ds_personlist[i] + ';';
										};
										personlistStr = personlistStr.substring(0, personlistStr.length - 1);

										var data = {
											"name": "ds_prostitution",
											"attributes": []
										};

										if (checkType == 'update') {

											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											} else {
												data.attributes.push({
													"name": "ds_personlist",
													"value": 'null'
												});
											};

											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											} else {
												data.attributes.push({
													"name": "ds_description",
													"value": 'null'
												});
											};

											public.upDataProstitutionCheckFrom($scope.options.id, data, function(result) {
												Api.alert('修改成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {
											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											};
											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											};
											data.attributes.push({
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											});
											data.attributes.push({
												"name": "ds_check_ref",
												"value": "@look/" + item.id
											});

											public.CreatProstitutionCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									};


								}
							})
						}else if($scope.detail.select==5){
							ngDialog.open({
								template: '/police_web/template/dialogs/drugCheck.html',
								controller: function($scope,$state,common,user,public,judes,address) {
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									$scope.options = {};
									$scope.People = {};
									$scope.people={};
									$scope.people.show = false;
									$scope.PeopleList = [];
									function initPeopleList(idList) {
										var newList = angular.copy(idList);

										function initPeopleList() {
											var id = newList.shift();
											public.getPeopleBriefMessage(id, function(result) {
												$scope.PeopleList.push(result);
												for (var i = 0; i < $scope.PeopleList.length; i++) {
													var item = $scope.PeopleList[i];
													item.isActive = false;
												};
												if (newList.length != 0) {
													initPeopleList();
												}
											})
										};
										initPeopleList();
									};
									var checkType = 'null';
									if (data.drugCheckModel) {
										$scope.options = data.drugCheckModel;
										checkType = 'update';
										if ($scope.options.ds_personlist) {
											$scope.options.ds_personlist = $scope.options.ds_personlist.split(';');
											initPeopleList($scope.options.ds_personlist);
										} else {
											$scope.options.ds_personlist = [];
										}
									} else {
										checkType = 'create';
										$scope.options.ds_personlist = [];
									};
									$scope.People.add = function() {
										$scope.People.detail = {};
										$scope.people.show = true;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
									};
									$scope.People.delete = function(data,index) {
										Api.checked('确定删除吗？',function(){
											
												$scope.options.ds_personlist.splice($.inArray(data.id, $scope.options.ds_personlist), 1);
												$scope.PeopleList.splice(index, 1);
										})
									};
									$scope.People.show = function(people) {
										$scope.People.detail = people;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
										people.isActive = true;
										$scope.people.show = false;
									};
									$scope.People.setPeople = function() {

										if (!judes.isNull($scope.People.detail['ds_name'])) {
											Api.alert( '请填姓名');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_id'])) {
											Api.alert( '请填身份证号');
											return;
										};
										if (!judes.isIdCard($scope.People.detail['ds_id'])) {
											Api.alert( '身份证号输入错误');
											return;
										};

										if (!judes.isNull($scope.People.detail['ds_phone'])) {
											Api.alert( '请填写电话号');
											return;
										};
										if (!judes.isPhone($scope.People.detail['ds_phone'])) {
											Api.alert('电话号输入错误');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_address'])) {
											Api.alert('请填住址');
											return;
										};

										common.getPeopleId({
											"name": $scope.People.detail['ds_name'],
											"idCard": $scope.People.detail['ds_id'],
											"isCreate": "true"
										}, function(result) {
											var peopleId = result.personId;
											public.updatePeopleBriefMessage(peopleId, {
												name: $scope.People.detail['ds_name'],
												phone: $scope.People.detail['ds_phone'],
												address: $scope.People.detail['ds_address'],
											}, function() {
												if ($.inArray(peopleId, $scope.options.ds_personlist) == -1) {
													$scope.options.ds_personlist.push(peopleId);
													$scope.PeopleList = [];
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												} else {
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												};
											});
										});
									};
									$scope.submit = function() {
										var personlistStr = '';
										for (var i = 0; i < $scope.options.ds_personlist.length; i++) {
											personlistStr += $scope.options.ds_personlist[i] + ';';
										};
										personlistStr = personlistStr.substring(0, personlistStr.length - 1);

										var data = {
											"name": "ds_drug",
											"attributes": []
										};

										if (checkType == 'update') {

											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											} else {
												data.attributes.push({
													"name": "ds_personlist",
													"value": 'null'
												});
											};

											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											} else {
												data.attributes.push({
													"name": "ds_description",
													"value": 'null'
												});
											};

											public.upDataDrugCheckFrom($scope.options.id, data, function(result) {
												Api.alert('更新成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {
											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											};
											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											};
											data.attributes.push({
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											});
											data.attributes.push({
												"name": "ds_check_ref",
												"value": "@look/" + item.id
											});

											public.CreatDrugCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									};

								}
							})
						}else if($scope.detail.select==4){
							ngDialog.open({
								template: '/police_web/template/dialogs/gambleCheck.html',
								controller: function($scope,$state,common,user,public,judes,address) {
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									$scope.options = {};
									$scope.People = {};
									$scope.people={};
									$scope.people.show = false;
									$scope.PeopleList = [];
									function initPeopleList(idList) {
										var newList = angular.copy(idList);

										function initPeopleList() {
											var id = newList.shift();
											public.getPeopleBriefMessage(id, function(result) {
												$scope.PeopleList.push(result);
												for (var i = 0; i < $scope.PeopleList.length; i++) {
													var item = $scope.PeopleList[i];
													item.isActive = false;
												};
												if (newList.length != 0) {
													initPeopleList();
												}
											})
										};
										initPeopleList();
									};
									var checkType = 'null';
									if (data.gambleCheckModel) {
										$scope.options = data.gambleCheckModel;
										checkType = 'update';
										if ($scope.options.ds_personlist) {
											$scope.options.ds_personlist = $scope.options.ds_personlist.split(';');
											initPeopleList($scope.options.ds_personlist);
										} else {
											$scope.options.ds_personlist = [];
										}
									} else {
										checkType = 'create';
										$scope.options.ds_personlist = [];
									};
									$scope.People.add = function() {
										$scope.People.detail = {};
										$scope.people.show = true;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
									};
									$scope.People.delete = function(data,index) {
										Api.checked('确定删除吗？',function(){
											
												$scope.options.ds_personlist.splice($.inArray(data.id, $scope.options.ds_personlist), 1);
												$scope.PeopleList.splice(index, 1);
										})
									};
									$scope.People.show = function(people) {
										$scope.People.detail = people;
										for (var i = 0; i < $scope.PeopleList.length; i++) {
											$scope.PeopleList[i].isActive = false;
										};
										people.isActive = true;
										$scope.people.show = false;
									};
									$scope.People.setPeople = function() {

										if (!judes.isNull($scope.People.detail['ds_name'])) {
											Api.alert( '请填姓名');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_id'])) {
											Api.alert( '请填身份证号');
											return;
										};
										if (!judes.isIdCard($scope.People.detail['ds_id'])) {
											Api.alert( '身份证号输入错误');
											return;
										};

										if (!judes.isNull($scope.People.detail['ds_phone'])) {
											Api.alert( '请填写电话号');
											return;
										};
										if (!judes.isPhone($scope.People.detail['ds_phone'])) {
											Api.alert('电话号输入错误');
											return;
										};
										if (!judes.isNull($scope.People.detail['ds_address'])) {
											Api.alert('请填住址');
											return;
										};

										common.getPeopleId({
											"name": $scope.People.detail['ds_name'],
											"idCard": $scope.People.detail['ds_id'],
											"isCreate": "true"
										}, function(result) {
											var peopleId = result.personId;
											public.updatePeopleBriefMessage(peopleId, {
												name: $scope.People.detail['ds_name'],
												phone: $scope.People.detail['ds_phone'],
												address: $scope.People.detail['ds_address'],
											}, function() {
												if ($.inArray(peopleId, $scope.options.ds_personlist) == -1) {
													$scope.options.ds_personlist.push(peopleId);
													$scope.PeopleList = [];
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												} else {
													initPeopleList($scope.options.ds_personlist);
													$scope.people.show=false;
												};
											});
										});
									};
									$scope.submit = function() {
										var personlistStr = '';
										for (var i = 0; i < $scope.options.ds_personlist.length; i++) {
											personlistStr += $scope.options.ds_personlist[i] + ';';
										};
										personlistStr = personlistStr.substring(0, personlistStr.length - 1);

										var data = {
											"name": "ds_gamble",
											"attributes": []
										};

										if (checkType == 'update') {

											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											} else {
												data.attributes.push({
													"name": "ds_personlist",
													"value": 'null'
												});
											};

											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											} else {
												data.attributes.push({
													"name": "ds_description",
													"value": 'null'
												});
											};

											public.upDataGamblingCheckFrom($scope.options.id, data, function(result) {
												Api.alert('更新成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {
											if (personlistStr) {
												data.attributes.push({
													"name": "ds_personlist",
													"value": personlistStr
												});
											};
											if (judes.isNull($scope.options.ds_description)) {
												data.attributes.push({
													"name": "ds_description",
													"value": $scope.options.ds_description
												});
											};
											data.attributes.push({
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											});
											data.attributes.push({
												"name": "ds_check_ref",
												"value": "@look/" + item.id
											});

											public.CreatGamblingCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									};

								}
							})
						}else if($scope.detail.select==7){
							ngDialog.open({
								template: '/police_web/template/dialogs/CheckRealName.html',
								appendClassName: 'ngdialog-place',
								controller: function($scope,$state,common,user,public,judes,address) {
									$scope.option = {};
									$scope.option.show=false;
									$scope.option.hide=true;
									public.getRealNameLogisticsList(publicId, function(result) {
										$scope.list = result;
										console.log($scope.list);
										for (var i = 0; i < $scope.list.length; i++) {
											var item = $scope.list[i];
											item.isActive = false;
										};
									});
									$scope.show=function(item){
										public.getRealNameLogisticsIntervalOrderList(item.id, function(result) {
											for (var i = 0; i < $scope.list.length; i++) {
												$scope.list[i].isActive= false;
											};
											item.isActive=true;
											$scope.waybillList = result;
										});
										
									};
									$scope.showCustom=function(){
										$scope.option.show=false;
								    	$scope.option.hide=true;
										$scope.isActive=true;
										for (var i = 0; i < $scope.list.length; i++) {
											$scope.list[i].isActive= false;
										};
										$scope.currentPageNum=1;
										$scope.allMessage=0;
										$scope.getMessageByPageNum = function(currentPageNum) {
											var data = {};
											data.id=publicId;
											data.text = $scope.option.searchText;
											data.index = currentPageNum;
											data.count = 12;
											
											public.getRealNameLogisticsCustomList(data,function(result,totalCount, currentPageNum){

												$scope.customWaybillList=result;
												
												$scope.allMessage = totalCount;
												$scope.currentPageNum = currentPageNum;

											});
										};
										$scope.getMessageByPageNum($scope.currentPageNum);
										$scope.$on('message.initPage', function() {
											$scope.getMessageByPageNum($scope.currentPageNum);
										});

									};
									$scope.readClassName = function(item) {
										var className = '';
										if (item.ds_orderstatus.split(":")[0] == '100000000') {
											className = 'red';
										};
										if (item.ds_orderstatus.split(":")[0] == '100000002') {
											className = 'opacity';
										};
										return className;
									};
									$scope.showDetail=function(item){
										ngDialog.open({
											template: '/police_web/template/dialogs/waybillInfo.html',
											appendClassName: 'ngdialog-place',
											controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
												console.log(item);
												public.getRealNameLogisticsDetailByOrderId(item.id, function(result) {
													$scope.detail = result;
													$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
													$('.look').unbind().bind('click',function(){
														if($scope.detail.ds_image){	
															common.getSub($scope.detail.ds_image, function(url) {
																$scope.detail.imageSrc = url;
																var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
																a = $(a);
																a.find('span').click();
																	
															});
														
														}else{
															Api.alert( '未找到图片！');
														}
														
													});
												});
												$scope.close = function(){
													$scope.closeThisDialog();
												};
												// $scope.updataImage = function() {
																
												// 	document.getElementById('uploadImage').click();
												// };
												// $scope.fileChange = function() {
												// 	getBase64ByFile({
												// 		fileType: 'image', // image or doc
												// 		elementId: 'uploadImage',
												// 		success: function(base64) {
												// 			$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
												// 			$('.look').unbind().bind('click',function(){

												// 				var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
												// 				a = $(a);
												// 				a.find('span').click();											
												// 			})	
												// 			$scope.imgData = base64;
												// 		},
												// 		error: function(message) {
												// 			Api.alert(message);
												// 		},
												// 	});
												// };
												// $scope.delete = function() {
													
												// 	if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
												// 		Api.alert('已作废');
												// 		return;
												// 	}else{
												// 		Api.checked('是否作废该订单?',function(){
												// 			public.invalidRealname(item.id, function() {
												// 				Api.alert('已作废');
												// 				$scope.closeThisDialog();
												// 			});
												// 		})
												// 	}
												// };
												// $scope.upData = function() {
													
												// 	if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
												// 		Api.alert('已作废');
												// 		return;
												// 	};

												// 	function upData(subId) {
												// 		if (!judes.isNull($scope.detail['ds_name'])) {
															
												// 			Api.alert('请填写物品名称');
												// 			return;
												// 		};
												// 		if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
												// 			Api.alert('请填写寄件人姓名');
												// 			return;
												// 		};
												// 		if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
												// 			Api.alert('请填写寄件人电话号');
												// 			return;
												// 		};
												// 		if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
												// 			Api.alert('寄件人电话号输入错误');
												// 			return;
												// 		};

												// 		if (!judes.isNull($scope.detail['ds_information'])) {
												// 			Api.alert('请填写物品描述');
												// 			return;
												// 		};

												// 		var data = {
												// 			"attributes": [{
												// 				"name": "ds_name",
												// 				"value": $scope.detail['ds_name']
												// 			}, {
												// 				"name": "ds_information",
												// 				"value": $scope.detail['ds_information']
												// 			}]
												// 		};

												// 		if (judes.isNull($scope.detail['ds_receivernic'])) {
												// 			data.attributes.push({
												// 				"name": "ds_receivernic",
												// 				"value": $scope.detail['ds_receivernic']
												// 			});
												// 		} else {
												// 			data.attributes.push({
												// 				"name": "ds_receivernic",
												// 				"value": "null"
												// 			});
												// 		};

												// 		if (judes.isNull($scope.detail['ds_receiverphone'])) {
												// 			if (!judes.isPhone($scope.detail['ds_receiverphone'])) {
												// 				Api.alert('收件人电话号输入错误');
												// 				return;
												// 			} else {
												// 				data.attributes.push({
												// 					"name": "ds_receiverphone",
												// 					"value": $scope.detail['ds_receiverphone']
												// 				});
												// 			};
												// 		} else {
												// 			data.attributes.push({
												// 				"name": "ds_receiverphone",
												// 				"value": "null"
												// 			});
												// 		};
												// 		if (subId) {
												// 			data.attributes.push({
												// 				"name": "ds_image",
												// 				"value": subId
												// 			});
												// 		};

												// 		public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
												// 		public.updateRealname(item.id, data, function() {
												// 			Api.alert('更新成功');
												// 		});
												// 	}

												// 	if ($scope.imgData) {
												// 		common.upDataSub({
												// 			"fileName": "物品图片",
												// 			"fileType": ".jpg",
												// 			"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
												// 		}, function(result) {
												// 			upData(result);
												// 		});
												// 	} else {
												// 		upData(false);
												// 	}
												// };


											}
										})
									};
									$scope.search=function(){
										if(!judes.isNull($scope.option.searchText)){
								    		Api.alert('请输入要搜索的关键字');
								    		return;
								    	};
								    	console.log($scope.option.searchText);
								    	var searchText=$scope.option.searchText;
										ngDialog.open({
											template: '/police_web/template/dialogs/checkLogisticsSearch.html',
											appendClassName: 'ngdialog-place',
											controller: function($scope,$state,common,user,public,judes,address) {
												$scope.option = {};
												$scope.currentPageNum=1;
												$scope.allMessage=0;
												$scope.emptyShow=false;

												$scope.getMessageByPageNum = function(currentPageNum) {
													var data = {};
													data.id=publicId;
													data.text =searchText;
													data.index = currentPageNum;
													data.count = 12;
													
													public.getRealNameLogisticsSearch(data,function(result,totalCount,currentPageNum){
														
														$scope.allMessage = totalCount;
														$scope.currentPageNum = currentPageNum;
														if(!judes.isNull(result) && currentPageNum==1){
															$scope.emptyShow=true;
														}else{
															$scope.emptyShow=false;
															$scope.searchList=result;
														}
													});
												};
												$scope.getMessageByPageNum($scope.currentPageNum);
												$scope.$on('message.initPage', function() {
													$scope.getMessageByPageNum($scope.currentPageNum);
												});
												$scope.showDetail=function(item){
													ngDialog.open({
														template: '/police_web/template/dialogs/waybillInfo.html',
														appendClassName: 'ngdialog-place',
														controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
															console.log(item);
															public.getRealNameLogisticsDetailByOrderId(item.id, function(result) {
																$scope.detail = result;
																$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
																$('.look').unbind().bind('click',function(){
																	if($scope.detail.ds_image){	
																		common.getSub($scope.detail.ds_image, function(url) {
																			$scope.detail.imageSrc = url;
																			var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
																			a = $(a);
																			a.find('span').click();
																				
																		});
																	
																	}else{
																		Api.alert( '未找到图片！');
																	}
																	
																});
															});
															$scope.close = function(){
																$scope.closeThisDialog();
															};
															// $scope.updataImage = function() {
																			
															// 	document.getElementById('uploadImage').click();
															// };
															// $scope.fileChange = function() {
															// 	getBase64ByFile({
															// 		fileType: 'image', // image or doc
															// 		elementId: 'uploadImage',
															// 		success: function(base64) {
															// 			$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
															// 			$('.look').unbind().bind('click',function(){

															// 				var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
															// 				a = $(a);
															// 				a.find('span').click();											
															// 			})	
															// 			$scope.imgData = base64;
															// 		},
															// 		error: function(message) {
															// 			Api.alert(message);
															// 		},
															// 	});
															// };
															// $scope.delete = function() {
																
															// 	if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
															// 		Api.alert('已作废');
															// 		return;
															// 	}else{
															// 		Api.checked('是否作废该订单?',function(){
															// 			public.invalidRealname(item.id, function() {
															// 				Api.alert('已作废');
															// 				$scope.closeThisDialog();
															// 			});
															// 		})
															// 	}
															// };
															// $scope.upData = function() {
																
															// 	if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
															// 		Api.alert('已作废');
															// 		return;
															// 	};

															// 	function upData(subId) {
															// 		if (!judes.isNull($scope.detail['ds_name'])) {
																		
															// 			Api.alert('请填写物品名称');
															// 			return;
															// 		};
															// 		if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
															// 			Api.alert('请填写寄件人姓名');
															// 			return;
															// 		};
															// 		if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
															// 			Api.alert('请填写寄件人电话号');
															// 			return;
															// 		};
															// 		if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
															// 			Api.alert('寄件人电话号输入错误');
															// 			return;
															// 		};

															// 		if (!judes.isNull($scope.detail['ds_information'])) {
															// 			Api.alert('请填写物品描述');
															// 			return;
															// 		};

															// 		var data = {
															// 			"attributes": [{
															// 				"name": "ds_name",
															// 				"value": $scope.detail['ds_name']
															// 			}, {
															// 				"name": "ds_information",
															// 				"value": $scope.detail['ds_information']
															// 			}]
															// 		};

															// 		if (judes.isNull($scope.detail['ds_receivernic'])) {
															// 			data.attributes.push({
															// 				"name": "ds_receivernic",
															// 				"value": $scope.detail['ds_receivernic']
															// 			});
															// 		} else {
															// 			data.attributes.push({
															// 				"name": "ds_receivernic",
															// 				"value": "null"
															// 			});
															// 		};

															// 		if (judes.isNull($scope.detail['ds_receiverphone'])) {
															// 			if (!judes.isPhone($scope.detail['ds_receiverphone'])) {
															// 				Api.alert('收件人电话号输入错误');
															// 				return;
															// 			} else {
															// 				data.attributes.push({
															// 					"name": "ds_receiverphone",
															// 					"value": $scope.detail['ds_receiverphone']
															// 				});
															// 			};
															// 		} else {
															// 			data.attributes.push({
															// 				"name": "ds_receiverphone",
															// 				"value": "null"
															// 			});
															// 		};
															// 		if (subId) {
															// 			data.attributes.push({
															// 				"name": "ds_image",
															// 				"value": subId
															// 			});
															// 		};

															// 		public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
															// 		public.updateRealname(item.id, data, function() {
															// 			Api.alert('更新成功');
															// 		});
															// 	}

															// 	if ($scope.imgData) {
															// 		common.upDataSub({
															// 			"fileName": "物品图片",
															// 			"fileType": ".jpg",
															// 			"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
															// 		}, function(result) {
															// 			upData(result);
															// 		});
															// 	} else {
															// 		upData(false);
															// 	}
															// };

														}
													})
												};


											}
										})

									};
									$scope.addDeductMark=function(){
										ngDialog.open({
											template: '/police_web/template/dialogs/otherCheck.html',
											controller: function($scope,$state,common,user,public,judes,address) {
												$scope.close=function(){
													$scope.closeThisDialog();
												};
												var checkType = 'null';
												$scope.options = {};
												if (data.realNameCheckModel) {
													checkType = 'update';
													$scope.options = data.realNameCheckModel;

												} else {
													checkType = 'create';
													$scope.options.ds_description = '';
													$scope.options.ds_pointsscore = 0;

												}

												$scope.submit = function() {
													if (!judes.isNull($scope.options.ds_description)) {
														Api.alert('请填写扣分描述');
														return;
													};
													if (!judes.isNull($scope.options.ds_pointsscore)) {
														Api.alert('请填写扣分数');
														return;
													};

													if (!judes.isInteger($scope.options.ds_pointsscore)) {
														Api.alert( '扣分数只能为数字');
														return;
													};

													var data = {
														"name": "ds_othersituations_exam",
														"attributes": [{
															"name": "ds_description",
															"value": $scope.options.ds_description
														}, {
															"name": "ds_pointsscore",
															"value": "@nu/" + $scope.options.ds_pointsscore
														}]
													};

													if (checkType == 'update') {
														public.upDataRealnameCheckFrom($scope.options.id, data, function(result) {
															Api.alert('修改成功');
															$scope.closeThisDialog();
														});
													} else if (checkType == 'create') {

														data.attributes.push({
															"name": "ds_publicorder_ref",
															"value": "@look/" + publicId
														});
														data.attributes.push({
															"name": "ds_check_ref",
															"value": "@look/" + item.id
														});

														public.CreatRealnameCheckFrom(data, function(result) {
															Api.alert('创建成功');
															$scope.closeThisDialog();
														});
													} else {
														console.log('error');
													}
												};
											}
										})
									};

								}
							})
						}else if($scope.detail.select==8){
							ngDialog.open({
								template: '/police_web/template/dialogs/otherCheck.html',
								controller: function($scope,$state,common,user,public,judes,address) {
									$scope.close=function(){
										$scope.closeThisDialog();
									};
									var checkType = 'null';
									$scope.options = {};
									if (data.otherSituationCheckModel) {
										checkType = 'update';
										$scope.options = data.otherSituationCheckModel;

									} else {
										checkType = 'create';
										$scope.options.ds_description = '';
										$scope.options.ds_pointsscore = 0;

									}

									$scope.submit = function() {
										if (!judes.isNull($scope.options.ds_description)) {
											Api.alert('请填写扣分描述');
											return;
										};
										if (!judes.isNull($scope.options.ds_pointsscore)) {
											Api.alert('请填写扣分数');
											return;
										};

										if (!judes.isInteger($scope.options.ds_pointsscore)) {
											Api.alert( '扣分数只能为数字');
											return;
										};

										var data = {
											"name": "ds_othersituations_exam",
											"attributes": [{
												"name": "ds_description",
												"value": $scope.options.ds_description
											}, {
												"name": "ds_pointsscore",
												"value": "@nu/" + $scope.options.ds_pointsscore
											}]
										};

										if (checkType == 'update') {
											public.upDataOtherCheckFrom($scope.options.id, data, function(result) {
												Api.alert('修改成功');
												$scope.closeThisDialog();
											});
										} else if (checkType == 'create') {

											data.attributes.push({
												"name": "ds_publicorder_ref",
												"value": "@look/" + publicId
											});
											data.attributes.push({
												"name": "ds_check_ref",
												"value": "@look/" + item.id
											});

											public.CreatOtherCheckFrom(data, function(result) {
												Api.alert('创建成功');
												$scope.closeThisDialog();
											});
										} else {
											console.log('error');
										}
									};
								}
							})
						}else{
							return;
						}
					}

				});
			}
		})
	};		

});
//实名制物流
controllers.controller('index.realnameLogistics', function($scope, $state, Api, ngDialog, download, checkType, public,judes) {
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].id;
	var name = crumbs[2].name;
	var type = crumbs[2].type;
	if(crumbs[2].fromfirst){
		var publicName=crumbs[2].publicName;
	}else{
		var publicName=crumbs[1].name;
	}
	

	$scope.title = $scope.$parent.$parent.title = name;
	
	$scope.option = {};
	$scope.option.show=false;
	$scope.option.hide=true;
	public.getRealNameLogisticsList(publicId, function(result) {
		$scope.list = result;
		// console.log($scope.list);
		for (var i = 0; i < $scope.list.length; i++) {
			var item = $scope.list[i];
			item.isActive = false;
		};
	});
	$scope.show=function(item){
		public.getRealNameLogisticsIntervalOrderList(item.id, function(result) {
			for (var i = 0; i < $scope.list.length; i++) {
				$scope.list[i].isActive= false;
			};
			item.isActive=true;
			$scope.waybillList = result;
		});
		
	};
	$scope.showCustom=function(){
		$scope.option.show=false;
    	$scope.option.hide=true;
		$scope.isActive=true;
		for (var i = 0; i < $scope.list.length; i++) {
			$scope.list[i].isActive= false;
		};
		$scope.currentPageNum=1;
		$scope.allMessage=0;
		$scope.getMessageByPageNum = function(currentPageNum) {
			var data = {};
			data.id=publicId;
			data.text = $scope.option.searchText;
			data.index = currentPageNum;
			data.count = 12;
			
			public.getRealNameLogisticsCustomList(data,function(result,totalCount, currentPageNum){

				$scope.customWaybillList=result;
				
				$scope.allMessage = totalCount;
				$scope.currentPageNum = currentPageNum;

			});
		};
		$scope.getMessageByPageNum($scope.currentPageNum);
		$scope.$on('message.initPage', function() {
			$scope.getMessageByPageNum($scope.currentPageNum);
		});


	};
	$scope.readClassName = function(item) {
		var className = '';
		if (item.ds_orderstatus.split(":")[0] == '100000000') {
			className = 'red';
		};
		if (item.ds_orderstatus.split(":")[0] == '100000002') {
			className = 'opacity';
		};
		return className;
	};
	$scope.showDetail=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/waybillInfo.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
				// console.log(item);
				$scope.create='';
				public.getRealNameLogisticsDetailByOrderId(item.id, function(result) {
					$scope.detail = result;
					$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
					$('.look').unbind().bind('click',function(){
						if($scope.detail.ds_image){	
							common.getSub($scope.detail.ds_image, function(url) {
								$scope.detail.imageSrc = url;
								var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();
									
							});
						
						}else{
							Api.alert( '未找到图片！');
						}
						
					});
				});
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.delete = function() {
					
					if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
						Api.alert('已作废');
						return;
					}else{
						Api.checked('是否作废该订单?',function(){
							public.invalidRealname(item.id, function() {
								Api.alert('已作废');
								$scope.closeThisDialog();
							});
						})
					}
				};
				$scope.upData = function() {
					
					if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
						Api.alert('已作废');
						return;
					};

					function upData(subId) {
						if (!judes.isNull($scope.detail['ds_name'])) {
							
							Api.alert('请填写物品名称');
							return;
						};
						if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
							Api.alert('请填写寄件人姓名');
							return;
						};
						if (!$scope.detail['ds_person-ds_personid']) {
							$scope.create=false;
							if (!judes.isNull($scope.detail['ds_person-ds_id'])) {
								$ionicPopup.alert({
									template: '请填写寄件人身份证'
								});
								return;
							};
							if (!judes.isIdCard($scope.detail['ds_person-ds_id'])) {
								$ionicPopup.alert({
									template: '请填写正确的寄件人身份证'
								});
								return;
							};
						}else{
							$scope.create=true;
						};
						if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
							Api.alert('请填写寄件人电话号');
							return;
						};
						if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
							Api.alert('寄件人电话号输入错误');
							return;
						};

						if (!judes.isNull($scope.detail['ds_information'])) {
							Api.alert('请填写物品描述');
							return;
						};

						var data = {
							"attributes": [{
								"name": "ds_name",
								"value": $scope.detail['ds_name']
							}, {
								"name": "ds_information",
								"value": $scope.detail['ds_information']
							},{
								"name": "ds_orderstatus",
								"value": "@code/100000002"
							}]
						};

						if (judes.isNull($scope.detail['ds_receivernic'])) {
							data.attributes.push({
								"name": "ds_receivernic",
								"value": $scope.detail['ds_receivernic']
							});
						} else {
							data.attributes.push({
								"name": "ds_receivernic",
								"value": "null"
							});
						};

						if (judes.isNull($scope.detail['ds_receiverphone'])) {
							if (!judes.isPhone($scope.detail['ds_receiverphone'])) {
								Api.alert('收件人电话号输入错误');
								return;
							} else {
								data.attributes.push({
									"name": "ds_receiverphone",
									"value": $scope.detail['ds_receiverphone']
								});
							};
						} else {
							data.attributes.push({
								"name": "ds_receiverphone",
								"value": "null"
							});
						};
						if (subId) {
							data.attributes.push({
								"name": "ds_image",
								"value": subId
							});
						};

						if ($scope.detail['ds_person-ds_personid']) {
							public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
							public.updateRealname(item.id, data, function() {
								Api.alert('更新成功');
							});
						} else {
							common.getPeopleId({
								"name": $scope.detail['ds_person-ds_name'],
								"idCard": $scope.detail['ds_person-ds_id'],
								"isCreate": "true"
							}, function(result) {
								var personId = result.personId;
								public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
								data.attributes.push({
									"name": "ds_person",
									"value": "@look/" + personId
								});
								public.updateRealname(item.id, data, function() {
									Api.alert('更新成功');
								});
							})
						};
					};

					if ($scope.imgData) {
						common.upDataSub({
							"fileName": "物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							upData(result);
						});
					} else {
						upData(false);
					}
				};

			}
		})
	};
    
    $scope.addWaybill=function(){
    	ngDialog.open({
			template: '/police_web/template/dialogs/addWaybill.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
				$scope.detail = {};
				$scope.options = {};

				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.submit = function() {

					if (!judes.isNull($scope.detail['ds_ordernum'])) {
						Api.alert('请填写订单编号');
						return;
					};

					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert('请填写物品名称');
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert('请填写寄件人姓名');
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_id'])) {
						Api.alert('请填写寄件人身份证号');
						return;
					};
					if (!judes.isIdCard($scope.detail['ds_person-ds_id'])) {
						Api.alert('寄件人身份证号输入错误');
						return;
					};

					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert('请填写寄件人电话号');
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert('寄件人电话号输入错误');
						return;
					};

					common.getPeopleId({
						"name": $scope.detail['ds_person-ds_name'],
						"idCard": $scope.detail['ds_person-ds_id'],
						"isCreate": "true"
					}, function(result) {
						var personId = result.personId;
						public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						common.upDataSub({
							"fileName": "物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							var data = {
								"attributes": [{
									"name": "ds_name",
									"value": $scope.detail['ds_name']
								}, {
									"name": "ds_image",
									"value": result
								}, {
									"name": "ds_orderstatus",
									"value": "@code/100000002"
								}, {
									"name": "ds_person",
									"value": "@look/" + personId
								}, {
									"name": "ds_publicorder",
									"value": "@look/" + publicId
								}]
							};


							public.RealNameCheckOrder($scope.detail['ds_ordernum'], function(result) {
								if (result.length == 0) {
									data.name = "ds_shimingzhi";
									data.attributes.push({
										"name": "ds_ordernum",
										"value": $scope.detail['ds_ordernum']
									});

									if (judes.isNull($scope.detail['ds_information'])) {
										data.attributes.push({
											"name": "ds_information",
											"value": $scope.detail['ds_information']
										});
									};
									if (judes.isNull($scope.detail['ds_receivernic'])) {
										data.attributes.push({
											"name": "ds_receivernic",
											"value": $scope.detail['ds_receivernic']
										});
									};
									if (judes.isNull($scope.detail['ds_receiverphone'])) {
										data.attributes.push({
											"name": "ds_receiverphone",
											"value": $scope.detail['ds_receiverphone']
										});
									};
									// console.log(data);
									public.creatRealname(data, function() {
										Api.alert('创建成功');
										$scope.closeThisDialog();
									});
								} else {


									if (judes.isNull($scope.detail['ds_information'])) {
										data.attributes.push({
											"name": "ds_information",
											"value": $scope.detail['ds_information']
										});
									} else {
										data.attributes.push({
											"name": "ds_information",
											"value": 'null'
										});
									};
									if (judes.isNull($scope.detail['ds_receivernic'])) {
										data.attributes.push({
											"name": "ds_receivernic",
											"value": $scope.detail['ds_receivernic']
										});
									} else {
										data.attributes.push({
											"name": "ds_receivernic",
											"value": 'null'
										});
									};
									if (judes.isNull($scope.detail['ds_receiverphone'])) {
										data.attributes.push({
											"name": "ds_receiverphone",
											"value": $scope.detail['ds_receiverphone']
										});
									} else {
										data.attributes.push({
											"name": "ds_receiverphone",
											"value": 'null'
										});
									};
									var id = result[0].id;
									public.updateRealname(id, data, function() {
										Api.alert('更新成功');
										$scope.closeThisDialog();
									});
								}
							});
						});
					});
				};

			}
		})
    };
    $scope.search=function(){
    	if(!judes.isNull($scope.option.searchText)){
    		Api.alert('请输入要搜索的关键字');
    		return;
    	};
    	Api.Storage.set('crumbs', [{
			name:'行业场所',
			stateName: 'place',
		},{
			name:publicName,
			stateName:'placeDetail',
			id: publicId,
			type:type,
		},{
			name:'实名制',
			stateName:'realnameLogistics',
			id:publicId,
			type:type,
		},{
			name:'搜索结果',
			stateName:'realnameLogisticsSearch',
			id:publicId,
			type:type,
			searchtext:$scope.option.searchText,

		}]);
		$state.go('index.realnameLogisticsSearch');

    	
    	
    };
	
});
controllers.controller('index.realnameLogisticsSearch', function($scope, $state, Api, ngDialog, download, checkType, public,judes) {
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[3].id;
	var name = crumbs[3].name;
	var type = crumbs[3].type;
	var searchtext=crumbs[3].searchtext;
	var publicName=crumbs[3].publicName;
	$scope.title = $scope.$parent.$parent.title = name;
	
	$scope.option = {};

	$scope.currentPageNum=1;
	$scope.allMessage=0;
	$scope.emptyShow=false;
	$scope.getMessageByPageNum = function(currentPageNum) {
		var data = {};
		data.id=publicId;
		data.text = searchtext;
		data.index = currentPageNum;
		data.count = 12;
		
		public.getRealNameLogisticsSearch(data,function(result,totalCount,currentPageNum){

			$scope.searchList=result;
			$scope.allMessage = totalCount;
			$scope.currentPageNum = currentPageNum;
			if(!judes.isNull(result) && currentPageNum==1){
				$scope.emptyShow=true;
			}else{
				$scope.emptyShow=false;
				$scope.searchList=result;
			}

		});
	};
	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});
	$scope.showDetail=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/waybillInfo.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
				console.log(item);
				public.getRealNameLogisticsDetailByOrderId(item.id, function(result) {
					$scope.detail = result;
					$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
					$('.look').unbind().bind('click',function(){
						if($scope.detail.ds_image){	
							common.getSub($scope.detail.ds_image, function(url) {
								$scope.detail.imageSrc = url;
								var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();
									
							});
						
						}else{
							Api.alert( '未找到图片！');
						}
						
					});
				});
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.delete = function() {
					
					if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
						Api.alert('已作废');
						return;
					}else{
						Api.checked('是否作废该订单?',function(){
							public.invalidRealname(item.id, function() {
								Api.alert('已作废');
								$scope.closeThisDialog();
							});
						})
					}
				};
				$scope.upData = function() {
					
					if ($scope.detail.ds_orderstatus.split(':')[0] == '100000000') {
						Api.alert('已作废');
						return;
					};

					function upData(subId) {
						if (!judes.isNull($scope.detail['ds_name'])) {
							
							Api.alert('请填写物品名称');
							return;
						};
						if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
							Api.alert('请填写寄件人姓名');
							return;
						};
						if (!$scope.detail['ds_person-ds_personid']) {
							if (!judes.isNull($scope.detail['ds_person-ds_id'])) {
								$ionicPopup.alert({
									template: '请填写寄件人身份证'
								});
								return;
							};
							if (!judes.isIdCard($scope.detail['ds_person-ds_id'])) {
								$ionicPopup.alert({
									template: '请填写正确的寄件人身份证'
								});
								return;
							};
						};
						if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
							Api.alert('请填写寄件人电话号');
							return;
						};

						if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
							Api.alert('寄件人电话号输入错误');
							return;
						};

						if (!judes.isNull($scope.detail['ds_information'])) {
							Api.alert('请填写物品描述');
							return;
						};

						var data = {
							"attributes": [{
								"name": "ds_name",
								"value": $scope.detail['ds_name']
							}, {
								"name": "ds_information",
								"value": $scope.detail['ds_information']
							},{
								"name": "ds_orderstatus",
								"value": "@code/100000002"
							}]
						};

						if (judes.isNull($scope.detail['ds_receivernic'])) {
							data.attributes.push({
								"name": "ds_receivernic",
								"value": $scope.detail['ds_receivernic']
							});
						} else {
							data.attributes.push({
								"name": "ds_receivernic",
								"value": "null"
							});
						};

						if (judes.isNull($scope.detail['ds_receiverphone'])) {
							if (!judes.isPhone($scope.detail['ds_receiverphone'])) {
								Api.alert('收件人电话号输入错误');
								return;
							} else {
								data.attributes.push({
									"name": "ds_receiverphone",
									"value": $scope.detail['ds_receiverphone']
								});
							};
						} else {
							data.attributes.push({
								"name": "ds_receiverphone",
								"value": "null"
							});
						};
						if (subId) {
							data.attributes.push({
								"name": "ds_image",
								"value": subId
							});
						};

						if ($scope.detail['ds_person-ds_personid']) {
							public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
							public.updateRealname(item.id, data, function() {
								Api.alert('更新成功');
							});
						} else {
							common.getPeopleId({
								"name": $scope.detail['ds_person-ds_name'],
								"idCard": $scope.detail['ds_person-ds_id'],
								"isCreate": "true"
							}, function(result) {
								var personId = result.personId;
								public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
								data.attributes.push({
									"name": "ds_person",
									"value": "@look/" + personId
								});
								public.updateRealname(item.id, data, function() {
									Api.alert('更新成功');
								});
							})
						};
					};

					if ($scope.imgData) {
						common.upDataSub({
							"fileName": "物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							upData(result);
						});
					} else {
						upData(false);
					}
				};

			}
		})
	};

});
//实名制废品回收
controllers.controller('index.publicRealNameWaste', function($scope, $state, Api, ngDialog, download, checkType, public) {

	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].id;
	var name = crumbs[2].name;
	var type = crumbs[2].type;	
	var publicName=crumbs[2].publicName;
	$scope.title = $scope.$parent.$parent.title = name;

	$scope.list = [];
	$scope.option = {};
	
	$scope.option.starTime = new Date(Api.formatDate('z') - (60 * 60 * 24 * 3 * 1000));
	$scope.option.endTime = new Date();
	$scope.currentPageNum=1;
	$scope.allMessage=0;


	$scope.formatDate = function(timeStr) {
		return Api.formatDate('/', timeStr);
	};
	
	$scope.getMessageByPageNum = function(currentPageNum) {
		
		$scope.option.index = currentPageNum;
		$scope.option.count = 2;
		$scope.option.id = publicId;
		$scope.option.starTime = $scope.formatDate($scope.option.starTime);
		$scope.option.endTime = $scope.formatDate($scope.option.endTime);
		console.log($scope.option)
		public.realNameSearchWithOutLogistics($scope.option, function(result,totalCount,currentPageNum) {
			console.log(result);
			$scope.list = result;
			$scope.allMessage = totalCount;
			$scope.currentPageNum = currentPageNum;

		});
	};
	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});
	$scope.delete = function(id,e){
		e.stopPropagation();
		Api.checked('确定删除吗？',function(){
			public.deleteRealname(id,function(){
				Api.alert('删除成功');
				if ($scope.currentPageNum != 1 && $scope.messageList.showList.length == 0) {
					$scope.getMessageByPageNum($scope.currentPageNum - 1);
				} else if ($scope.currentPageNum != 1 && $scope.messageList.showList.length != 0) {
					$scope.getMessageByPageNum($scope.currentPageNum);
				} else if ($scope.currentPageNum == 1) {
					$scope.getMessageByPageNum(1);
				}else{
					messageServers.alertTips("出错啦");
				}
				// $scope.getMessageByPageNum($scope.currentPageNum);
			})
		})
		
	};
	$scope.showInfo=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/wasteInfo.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,Api,getBase64ByFile) {								
				item.date=Api.formatDate('/',item['ds_date']);
				$scope.detail=item;
				$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
								
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.lookImg=function(){
					if($scope.detail.ds_image&&!$scope.imgData){
						
							if($scope.detail.ds_image){	
								common.getSub($scope.detail.ds_image, function(url) {
									$scope.detail.imageSrc = url;
									var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
									a = $(a);
									a.find('span').click();
										
								});
							
							}else{
								Api.alert( '未找到图片！');
							}							
						
					}else if($scope.imgData){
						var a = '<a href="' + $scope.imgData + '" target="_blank"><span> </span></a>';
						a = $(a);
						a.find('span').click();		
					}
				};
				
				$scope.upData = function() {
					
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if (!$scope.detail.aheadpic) {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					var upData = function(subId) {
						var data = {
							"attributes": [{
								"name": "ds_name",
								"value": $scope.detail['ds_name']
							}, {
								"name": "ds_information",
								"value": $scope.detail['ds_information']
							}]
						};
						if (judes.isNull($scope.detail['ds_weight'])) {
							data.attributes.push({
								"name": "ds_weight",
								"value": $scope.detail['ds_weight']
							});
						} else {
							data.attributes.push({
								"name": "ds_weight",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_type'])) {
							data.attributes.push({
								"name": "ds_type",
								"value": $scope.detail['ds_type']
							});
						} else {
							data.attributes.push({
								"name": "ds_type",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_brand'])) {
							data.attributes.push({
								"name": "ds_brand",
								"value": $scope.detail['ds_brand']
							});
						} else {
							data.attributes.push({
								"name": "ds_brand",
								"value": "null"
							});
						};
						if (subId) {
							data.attributes.push({
								"name": "ds_image",
								"value": subId
							});
						};
						public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						public.updateRealname(item['ds_shimingzhiid'], data, function() {
							Api.alert('更新成功');
							$scope.closeThisDialog();
						});
					}
					if ($scope.imgData) {
						common.upDataSub({
							"fileName": "危爆物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							upData(result);
						});
					} else {
						upData(false);
					}
				}

				
			}
		})
	};
	$scope.addWaste=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/addWaste.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
				$scope.detail = {};
				$scope.detail['ds_date'] = new Date();
				$scope.detail.fmtDT = Api.formatDate('zh', $scope.detail['ds_date']);

				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.submit = function() {
		
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if ($scope.detail.aheadpic=='') {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					common.getPeopleId({
						"name": $scope.detail['ds_person-ds_name'],
						"idCard": $scope.detail['ds_person-ds_id'],
						"isCreate": "true"
					}, function(result) {
						var personId = result.personId;
						public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						common.upDataSub({
							"fileName": "废品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							var data = {
								"name": "ds_shimingzhi",
								"attributes": [{
									"name": "ds_date",
									"value": "@dt/" + Api.formatDate('-', $scope.detail['ds_date']) + ' 8:00:00'
								}, {
									"name": "ds_name",
									"value": $scope.detail['ds_name']
								}, {
									"name": "ds_image",
									"value": result
								}, {
									"name": "ds_person",
									"value": "@look/" + personId
								}, {
									"name": "ds_publicorder",
									"value": "@look/" + publicId
								}]
							};
							if (judes.isNull($scope.detail['ds_weight'])) {
								data.attributes.push({
									"name": "ds_weight",
									"value": $scope.detail['ds_weight']
								});
							};
							if (judes.isNull($scope.detail['ds_information'])) {
								data.attributes.push({
									"name": "ds_information",
									"value": $scope.detail['ds_information']
								});
							};
							if (judes.isNull($scope.detail['ds_type'])) {
								data.attributes.push({
									"name": "ds_type",
									"value": $scope.detail['ds_type']
								});
							};
							if (judes.isNull($scope.detail['ds_brand'])) {
								data.attributes.push({
									"name": "ds_brand",
									"value": $scope.detail['ds_brand']
								});
							};
							public.creatRealname(data, function() {
								Api.alert('创建成功');
								$scope.closeThisDialog();
								$scope.getMessageByPageNum($scope.currentPageNum);
							});
						});
					});
				}

			}
		})
	};
	
});
//实名制旅馆
controllers.controller('index.publicRealNameHotel', function($scope, $state, Api, ngDialog, download, checkType, public) {
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].id;
	var name = crumbs[2].name;
	var type = crumbs[2].type;	
	var publicName=crumbs[2].publicName;
	$scope.title = $scope.$parent.$parent.title = name;

	$scope.list = [];
	$scope.option = {};	
	$scope.option.starTime = new Date(Api.formatDate('z') - (60 * 60 * 24 * 3 * 1000));
	$scope.option.endTime = new Date();
	$scope.currentPageNum=1;
	$scope.allMessage=0;

	$scope.formatDate = function(timeStr) {
		return Api.formatDate('/', timeStr);
	};

	$scope.getMessageByPageNum = function(currentPageNum) {
		
			$scope.option.index = currentPageNum;
			$scope.option.count = 10;
			$scope.option.id = publicId;
			$scope.option.starTime = $scope.formatDate($scope.option.starTime);
			$scope.option.endTime = $scope.formatDate($scope.option.endTime);
			console.log($scope.option)
			public.realNameSearchWithOutLogistics($scope.option, function(result,totalCount,currentPageNum) {
				console.log(result);
				$scope.list = result;
				$scope.allMessage = totalCount;
				$scope.currentPageNum = currentPageNum;

			});		
	};
	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});
	$scope.formatDate = function(timeStr) {
		return Api.formatDate('/', timeStr);
	};
	$scope.delete = function(id,e){
		e.stopPropagation();
		Api.checked('确定删除吗？',function(){
			public.deleteRealname(id,function(){
				Api.alert('删除成功');
				if ($scope.currentPageNum != 1 && $scope.messageList.showList.length == 0) {
					$scope.getMessageByPageNum($scope.currentPageNum - 1);
				} else if ($scope.currentPageNum != 1 && $scope.messageList.showList.length != 0) {
					$scope.getMessageByPageNum($scope.currentPageNum);
				} else if ($scope.currentPageNum == 1) {
					$scope.getMessageByPageNum(1);
				}else{
					messageServers.alertTips("出错啦");
				}
				
			})
		})
		
	};
	$scope.showhotel=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/hotelInfo.html',
			controller: function($scope,$state,common,user,public,judes,address) {
				item.ds_date=Api.formatDate('/',item['ds_date']);
				$scope.detail=item;
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				function initPeopleList(idList) {
					var newList = angular.copy(idList);

					function initPeopleList() {
						var id = newList.shift();
						public.getPeopleBriefMessage(id, function(result) {
							if (result) {
								$scope.PeopleList.push(result);
							};
							if (newList.length != 0) {
								initPeopleList();
							}
						})
					};
					initPeopleList();
				};
				if(item.ds_personlist){
					$scope.PeopleList = [];
					item.ds_personlist=item.ds_personlist.split(";");
					initPeopleList(item.ds_personlist);
				}
				// $scope.upData=function(){
				// 	if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
				// 		Api.alert(
				// 			'请填写顾客姓名'
				// 		);
				// 		return;
				// 	};
				// 	if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
				// 		Api.alert(
				// 		 '请填写顾客电话号码'
				// 		);
				// 		return;
				// 	};
				// 	if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
				// 		Api.alert(
				// 			'顾客电话号输入错误'
				// 		);
				// 		return;
				// 	};
				// 	if (!judes.isNull($scope.detail['ds_roomnum'])) {
				// 		Api.alert(
				// 			'请填写入住房间号'
				// 		);
				// 		return;
				// 	};
				// 	var data = {
				// 		"attributes": [{
				// 			"name": "ds_date",
				// 			"value": "@dt/" + Api.formatDate('-', $scope.detail['date']) + ' 8:00:00'
				// 		}, {
				// 			"name": "ds_roomnum",
				// 			"value": $scope.detail['ds_roomnum']
				// 		}]
				// 	};
				// 	console.log(data);
				// 	public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
				// 	public.updateRealname(item['ds_shimingzhiid'], data, function() {
				// 		Api.alert('更新成功');
				// 		$scope.closeThisDialog();
						
				// 	});
				// };
				
			}
		})
	};
	$scope.addHotel=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/addHotel.html',
			controller: function($scope,$state,common,user,public,judes,address) {
				$scope.currentPageNum=1;
				$scope.submit = function() {
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_id'])) {
						Api.alert(
							'请填写顾客身份证'
						);
						return;
					};
					if (!judes.isIdCard($scope.detail['ds_person-ds_id'])) {
						Api.alert(
							'顾客身份证输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_roomnum'])) {
						Api.alert(
							'请填写入住房间号'
						);
						return;
					};
					common.getPeopleId({
						"name": $scope.detail['ds_person-ds_name'],
						"idCard": $scope.detail['ds_person-ds_id'],
						"isCreate": "true"
					}, function(result) {
						var personId = result.personId;
						public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						var data = {
							"name": "ds_shimingzhi",
							"attributes": [{
								"name": "ds_date",
								"value": "@dt/" + Api.formatDate('-', $scope.detail['ds_date']) + ' 8:00:00'
							}, {
								"name": "ds_roomnum",
								"value": $scope.detail['ds_roomnum']
							}, {
								"name": "ds_person",
								"value": "@look/" + personId
							}, {
								"name": "ds_publicorder",
								"value": "@look/" + publicId
							}]
						};
						public.creatRealname(data, function() {
							Api.alert('创建成功');
							$scope.closeThisDialog();
							$scope.getMessageByPageNum($scope.currentPageNum);
						});
					});
				};

			}
		})

		
	};

});
//实名制首饰加工
controllers.controller('index.publicRealNameMetal', function($scope, $state, Api, ngDialog, download, checkType, public) {
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].id;
	var name = crumbs[2].name;
	var type = crumbs[2].type;	
	var publicName=crumbs[2].publicName;
	$scope.title = $scope.$parent.$parent.title = name;
	$scope.list = [];
	$scope.option = {};	
	$scope.option.starTime = new Date(Api.formatDate('z') - (60 * 60 * 24 * 3 * 1000));
	$scope.option.endTime = new Date();
	$scope.currentPageNum=1;
	$scope.allMessage=0;

	$scope.formatDate = function(timeStr) {
		return Api.formatDate('/', timeStr);
	};

	$scope.getMessageByPageNum = function(currentPageNum) {
		
		$scope.option.index = currentPageNum;
		$scope.option.count = 2;
		$scope.option.id = publicId;
		$scope.option.starTime = $scope.formatDate($scope.option.starTime);
		$scope.option.endTime = $scope.formatDate($scope.option.endTime);
		console.log($scope.option)
		public.realNameSearchWithOutLogistics($scope.option, function(result,totalCount,currentPageNum) {
			console.log(result);
			$scope.list = result;
			$scope.allMessage = totalCount;
			$scope.currentPageNum = currentPageNum;

		});
	};
	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});
	$scope.delete = function(id,e){
		e.stopPropagation();
		Api.checked('确定删除吗？',function(){
			public.deleteRealname(id,function(){
				Api.alert('删除成功');
				if ($scope.currentPageNum != 1 && $scope.messageList.showList.length == 0) {
					$scope.getMessageByPageNum($scope.currentPageNum - 1);
				} else if ($scope.currentPageNum != 1 && $scope.messageList.showList.length != 0) {
					$scope.getMessageByPageNum($scope.currentPageNum);
				} else if ($scope.currentPageNum == 1) {
					$scope.getMessageByPageNum(1);
				}else{
					messageServers.alertTips("出错啦");
				}
				
			})
		})
		
	};
	$scope.showInfo=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/wasteInfo.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,Api,getBase64ByFile) {								
				item.date=Api.formatDate('/',item['ds_date']);
				$scope.detail=item;
				$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
				
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.lookImg=function(){
					if($scope.detail.ds_image&&!$scope.imgData){
						
						if($scope.detail.ds_image){	
							common.getSub($scope.detail.ds_image, function(url) {
								$scope.detail.imageSrc = url;
								var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();
									
							});
						
						}else{
							Api.alert( '未找到图片！');
						}							
						
					}else if($scope.imgData){
						var a = '<a href="' + $scope.imgData + '" target="_blank"><span> </span></a>';
						a = $(a);
						a.find('span').click();		
					}
				};
				$scope.upData = function() {
					
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if (!$scope.detail.aheadpic) {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					var upData = function(subId) {
						var data = {
							"attributes": [{
								"name": "ds_name",
								"value": $scope.detail['ds_name']
							}, {
								"name": "ds_information",
								"value": $scope.detail['ds_information']
							}]
						};
						if (judes.isNull($scope.detail['ds_weight'])) {
							data.attributes.push({
								"name": "ds_weight",
								"value": $scope.detail['ds_weight']
							});
						} else {
							data.attributes.push({
								"name": "ds_weight",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_type'])) {
							data.attributes.push({
								"name": "ds_type",
								"value": $scope.detail['ds_type']
							});
						} else {
							data.attributes.push({
								"name": "ds_type",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_brand'])) {
							data.attributes.push({
								"name": "ds_brand",
								"value": $scope.detail['ds_brand']
							});
						} else {
							data.attributes.push({
								"name": "ds_brand",
								"value": "null"
							});
						};
						if (subId) {
							data.attributes.push({
								"name": "ds_image",
								"value": subId
							});
						};
						public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						public.updateRealname(item['ds_shimingzhiid'], data, function() {
							Api.alert('更新成功');
							$scope.closeThisDialog();
							$scope.getMessageByPageNum($scope.currentPageNum);
						});
					};
					if ($scope.imgData) {
						common.upDataSub({
							"fileName": "危爆物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							upData(result);
						});
					} else {
						upData(false);
					};
				};

				
			}
		})
	};
	$scope.addMetal=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/addMetal.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile) {
				$scope.detail = {};
				$scope.detail['ds_date'] = new Date();
				$scope.detail.fmtDT = Api.formatDate('zh', $scope.detail['ds_date']);

				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.submit=function(){
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							 '请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if (!$scope.imgData) {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					common.getPeopleId({
						"name": $scope.detail['ds_person-ds_name'],
						"idCard": $scope.detail['ds_person-ds_id'],
						"isCreate": "true"
					}, function(result) {
						var personId = result.personId;
						public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						common.upDataSub({
							"fileName": "回收金属图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							var data = {
								"name": "ds_shimingzhi",
								"attributes": [{
									"name": "ds_date",
									"value": "@dt/" + Api.formatDate('-', $scope.detail.dete) + ' 8:00:00'
								}, {
									"name": "ds_name",
									"value": $scope.detail['ds_name']
								}, {
									"name": "ds_image",
									"value": result
								}, {
									"name": "ds_person",
									"value": "@look/" + personId
								}, {
									"name": "ds_publicorder",
									"value": "@look/" + publicId
								}]
							};
							if (judes.isNull($scope.detail['ds_weight'])) {
								data.attributes.push({
									"name": "ds_weight",
									"value": $scope.detail['ds_weight']
								});
							};
							if (judes.isNull($scope.detail['ds_information'])) {
								data.attributes.push({
									"name": "ds_information",
									"value": $scope.detail['ds_information']
								});
							};
							if (judes.isNull($scope.detail['ds_type'])) {
								data.attributes.push({
									"name": "ds_type",
									"value": $scope.detail['ds_type']
								});
							};
							if (judes.isNull($scope.detail['ds_brand'])) {
								data.attributes.push({
									"name": "ds_brand",
									"value": $scope.detail['ds_brand']
								});
							};
							public.creatRealname(data, function() {
								Api.alert('创建成功');
								$scope.closeThisDialog();
							});
						});
					});
				}

			}
		})
	}

});
//实名制手机维修
controllers.controller('index.publicRealNamePhone', function($scope, $state, Api, ngDialog, download, checkType, public) {
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].id;
	var name = crumbs[2].name;
	var type = crumbs[2].type;	
	var publicName=crumbs[2].publicName;
	$scope.title = $scope.$parent.$parent.title = name;
	$scope.list = [];
	$scope.option = {};	
	$scope.option.starTime = new Date(Api.formatDate('z') - (60 * 60 * 24 * 3 * 1000));
	$scope.option.endTime = new Date();
	$scope.currentPageNum=1;
	$scope.allMessage=0;

	$scope.formatDate = function(timeStr) {
		return Api.formatDate('/', timeStr);
	};

	$scope.getMessageByPageNum = function(currentPageNum) {
		
		$scope.option.index = currentPageNum;
		$scope.option.count = 2;
		$scope.option.id = publicId;
		$scope.option.starTime = $scope.formatDate($scope.option.starTime);
		$scope.option.endTime = $scope.formatDate($scope.option.endTime);
		console.log($scope.option)
		public.realNameSearchWithOutLogistics($scope.option, function(result,totalCount,currentPageNum) {
			console.log(result);
			$scope.list = result;
			$scope.allMessage = totalCount;
			$scope.currentPageNum = currentPageNum;

		});
	};
	$scope.getMessageByPageNum($scope.currentPageNum);
	$scope.$on('message.initPage', function() {
		$scope.getMessageByPageNum($scope.currentPageNum);
	});
	$scope.delete = function(id,e){
		e.stopPropagation();
		Api.checked('确定删除吗？',function(){
			public.deleteRealname(id,function(){
				Api.alert('删除成功');
				if ($scope.currentPageNum != 1 && $scope.messageList.showList.length == 0) {
					$scope.getMessageByPageNum($scope.currentPageNum - 1);
				} else if ($scope.currentPageNum != 1 && $scope.messageList.showList.length != 0) {
					$scope.getMessageByPageNum($scope.currentPageNum);
				} else if ($scope.currentPageNum == 1) {
					$scope.getMessageByPageNum(1);
				}else{
					messageServers.alertTips("出错啦");
				}
				
			})
		})
		
	};
	$scope.showInfo=function(item){
		ngDialog.open({
			template: '/police_web/template/dialogs/phoneInfo.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile,$rootScope){
				item.date=Api.formatDate('/',item['ds_date']);
				$scope.detail=item;
				$scope.detail.aheadpic = $scope.detail.ds_image?'物品照片.jpeg':"";
				
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.lookImg=function(){
					if($scope.detail.ds_image&&!$scope.imgData){
						
						if($scope.detail.ds_image){	
							common.getSub($scope.detail.ds_image, function(url) {
								$scope.detail.imageSrc = url;
								var a = '<a href="' + $scope.detail.imageSrc + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();
									
							});
						
						}else{
							Api.alert( '未找到图片！');
						}							
						
					}else if($scope.imgData){
						var a = '<a href="' + $scope.imgData + '" target="_blank"><span> </span></a>';
						a = $(a);
						a.find('span').click();		
					}
				};
				$scope.upData = function() {
					
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if (!$scope.detail.aheadpic) {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					var upData = function(subId) {
						var data = {
							"attributes": [{
								"name": "ds_name",
								"value": $scope.detail['ds_name']
							}, {
								"name": "ds_information",
								"value": $scope.detail['ds_information']
							}]
						};
						if (judes.isNull($scope.detail['ds_weight'])) {
							data.attributes.push({
								"name": "ds_weight",
								"value": $scope.detail['ds_weight']
							});
						} else {
							data.attributes.push({
								"name": "ds_weight",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_type'])) {
							data.attributes.push({
								"name": "ds_type",
								"value": $scope.detail['ds_type']
							});
						} else {
							data.attributes.push({
								"name": "ds_type",
								"value": "null"
							});
						};
						if (judes.isNull($scope.detail['ds_brand'])) {
							data.attributes.push({
								"name": "ds_brand",
								"value": $scope.detail['ds_brand']
							});
						} else {
							data.attributes.push({
								"name": "ds_brand",
								"value": "null"
							});
						};
						if (subId) {
							data.attributes.push({
								"name": "ds_image",
								"value": subId
							});
						};
						public.upDataPeopleMessageAboutNameAndPhone($scope.detail['ds_person-ds_personid'], $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						public.updateRealname(item['ds_shimingzhiid'], data, function() {
							Api.alert('更新成功');
							$scope.closeThisDialog();
						});
					};
					if ($scope.imgData) {
						common.upDataSub({
							"fileName": "危爆物品图片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							upData(result);
						});
					} else {
						upData(false);
					}
				};

			}
		})
	};
	$scope.addPhone=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/addPhone.html',
			appendClassName: 'ngdialog-place',
			controller: function($scope,$state,common,user,public,judes,address,getBase64ByFile,$rootScope) {
				$scope.detail = {};
				$scope.detail['ds_date'] = new Date();
				$scope.detail.fmtDT = Api.formatDate('zh', $scope.detail['ds_date']);

				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.updataImage = function() {
								
					document.getElementById('uploadImage').click();
				};
				$scope.fileChange = function() {
					getBase64ByFile({
						fileType: 'image', // image or doc
						elementId: 'uploadImage',
						success: function(base64) {
							$scope.detail.aheadpic = angular.element('#uploadImage')[0].files[0].name;
							$('.look').unbind().bind('click',function(){

								var a = '<a href="' + base64 + '" target="_blank"><span> </span></a>';
								a = $(a);
								a.find('span').click();											
							})	
							$scope.imgData = base64;
						},
						error: function(message) {
							Api.alert(message);
						},
					});
				};
				$scope.submit = function() {
					if (!judes.isNull($scope.detail['ds_person-ds_name'])) {
						Api.alert(
							'请填写顾客姓名'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'请填写顾客电话号码'
						);
						return;
					};
					if (!judes.isPhone($scope.detail['ds_person-ds_phone'])) {
						Api.alert(
							'顾客电话号输入错误'
						);
						return;
					};
					if (!judes.isNull($scope.detail['ds_name'])) {
						Api.alert(
							'请填写入物品名称'
						);
						return;
					};
					if (!$scope.imgData) {
						Api.alert(
							'请上传物品照片'
						);
						return;
					};
					common.getPeopleId({
						"name": $scope.detail['ds_person-ds_name'],
						"idCard": $scope.detail['ds_person-ds_id'],
						"isCreate": "true"
					}, function(result) {
						var personId = result.personId;
						public.upDataPeopleMessageAboutNameAndPhone(personId, $scope.detail['ds_person-ds_name'], $scope.detail['ds_person-ds_phone']);
						common.upDataSub({
							"fileName": "手机照片",
							"fileType": ".jpg",
							"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
						}, function(result) {
							var data = {
								"name": "ds_shimingzhi",
								"attributes": [{
									"name": "ds_date",
									"value": "@dt/" + Api.formatDate('-', $scope.detail['ds_date']) + ' 8:00:00'
								}, {
									"name": "ds_name",
									"value": $scope.detail['ds_name']
								}, {
									"name": "ds_image",
									"value": result
								}, {
									"name": "ds_person",
									"value": "@look/" + personId
								}, {
									"name": "ds_publicorder",
									"value": "@look/" + publicId
								}]
							};
							if (judes.isNull($scope.detail['ds_weight'])) {
								data.attributes.push({
									"name": "ds_weight",
									"value": $scope.detail['ds_weight']
								});
							};
							if (judes.isNull($scope.detail['ds_information'])) {
								data.attributes.push({
									"name": "ds_information",
									"value": $scope.detail['ds_information']
								});
							};
							if (judes.isNull($scope.detail['ds_type'])) {
								data.attributes.push({
									"name": "ds_type",
									"value": $scope.detail['ds_type']
								});
							};
							if (judes.isNull($scope.detail['ds_brand'])) {
								data.attributes.push({
									"name": "ds_brand",
									"value": $scope.detail['ds_brand']
								});
							};
							public.creatRealname(data, function() {
								Api.alert('创建成功');
								$scope.closeThisDialog();
								$rootScope.$broadcast('message.initPage');
							});
						});
					});
				}

			}
		})
	}
});
