services.directive("publicMap", function($compile, $state, Api) {
	return {
		restrict: "E",
		replace: true,
		template: "<div id='allMap' style='position:absolute; top:0px; left:0px; bottom : 0px; right : 0px;'></div>",
		link: function(scope, element, attrs) {
			try {
				var marker, map = new AMap.Map("allMap", {
					resizeEnable: true,
					center: [125.658668, 43.524547],
					zoom: 16,
				});
				element.css({
					width: $('#main').width(),
					height: $('#main').height()
				});
				// 红绿橙显示
				var heatmapData = [{
					"lng": 125.658668,
					"lat": 43.524547,
					"count": 5
				}];
				var heatmap;
				map.plugin(["AMap.Heatmap"], function() {
					heatmap = new AMap.Heatmap(map, {
						radius: 40, //给定半径
						opacity: [0, 0.6],
						gradient: {
							0: 'green',
							0.5: 'orange',
							1.0: 'red'
						}
					});
				});
				// 初始化坐标
				// heatmap.setDataSet({
				// 	data: heatmapData,
				// 	max: 10
				// });

				// 自定义点标注


				function initMarkers() {

					markers = [];
					var inofContent = scope.publicList;
					// var addressInfo =

					for (var i = 0, marker; i < inofContent.length; i++) {
						if (inofContent[i].position[0] && inofContent[i].position[1]) {
							var marker = new AMap.Marker({
								icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
								position: inofContent[i].position,
								map: map
							});
							marker.setMap(map);
							marker.setLabel({
								offset: new AMap.Pixel(-90, 35),
								// content: '<div><a href=#/index/placeDetail?id=' + inofContent[i].id +'&type=' + inofContent[i].type + ' style="color:white">' + inofContent[i].title + '</a></div>'
								content: '<div>' + inofContent[i].title + '</div>'

							});
							marker.on('click', function(e){
								markerClick(e.target.content);
							});
							marker.content = inofContent[i];
							markers.push(marker);
						}
					};

					function markerClick(inofContent) {
						Api.Storage.set('crumbs', [{
							name: '行业场所',
							stateName: 'place'
						}, {
							name: inofContent.title,
							stateName: 'placeDetail',
							id: inofContent.id,
							type:inofContent.type,
							formMap:true,
						}]);
						$state.go('index.placeDetail');
					}
				};
				scope.$watch('refresh', function() {
					console.log('init');
					initMarkers();
				}, true);

			} catch (error) {
				element.append('地图模块加载失败,请刷新页面或检查网络连接');
			}
		}
	};
});
services.directive('showPosition', function(Api) {
	return {
		restrict: "E",
		replace: true,
		template: "<div id='showPositionElememt' style='position:absolute; top:0px; left:0px; bottom : 0px; right : 0px;'></div>",
		link: function(scope, element, attrs) {
			try {
				var markers = [];
				var map = new AMap.Map("showPositionElememt", {
					resizeEnable: true,
					center: [125.658668, 43.524547],
					zoom: 18,
				});
				
				function regeocoder() { //逆地理编码
					var marker = new AMap.Marker({ //加点
						map: map,
						position: scope.position
					});
					map.setFitView();
				};
				scope.$watch('refresh', function() {
					regeocoder()
				}, true);
			} catch (error) {
				element.append('地图模块加载失败,请刷新页面或检查网络连接');
			}
		}
	};
});
services.factory('public', function(Api,user) {

	var getPublicList = function(data,success) {
		Api.POST({
			url: "/api/Crm/GetPublicOrderList",
			data:data,
			success: function(result) {
				console.log(result);
				success(result);
			}
		});
	};

	var getPublicBusinesskind = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_businesskind' " +
				"),lookups&$filter=name eq 'ds_publicorder' and query eq 'ds_publicorderid eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMValue(result.value);
				success(resultValue);
			}
		});
	};

	var getPublicInfor = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_publicorderid' " +
				"or name eq 'ds_businesskind' " +
				"or name eq 'ds_districtpolicestation_name' " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_address' " +
				"or name eq 'ds_owner_ref-ds_name' " +
				"or name eq 'ds_owner_ref-ds_id' " +
				"or name eq 'ds_owner_ref-ds_phone' " +
				"or name eq 'ds_owner_ref-ds_address' " +
				"or name eq 'ds_securityowner_ref-ds_name' " +
				"or name eq 'ds_securityowner_ref-ds_id' " +
				"or name eq 'ds_securityowner_ref-ds_phone' " +
				"or name eq 'ds_securityowner_ref-ds_phone2' " +
				"or name eq 'ds_securityowner_ref-ds_address' " +
				"or name eq 'ds_latitude' " +
				"or name eq 'ds_longitude' " +
				"or name eq 'ds_address_tree' " +
				"or name eq 'ds_collectperson' " +
				"or name eq 'ds_stub' " +
				"or name eq 'ds_firestub' " +
				"or name eq 'ds_issmall' " +
				"or name eq 'ds_firelevel' " +
				"),lookups&$filter=name eq 'ds_publicorder' and query eq 'ds_publicorderid eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMValue(result.value);
				success(resultValue);
			}
		});
	};

	var getPublicPeopleList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_employee-ds_name' or name eq 'ds_employee-ds_personid' or name eq 'ds_publicorder_employeeid' or name eq 'ds_position' ),lookups&$filter=name eq 'ds_publicorder_employee' and query eq 'ds_publicorder_ref eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};

	var puDataPublicPliceMessage = function(id, data, success) {
		if (!data.firelevel) {
			Api.alert('请选择行业场所消防单位级别');
			return;
		};
		var pustData = {
			attributes: [{
				"name": "ds_firelevel",
				"value": "@code/" + data.firelevel,
			}, {
				"name": "ds_issmall",
				"value": "@b/" + (data.issmall ? 'True' : 'False'),
			}],
		};
		Api.PUT({
			url: "/crm/Entities('ds_publicorder" + id + "')",
			data: pustData,
			success: function(result) {
				success();
				Api.alert('修改成功');
			},
			error: function(result) {
				console.log(result);
			}
		});
	};

	var getPeopleDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter = name eq 'ds_employee-ds_name' " +
				"or name eq 'ds_employee-ds_id' " +
				"or name eq 'ds_position' " +
				"or name eq 'ds_employee-ds_account' " +
				"or name eq 'ds_employee-ds_address' " +
				"or name eq 'ds_employee-ds_birth' " +
				"or name eq 'ds_employee-ds_bloodtype' " +
				"or name eq 'ds_employee-ds_education' " +
				"or name eq 'ds_employee-ds_gender' " +
				"or name eq 'ds_employee-ds_height' " +
				"or name eq 'ds_employee-ds_idaheadpic' " +
				"or name eq 'ds_employee-ds_idbackpic' " +
				"or name eq 'ds_employee-ds_livestatus' " +
				"or name eq 'ds_employee-ds_marriage' " +
				"or name eq 'ds_employee-ds_nation' " +
				"or name eq 'ds_employee-ds_nativeplace' " +
				"or name eq 'ds_employee-ds_oldname' " +
				"or name eq 'ds_employee-ds_personid' " +
				"or name eq 'ds_employee-ds_phone' " +
				"or name eq 'ds_employee-ds_phone2' " +
				"or name eq 'ds_employee-ds_politics' " +
				"or name eq 'ds_employee-ds_qq' " +
				"or name eq 'ds_employee-ds_telephone' " +
				"or name eq 'ds_employee-ds_wechat' " +
				"),lookups&$filter=name eq 'ds_publicorder_employee' and query eq 'ds_publicorder_employeeid eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMValue(result.value);
				success(resultValue);
			}
		});
	};


	var upDataPeopleMessage = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};



	var getDangerList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_dangerousgoodsid' " +
				"or name eq 'ds_name' " +
				"),lookups&$filter=name eq 'ds_dangerousgoods' and query eq 'ds_publicorder eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};

	var getDangerDetail = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_charge-ds_personid' " +
				"or name eq 'ds_charge-ds_name' " +
				"or name eq 'ds_charge-ds_phone' " +
				"or name eq 'ds_charge-ds_id' " +
				"or name eq 'ds_condition' " +
				"or name eq 'ds_description' " +
				"or name eq 'ds_disposeplan' " +
				"or name eq 'ds_location' " +
				"or name eq 'ds_measure' " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_picstub' " +
				"or name eq 'ds_publicorder' " +
				"or name eq 'ds_type' " +
				"),lookups&$filter=name eq 'ds_dangerousgoods' and query eq 'ds_dangerousgoodsid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value);
				success(value);
			},
		});
	};

	var upDataDangerDetail = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_dangerousgoods" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};
	var deleteDanger = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_dangerousgoods" + id + "')",
			success: function() {
				success();
			}
		});
	};
	var CreatDangerDetail = function(data, success) {
		Api.POST({
			url: '/crm/Entities',
			data: data,
			success: function() {
				success();
			}
		});
	};

	//查询浏览记录/api/Crm/GetBrowseHistory
	var GetBrowse = function(id, Type, success) {
		var userMessage = user.getUserMessage();
		Api.POST({
			url: "/api/Crm/GetBrowseHistory",
			data: {
				"id": id,
				"ds_person": userMessage.policeCrmId,
				"ds_type": Type
			},
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					Api.alert('浏览记录获取失败');
				}
			}
		});
	};

	var upDataBrowse = function(id, type, success) {
		Api.PUT({
			url: "/crm/Entities('ds_browsehistory" + id + "')",
			data: {
				"attributes": [{
					"name": "ds_viewtype",
					"value": "@code/" + type
				}]
			},
			success: function(result) {
				if (success) {
					success(result);
				}
				console.log('浏览记录修改成功');
			},
		});
	};

	var AddPublic = function(data, success) {
		Api.POST({
			url: "/api/Crm/PoliceCreatePublicorder",
			data: data,
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					Api.alert('创建成功');
				}
			}
		});
	};

	var CreatUniversity = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: data,
			success: function(result) {
				success(result);
			}
		});
	};

	var upDataPeopleMessageForAddPublic = function(data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + data.id + "')",
			data: {
				"attributes": [{
					"name": "ds_phone",
					"value": data.phone
				}, {
					"name": "ds_name",
					"value": data.name
				}, {
					"name": "ds_address",
					"value": data.address
				}]
			},
			success: function() {
				if (success) {
					success();
				}
				console.log('更新成功');
			},
			unloading: true,
		});
	};

	var getDormitoryList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_address_l4_ref-ds_address_l4id' " +
				"or name eq 'ds_address_l4_ref-ds_name'" +
				"),lookups&$filter=name eq 'ds_publicorder_address_l4' and query eq 'ds_publicorder_ref eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};


	var getDormlist = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_address' " +
				"or name eq 'ds_floor' " +
				"or name eq 'ds_roomfigure' " +
				"),lookups&$filter=name eq 'ds_realhouse' and query eq 'ds_address_tree eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};
	var deleteDormlist = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_publicorder_address_l4" + id + "')",
			success: function() {
				success();
			}
		});
	};
	var dormitoryDetailAdd = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: data,
			success: function(result) {
				success(result);
			}
		});
	};
	var getStudentList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_person_ref-ds_name'" +
				"or name eq 'ds_person_ref-ds_id'" +
				"or name eq 'ds_person_ref-ds_personid'" +
				"),lookups&$filter=name eq 'ds_residentsassociation' and query eq 'ds_realhouse_ref eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};

	var deleteStudentList = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_realhouse" + id + "')",
			success: function() {
				success();
			}
		});
	};

	var upDataStudent = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + id + "')",
			data: {
				"attributes": [{
					"name": "ds_phone",
					"value": data.ds_phone
				}, {
					"name": "ds_name",
					"value": data.ds_name
				}, {
					"name": "ds_nativeplace",
					"value": data.ds_nativeplace
				}]
			},
			success: function() {
				if (success) {
					success();
				}
				console.log('更新成功');
			},
			unloading: true,
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

	var deleteStudent = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_residentsassociation" + id + "')",
			success: function(result) {
				success();
			}
		})
	};

	var realNameSearchWithOutLogistics = function(_data, success) {
		var data = angular.copy(_data);
		data.starTime = Api.formatDate('-', data.starTime) + ' 00:00';
		data.endTime = Api.formatDate('-', data.endTime) + ' 23:59';

		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum' " +
				"or name eq 'ds_shimingzhiid' " +
				"or name eq 'ds_person-ds_name' " +
				"or name eq 'ds_person-ds_id' " +
				"or name eq 'ds_person-ds_phone' " +
				"or name eq 'ds_person-ds_personid' " +
				"or name eq 'ds_date' " +
				"or name eq 'ds_roomnum' " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_brand' " +
				"or name eq 'ds_type' " +
				"or name eq 'ds_image'" +
				"or name eq 'ds_information'" +
				"or name eq 'ds_weight'" +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq '{{{ds_date gt " + data.starTime + "} and {ds_date lt " + data.endTime + "}} and {ds_publicorder eq " + data.id + "}}'" +
				"and page eq " + data.index + " and count eq " + data.count + " and orderby eq 'createdon/desc'",
			success: function(result) {
				
				var currentPage = result.value[0] ? result.value[0].page : 1;
				var totalCount = result.value[0] ? result.value[0].totalCount : 0;
				var value = Api.format.CRMList(result.value);
				success(value,totalCount,currentPage);
			},
			
		});
	};

	var deleteRealname = function(id, success) {
		Api.DELETE({
			url: "/crm/Entities('ds_shimingzhi" + id + "')",
			success: function(result) {
				success();
			}
		});
	};

	var upDataPeopleMessageAboutNameAndPhone = function(id, name, phone, success) {
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
				if (success) {
					success();
				}
				console.log('更新成功');
			},
			unloading: true,
		});
	};
	var updatePeopleBriefMessage = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_person" + id + "')",
			data: {
				"attributes": [{
					"name": "ds_phone",
					"value": data.phone
				}, {
					"name": "ds_name",
					"value": data.name
				}, {
					"name": "ds_address",
					"value": data.address
				}]
			},
			success: function() {
				if (success) {
					success();
				}
				console.log('更新成功');
			}
		});
	};



	var updateRealname = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_shimingzhi" + id + "')",
			data: data,
			success: function() {
				success();
				console.log('更新成功');
			},
		});
	};

	var realNameSearchForLogistics = function(data, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum' " +
				"or name eq 'ds_person-ds_name'  " +
				"or name eq 'ds_person-ds_id'  " +
				"or name eq 'ds_person-ds_phone'  " +
				"or name eq 'ds_name'" +
				"or name eq 'ds_information'  " +
				"or name eq 'ds_image'  " +
				"or name eq 'ds_shimingzhiid'" +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq '{{{ds_name like %25" + data.text + "%25} or {ds_ordernum eq " + data.text + "}} and {ds_publicorder eq " + data.id + "}}'" +
				"and page eq " + data.index + " and count eq " + data.count + " and orderby eq 'createdon/desc'",
			success: function(result) {
				console.log(result);
				var currentPage = result.value[0] ? result.value[0].page : 1;
				var totalCount = result.value[0] ? result.value[0].totalCount : 0;
				var value = Api.format.CRMList(result.value);
				success(value,totalCount,currentPage);
			}
		});
	};

	var getRealNameLogisticsList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_orderstart' " +
				"or name eq 'ds_orderend' " +
				"or name eq 'ds_logisticsorderareaId' " +
				"or name eq 'ds_ordercount' " +
				"or name eq 'ds_unusednum' " +
				"),lookups&$filter=name eq 'ds_logisticsorderarea' and  query eq 'ds_publicorder_ref eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};
	var getRealNameLogisticsIntervalOrderList = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum'  " +
				"or name eq 'ds_orderstatus'  " +
				"or name eq 'ds_shimingzhiid'  " +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq 'ds_orderarea eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};
	var getRealNameLogisticsDetailByOrderId = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum' " +
				"or name eq 'ds_person-ds_name'  " +
				"or name eq 'ds_person-ds_id'  " +
				"or name eq 'ds_person-ds_phone'  " +
				"or name eq 'ds_name' " +
				"or name eq 'ds_orderstatus' " +
				"or name eq 'ds_information' " +
				"or name eq 'ds_image' " +
				"or name eq 'ds_person-ds_personid' " +
				"or name eq 'ds_receivernic' " +
				"or name eq 'ds_receiverphone' " +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq 'ds_shimingzhiid eq " + id + "'",
			success: function(result) {
				var value = Api.format.CRMValue(result.value)
				success(value);
			}
		});
	};
	var invalidRealname = function(id, success) {
		Api.PUT({
			url: "/crm/Entities('ds_shimingzhi" + id + "')",
			data: {
				"attributes": [{
					"name": "ds_orderstatus",
					"value": "@code/100000000"
				}]
			},
			success: function(result) {
				success();
			}
		});
	};
	var RealNameCheckOrder = function(num, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum'" +
				"or name eq 'ds_shimingzhiid' " +
				"or name eq 'ds_person-ds_name'  " +
				"or name eq 'ds_person-ds_id'  " +
				"or name eq 'ds_person-ds_phone'  " +
				"or name eq 'ds_name'" +
				"or name eq 'ds_information'  " +
				"or name eq 'ds_image'  " +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq 'ds_ordernum eq " + num + "'",
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			}
		});
	};
	var getRealNameLogisticsCustomList = function(data, success) {
		Api.POST({
			url: "/api/Crm/GetCustomOrderList",
			data: {
				"commonStr": data.id,
				"index": data.index,
				"count": data.count
			},
			success: function(result) {
				console.log(result);
				var currentPage = result.resultObj.length==0 ? 1:data.index;
				var totalCount = result.resultObj.length==0 ? 0 : result.resultObj[0].totalCount;
				if (result.status == 0) {
					var value = result.resultObj;
					for (var i = 0; i < value.length; i++) {
						value[i].id = value[i].ds_shimingzhiid;

					};
					success(value,totalCount, currentPage);
				} else {
					Api.alert('获取失败');
				}
			},
			unloading: true,
		});
	};

	var getRealNameLogisticsSearch = function(data, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter=name eq 'ds_ordernum' " +
				"or name eq 'ds_person-ds_name'  " +
				"or name eq 'ds_person-ds_id'  " +
				"or name eq 'ds_person-ds_phone'  " +
				"or name eq 'ds_name'" +
				"or name eq 'ds_information'  " +
				"or name eq 'ds_image'  " +
				"or name eq 'ds_shimingzhiid'" +
				"),lookups&$filter=name eq 'ds_shimingzhi' and  query eq '{{{ds_name like %25" + data.text + "%25} or {ds_ordernum eq " + data.text + "}} and {ds_publicorder eq " + data.id + "}}'" +
				"and page eq " + data.index + " and count eq " + data.count + " and orderby eq 'createdon/desc'",
			success: function(result) {
				
				console.log(result);
				var currentPage = result.value[0] ? result.value[0].page : 1;
				var totalCount = result.value[0] ? result.value[0].totalCount : 0;
				var value = Api.format.CRMList(result.value);
				success(value,totalCount, currentPage);
			},
			
		});
	};
	var getCheckList = function(data, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes(" +
				"$filter= name eq 'ds_checkitem_personid' " +
				"or name eq 'ds_date' " +
				"or name eq 'ds_lostscore' " +
				")&$filter=name eq 'ds_checkitem_person' and query eq 'ds_publicorder_ref eq " + data + "'",
			/* + "and page eq " + data.index + " and count eq " + data.count + " and orderby eq 'createdon/desc'",*/
			success: function(result) {
				var value = Api.format.CRMList(result.value);
				success(value);
			},
			unloading: true,
		});
	};
	var getCheckItemListDetail = function(id, success) {
		Api.POST({
			url: "/api/Crm/GetCheckInfo",
			data: {
				"commonStr": id
			},
			success: function(result) {
				if (result.status == 0) {
					success(result.resultObj);
				} else {
					Api.alert('获取失败');
				}
			}
		});
	};
	var upDataFireCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_gapcsrcxfjdjcjl" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};

	var upDataProstitutionCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_prostitution" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};

	var upDataGamblingCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_gamble" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};

	var upDataDrugCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_drug" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};

	var upDataPeopleCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_employeecheck" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};

	var upDataOtherCheckFrom = function(id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_othersituations_exam" + id + "')",
			data: data,
			success: function(result) {
				success();
			}
		});
	};
	var upDataRealnameCheckFrom = function (id, data, success) {
		Api.PUT({
			url: "/crm/Entities('ds_realname_exam" + id + "')",
			data: data,
			success: function(result) {
				success();
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
	};
	var downloadTemplate=function(data, success) {
		Api.POST({
			data: data,
			url: "/api/Place/GetArchiveTemp",
			success: function(result) {
				if (result.status == 0) {
					success(result);
				} else {		
					Api.alert(result.message);
				};
			}
		})
	};
	
	var uploadDocument = function(data, id, success) {
		Api.PUT({
			url:"/crm/Entities('ds_publicorder" + id + "')",
			data:{
				"attributes": [{
					"name": "ds_stub",
					"value": data
				}]
			},
			success:function(result){
				success();
			}
		})
	};
	var uploadfireDocument = function(data, id, success) {
		Api.PUT({
			url:"/crm/Entities('ds_publicorder" + id + "')",
			data:{
				"attributes": [{
					"name": "ds_firestub",
					"value": data
				}]
			},
			success:function(result){
				success();
			}
		})
	};
	
	var downloadDocument = function(id, success) {
		Api.POST({
			data: {
				"id": id
			},
			url: "/api/Place/GetStub",
			success: function(result) {
				if (result.status == 0) {
					success(result);
				} else {		
					Api.alert(result.message);
				};
			}
		})
	};
	var getPublicSigninStats = function(id, success) {
        Api.GET({
            url: "/crm/Entities?$expand=attributes(" +
                "$filter= name eq 'ds_ischekcin' " +
                "),lookups&$filter=name eq 'ds_publicorder' and query eq 'ds_publicorderid eq " + id + "'",
            success: function(result) {
                var value = Api.format.CRMValue(result.value);
                success(value);
            }
        });
    };
    var getPublicSigninList = function(data, success) {
        Api.POST({
            url: "/api/Crm/GetEmployeeCheckInHistory",
            data: data,
            success: function(result) {
                if (result.status == 0) {
                    success(result.resultObj);
                } else {
                    $cordovaToast.showShortCenter(result.message);
                }
            }
        });
    };
	return {
		getList: getPublicList, // 获取行业场所列表
		getInfor: getPublicInfor, // 获取行业场所基本信息
		getPeopleList: getPublicPeopleList, // 获取从业人员列表
		upData: puDataPublicPliceMessage, // 更新行业场所信息
		getPeopleDetail: getPeopleDetail, // 获取从业人员详情
		getDangerList: getDangerList, // 获取危爆物品列表
		getDangerDetail: getDangerDetail, // 获取危爆物品详情
		upDataPeople: upDataPeopleMessage, // 更新人员信息
		upDataDangerDetail: upDataDangerDetail, // 更新危爆物品信息
		deleteDanger: deleteDanger, // 删除危爆物品
		CreatDangerDetail: CreatDangerDetail, // 创建危爆物品
		GetBrowse: GetBrowse, // 行业场所浏览记录
		upDataBrowse: upDataBrowse, // 更新行业场所浏览记录
		AddPublic: AddPublic, // 创建行业场所
		CreatUniversity: CreatUniversity, // 创建寝室楼
		upDataPeopleMessageForAddPublic: upDataPeopleMessageForAddPublic, // 更新法人及治安防卫负责人信息
		getDormitoryList: getDormitoryList, // 获取寝室楼列表
		getDormlist: getDormlist, // 获取寝室列表
		deleteDormlist: deleteDormlist, // 删除寝室楼
		dormitoryDetailAdd: dormitoryDetailAdd, // 添加寝室楼
		getStudentList: getStudentList, // 获取寝室学生列表
		deleteStudentList: deleteStudentList, // 删除寝室
		upDataStudent: upDataStudent, // 更新学生信息
		upDataStudentAboutRealHouse: dormitoryDetailAdd, // 创建学生信息关联表
		getStudentDetail: getStudentDetail, // 获取学生信息
		deleteStudent: deleteStudent, // 删除学生
		realNameSearchWithOutLogistics: realNameSearchWithOutLogistics, // 实名制搜索接口 非物流寄递业
		deleteRealname: deleteRealname, // 删除实名制信息
		upDataPeopleMessageAboutNameAndPhone: upDataPeopleMessageAboutNameAndPhone,
		updateRealname: updateRealname, // 更新实名制信息
		creatRealname: dormitoryDetailAdd, // 创建实名制信息
		getRealNameLogisticsList: getRealNameLogisticsList, // 获取实名制订单区间列表
		getRealNameLogisticsIntervalOrderList: getRealNameLogisticsIntervalOrderList, //  获取实名制订单区间单号列表
		getRealNameLogisticsDetailByOrderId: getRealNameLogisticsDetailByOrderId, // 获得订单详情
		invalidRealname: invalidRealname, // 订单作废
		RealNameCheckOrder: RealNameCheckOrder, // 检查订单是否存在
		getRealNameLogisticsCustomList: getRealNameLogisticsCustomList, // 获得自定义单号列表
		getRealNameLogisticsSearch: getRealNameLogisticsSearch, // 订单关键字搜索
		getCheckList: getCheckList, // 获取检查项
		CreatCheckItem: dormitoryDetailAdd, // 创建检查项
		getCheckItemListDetail: getCheckItemListDetail, // 获取指定行业场所检查内容
		getPublicBusinesskind: getPublicBusinesskind, // 获取行业场所类型
		CreatFireCheckFrom: dormitoryDetailAdd, // 创建消防检查项
		upDataFireCheckFrom: upDataFireCheckFrom, // 更改消防检查项
		getPeopleBriefMessage: getStudentDetail, // 获取人员简要信息
		updatePeopleBriefMessage: updatePeopleBriefMessage, // 更新人员简要信息
		CreatProstitutionCheckFrom: dormitoryDetailAdd, // 创建卖淫嫖娼人员检查记录
		upDataProstitutionCheckFrom: upDataProstitutionCheckFrom, // 更新卖淫嫖娼人员检查记录
		CreatGamblingCheckFrom: dormitoryDetailAdd, // 创建赌博人员检查记录
		upDataGamblingCheckFrom: upDataGamblingCheckFrom, // 更新赌博人员检查记录
		CreatDrugCheckFrom: dormitoryDetailAdd, // 创建赌博人员检查记录
		upDataDrugCheckFrom: upDataDrugCheckFrom, // 更新涉毒人员检查记录
		CreatPeopleCheckFrom: dormitoryDetailAdd, // 创建赌博人员检查记录
		upDataPeopleCheckFrom: upDataPeopleCheckFrom, // 更新从业人员检查记录
		CreatOtherCheckFrom: dormitoryDetailAdd, // 创建其他检查记录
		upDataOtherCheckFrom: upDataOtherCheckFrom, // 更新其他检查记录
		CreatCase: dormitoryDetailAdd, // 创建案件
		CreatCaseCheckFrom: dormitoryDetailAdd, // 创建发案检查项
		getCaseDetail: getCaseDetail , // 获取案件详情
		upDataRealnameCheckFrom : upDataRealnameCheckFrom, // 更新物流寄递业实名制信息
		CreatRealnameCheckFrom : dormitoryDetailAdd, // 创建物流寄递业实名制信息
		downloadTemplate:downloadTemplate,//下载档案模板
		uploadDocument:uploadDocument,//上传模板
		uploadfireDocument:uploadfireDocument,//上传消防档案
		downloadDocument: downloadDocument,//下载档案记录
		getPublicSigninStats:getPublicSigninStats,// 获取行业场所签到类型
		getPublicSigninList:getPublicSigninList,// 获取行业场所签到记录
	}
});