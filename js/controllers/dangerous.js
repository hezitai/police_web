controllers.controller('index.dangerous', function($scope, $state, Api, ngDialog, download, public,dangerous,$stateParams) {
	$scope.title = $scope.$parent.$parent.title = "危爆物品管理";

	$scope.dangerPublic=[];
	dangerous.getDangerPublicList(function(result){
		
		$scope.dangerPublic=result;
			 	
	 	$scope.stateGo = function(stateName,id) {
			$state.go(stateName);
			Api.Storage.set('crumbs', [{
				name: '危爆物品管理',
				stateName: 'dangerous',
			}, {
				name: '危爆物品清单',
				stateName: 'dangerousDetail',
				id:id,
				
			}]);
			
		};
	});

});
controllers.controller('index.dangerousDetail', function($scope, $state, Api, ngDialog, download, checkType, public,dangerous) {
	$scope.title = $scope.$parent.$parent.title = "危爆物品清单";

	var crumbs = Api.Storage.get('crumbs');
	
	var publicorderid = crumbs[1].id;
	function get(){
		public.getDangerList(publicorderid,function(result){
			$scope.dangerList =[];
			for(var i=0;i<result.length;i++){
				var time=Api.formatDate('-',result[i].createdon);
				result[i].time=time;
				$scope.dangerList.push(result[i]);
			};
			

		})
	};
	get();
	$scope.deleteDanger = function(id,e){
		e.stopPropagation();
		Api.checked('确定删除吗？',function(){
			public.deleteDanger(id,function(){
				Api.alert('删除成功');
				get();
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
							console.log(result);
							$scope.dangermessage.name = result['ds_name'];
							$scope.dangermessage.person = result['ds_charge-ds_name'];
							$scope.dangermessage.phone = result['ds_charge-ds_phone'];
							$scope.dangermessage.id = result['ds_charge-ds_id'];
							$scope.dangermessage.type = result['ds_type'];
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
								if (!judes.isNull($scope.dangermessage.description)) {
									
									Api.alert('危爆物品重要性论述不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.condition)) {
									
									Api.alert('危爆物品危险品情况不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.measure)) {
									
									Api.alert('危爆物品安保措施不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.disposeplan)) {
									
									Api.alert('危爆物品应急处理方案不能为空');
									return;
								};

								if (!judes.isNull($scope.dangermessage.aheadpic)) {
									
									Api.alert('请上传危爆物品图片');
									return;
								};
								function upData(subId) {
									var pustData = {
										"attributes": [{
											"name": "ds_name",
											"value": $scope.dangermessage.name
										}, {
											"name": "ds_description",
											"value": $scope.dangermessage.description
										}, {
											"name": "ds_disposeplan",
											"value": $scope.dangermessage.disposeplan
										}, {
											"name": "ds_condition",
											"value": $scope.dangermessage.condition
										}, {
											"name": "ds_measure",
											"value": $scope.dangermessage.measure
										}, {
											"name": "ds_type",
											"value": $scope.dangermessage.type
										}]
									};
									if (subId) {
										pustData.attributes.push({
											"name": "ds_picstub",
											"value": subId
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

			$scope.addDangers = function(){
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
								if (!judes.isNull($scope.dangermessage.description)) {
									
									Api.alert('危爆物品重要性论述不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.condition)) {
									
									Api.alert('危爆物品危险品情况不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.measure)) {
									
									Api.alert('危爆物品安保措施不能为空');
									return;
								};
								if (!judes.isNull($scope.dangermessage.disposeplan)) {
									
									Api.alert('危爆物品应急处理方案不能为空');
									return;
								};

								if (!judes.isNull($scope.dangermessage.aheadpic)) {
									
									Api.alert('请上传危爆物品图片');
									return;
								};
								function upData(subId, peopleId) {
									var pustData = {
										"name": "ds_dangerousgoods",
										"attributes": [{
											"name": "ds_publicorder",
											"value": "@look/" + publicorderid
										}, {
											"name": "ds_name",
											"value": $scope.dangermessage.name
										}, {
											"name": "ds_charge",
											"value": "@look/" + peopleId,
										}, {
											"name": "ds_description",
											"value": $scope.dangermessage.description
										}, {
											"name": "ds_disposeplan",
											"value": $scope.dangermessage.disposeplan
										}, {
											"name": "ds_condition",
											"value": $scope.dangermessage.condition
										}, {
											"name": "ds_picstub",
											"value": subId
										}, {
											"name": "ds_measure",
											"value": $scope.dangermessage.measure
										}, {
											"name": "ds_type",
											"value": $scope.dangermessage.type
										}]
									};
									common.upDataPeopleMessage(peopleId, $scope.dangermessage.person, $scope.dangermessage.phone);
									public.CreatDangerDetail(pustData, function() {
										Api.alert('创建成功');
										$scope.closeThisDialog();
										get();
									});
								};
								common.getPeopleId({
									"name": $scope.dangermessage.person,
									"idCard": $scope.dangermessage.id,
									"isCreate": "true"
								}, function(result) {
									var peopleId = result.personId;
									common.upDataSub({
										"fileName": "危爆物品图片",
										"fileType": ".jpg",
										"tempFileStream": $scope.imgData.replace(/data:image\/jpeg\;base64\,/g, "")
									}, function(result) {
										upData(result, peopleId);
									});
								});

							};
						
					}					
				});			
			}

})