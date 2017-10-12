services.directive("pmapSet", function($compile, $state) {
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
				element.css({
					width: $('#main').width(),
					height: $('#main').height()
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
							content: '<div>' + list[i].name + ' ' + list[i].year + '-' + list[i].month + '-' + list[i].day + '</div>'
						});
						marker.setMap(map);
						markers.push(marker);
					};
				};
				scope.$watch('refresh', function() {
					console.log('init');
					initMarkers();
				}, true);

				map.setFitView();
			} catch (error) {
				element.append('地图模块加载失败,请刷新页面或检查网络连接');
			}
		}
	};
});

services.factory('point', function(Api, user) {
	var user = user.getUserMessage();
	var police = user.policeCrmId;
	console.log(police);
	var urlStr = "/crm/Entities?$expand=attributes($filter=name eq 'ds_person-ds_id' or name eq 'ds_person-ds_name' or name eq 'ds_person' or name eq 'ds_regulatoryreason-ds_name' or name eq 'ds_regulatoryscope-ds_name' or name eq 'ds_enddate' or name eq 'ds_policestation-name' or name eq 'ds_policestation' or name eq 'ds_prioritypeopleid'),lookups& $filter=name eq 'ds_prioritypeople' and query eq ";
	// 获取所有重点人口
	var getAllPointPeople = function(success) {
		var today = Api.formatDate('/');
		Api.GET({
			url: urlStr + "'ds_enddate gt 2017/03/01'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 通过警员ID获取重点人口
	var getPointPeopleByPoliceId = function(id, success) {
		var today = Api.formatDate('/');
		Api.GET({
			url: urlStr + "'{{ds_police eq " + police + "} and {ds_enddate gt 2017/03/01}}'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 通过公安局获取重点人口
	var getPointPeopleByTeamId = function(id, success) {
		var today = Api.formatDate('/');
		Api.GET({
			url: urlStr + "'{{ds_policestation eq " + id + "} and {ds_enddate gt 2017/03/01}}'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 监管原因
	var getPointCause = function(success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_name' or name eq 'ds_regulatoryreasonid')&$filter=name eq 'ds_regulatoryreason' and query eq 'ds_name ne null'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 监管范围
	var getScope = function(success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_name' or name eq 'ds_regulatoryscopeid')&$filter=name eq 'ds_regulatoryscope' and query eq 'ds_name ne null'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 获取涉毒选项,
	var getDrugDangerOption = function(success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_name' or name eq 'ds_riskassessment_poisonId' or name eq 'ds_riskgrade')&$filter=name eq 'ds_riskassessment_poison' and query eq 'ds_name ne null'",
			success: function(result) {
				var resultValue = Api.format.CRMList(result.value);
				success(resultValue);
			}
		});
	};
	// 创建重点人口基本信息 
	var creatPointPeople = function(data, success) {
		Api.POST({
			url: "/api/Crm/CreatePriorityPeople",
			data: data,
			success: function(result) {
				console.log(result);
				success(result);
			},
		})
	};
	// 创建风险评估
	var creatRiskassess = function(data, success) {
		Api.POST({
			url: "/crm/Entities",
			data: data,
			success: function(result) {
				success(result);
			}
		});
	};



	// 获取重点人口详情
	var getPointPeopleDetail = function(id, success) {
		console.log(id);
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_person-ds_id' or name eq 'ds_doc' or name eq 'ds_enddate' or name eq 'ds_needsignin' or name eq 'ds_person-ds_name' or name eq 'ds_person-ds_phone' or name eq 'ds_person' or name eq 'ds_police' or name eq 'ds_policestation' or name eq 'ds_prioritypeopleId' or name eq 'ds_regulatoryreason-ds_name' or name eq 'ds_regulatoryscope-ds_name' or name eq 'ds_riskassessment' or name eq 'ds_riskassessment_ref-ds_riskassessmentid' or name eq 'ds_signdate' or name eq 'ds_signtime' or name eq 'ds_signtype' or name eq 'ds_signweek' ),lookups&$filter=name eq 'ds_prioritypeople' and query eq 'ds_prioritypeopleid eq " + id + "'",
			success: function(result) {
				console.log(result);
				var resultValue = Api.format.CRMValue(result.value);
				success(resultValue);
			},
		})
	};
	// 获取重点人口风险评估
	var getPointPeopleRisk = function(id, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_poisonitem'or name eq 'ds_risktype'or name eq 'ds_visitgrade'),lookups&$filter=name eq 'ds_riskassessment' and query eq 'ds_riskassessmentid eq " + id + "'",
			success: function(result) {
				var resultValue = Api.format.CRMValue(result.value);
				success(resultValue);
			},
		})
	};
	//获取重点人口按月签到记录
	var getPointPeopleSigninBymon = function(id, year, month, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_year'or name eq 'ds_month'or name eq 'ds_day'or name eq 'ds_user'or name eq 'ds_latandlon'or name eq 'ds_checkinId'or name eq 'ds_person')&$filter=name eq 'ds_checkin' and query eq '{{{ds_year eq " + year + "} and {ds_month eq " + month + "}} and {ds_person eq " + id + "}}'",
			success: function(result) {

				if (result.value == '' || result.value == undefined || result.value.length == 0) {
					Api.alert('暂无签到记录')
				} else {
					var resultValue = Api.format.CRMValue(result.value);
					success(resultValue);
				}

			},
		})
	};
	//获取重点人口按年签到记录
	var getPointPeopleSigninByyear = function(id, year, success) {
		Api.GET({
			url: "/crm/Entities?$expand=attributes($filter= name eq 'ds_year'or name eq 'ds_month'or name eq 'ds_day'or name eq 'ds_user'or name eq 'ds_latandlon'or name eq 'ds_checkinId'or name eq 'ds_person')&$filter=name eq 'ds_checkin' and query eq '{{ds_year eq " + year + "} and {ds_person eq " + id + "}}'",
			success: function(result) {
				if (result.value == '' || result.value == undefined || result.value.length == 0) {
					Api.alert('暂无签到记录')
				} else {
					var resultValue = Api.format.CRMValue(result.value);
					success(resultValue);
				}
				
			},
		})
	};
	//修改重点人口

	var resetPeople = function(id, data, success) {
			Api.PUT({
				url: "/crm/Entities('ds_prioritypeople" + id + "')",
				data: data,
				success: function(result) {
					success(result);
				},
			})
		}
		//创建附件
	var updateimg = function(data) {
		Api.POST({
			url: "/api/Crm/CreateStub",
			data: data,
			success: function(result) {
				success(result);
			}
		});
	}
	return {
		getAll: getAllPointPeople,
		getUsers: getPointPeopleByPoliceId,
		getTeams: getPointPeopleByTeamId,
		cause: getPointCause,
		regulatoryScope: getScope,
		drugDangerOption: getDrugDangerOption,
		creat: creatPointPeople,
		creatRis: creatRiskassess,
		detail: getPointPeopleDetail,
		getRisk: getPointPeopleRisk,
		getSignBym: getPointPeopleSigninBymon,
		getSignByY: getPointPeopleSigninByyear,
		resetPeople: resetPeople,
	};
});