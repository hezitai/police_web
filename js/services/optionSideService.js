services.factory('options', function(Api) {
	var items = {
		// 风险评估类别 
		riskassessmenttype: false,
		// 风险评估级别
		riskassessment: false,
		// 信访级别
		visitgrade: false,
		// 消息类型
		messageType: false,
		// 群发接收方
		batchreceiver: false,
		// 场所类别
		businesskind: false,
		// 订单状态
		orderstatus: false,
		// 房屋使用形式
		houseusertype: false,
		// 居住方式
		liveway: false,
		// 消防等级
		firelevel: false,
		// 房屋类型
		buildingtype: false,
		// 发案部位
		caseposition: false,
		// 民族
		nation: false,
		// 血型
		bloodtype: false,
		// 文化程度
		education: false,
		// 政治面貌
		politics: false,
		// 户籍类型
		familyregister: false,
		// 婚姻状况
		marriage: false,
		// 任务级别
		task_level: false,
		// 任务类型
		tasktype: false,
	};


	var getOptions = function(name, success) {
		if (items[name]) {
			success(items[name]);
		} else {
			Api.GET({
				url: "/crm/OptionSets('ds_" + name + "')",
				success: function(result) {
					items[name] = Api.format.CRMOptions(result);
					success(items[name]);
				}
			});
		};
	};
	return {
		get: function(arrayList, success) {
			var newArray = angular.copy(arrayList);
			var resultArray = {};
			var recursiveOptionSites = function() {
				var item = newArray.pop();
				getOptions(item, function(result) {
					resultArray[item] = angular.copy(result);
					// resultArray.unshift(result);
					if (newArray.length == 0) {
						success(resultArray);
					} else {
						recursiveOptionSites();
					}
				});
			};
			recursiveOptionSites();
		},
	}
});