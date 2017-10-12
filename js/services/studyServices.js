services.directive("casePosition", function($compile,Api) {
	return {
		restrict: "E",
		replace: true,
		template: "<div id='case_position' style='position:absolute; top:0px; left:0px; bottom : 0px; right : 0px;'></div>",
		link: function(scope, element, attrs) {
			var map, marker, geocoder;
			//加载地图，调用浏览器定位服务
			map = new AMap.Map("case_position", {
				resizeEnable: true,
				center: [125.658668, 43.524547],
				zoom: 16,
			});
			var showConfirm = function(str, position) {
				Api.Loading.hide();
				
				Api.checked('是否选择以下地址?<br/>' + str,function(){
					scope.setAddress(str, position);
					console.log(str, position);
				})	
			};

			map.plugin('AMap.Geocoder', function() {
				var geocoder = new AMap.Geocoder({
					city: "010" //城市，默认：“全国”
				});
				map.on('click', function(e) {
					Api.Loading.show();
					if (marker) {
						marker.setMap(null);
						marker = null;
					};
					marker = new AMap.Marker({
						icon: "img/mark_b.png",
						position: [e.lnglat.getLng(), e.lnglat.getLat()]
					});
					marker.setMap(map);
					geocoder.getAddress(e.lnglat, function(status, result) {
						if (status == 'complete') {
							showConfirm(result.regeocode.formattedAddress, [e.lnglat.getLng(), e.lnglat.getLat()]);
						}
					});
				});
			});

		}
	};
});
services.directive("jmapSet", function($compile, $state) {
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
					console.log(list);
					for (var i = 0, marker; i < list.length; i++) {
						if(list[i].level==0){
							var marker = new AMap.Marker({
								icon: "img/mark_g.png",
								position: [list[i].longitude, list[i].latitude],
								map: map
							});
							marker.setLabel({
								offset: new AMap.Pixel(-90, 35),
								content: '<div class="green">' + list[i].name + '</div>'
							});
						}else if(list[i].level==1){
							var marker = new AMap.Marker({
								icon: "img/mark_o.png",
								position: [list[i].longitude, list[i].latitude],
								map: map
							});
							marker.setLabel({
								offset: new AMap.Pixel(-90, 35),
								content: '<div class="orange">' + list[i].name + '</div>'
							});
						}else if(list[i].level==2){
							var marker = new AMap.Marker({
								icon: "img/mark_r.png",
								position: [list[i].longitude, list[i].latitude],
								map: map
							});
							marker.setLabel({
								offset: new AMap.Pixel(-90, 35),
								content: '<div class="red">' + list[i].name + '</div>'
							});
						}
						
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
services.factory('caseService', function(Api) {
	var getAddress = function(success) {
		var map, geolocation, geocoder;
		//加载地图，调用浏览器定位服务
		map = new AMap.Map('container', {
			resizeEnable: true
		});
		map.plugin('AMap.Geolocation', function() {
			geolocation = new AMap.Geolocation({
				enableHighAccuracy: true,
				timeout: 10000,
				buttonOffset: new AMap.Pixel(10, 20),
				zoomToAccuracy: true,
				buttonPosition: 'RB'
			});
			geocoder = new AMap.Geocoder({
				city: "010" //城市，默认：“全国”
			});
			map.addControl(geolocation);
			geolocation.getCurrentPosition();
			AMap.event.addListener(geolocation, 'complete', onComplete);
			AMap.event.addListener(geolocation, 'error', onError);
		});
		//解析定位结果
		function onComplete(data) {
			var lnglatXY = [data.position.getLng(), data.position.getLat()];
			console.log(lnglatXY);
			geocoder.getAddress(lnglatXY, function(status, result) {
				if (status == 'complete') {
					success(result.regeocode.formattedAddress, [data.position.getLng(), data.position.getLat()]);
					map.destroy();
				} else {
					Api.alert('获取详细地址失败,请手动输入详细地址');
				}
			});
		};
		//解析定位错误信息
		function onError(data) {
			Api.alert('定位失败\n请在系统设置中,开启定位服务');
		};
	};

	var getPublicListForMap = function(id, success) {
		console.log(id);
		Api.POST({
			url: "/api/Crm/SearchInfoPublic",
			data: {
				"policeStation": id
			},
			success: function(result) {
				console.log(result);
				if (result.status == 0) {
					success(result.resultObj);
				} else if (result.status == 2) {
					success([]);
					Api.alert('未获到取任何数据');
				}else {
					Api.alert('获取失败,请重试');
				}
			}
		});
	};
	var getCaseListForMap = function(data, success) {
		Api.POST({
			url: "/api/Crm/SearchInfoJudgeCase",
			data: data,
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else if (result.status == 2) {
					success([]);
					Api.alert('未获到取任何数据');
				} else {
					Api.alert('获取失败,请重试');
				}
			}
		});
	};
	var getPeopleListForMap = function(id, success) {
		Api.POST({
			url: "/api/Crm/SearchInfoPerson",
			data: {
				"policeStation": id
			},
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else if (result.status == 2) {
					success([]);
					Api.alert('未获到取任何数据');
				} else {
					Api.alert('获取失败,请重试');
				}
			}
		});
	};
	var getCaseDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_address' " +
				"or name eq 'ds_caselocation'" +
				"or name eq 'ds_caseposition'" +
				"or name eq 'ds_casestatus'" +
				"or name eq 'ds_casetype-ds_source'" +
				"or name eq 'ds_casetype-ds_name'" +
				"or name eq 'ds_description'" +
				"or name eq 'ds_happendate'" +
				"or name eq 'ds_latitude'" +
				"or name eq 'ds_longitude'" +
				"or name eq 'ds_name'" +
				"or name eq 'ds_personlist'" +
				// "or name eq 'ds_pic'" +
				"or name eq 'ds_police_ref'" +
				"or name eq 'ds_policestation_ref'" +
				"or name eq 'ds_receiveddate'" +
				// "or name eq 'ds_video'" +
				"or name eq 'ds_police_ref-ds_name'" +
				"or name eq 'ds_policestation_ref-ds_name'" +
				"or name eq 'ds_helppolice'" +
				"),lookups&$filter=name eq 'ds_case' and query eq 'ds_caseid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value)
				success(value);
			}
		});
	};var getFireCaseList = function(data, success) {
		Api.POST({
			url: "/api/Crm/SearchInfoFireCase",
			data: data,
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					Api.alert('获取失败,请重试');
				}
			}
		});
	};
	var createCrm = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: data,
			success: function(result) {
				success(result);
			}
		});
	};
	var getStudentDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_nativeplace' " +
				"or name eq 'ds_address' " +
				"or name eq 'ds_id' " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_phone' " +
				")&$filter=name eq 'ds_person' and query eq 'ds_personid eq " + id + "'",

			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			}
		});
	};
	return {
		getAddress: getAddress, // 获取地图位置信息
		getPublicListForMap: getPublicListForMap, // 获取行业场所列表
		getCaseListForMap: getCaseListForMap, // 获取案件列表
		getPeopleListForMap: getPeopleListForMap, // 获取人员列表
		getCaseDetail: getCaseDetail, // 获取案件详情
		getFireCaseList:getFireCaseList,
		getStudentDetail: getStudentDetail,
		createCrm:createCrm
	}
});