// collect
controllers.controller('index.collect', function($scope, $state, Api) {
	$scope.title = $scope.$parent.$parent.title = "信息采集";
	$scope.stateGo = function(name) {
		$state.go(name);
	};
});
controllers.controller('index.collectCar', function($scope, getBase64ByFile, Api,judes,ngDialog,public,common,gather,$rootScope) {
	$scope.title = $scope.$parent.$parent.title = "车辆信息采集";
	//车辆信息
	$scope.driver = {
		name: '穆松鹤',
		idCard: '220381198909221115',
		phone: '13630985996'
	};
	$scope.master = {
		name: '穆松鹤',
		idCard: '220381198909221115',
		phone: '13630985996'
	};
	$scope.car = {
		name: '本田',
		color: '白色',
		number: '吉A35648'
	};
	$scope.caseMaps = {};
	//上传的图片数组
	$scope.imageList = [];
	$scope.picture = {};
	$scope.picture.images = [];

	$scope.picture.imageStr = [];
	//手动定位
	var Position='';
	var Address = '';
	$scope.$on('choosePosition.show',function(){
		$scope.car.ds_address = Address;
		$scope.car.position = Position;
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
	//修改上传图片
	var imageMessage = {};
	$scope.updataImage = function(type, index) {
		imageMessage = {
			type: type,
			index: index,
		};
		document.getElementById('collectCarImage').click();

	};
	//上传图片
	$scope.fileChange = function() {
		getBase64ByFile({
			fileType: 'image', // image or doc
			elementId: 'collectCarImage',
			success: function(base64) {
				if (imageMessage.type == 'creat') {
					$scope.picture.images.push(base64);
				} else {
					$scope.picture.images.splice(imageMessage.index, 1, base64);
				}
			},
			error: function(message) {
				Api.alert(message);
			},
		});
	};
	//删除上传的图片
	$scope.deletePic = function(index){
		$scope.picture.images.splice(index, 1);
	};
	//上传图片
	
	function upDataImage(success) {
		console.log($scope.picture.images);
		var imagesArray = angular.copy($scope.picture.images);

		function getImageId() {
			if (imagesArray.length != 0) {
				var base64 = imagesArray.shift().replace(/data:image\/jpeg\;base64\,/g, "");
				common.upDataSub({
					"fileType": "车辆信息",
					"fileName": ".jpg",
					"tempFileStream": base64
				}, function(result) {
					$scope.picture.imageStr.push(result);
					getImageId();
				});
			} else {
				success();
			}
		}
		getImageId();
	};

	$scope.submit = function() {
		if (!judes.isNull($scope.driver.name)) {
			Api.alert(
				 '请填写驾驶者姓名'
			);
			return;
		};
		if (!judes.isNull($scope.driver.idCard)) {
			Api.alert(
				 '请填写驾驶者身份证号'
			);
			return;
		};
		if (!judes.isIdCard($scope.driver.idCard)) {
			Api.alert(
				 '驾驶者身份证号输入有误'
			);
			return;
		};
		if (!judes.isNull($scope.driver.phone)) {
			Api.alert(
				 '请填写驾驶者联系电话'
			);
			return;
		};
		if (!judes.isPhone($scope.driver.phone)) {
			Api.alert(
				 '驾驶者联系电话输入有误'
			);
			return;
		};


		if (!judes.isNull($scope.master.name)) {
			Api.alert(
				 '请填写车主姓名'
			);
			return;
		};
		if (!judes.isNull($scope.master.idCard)) {
			Api.alert(
				 '请填写车主身份证号'
			);
			return;
		};
		if (!judes.isIdCard($scope.master.idCard)) {
			Api.alert(
				 '车主身份证号输入有误'
			);
			return;
		};
		if (!judes.isNull($scope.master.phone)) {
			Api.alert(
				 '请填写车主联系电话'
			);
			return;
		};
		if (!judes.isPhone($scope.master.phone)) {
			Api.alert(
				 '车主联系电话输入有误'
			);
			return;
		};


		if (!judes.isNull($scope.car.name)) {
			Api.alert(
				 '请填写车辆型号'
			);
			return;
		};
		if (!judes.isNull($scope.car.color)) {
			Api.alert(
				 '请填写车辆颜色'
			);
			return;
		};
		if (!judes.isNull($scope.car.number)) {
			Api.alert(
				 '请填写车牌号'
			);
			return;
		};
		if (!judes.isNull($scope.car.ds_address)) {
			Api.alert(
				 '请填写详细地址'
			);
			return;
		};

		// 查找驾驶员信息
		common.getPeopleId({
			"name": $scope.driver.name,
			"idCard": $scope.driver.idCard,
			"isCreate": "true"
		}, function(result) {
			var driverId = result.personId;
			// 更新驾驶员信息
			public.upDataPeopleMessageAboutNameAndPhone(driverId, $scope.driver.name, $scope.driver.phone);
			// 查找车主信息
			common.getPeopleId({
				"name": $scope.master.name,
				"idCard": $scope.master.idCard,
				"isCreate": "true"
			}, function(result) {
				var masterId = result.personId;
				// 更新车主信息
				public.upDataPeopleMessageAboutNameAndPhone(masterId, $scope.master.name, $scope.master.phone);
				upDataImage(function() {
					var imageStr = '';
					for (var i = 0; i < $scope.picture.imageStr.length; i++) {
						imageStr += $scope.picture.imageStr[i] + ';';
					};
					imageStr = imageStr.substring(0, imageStr.length - 1);

					var data = {
						"name": "ds_vehicle",
						"attributes": [{
							"name": "ds_driver",
							"value": "@look/" + driverId
						}, {
							"name": "ds_person",
							"value": "@look/" + masterId
						}, {
							"name": "ds_model",
							"value": $scope.car.name
						}, {
							"name": "ds_color",
							"value": $scope.car.color
						}, {
							"name": "ds_number",
							"value": $scope.car.number
						}, {
							"name": "ds_longitude",
							"value": $scope.car.position[0].toString()
						}, {
							"name": "ds_latitude",
							"value": $scope.car.position[1].toString()
						}, {
							"name": "ds_address",
							"value": $scope.car.ds_address
						}]
					};
					if (judes.isNull(imageStr)) {
						data.attributes.push({
							"name": "ds_picstubidarray",
							"value": imageStr
						});
					};
					if (judes.isNull($scope.car.ds_description)) {
						data.attributes.push({
							"name": "ds_description",
							"value": $scope.car.ds_description
						});
					};

					gather.creatCrm(data, function(result) {
						Api.alert('创建成功');
						// $ionicHistory.goBack();
						
					});
				});
			});
		});
	};

});
controllers.controller('index.collectPeople', function($scope, gather, options, judes, common,Api) {
	$scope.title = $scope.$parent.$parent.title = "信息采集";

	$scope.people = {};
	options.get(['nation'], function(result) {
		$scope.nations = result.nation;
		$scope.people.nation = $scope.nations[0]
	});

	$scope.submit = function() {
		if (!judes.isNull($scope.people.name)) {
			Api.alert(
				 '请填写姓名'
			);
			return;
		};
		if (!judes.isNull($scope.people.phone)) {
			Api.alert(
				 '请填写电话'
			);
			return;
		};
		if (!judes.isPhone($scope.people.phone)) {
			Api.alert(
				 '电话输入有误'
			);
			return;
		};

		if (!judes.isNull($scope.people.idCard)) {
			Api.alert(
				 '请填写身份证号'
			);
			return;
		};
		if (!judes.isIdCard($scope.people.idCard)) {
			Api.alert(
				 '身份证号填写有误'
			);
			return;
		};

		common.getPeopleId({
			"name": $scope.people.name,
			"idCard": $scope.people.idCard,
			"isCreate": "true"
		}, function(result) {

			var data = {
				"attributes": [{
					"name": "ds_name",
					"value": $scope.people.name
				}, {
					"name": "ds_phone",
					"value": $scope.people.phone
				}, {
					"name": "ds_nation",
					"value": "@code/" + $scope.people.nation.value
				}]
			};

			if (judes.isNull($scope.people.address)) {
				data.attributes.push({
					"name": "ds_address",
					"value": $scope.people.address
				});
			};

			gather.upDataPeople(result.personId, data, function(result) {
				Api.alert('操作成功');
				// $ionicHistory.goBack();
			});

		});
	};

});
controllers.controller('index.collectAddress', function($scope,$state, Api, address, public, $stateParams,judes,gather,options,common,ngDialog) {
	$scope.title = $scope.$parent.$parent.title = "信息采集";
	$scope.address = {};
	$scope.address.showName = '请选择地址树';
	$scope.address.ready = false;
	$scope.address.data = [];
	$scope.address.list = [
		[],
		[],
		[],
		[]
	];
	$scope.address.index = [0, 0, 0, 0];
	$scope.address.result = [{}, {}, {}, {}];

	var formattingAddress = function(data, toData, success) {
		for (var i = 0; i < data.length; i++) {
			var _data = {};
			_data.name = data[i].name;
			_data.id = data[i].id;
			_data.index = i;
			toData.push(_data);
		};
	};

	$scope.address.change = function(index) {
		if (index == 0) {
			$scope.address.index = [$scope.address.result[0].index, 0, 0, 0];
			$scope.address.list[1] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models, $scope.address.list[1]);
			$scope.address.result[1] = $scope.address.list[1][0];

			$scope.address.list[2] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[0].address3Models, $scope.address.list[2]);
			$scope.address.result[2] = $scope.address.list[2][0];

			address.last($scope.address.list[2][0].id, function(result) {
				$scope.address.list[3] = [];
				formattingAddress(result, $scope.address.list[3]);
				$scope.address.result[3] = $scope.address.list[3][0];
				$scope.address.ready = true;
			});
		};
		if (index == 1) {
			$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, 0, 0];
			$scope.address.list[2] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[$scope.address.result[1].index].address3Models, $scope.address.list[2]);
			$scope.address.result[2] = $scope.address.list[2][0];
			if ($scope.address.list[2].length == 0) {
				$scope.address.list[3] = [];
			} else {
				address.last($scope.address.list[2][0].id, function(result) {
					$scope.address.list[3] = [];
					formattingAddress(result, $scope.address.list[3]);
					$scope.address.result[3] = $scope.address.list[3][0];
					$scope.address.ready = true;
				});
			}
		};
		if (index == 2) {
			$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, $scope.address.result[2].index, 0];
			address.last($scope.address.list[2][$scope.address.result[2].index].id, function(result) {
				$scope.address.list[3] = [];
				formattingAddress(result, $scope.address.list[3]);
				$scope.address.result[3] = $scope.address.list[3][0];
				$scope.address.ready = true;
			});
		};

		console.log($scope.address.result);

	};

	function initAddressTree(result, success) {
		$scope.address.data = result;
		$scope.address.list = [
			[],
			[],
			[],
			[]
		];
		// 格式化第一级地址树
		formattingAddress(result, $scope.address.list[0]);
		$scope.address.result[0] = $scope.address.list[0][0];
		// 格式化第二级地址树
		formattingAddress(result[0].address2Models, $scope.address.list[1]);
		$scope.address.result[1] = $scope.address.list[1][0];
		// 格式化第三级级地址树
		formattingAddress(result[0].address2Models[0].address3Models, $scope.address.list[2]);
		$scope.address.result[2] = $scope.address.list[2][0];
		// 获得第四级地址树 

		address.last($scope.address.list[2][0].id, function(result) {
			formattingAddress(result, $scope.address.list[3]);
			$scope.address.ready = true;
			$scope.address.result[3] = $scope.address.list[3][0];
			if (success) {
				success();
			}
		});
	};

	address.get(function(result) {
		initAddressTree(result);
	});

	$scope.AddressTreeModal = {};
	$scope.AddressTreeModal.SubSecond = {};
	$scope.AddressTreeModal.SubSecond.show = false;
	$scope.AddressTreeModal.SubSecond.add=function(){
		$scope.AddressTreeModal.SubSecond.show = true;

		$scope.AddressTreeModal.addSubSecond = function() {

			if (!judes.isNull($scope.AddressTreeModal.SubSecond.name)) {
				Api.alert(
					'请填写地址树名称'
				);
				return;
			};


			var data = {
				name: $scope.AddressTreeModal.SubSecond.name,
				id: $scope.address.result[0].id
			};
			address.addAddressSubSecond(data, function(result) {
				var newAddressTreeId = result;
				$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, $scope.address.result[2].index, $scope.address.result[3].index];
				address.get(function(result) {
					$scope.address.data = result;
					$scope.address.list = [
						[],
						[],
						[],
						[]
					];
					formattingAddress(result, $scope.address.list[0]);
					$scope.address.result[0] = $scope.address.list[0][$scope.address.index[0]];

					formattingAddress(result[$scope.address.index[0]].address2Models, $scope.address.list[1]);
					for (var i = 0; i < $scope.address.list[1].length; i++) {
						var addressTree = $scope.address.list[1][i];
						if (addressTree.id == newAddressTreeId) {
							$scope.address.index[1] = i;
						}
					}
					$scope.address.result[1] = $scope.address.list[1][$scope.address.index[1]];
					$scope.AddressTreeModal.SubSecond.show = false;
				});
			});
		};
		
	}

	$scope.AddressTreeModal.SubThird = {};
	$scope.AddressTreeModal.SubThird.show = false;
	$scope.AddressTreeModal.SubThird.add=function(){
		$scope.AddressTreeModal.SubThird.show = true;
		$scope.AddressTreeModal.addSubThird = function() {

			if (!judes.isNull($scope.AddressTreeModal.SubThird.name)) {
				Api.alert(
					'请填写地址树名称'
				);
				return;
			};

			var data = {
				name: $scope.AddressTreeModal.SubThird.name,
				id: $scope.address.result[1].id
			};
			address.addAddressSubThird(data, function(result) {
				var newAddressTreeId = result;
				$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, $scope.address.result[2].index, $scope.address.result[3].index];
				address.get(function(result) {
					$scope.address.data = result;
					$scope.address.list = [
						[],
						[],
						[],
						[]
					];
					formattingAddress(result, $scope.address.list[0]);
					$scope.address.result[0] = $scope.address.list[0][$scope.address.index[0]];

					formattingAddress(result[$scope.address.index[0]].address2Models, $scope.address.list[1]);
					$scope.address.result[1] = $scope.address.list[1][$scope.address.index[1]];

					formattingAddress(result[$scope.address.index[0]].address2Models[$scope.address.index[1]].address3Models, $scope.address.list[2]);
					for (var i = 0; i < $scope.address.list[2].length; i++) {
						var addressTree = $scope.address.list[2][i];
						if (addressTree.id == newAddressTreeId) {
							$scope.address.index[2] = i;
						}
					}
					$scope.address.result[2] = $scope.address.list[2][$scope.address.index[2]];

					$scope.AddressTreeModal.SubThird.show = false;
				});
			});
		};
	}
	
	$scope.AddressTreeModal.SubFourth = {};
	$scope.AddressTreeModal.SubFourth.show = false;
	$scope.AddressTreeModal.SubFourth.add=function(){
		$scope.AddressTreeModal.SubFourth.show = true;
		$scope.AddressTreeModal.addSubFourth = function() {

		if (!judes.isNull($scope.AddressTreeModal.SubFourth.name)) {
			Api.alert(
				'请填写地址树名称'
			);
			return;
		};

			var data = {
				name: $scope.AddressTreeModal.SubFourth.name,
				id: $scope.address.result[2].id
			};
			address.addAddressSubFourth(data, function(result) {
				var newAddressTreeId = result;
				$scope.address.list[3] = [];
				address.last($scope.address.result[2].id, function(result) {
					formattingAddress(result, $scope.address.list[3]);
					var lastIndex = 0;
					for (var i = 0; i < $scope.address.list[3].length; i++) {
						var addressTree = $scope.address.list[3][i];
						if (addressTree.id == newAddressTreeId) {
							lastIndex = i;
						}
					};
					$scope.address.result[3] = $scope.address.list[3][lastIndex];
					$scope.AddressTreeModal.SubFourth.show = false;
				});
			});
		};
	}

});
controllers.controller('index.collectReality', function($scope,$scope,$state, Api, address, public, $stateParams,judes,gather,options,common,ngDialog,user) {
	$scope.title = $scope.$parent.$parent.title = "信息采集";
	
	$scope.list = {};
	$scope.empty=false;
	$scope.houseShow=false;
	$scope.showbtn=false;
	$scope.address = {};
	$scope.address.showName = '请选择地址树';
	$scope.address.ready = false;
	$scope.address.data = [];
	$scope.address.list = [
		[],
		[],
		[],
		[]
	];
	$scope.address.index = [0, 0, 0, 0];
	$scope.address.result = [{}, {}, {}, {}];

	var formattingAddress = function(data, toData, success) {
		for (var i = 0; i < data.length; i++) {
			var _data = {};
			_data.name = data[i].name;
			_data.id = data[i].id;
			_data.index = i;
			toData.push(_data);
		};
	};

	$scope.address.change = function(index) {
		if (index == 0) {
			$scope.houseShow=false;
			$scope.showbtn=false;
			$scope.empty=false;
			$scope.address.index = [$scope.address.result[0].index, 0, 0, 0];
			$scope.address.list[1] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models, $scope.address.list[1]);
			$scope.address.result[1] = $scope.address.list[1][0];

			$scope.address.list[2] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[0].address3Models, $scope.address.list[2]);
			$scope.address.result[2] = $scope.address.list[2][0];

			address.last($scope.address.list[2][0].id, function(result) {
				$scope.address.list[3] = [];
				formattingAddress(result, $scope.address.list[3]);
				$scope.address.result[3] = $scope.address.list[3][0];
				$scope.address.ready = true;
			});
		};
		if (index == 1) {
			$scope.houseShow=false;
			$scope.showbtn=false;
			$scope.empty=false;
			$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, 0, 0];
			$scope.address.list[2] = [];
			formattingAddress($scope.address.data[$scope.address.result[0].index].address2Models[$scope.address.result[1].index].address3Models, $scope.address.list[2]);
			$scope.address.result[2] = $scope.address.list[2][0];
			if ($scope.address.list[2].length == 0) {
				$scope.address.list[3] = [];
				$scope.address.result[3] = $scope.address.result[2];
			} else {
				address.last($scope.address.list[2][0].id, function(result) {
					$scope.address.list[3] = [];
					formattingAddress(result, $scope.address.list[3]);
					$scope.address.result[3] = $scope.address.list[3][0];
					$scope.address.ready = true;
				});
			}
		};
		if (index == 2) {
			$scope.houseShow=false;
			$scope.showbtn=false;
			$scope.empty=false;
			$scope.address.index = [$scope.address.result[0].index, $scope.address.result[1].index, $scope.address.result[2].index, 0];
			address.last($scope.address.list[2][$scope.address.result[2].index].id, function(result) {
				$scope.address.list[3] = [];
				formattingAddress(result, $scope.address.list[3]);
				$scope.address.result[3] = $scope.address.list[3][0];
				$scope.address.ready = true;
			});
		};
		if(index == 3){
			$scope.houseShow=false;
			$scope.showbtn=false;
			$scope.empty=false;
		};
	};

	function initAddressTree(result, success) {
		$scope.address.data = result;
		$scope.address.list = [
			[],
			[],
			[],
			[]
		];
		// 格式化第一级地址树
		formattingAddress(result, $scope.address.list[0]);
		$scope.address.result[0] = $scope.address.list[0][0];
		// 格式化第二级地址树
		formattingAddress(result[0].address2Models, $scope.address.list[1]);
		$scope.address.result[1] = $scope.address.list[1][31];
		// 格式化第三级级地址树
		formattingAddress(result[0].address2Models[31].address3Models, $scope.address.list[2]);
		$scope.address.result[2] = $scope.address.list[2][1];
		// 获得第四级地址树 

		address.last($scope.address.list[2][1].id, function(result) {
			formattingAddress(result, $scope.address.list[3]);
			$scope.address.ready = true;
			$scope.address.result[3] = $scope.address.list[3][0];
			if (success) {
				success();
			}
		});
	};

	address.get(function(result) {
		initAddressTree(result);
	});

	$scope.submit = function() {
		if (!$scope.address.result[3]) {
			Api.alert(
				'请选择地址树'
			);
			return;
		};

		var id = $scope.address.result[3].id;

		gather.getRealHouseList(id, function(result) {
			
			if(!judes.isNull(result)||result.length==0){
				$scope.empty=true;
				$scope.houseShow=false;
				$scope.showbtn=true;
			}else{
				$scope.list = result;
				$scope.empty=false;
				$scope.houseShow=true;
				$scope.showbtn=true;
			};
			
		});
		$scope.$on('initRealHouse',function(){
			var Id = $scope.address.result[3].id;
			gather.getRealHouseList(Id, function(result) {	
				if(!judes.isNull(result)||result.length==0){
					$scope.empty=true;
					$scope.houseShow=false;
					$scope.showbtn=true;
				}else{
					$scope.list = result;
					$scope.empty=false;
					$scope.houseShow=true;
					$scope.showbtn=true;
				};
				
			});
		});
		$scope.addRealHouse=function(){
				ngDialog.open({
					template: '/police_web/template/dialogs/addCollectRealHouse.html',	
					appendClassName: 'ngdialog-place',				
					controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather) {
						$scope.detail={};
						var userMessage = user.getUserMessage();
						gather.getPoliceHouse(function(result) {
							$scope.team = result;
							$scope.detail.team = $scope.team[0];
							options.get(['houseusertype'], function(result) {
								$scope.houseusertype = result.houseusertype;
								$scope.detail.ds_kind = $scope.houseusertype[0];
								$scope.detail['ds_date'] = Api.formatDate('zh',new Date());
								$scope.detail['ds_dutypolice-ds_name'] = userMessage.name
							});
						});
						$scope.close=function(){
							$scope.closeThisDialog();
						};
						$scope.addRealHouse = function() {

							if (!judes.isNull($scope.detail.ds_address)) {
								Api.alert(
									'请输入房屋地址'
								);
								return;
							};

							if (judes.isNull($scope.detail.ds_rentroomnum) && !judes.isInteger($scope.detail.ds_rentroomnum)) {
								Api.alert(
									'出租间数只能为数字'
								);
								return;
							};
							if (judes.isNull($scope.detail.ds_usingarea) && !judes.isInteger($scope.detail.ds_usingarea)) {
								Api.alert(
									'出租面积只能为数字'
								);
								return;
							};

							var putData = {
								"name": "ds_realhouse",
								"attributes": [{
									"name": "ds_address",
									"value": $scope.detail.ds_address
								}, {
									"name": "ds_dutyplace",
									"value": "@look/" + $scope.detail.team.value
								}, {
									"name": "ds_date",
									"value": "@dt/" + Api.formatDate('-', $scope.detail['ds_date']) + ' 08:00'
								}, {
									"name": "ds_collectperson",
									"value": "@look/" + userMessage.policeCrmId
								}, {
									"name": "ds_kind",
									"value": "@code/" + $scope.detail.ds_kind.value
								}, {
									"name": "ds_address_tree",
									"value": "@look/" + id
								}, {
									"name": "ds_dutypolice",
									"value": "@look/" + userMessage.policeCrmId
								}]
							};

							if (judes.isNull($scope.detail.ds_buildingnum)) {
								putData.attributes.push({
									"name": "ds_buildingnum",
									"value": $scope.detail.ds_buildingnum
								});
							};
							if (judes.isNull($scope.detail.ds_roomfigure)) {
								putData.attributes.push({
									"name": "ds_roomfigure",
									"value": $scope.detail.ds_roomfigure
								});
							};
							if (judes.isNull($scope.detail.ds_household)) {
								putData.attributes.push({
									"name": "ds_household",
									"value": $scope.detail.ds_household
								});
							};
							if (judes.isNull($scope.detail.ds_unit)) {
								putData.attributes.push({
									"name": "ds_unit",
									"value": $scope.detail.ds_unit
								});
							};
							if (judes.isNull($scope.detail.ds_property)) {
								putData.attributes.push({
									"name": "ds_property",
									"value": $scope.detail.ds_property
								});
							};
							if (judes.isNull($scope.detail.ds_structure)) {
								putData.attributes.push({
									"name": "ds_structure",
									"value": $scope.detail.ds_structure
								});
							};
							if (judes.isNull($scope.detail.ds_realityroom)) {
								putData.attributes.push({
									"name": "ds_realityroom",
									"value": $scope.detail.ds_realityroom
								});
							};
							if (judes.isNull($scope.detail.ds_securitytype)) {
								putData.attributes.push({
									"name": "ds_securitytype",
									"value": $scope.detail.ds_securitytype
								});
							};
							if (judes.isNull($scope.detail.ds_usingarea)) {
								putData.attributes.push({
									"name": "ds_usingarea",
									"value": "@nu/" + $scope.detail.ds_usingarea
								});
							};
							if (judes.isNull($scope.detail.ds_rentroomnum)) {
								putData.attributes.push({
									"name": "ds_rentroomnum",
									"value": "@nu/" + $scope.detail.ds_rentroomnum
								});
							};

							gather.creatCrm(putData, function(result) {
								Api.alert('添加成功');
								$scope.closeThisDialog();
								$rootScope.$broadcast('initRealHouse');
								
							});
						};
					}
				})


		};
		$scope.goRealName=function(item){
			$state.go('index.collectRealHouseInfo');
			Api.Storage.set('crumbs', [{
				name:'信息采集',
				stateName: 'collect',
			},{
				name:'三实信息',
				stateName:'collectReality',
			},{
				name:'房屋详情',
				stateName:'collectRealHouseInfo',
				item:item			
			}]);
		};
		
	};


});
controllers.controller('index.collectRealHouseInfo', function($scope,$scope,$state, Api, address, public, $stateParams,judes,gather,options,common,ngDialog,user){
	var crumbs = Api.Storage.get('crumbs');	
	var publicId = crumbs[2].item['ds_realhouseid'];
	var name = crumbs[2].name;
	var publicName=crumbs[2].item.ds_address;
	$scope.title = $scope.$parent.$parent.title = name;

	$scope.house = {};
	$scope.house.housename=publicName;

	$scope.lookhouseInfo=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/addCollectRealHouse.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather) {
				$scope.detail = {};
				$scope.team = [];
				$scope.houseusertype = [];

				gather.getHouseMassage(publicId, function(result) {
					$scope.detail = result;
					$scope.detail.ds_date = Api.formatDate('zh', result['ds_date']);
					$scope.detail.ds_kind = $scope.detail.ds_kind.split(':')[0];
					$scope.detail.ds_usingarea = $scope.detail.ds_usingarea.split('.')[0];
					$scope.detail.ds_rentroomnum = $scope.detail.ds_rentroomnum.split('.')[0];
					gather.getPoliceHouse(function(result) {
						$scope.team = result;

						for (var i = 0; i < $scope.team.length; i++) {
							if ($scope.detail['ds_dutyplace-teamid'] == $scope.team[i].value) {
								$scope.detail.team = $scope.team[i];
							}
						};
						options.get(['houseusertype'], function(result) {
							$scope.houseusertype = result.houseusertype;
							for (var i = 0; i < $scope.houseusertype.length; i++) {
								if ($scope.detail.ds_kind == $scope.houseusertype[i].value) {
									$scope.detail.ds_kind = $scope.houseusertype[i];
								}
							}
						});
					});

				});
				$scope.addRealHouse = function() {
					var date=$('.timeInput1').val();
					if (!judes.isInteger($scope.detail.ds_rentroomnum)) {
						Api.alert(
							 '出租间数只能为数字'
						);
						return;
					};
					if (!judes.isInteger($scope.detail.ds_usingarea)) {
						Api.alert(
							 '出租面积只能为数字'
						);
						return;
					};
					if (!judes.isNull($scope.detail.ds_address)) {
						Api.alert(
							 '请输入房屋地址'
						);
						return;
					};
					var putData = {
						"attributes": [{
							"name": "ds_address",
							"value": $scope.detail.ds_address
						}]
					};
					if (judes.isNull($scope.detail.ds_buildingnum)) {
						putData.attributes.push({
							"name": "ds_buildingnum",
							"value": $scope.detail.ds_buildingnum
						});
					} else {
						putData.attributes.push({
							"name": "ds_buildingnum",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_roomfigure)) {
						putData.attributes.push({
							"name": "ds_roomfigure",
							"value": $scope.detail.ds_roomfigure
						});
					} else {
						putData.attributes.push({
							"name": "ds_roomfigure",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_household)) {
						putData.attributes.push({
							"name": "ds_household",
							"value": $scope.detail.ds_household
						});
					} else {
						putData.attributes.push({
							"name": "ds_household",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_unit)) {
						putData.attributes.push({
							"name": "ds_unit",
							"value": $scope.detail.ds_unit
						});
					} else {
						putData.attributes.push({
							"name": "ds_unit",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_property)) {
						putData.attributes.push({
							"name": "ds_property",
							"value": $scope.detail.ds_property
						});
					} else {
						putData.attributes.push({
							"name": "ds_property",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_structure)) {
						putData.attributes.push({
							"name": "ds_structure",
							"value": $scope.detail.ds_structure
						});
					} else {
						putData.attributes.push({
							"name": "ds_structure",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_realityroom)) {
						putData.attributes.push({
							"name": "ds_realityroom",
							"value": $scope.detail.ds_realityroom
						});
					} else {
						putData.attributes.push({
							"name": "ds_realityroom",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_securitytype)) {
						putData.attributes.push({
							"name": "ds_securitytype",
							"value": $scope.detail.ds_securitytype
						});
					} else {
						putData.attributes.push({
							"name": "ds_securitytype",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_usingarea)) {
						putData.attributes.push({
							"name": "ds_usingarea",
							"value": "@nu/" + $scope.detail.ds_usingarea
						});
					} else {
						putData.attributes.push({
							"name": "ds_usingarea",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_rentroomnum)) {
						putData.attributes.push({
							"name": "ds_rentroomnum",
							"value": "@nu/" + $scope.detail.ds_rentroomnum
						});
					} else {
						putData.attributes.push({
							"name": "ds_rentroomnum",
							"value": 'null'
						});
					};
					putData.attributes.push({
						"name": "ds_kind",
						"value": "@code/" + $scope.detail.ds_kind.value
					});
					putData.attributes.push({
						"name": "ds_dutyplace",
						"value": "@look/" + $scope.detail.team.value
					});
					putData.attributes.push({
						"name": "ds_date",
						"value": "@dt/" + Api.formatDate('-', date) + ' 08:00'
					});

					gather.putHouseMassage(publicId, putData, function() {
						Api.alert('修改成功');
						$scope.closeThisDialog();
					});
				};
			}
		})
	};
	$scope.lookUserInfo=function(){
		ngDialog.open({
			template: '/police_web/template/dialogs/collectRealHouseMaster.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather,getBase64ByFile,$filter) {
				$scope.detail = {};
				$scope.options = {};
				$scope.options.isCreate = false;
				var masterId = '';
				$scope.close = function(){
					$scope.closeThisDialog();
				};
				$scope.changeSelect = function(data, options) {
					if (data.value != 1 && options[0].value == 1) {
						options.shift(0, 1);
					}
				};
				$scope.changeIdCard = function() {
					if (judes.isIdCard($scope.detail.ds_id)) {
						$scope.detail.birth = $filter('idCardNum')($scope.detail.ds_id, 'birth');
						$scope.detail.sex = $filter('idCardNum')($scope.detail.ds_id, 'sex') == '1' ? '男' : '女';
					} else {
						$scope.detail.birth = '';
						$scope.detail.sex = '';
					}
				};

				function initSelect(value, scopeData, options) {
					if (value) {
						$scope.detail[scopeData] = value.split(':')[0];
						for (var i = 0; i < $scope.options[options].length; i++) {
							if ($scope.options[options][i].value == $scope.detail[scopeData]) {
								$scope.detail[scopeData] = $scope.options[options][i];
							}
						}
					} else {
						$scope.options[options].unshift({
							name: '-请选择-',
							value: '1'
						});
						$scope.detail[scopeData] = $scope.options[options][0];
					};
				};
				gather.getHouseMassage(publicId, function(result) {
					masterId = result['ds_houseowner-ds_personid'];
					options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
						$scope.options = result;
						if (masterId) {
							gather.getPersonMessage(masterId, function(result) {
								
								$scope.detail = result;
								$scope.detail.birth = $filter('idCardNum')($scope.detail.ds_id, 'birth');
								$scope.detail.sex = $filter('idCardNum')($scope.detail.ds_id, 'sex') == '1' ? '男' : '女';
								$scope.detail.aheadpic = result.ds_idaheadpic ?'身份证照片.jpeg':"";

								initSelect(result.ds_account, 'ds_account', 'familyregister');
								initSelect(result.ds_education, 'ds_education', 'education');
								initSelect(result.ds_nation, 'ds_nation', 'nation');
								initSelect(result.ds_marriage, 'ds_marriage', 'marriage');
								initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype');

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
									if(result.ds_idaheadpic &&!$scope.imgData){
										
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
										
									}else if($scope.imgData){
										var a = '<a href="' + $scope.imgData + '" target="_blank"><span> </span></a>';
										a = $(a);
										a.find('span').click();		
									}
								};
							});
						} else {
							$scope.options.isCreate = true;
							initSelect(result.ds_account, 'ds_account', 'familyregister');
							initSelect(result.ds_education, 'ds_education', 'education');
							initSelect(result.ds_nation, 'ds_nation', 'nation');
							initSelect(result.ds_marriage, 'ds_marriage', 'marriage');
							initSelect(result.ds_bloodtype, 'ds_bloodtype', 'bloodtype');
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
						};
					});
				});

				$scope.submit = function() {
					var putData = {
						"attributes": []
					};

					if (judes.isNull($scope.detail.ds_name)) {
						putData.attributes.push({
							"name": "ds_name",
							"value": $scope.detail.ds_name
						});
					} else {
						Api.alert(
							 '请填写姓名'
						);
						return;
					};
					if (judes.isNull($scope.detail.ds_id)) {
						putData.attributes.push({
							"name": "ds_id",
							"value": $scope.detail.ds_id
						});
					} else {
						Api.alert(
							 '请填身份证号'
						);
						return;
					};
					if (judes.isNull($scope.detail.ds_phone)) {
						putData.attributes.push({
							"name": "ds_phone",
							"value": $scope.detail.ds_phone
						});
					} else {
						Api.alert(
							 '请填联系电话1'
						);
						return;
					};

					if (!judes.isIdCard($scope.detail.ds_id)) {
						Api.alert(
							 '身份证号填写有误'
						);
						return;
					};

					if (!$scope.imgData && !judes.isNull($scope.detail.ds_idaheadpic)) {
						Api.alert(
							 '请上传身份证正面照片'
						);
						return;
					};

					if ($scope.detail.ds_account.value != 1) {
						putData.attributes.push({
							"name": "ds_account",
							"value": "@code/" + $scope.detail.ds_account.value
						});
					};
					if ($scope.detail.ds_education.value != 1) {
						putData.attributes.push({
							"name": "ds_education",
							"value": "@code/" + $scope.detail.ds_education.value
						});
					};
					if ($scope.detail.ds_nation.value != 1) {
						putData.attributes.push({
							"name": "ds_nation",
							"value": "@code/" + $scope.detail.ds_nation.value
						});
					};
					if ($scope.detail.ds_marriage.value != 1) {
						putData.attributes.push({
							"name": "ds_marriage",
							"value": "@code/" + $scope.detail.ds_marriage.value
						});
					};
					if ($scope.detail.ds_bloodtype.value != 1) {
						putData.attributes.push({
							"name": "ds_bloodtype",
							"value": "@code/" + $scope.detail.ds_bloodtype.value
						});
					};

					if (judes.isNull($scope.detail.ds_phone2)) {
						putData.attributes.push({
							"name": "ds_phone2",
							"value": $scope.detail.ds_phone2
						});
					} else {
						putData.attributes.push({
							"name": "ds_phone2",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_qq)) {
						putData.attributes.push({
							"name": "ds_qq",
							"value": $scope.detail.ds_qq
						});
					} else {
						putData.attributes.push({
							"name": "ds_qq",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_wechat)) {
						putData.attributes.push({
							"name": "ds_wechat",
							"value": $scope.detail.ds_wechat
						});
					} else {
						putData.attributes.push({
							"name": "ds_wechat",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_height)) {
						putData.attributes.push({
							"name": "ds_height",
							"value": $scope.detail.ds_height
						});
					} else {
						putData.attributes.push({
							"name": "ds_height",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail.ds_address)) {
						putData.attributes.push({
							"name": "ds_address",
							"value": $scope.detail.ds_address
						});
					} else {
						putData.attributes.push({
							"name": "ds_address",
							"value": 'null'
						});
					};

					function upDataPeople() {
						if ($scope.imgData) {
							common.upDataSub({
								"fileType": ".jpg",
								"fileName": "身份证正面照片",
								"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
							}, function(result) {
								putData.attributes.push({
									"name": "ds_idaheadpic",
									"value": result
								});
								gather.upDataPeopleMessage(masterId, putData, function() {
									Api.alert('操作成功');
									$scope.closeThisDialog();
								});
							});
						} else {
							gather.upDataPeopleMessage(masterId, putData, function() {
								Api.alert('操作成功');
								$scope.closeThisDialog();
							});
						};
					};

					if ($scope.options.isCreate) {
						common.getPeopleId({
							name: $scope.detail.ds_name,
							idCard: $scope.detail.ds_id,
							isCreate: "true"
						}, function(result) {
							masterId = result.personId;
							var houseData = {
								"attributes": [{
									"name": "ds_houseowner",
									"value": "@look/" + masterId
								}]
							};
							gather.putHouseMassage(publicId, houseData, function() {
								upDataPeople();
							});
						});
					} else {
						upDataPeople();
					}
				};

			}
		})
	};
	$scope.getUserList=function(){
		gather.getUserList(publicId, function(result) {
			$scope.userList=[]
			for (var i = 0; i < result.length; i++) {
				var item=result[i];
				item.date=Api.formatDate('zh',item['ds_startdate']);
				$scope.userList.push(item);
			};
			$scope.delete=function(data,e){
				e.stopPropagation();
					Api.checked('确定删除'+ data['ds_person_ref-ds_name'] +'吗？',function(){
					gather.deleteUser(data.id, function() {
						Api.alert('删除成功');
						gather.getUserList(publicId, function(result) {
							$scope.userList = result;
						});
					});
				})
			}
		});
	};
		
	$scope.getLesseeList=function(){
		gather.getLesseeList(publicId, function(result) {
			$scope.LesseeList = [];
			for (var i = 0; i < result.length; i++) {
				var item=result[i];
				item.date=Api.formatDate('zh',item['ds_startdate']);
				$scope.LesseeList.push(item);

			};
			console.log($scope.LesseeList);
			$scope.delete=function(data,e){
				e.stopPropagation();
					Api.checked('确定删除'+ data['ds_person_ref-ds_name'] +'吗？',function(){
					gather.deleteUser(data.id, function() {
						Api.alert('删除成功');
						gather.getLesseeList(publicId, function(result) {
							$scope.LesseeList = result;
						});
					});
				})
			}

		});
	};
	$scope.getLesseeList();	
	$scope.getUserList();

	$scope.$on('initList',function(){
		$scope.getLesseeList();	
		$scope.getUserList();
	});
	$scope.addHousePerson=function(type){
		ngDialog.open({
			template: '/police_web/template/dialogs/addCollectHousePerson.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather,$filter,getBase64ByFile) {
				
				$scope.detail = {};
				$scope.options = {};

				$scope.changeSelect = function(data, options) {
					if (data.value != 1 && $scope.options[options][0].value == 1) {
						$scope.options[options].shift(0, 1);
					}
				};

				$scope.changeDate = function(str) {
					$scope.detail[str].show = Api.formatDate('zh', $scope.detail[str].data);
				};

				$scope.changeIdCard = function() {
					if (judes.isIdCard($scope.detail['ds_person_ref-ds_id'])) {
						$scope.detail.birth = $filter('idCardNum')($scope.detail['ds_person_ref-ds_id'], 'birth');
						$scope.detail.sex = $filter('idCardNum')($scope.detail['ds_person_ref-ds_id'], 'sex') == '1' ? '男' : '女';
					} else {
						$scope.detail.birth = '';
						$scope.detail.sex = '';
					}
				};

				function initSelect(value, scopeData, options) {
					if (value) {
						$scope.detail[scopeData] = value.split(':')[0];
						for (var i = 0; i < $scope.options[options].length; i++) {
							if ($scope.options[options][i].value == $scope.detail[scopeData]) {
								$scope.detail[scopeData] = $scope.options[options][i];
							}
						}
					} else {
						$scope.options[options].unshift({
							name: '-请选择-',
							value: '1'
						});
						$scope.detail[scopeData] = $scope.options[options][0];
					};
				};

				options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
					$scope.options = result;
					initSelect(result['ds_person_ref-ds_account'], 'ds_person_ref-ds_account', 'familyregister');
					initSelect(result['ds_person_ref-ds_education'], 'ds_person_ref-ds_education', 'education');
					initSelect(result['ds_person_ref-ds_nation'], 'ds_person_ref-ds_nation', 'nation');
					initSelect(result['ds_person_ref-ds_marriage'], 'ds_person_ref-ds_marriage', 'marriage');
					initSelect(result['ds_person_ref-ds_bloodtype'], 'ds_person_ref-ds_bloodtype', 'bloodtype');

					$scope.detail['ds_startdate'] = {};
					$scope.detail['ds_startdate'] = Api.formatDate('zh', new Date());
					
					$scope.detail['ds_enddate'] = {};
					$scope.detail['ds_enddate'] = Api.formatDate('zh', new Date());
					
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
				$scope.submit = function() {
					var putData = {
						"attributes": []
					};

					if (judes.isNull($scope.detail['ds_person_ref-ds_name'])) {
						putData.attributes.push({
							"name": "ds_name",
							"value": $scope.detail['ds_person_ref-ds_name']
						});
					} else {
						Api.alert(
							 '请填写姓名'
						);
						return;
					};

					if (!judes.isNull($scope.detail['ds_person_ref-ds_id'])) {
						Api.alert(
							 '请填写身份证号'
						);
						return;
					};

					if (!judes.isIdCard($scope.detail['ds_person_ref-ds_id'])) {
						Api.alert(
							 '身份证号输入错误'
						);
						return;
					};

					if (Api.formatDate('/', $('.timeInput1').val()) == 'error') {
						Api.alert(
							 '请选择正确的开始时间'
						);
						return;
					};
					if (Api.formatDate('/', $('.timeInput2').val()) == 'error') {
						Api.alert(
							 '请选择正确的结束时间'
						);
						return;
					};

					var startTime = Api.formatDate('/', $('.timeInput1').val()) + ' 00:00:01';
					var endTime = Api.formatDate('/', $('.timeInput2').val()) + ' 23:59:59';
					if (Api.formatDate('Z', startTime) > Api.formatDate('Z', endTime)) {
						Api.alert(
							 '开始时间不能大于结束时间'
						);
						return;
					};

					if (!$scope.imgData) {
						Api.alert(
							 '请上传身份证正面照片'
						);
						return;
					};

					common.getPeopleId({
						name: $scope.detail['ds_person_ref-ds_name'],
						idCard: $scope.detail['ds_person_ref-ds_id'],
						isCreate: "true"
					}, function(result) {
						var peopleId = result.personId
						var userData = {
							"name": "ds_residentsassociation",
							"attributes": [{
								"name": "ds_startdate",
								"value": "@dt/" + startTime
							}, {
								"name": "ds_enddate",
								"value": "@dt/" + endTime
							}, {
								"name": "ds_liveway",
								"value": "@code/" + type
							}, {
								"name": "ds_person_ref",
								"value": "@look/" + peopleId
							}, {
								"name": "ds_realhouse_ref",
								"value": "@look/" + publicId
							}]
						};
						gather.creatCrm(userData, function(result) {
							if ($scope.detail['ds_person_ref-ds_account'].value != 1) {
								putData.attributes.push({
									"name": "ds_account",
									"value": "@code/" + $scope.detail['ds_person_ref-ds_account'].value
								});
							};
							if ($scope.detail['ds_person_ref-ds_education'].value != 1) {
								putData.attributes.push({
									"name": "ds_education",
									"value": "@code/" + $scope.detail['ds_person_ref-ds_education'].value
								});
							};
							if ($scope.detail['ds_person_ref-ds_nation'].value != 1) {
								putData.attributes.push({
									"name": "ds_nation",
									"value": "@code/" + $scope.detail['ds_person_ref-ds_nation'].value
								});
							};
							if ($scope.detail['ds_person_ref-ds_marriage'].value != 1) {
								putData.attributes.push({
									"name": "ds_marriage",
									"value": "@code/" + $scope.detail['ds_person_ref-ds_marriage'].value
								});
							};
							if ($scope.detail['ds_person_ref-ds_bloodtype'].value != 1) {
								putData.attributes.push({
									"name": "ds_bloodtype",
									"value": "@code/" + $scope.detail['ds_person_ref-ds_bloodtype'].value
								});
							};

							if (judes.isNull($scope.detail['ds_person_ref-ds_phone2'])) {
								putData.attributes.push({
									"name": "ds_phone2",
									"value": $scope.detail['ds_person_ref-ds_phone2']
								});
							};
							if (judes.isNull($scope.detail['ds_person_ref-ds_qq'])) {
								putData.attributes.push({
									"name": "ds_qq",
									"value": $scope.detail['ds_person_ref-ds_qq']
								});
							};
							if (judes.isNull($scope.detail['ds_person_ref-ds_wechat'])) {
								putData.attributes.push({
									"name": "ds_wechat",
									"value": $scope.detail['ds_person_ref-ds_wechat']
								});
							};
							if (judes.isNull($scope.detail['ds_person_ref-ds_height'])) {
								putData.attributes.push({
									"name": "ds_height",
									"value": $scope.detail['ds_person_ref-ds_height']
								});
							};
							if (judes.isNull($scope.detail['ds_person_ref-ds_address'])) {
								putData.attributes.push({
									"name": "ds_address",
									"value": $scope.detail['ds_person_ref-ds_address']
								});
							};

							common.upDataSub({
								"fileType": ".jpg",
								"fileName": "身份证正面照片",
								"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
							}, function(result) {
								putData.attributes.push({
									"name": "ds_idaheadpic",
									"value": result
								});
								gather.upDataPeopleMessage(peopleId, putData, function() {
									Api.alert('操作成功');
									$scope.closeThisDialog();
									$rootScope.$broadcast('initList');
								});
							});
						});
					});
				};
						
			}
		})
	};

	$scope.lookHousePerson=function(person){
		ngDialog.open({
			template: '/police_web/template/dialogs/collectRealHousePersonInfo.html',	
			appendClassName: 'ngdialog-place',				
			controller: function($scope,$state,common,user,public,address,user,$rootScope,options,gather,$filter,getBase64ByFile) {
				$scope.detail = {};
				$scope.options = {};
				var peopleId = '';

				$scope.close=function(){
					$scope.closeThisDialog();
				};
				$scope.changeSelect = function(data, options) {
					if (data.value != 1 && $scope.options[options][0].value == 1) {
						$scope.options[options].shift(0, 1);
					}
				};

				$scope.changeIdCard = function() {
					if (judes.isIdCard($scope.detail.ds_id)) {
						$scope.detail.birth = $filter('idCardNum')($scope.detail.ds_id, 'birth');
						$scope.detail.sex = $filter('idCardNum')($scope.detail.ds_id, 'sex') == '1' ? '男' : '女';
					} else {
						$scope.detail.birth = '';
						$scope.detail.sex = '';
					}
				};

				function initSelect(value, scopeData, options) {
					if (value) {
						$scope.detail[scopeData] = value.split(':')[0];
						for (var i = 0; i < $scope.options[options].length; i++) {
							if ($scope.options[options][i].value == $scope.detail[scopeData]) {
								$scope.detail[scopeData] = $scope.options[options][i];
							}
						}
					} else {
						$scope.options[options].unshift({
							name: '-请选择-',
							value: '1'
						});
						$scope.detail[scopeData] = $scope.options[options][0];
					};
				};

				options.get(['nation', 'bloodtype', 'education', 'familyregister', 'marriage'], function(result) {
					$scope.options = result;
					gather.houseUserDetail(person.id, function(result) {
						$scope.detail = angular.copy(result);
						console.log($scope.detail);
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
						// $scope.detail['ds_startdate'].data = new Date(Api.formatDate('-', result['ds_startdate']));
						$scope.detail['ds_startdate'] = Api.formatDate('zh', result['ds_startdate']);

						$scope.detail['ds_enddate'] = {};
						// $scope.detail['ds_enddate'].data = new Date(Api.formatDate('-', result['ds_enddate']));
						$scope.detail['ds_enddate'] = Api.formatDate('zh', result['ds_enddate']);

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
							if(result['ds_person_ref-ds_idaheadpic'] &&!$scope.imgData){
								
									if(result['ds_person_ref-ds_idaheadpic']){	
										common.getSub(result['ds_person_ref-ds_idaheadpic'], function(url) {
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
					});
				});

				$scope.submit = function() {
					var putData = {
						"attributes": []
					};

					if (judes.isNull($scope.detail['ds_person_ref-ds_name'])) {
						putData.attributes.push({
							"name": "ds_name",
							"value": $scope.detail['ds_person_ref-ds_name']
						});
					} else {
						Api.alert(
							 '请填写姓名'
						);
						return;
					};

					if (Api.formatDate('/', $('.timeInput1').val()) == 'error') {
						Api.alert(
							 '请选择正确的开始时间'
						);
						return;
					};
					if (Api.formatDate('/', $('.timeInput2').val()) == 'error') {
						Api.alert(
							 '请选择正确的结束时间'
						);
						return;
					};

					var startTime = Api.formatDate('/', $('.timeInput1').val()) + ' 00:00:01';
					var endTime = Api.formatDate('/', $('.timeInput2').val()) + ' 23:59:59';
					if (Api.formatDate('Z', startTime) > Api.formatDate('Z', endTime)) {
						Api.alert(
							 '开始时间不能大于结束时间'
						);
						return;
					};
					var userData = {
						"attributes": [{
							"name": "ds_startdate",
							"value": "@dt/" + startTime
						}, {
							"name": "ds_enddate",
							"value": "@dt/" + endTime
						}]
					};

					if ($scope.detail['ds_person_ref-ds_account'].value != 1) {
						putData.attributes.push({
							"name": "ds_account",
							"value": "@code/" + $scope.detail['ds_person_ref-ds_account'].value
						});
					};
					if ($scope.detail['ds_person_ref-ds_education'].value != 1) {
						putData.attributes.push({
							"name": "ds_education",
							"value": "@code/" + $scope.detail['ds_person_ref-ds_education'].value
						});
					};
					if ($scope.detail['ds_person_ref-ds_nation'].value != 1) {
						putData.attributes.push({
							"name": "ds_nation",
							"value": "@code/" + $scope.detail['ds_person_ref-ds_nation'].value
						});
					};
					if ($scope.detail['ds_person_ref-ds_marriage'].value != 1) {
						putData.attributes.push({
							"name": "ds_marriage",
							"value": "@code/" + $scope.detail['ds_person_ref-ds_marriage'].value
						});
					};
					if ($scope.detail['ds_person_ref-ds_bloodtype'].value != 1) {
						putData.attributes.push({
							"name": "ds_bloodtype",
							"value": "@code/" + $scope.detail['ds_person_ref-ds_bloodtype'].value
						});
					};

					if (judes.isNull($scope.detail['ds_person_ref-ds_phone2'])) {
						putData.attributes.push({
							"name": "ds_phone2",
							"value": $scope.detail['ds_person_ref-ds_phone2']
						});
					} else {
						putData.attributes.push({
							"name": "ds_phone2",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail['ds_person_ref-ds_qq'])) {
						putData.attributes.push({
							"name": "ds_qq",
							"value": $scope.detail['ds_person_ref-ds_qq']
						});
					} else {
						putData.attributes.push({
							"name": "ds_qq",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail['ds_person_ref-ds_wechat'])) {
						putData.attributes.push({
							"name": "ds_wechat",
							"value": $scope.detail['ds_person_ref-ds_wechat']
						});
					} else {
						putData.attributes.push({
							"name": "ds_wechat",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail['ds_person_ref-ds_height'])) {
						putData.attributes.push({
							"name": "ds_height",
							"value": $scope.detail['ds_person_ref-ds_height']
						});
					} else {
						putData.attributes.push({
							"name": "ds_height",
							"value": 'null'
						});
					};
					if (judes.isNull($scope.detail['ds_person_ref-ds_address'])) {
						putData.attributes.push({
							"name": "ds_address",
							"value": $scope.detail['ds_person_ref-ds_address']
						});
					} else {
						putData.attributes.push({
							"name": "ds_address",
							"value": 'null'
						});
					};

					gather.upDataUser(person.id, userData, function() {
						if ($scope.detail.upDataImg) {
							common.upDataSub({
								"fileType": ".jpg",
								"fileName": "身份证正面照片",
								"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
							}, function(result) {
								putData.attributes.push({
									"name": "ds_idaheadpic",
									"value": result
								});
								gather.upDataPeopleMessage(peopleId, putData, function() {
									Api.alert('修改成功');
									$scope.closeThisDialog();
								});
							});
						} else {
							gather.upDataPeopleMessage(peopleId, putData, function() {
								Api.alert('修改成功');
								$scope.closeThisDialog();
							});
						};
					});

				};
			}
		})
	}
});
controllers.controller('index.collectSocialResource', function($scope,$scope,$state, Api, address, public, $stateParams,judes,gather,options,common,ngDialog,user){
	$scope.title = $scope.$parent.$parent.title = "社会资源管理";
});