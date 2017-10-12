services.directive("signLink", function($compile, homePageServers) {
	return {
		restrict: "E",
		replace: true,
		template: "<div class='time-sign'></div>",
		link: function(scope, element, attrs) {
			var isLeap = function(year) {
				return year % 4 == 0 ? (year % 100 != 0 ? 1 : (year % 400 == 0 ? 1 : 0)) : 0;
			};
			var initTimeDate = function() {
				element.empty();
				var html = '';
				html += '<div class="time-top">';
				html += '<span class="time-word">签到表</span>';
				html += '</div>';
				html += '<table  class="time-body" id="timeTable">';
				html += '<tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>';
				var today = new Date(),
					y = today.getFullYear(),
					m = today.getMonth(),
					d = today.getDate(),
					firstday = new Date(y, m, 1),
					dayOfWeek = firstday.getDay(),
					days_per_month = new Array(31, 28 + isLeap(y), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31),
					str_nums = Math.ceil((dayOfWeek + days_per_month[m]) / 7);
				for (var i = 0; i < str_nums; i += 1) {
					html += '<tr class="time-row">';
					for (var k = 0; k < 7; k++) {
						var idx = 7 * i + k;
						var date = idx - dayOfWeek + 1;
						(date <= 0 || date > days_per_month[m]) ? date = ' ': date = idx - dayOfWeek + 1;
						html += '<td >' + date;
						if (date <= d && date != ' ' && scope.ymds.arr.length > 0) {
							var nn = scope.ymds.arr[0].ds_day.split(',');
							var isChecked = false;
							if ($.inArray(date.toString(), nn) != -1) {
								isChecked = true;
							};
							if (isChecked) {
								html += '<img class="sign-pic" src="/manage/img/sign/sign.png" ></img>';
							} else {
								if (date != today.getDate()) {
									html += '<img class="sign-pic" src="/manage/img/sign/unsign.png" ></img>';
								}
							}
						}
						html += '</td>';
					}
					html += '</tr>';
				}
				html += '</table>';
				html = $compile(html)(scope);
				element.append(html);
			};
			scope.$watch('refresh', function() {
				console.log('init');
				initTimeDate();
			}, true);

			homePageServers.showSignInfoToPlice(scope.year, scope.month, function(data) {
				if (data && data[0] && data[0].ds_day) {
					if ($.inArray(scope.day.toString(), data[0].ds_day.split(',')) != -1) {
						scope.isChecked = false;
						scope.ymds.arr = data;
						initTimeDate();
					} else {
						scope.ymds.arr = data;
						scope.isChecked = true;
						initTimeDate();
					}
				} else {
					scope.ymds.arr = '';
					scope.isChecked = true;
				}
			});
		}
	};
});

services.factory('homePageServers', function(Api, user) {
	var peoId = user.getUserMessage().userModel.crmGuid;
	console.log(user.getUserMessage().userModel);
	var peoType = user.getUserMessage().userModel.role;
	return {
		//获得类型
		getPeopleType: function() {
			return peoType;
		},
		//签到
		signInfo: function(year, month, day, success) {
			Api.request.post({
				url: "/api/Crm/PersonSignIn",
				data: {
					"crmId": peoId,
					"personType": peoType,
					"year": year,
					"month": month,
					"day": day,
					"latandlon": ""
				},
				success: function(data) {
					if (success) {
						success(data);
					}
				},
			});
		},
		//警员指定月份的签到情况
		showSignInfoToPlice: function(year, month, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter= name eq 'ds_year' or name eq 'ds_month' or name eq 'ds_day' or name eq 'ds_user' or name eq 'ds_latandlon' or name eq 'ds_checkinId' or name eq 'ds_person' )&$filter=name eq 'ds_checkin' and query eq '{{{ds_year eq " + year + "} and {ds_month eq " + month + "}} and {ds_user eq " + peoId + "}}'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					success(resultValue);
				}
			});
		},

		//重点人口指定月份的签到情况
		showSignInfo: function(year, month, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes( $filter= name eq 'ds_year' or name eq 'ds_month' or name eq 'ds_day' or name eq 'ds_user' or name eq 'ds_latandlon' or name eq 'ds_checkinId' or name eq 'ds_person' )&$filter=name eq 'ds_checkin' and query eq '{{{ds_year eq " + year + "} and {ds_month eq " + month + "}} and {ds_person eq " + peoId + "}}'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					success(resultValue);
				}
			});
		},

		alertTips: function(str) {
			Api.popUp.alert(str);
		}


	}
});