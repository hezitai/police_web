services.directive("amapSet", function($compile, $state) {
	return {
		restrict: "E",
		replace: true,
		template: "<div id='allMap' style='position:absolute; top:0px; left:0px; bottom : 0px; right : 0px;'></div>",
		link: function(scope, element, attrs) {
			try {
				var markers = [],
					map = new AMap.Map("allMap", {
						resizeEnable: true,
						center: [125.658668, 43.524547],
						zoom: 16,
					});
				

				function initMarkers() {
					map.remove(markers);
					markers = [];
					var list = scope.peopleList;
					for (var i = 0, marker; i < list.length; i++) {
						var marker = new AMap.Marker({
							icon: "img/mark_b.png",
							position: [list[i].longitude, list[i].latitude],
							map: map
						});
						marker.setLabel({
							offset: new AMap.Pixel(-90, 35),
							content: '<div class="blue">' + list[i].name + '</div>'
						});
						marker.setMap(map);
						markers.push(marker);
					};
				};
				scope.$watch('refresh', function() {
					console.log('init');
					initMarkers();
				}, true);

				// map.setFitView();
			} catch (error) {
				element.append('地图模块加载失败,请刷新页面或检查网络连接');
			}
		}
	};
});
services.factory('getPosition', function(Api) {
	return {
		get: function(id, success) {
			Api.POST({
				url: "/api/Crm/GetTeamUser",
				data: {
					"commonStr": id
				},
				success: function(result) {
//					var resultValue = Api.formatting(result, 'list');
					success(result.resultObj);
				},
			});
		},
	}
});

services.factory('common', function(Api) {
	return {
		
		getPoliceHouse: function(success) {
			Api.GET({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name' or name eq 'ds_team')&$filter=name eq 'ds_address_l1' and query eq 'ds_name ne null'",
				success: function(result) {
					var resultValue = Api.format.CRMList(result.value);
					success(resultValue);
				},
			});
		},
		getPeopleId: function(data, success) {
			Api.POST({
				url: "/api/Crm/GetPeopleExist",
				data: data,
				success: function(result) {
					if (result.status == 0) {
						success(result.resultObj);
					} else {
						Api.alert('创建人员失败');
					}
				},
			});
		},
		getSub: function(id, success) {
			Api.POST({
				url: "/api/Place/GetStub",
				data: {
					id: id
				},
				success: function(result) {
					if (result.status == 0) {
						success(result.resultObj.fileTempPath);
					} else {
						Api.alert('未找到图片');
					}
				},
			});
		},
		upDataSub: function(data, success) {
			Api.POST({
				url: "/api/Crm/CreateStub",
				data: data,
				success: function(result) {
					if (result.status == 0) {
						success(result.resultObj.id);
					} else {
						Api.alert('图片上传失败\n请检查网络');
					}
				},
			})
		},
		upDataPeopleMessage: function(id, name, phone) {
			Api.PUT({
				url: "/crm/Entities('ds_person" + id + "')",
				data: {
					"attributes": [{
						"name": "ds_phone",
						"value": phone
					}, {
						"name": "ds_name",
						"value": name
					}]
				},
				success: function() {
					console.log('修改人员信息成功!');
				},
				unLoading: true,
			});
		},
		getAllPloice: function(success) {
			Api.POST({
				url: "/api/Crm/GetAllPolice",
				success: function(result) {
					if (result.status == 0) {
						success(result.resultObj);
					} else {
						Api.alert('获取警员列表失败');
					}
				}
			});
		},
		getPoliceByPoliceCRMId: function(id, success) {
			Api.GET({
				url: "/crm/Entities?$expand=attributes(" +
					"$filter=name eq 'ds_name' " +
					"or name eq 'systemuserid'" +
					"),lookups&$filter=name eq 'systemuser' and query eq 'systemuserid eq " + id + "'",
				// data: data,
				success: function(result) {
					var value = Api.format.CRMValue(result.value);
					var data = {};
					data.name = value.ds_name;
					data.policeCrmId = value.systemuserid;
					success(data);
				},
			});
		},


	}
});