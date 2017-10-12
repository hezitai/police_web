var services = angular.module('manage.services', []);
services.directive("appMap", function() {
	return {
		restrict: "E",
		replace: true,
		template: "<div id='allMap'></div>",
		link: function(scope, element, attrs) {
			var marker, map = new AMap.Map("allMap", {
				resizeEnable: false,
				center: [125.658668, 43.524547],
				zoom: 14,
				features: ['bg', 'road', 'building']
			});
			var lnglatOne = new AMap.LngLat(125.062577, 42.94073);
			var lnglatTwo = new AMap.LngLat(126.575943, 43.955644);
			var bounds = new AMap.Bounds(lnglatOne, lnglatTwo);
			map.setLimitBounds(bounds);
			map.plugin(["AMap.ToolBar"], function() {
				map.addControl(new AMap.ToolBar());
			});
			if (location.href.indexOf('&guide=1') !== -1) {
				map.setStatus({
					scrollWheel: false
				})
			};
			var auto = new AMap.Autocomplete({
				input: "tipinput"
			});
		}
	};
});
services.directive("moveBar", function($compile) {
	return {
		restrict: "E",
		replace: true,
		template: "<div class='moveBar'></div>",
		link: function(scope, element, attrs) {
			var html = '';
			html += '<div class="move-bar left"><</div>';
			html += '<div class="move-box"><div class="move-list">' + attrs.html + '</div></div>';
			html += '<div class="move-bar right">></div>';
			html = $compile(html)(scope);
			element.append(html);

			function goleft(boxWidth, listWidth, listLeft) {
				// 向右的无缝循环滚动  
				if (boxWidth - listWidth >= 0) {
					return;
				}
				if (boxWidth - listWidth < listLeft - 100) {
					element.find('.move-list').css('left', (listLeft - 100));
				} else {
					element.find('.move-list').css('left', boxWidth - listWidth);
				}
			}

			function goRight(boxWidth, listWidth, listLeft) {
				if (boxWidth - listWidth >= 0) {
					return;
				}
				if (listLeft + 100 > 0) {
					element.find('.move-list').css('left', '0px');
				} else {
					element.find('.move-list').css('left', (listLeft + 100));
				}
			}

			scope.countWidth = function() {
				var moveListWidth = 0;
				element.find('.move-list div').each(function() {
					moveListWidth += parseInt($(this).outerWidth(true)) + 1;
				});
				element.find('.move-list').width(moveListWidth);
			}

			element.find('.right').click(function() {
				scope.countWidth();
				var boxWidth = parseInt(element.find('.move-box').width());
				var listWidth = parseInt(element.find('.move-list').width());
				var listLeft = parseInt(element.find('.move-list').css('left'));
				goleft(boxWidth, listWidth, listLeft);
			});

			element.find('.left').click(function() {
				scope.countWidth();
				var boxWidth = parseInt(element.find('.move-box').width());
				var listWidth = parseInt(element.find('.move-list').width());
				var listLeft = parseInt(element.find('.move-list').css('left'));
				goRight(boxWidth, listWidth, listLeft);
			});


		}
	};
});
services.directive("pagingLink", function($compile) {
	return {
		restrict: "E",
		replace: true,
		template: "<div class='paging'></div>",
		link: function(scope, element, attrs) {
			// scope.;
			scope.goPagingLink = function(index) {
				// console.log(attrs.test);
				if (attrs.test == 'true') {
					scope.currentPageNum = index;
				} else if (index != scope.currentPageNum) {
					scope.getMessageByPageNum(index);
				}
			};
			var initPagingLinks = function(pages, index) {
				element.empty('');
				console.log(pages, index);
				if (pages <= 1 && index == 1) {
					return;
				}
				var html = '';
				if (index > 1) {
					html += '<span ng-click="goPagingLink(' + (index - 1) + ')" class="prev" >上一页</span>';
				} else {
					element.remove('.prev');
					html += '<span class="disabled">上一页</span>';
				}
				//中间页码
				if (index != 1 && index >= 4 && pages != 4) {
					html += '<span ng-click="goPagingLink(1)" class="tcdNumber">' + 1 + '</span>';
				}
				if (index - 2 > 2 && index <= pages && pages > 5) {
					html += '<span class="disabled">...</span>';
				}
				var start = index - 2,
					end = index + 2;
				if ((start > 1 && index < 4) || index == 1) {
					end++;
				}
				if (index > pages - 4 && index >= pages) {
					start--;
				}
				for (; start <= end; start++) {
					if (start <= pages && start >= 1) {
						if (start != index) {
							html += '<span ng-click="goPagingLink(' + start + ')" class="tcdNumber">' + start + '</span>';
						} else {
							html += '<span class="current">' + start + '</span>';
						}
					}
				}
				if (index + 2 < pages - 1 && index >= 1 && pages > 5) {
					html += '<span class="disabled">...</span>';
				}
				if (index != pages && index < pages - 2 && pages != 4) {
					html += '<span ng-click="goPagingLink(' + pages + ')" class="tcdNumber">' + pages + '</span>';
				}
				//下一页
				if (index < pages) {
					html += '<span ng-click="goPagingLink(' + (index + 1) + ')" class="next">下一页</span>';
				} else {
					element.remove('.next');
					html += '<span class="disabled">下一页</span>';
				}

				html = $compile(html)(scope);
				element.append(html);
			};

			scope.currentPageNum = 1;
			scope.allMessage = 1;

			scope.readerPaging = function() {
				initPagingLinks(Math.ceil(parseInt(scope.allMessage) / parseInt(attrs.pageNums)), parseInt(scope.currentPageNum));
			}
			scope.$watch('currentPageNum', function() {
				// console.log('currentPageNum.$watch');
				scope.readerPaging();
			}, true);
			scope.$watch('allMessage', function() {
				// console.log('allMessage.$watch');
				scope.readerPaging();
			}, true);
		}
	};
});
services.directive("headerCrumbs", function(Api) {
	return {
		restrict: "E",
		replace: true,
		template: function(tElement, tAttrs) {
			var crumbs = Api.Storage.get('crumbs');
			if (tAttrs.usedlocalstorage == 'used' && crumbs != null) {
				var _html = '';
				_html += '<div class="crumbs">';
				for (var i = 0; i < tAttrs.usedlevel; i++) {
					var item = crumbs[i];
					_html += (i == 0 ? '<i class="icon"></i>' : '<span> \> </span>') + '<a href="#/index/' + item.stateName + '"><span>' + item.name + '</span></a>';
				}
				_html += '</div>';
				return _html;
			} else {
				var _html = '';
				_html += '<div class="crumbs">';
				_html += '	<i class="icon"></i><a href="' + tAttrs.title.split(':')[0] + '"><span>' + tAttrs.title.split(':')[1] + '</span></a>';
				_html += '</div>';
				return _html;
			}
		},
	};
});
services.factory('navList', function() {
	var navList = [{
		name: '信息研判',
		stateName: 'index.calculate',
		isUsed: false,
	}, {
		name: '工作日志',
		stateName: 'index.jobs',
		isUsed: true,
	}, {
		name: '行业场所',
		stateName: 'index.place',
		isUsed: true,
	}, {
		name: '信息查询',
		stateName: 'index.search',
		isUsed: true,
	}, {
		name: '重点人口',
		stateName: 'index.point',
		isUsed: true,
	}, {
		name: '巡逻防控',
		stateName: 'index.patrol',
		isUsed: true,
	}, {
		name: '信息采集',
		stateName: 'index.collect',
		isUsed: true,
	}, {
		name: '工作任务',
		stateName: 'index.mission',
		isUsed: true,
	}, {
		name: '消息中心',
		stateName: 'index.message',
		isUsed: true,
	}, {
		name: '发送通知',
		stateName: 'index.send',
		isUsed: true,
	}, {
		name: '实有房屋',
		stateName: 'index.house',
		isUsed: true,
	}];
	return navList;
});
services.factory('Api', function($resource, $rootScope) {
	var isShowLoading = true;
	var Loading = {
		show: function() {
			var loading = document.createElement('div');
			loading.id = 'loading';
			if (!document.getElementById("loading")) {
				document.getElementById('main').appendChild(loading);
			}
		},
		hide: function() {
			var loading = document.getElementById("loading");
			if (loading) {
				loading.parentNode.removeChild(loading);
			}
		}
	};
	return {
		Storage: {
			set: function(key, data) {
				return window.localStorage.setItem(key, window.JSON.stringify(data));
			},
			get: function(key) {
				return eval('(' + window.localStorage.getItem(key) + ')');
			},
			remove: function(key) {
				return window.localStorage.removeItem(key);
			}
		},
		Loading: {
			usedShow: function() {
				isShowLoading = false;
				Loading.show();
			},
			usedHide: function() {
				isShowLoading = true;
				Loading.hide();
			},
			show: function() {
				if (isShowLoading) {
					Loading.show();
				}
			},
			hide: function() {
				if (isShowLoading) {
					Loading.hide();
				}
			},
		},
		formatting: {
			CRMList: function(value) {
				var data = [];
				for (var i = 0; i < value.length; i++) {
					var itemValue = value[i];
					var itemData = {};
					itemData.id = itemValue.id;
					for (var d = 0; d < itemValue.attributes.length; d++) {
						var item = itemValue.attributes[d];
						itemData[item.name] = item.value;
					}
					data.push(itemData);
				};
				return data;
			},
			CRMValue: function(value) {
				var data = {};
				data.id = value[0].id;
				for (var i = 0; i < value[0].attributes.length; i++) {
					var item = value[0].attributes[i];
					data[item.name] = item.value;
				}
				return data;
			},
		},
		request: {
			post: function(data) {
				Loading.show();
				var resource = $resource(data.url, {});
				return resource.save(data.data, function(result) {
					Loading.hide();
					data.success(result);
				}, function(result) {
					console.log(result);
					Loading.hide();
					$rootScope.$broadcast('network.error');
				});
			},
			get: function(data) {
				Loading.show();
				var resource = $resource(data.url, {});
				return resource.get(function(result) {
					Loading.hide();
					data.success(result);
				}, function(result) {
					Loading.hide();
					$rootScope.$broadcast('network.error');
				});
			},
			updata: function(data) {
				Loading.show();
				var resource = $resource(data.url, {}, {
					timeout: 4000,
					updata: {
						method: 'PUT',
					}
				});
				return resource.updata(data.data, function(result) {
					Loading.hide();
					data.success(result);
				}, function(result) {
					Loading.hide();
					$rootScope.$broadcast('network.error');
				});
			},
			deleteAjax: function(data) {
				Loading.show();
				var resource = $resource(data.url, {}, {
					timeout: 4000,
					delete: {
						method: 'DELETE',
					}
				});
				return resource.delete(function(result) {
					Loading.hide();
					data.success(result);
				}, function(result) {
					Loading.hide();
					$rootScope.$broadcast('network.error');
					data.error(result);
				});
			},
		},
		popUp: {
			alert: function(str, callback) {
				function removeAlert() {
					var _alert = document.getElementById("alert");
					_alert.parentNode.removeChild(_alert);
				};
				if (document.getElementById("alert")) {
					removeAlert();
				};
				var alert = document.createElement('div');
				alert.id = 'alert';
				alert.setAttribute('class', 'alert');
				alert.innerHTML = '<div class="alert-background" id="alert-background"></div><div class="alert-main"><div class="alert-title"><p>提示</p><div class="alert-close" id="alert-close">×</div></div><div class="alert-body"><p>' + str + '</p></div><div class="alert-footer"><div class="confirm" id="alert-confirm">确定</div></div></div>';
				document.getElementsByTagName('body')[0].appendChild(alert);

				document.getElementById("alert-background").onclick = function() {
					if (callback) {
						callback();
					};
					removeAlert();
				};
				document.getElementById("alert-close").onclick = function() {
					if (callback) {
						callback();
					};
					removeAlert();
				};
				document.getElementById("alert-confirm").onclick = function() {
					if (callback) {
						callback();
					};
					removeAlert();
				};
			},
			checked: function(str, confirmCallback, cancelCallback) {
				function removeAlert() {
					var _checked = document.getElementById("checked");
					_checked.parentNode.removeChild(_checked);
				};
				if (document.getElementById("checked")) {
					removeAlert();
				};
				var checked = document.createElement('div');
				checked.id = 'checked';
				checked.setAttribute('class', 'alert');
				checked.innerHTML = '<div class="alert-background" id="alert-background"></div><div class="alert-main"><div class="alert-title"><p>提示</p><div class="alert-close" id="alert-close">×</div></div><div class="alert-body"><p>' + str + '</p></div><div class="alert-footer"><div class="confirm" id="alert-confirm">确定</div><div class="cancel" id="alert-cancel">取消</div></div></div>';
				document.getElementsByTagName('body')[0].appendChild(checked);

				document.getElementById("alert-background").onclick = function() {
					removeAlert();
				};
				document.getElementById("alert-close").onclick = function() {
					removeAlert();
				};
				document.getElementById("alert-cancel").onclick = function() {
					removeAlert();
					if (cancelCallback) {
						cancelCallback();
					}
				};
				document.getElementById("alert-confirm").onclick = function() {
					if (confirmCallback) {
						confirmCallback();
					};
					removeAlert();
				};
			}
		}
	};
});
services.factory('judes', function() {
	var phone = /^[1][0-9]{10}$/;
	var bankNum = /^\d{16}|\d{19}$/;
	var allChinese = /^([\u4E00-\u9FA5]+，?)+$/;
	var idCardNum1 = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$/;
	var idCardNum2 = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[A-Z])$/;

	var special = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")");
	special.push(":", ";", "'", "|", "\\", "<", ">", "?", "/", "<<", ">>", "||", "//");
	special.push("administrators", "administrator", "管理员", "系统管理员", "admin");
	special.push("select", "delete", "update", "insert", "create", "drop", "alter", "trancate");

	var _url = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
	var emall = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;

	var haveChinese = "[\\u4E00-\\u9FFF]+";
	var _isNull = "^[ ]+$";

	return {
		isNull: function(str) {
			// 如果全是空返回false
			if (str == "") return false;
			var regu = "^[ ]+$";
			var re = new RegExp(regu);
			return !re.test(str);
		},
		isPhone: function(str) {
			// 手机号格式正确返回 true;
			var re = new RegExp(phone);
			return re.test(str) ? true : false;
		},
		isAllChinese: function(str) {
			// 全部为中文返回 true;
			var re = new RegExp(allChinese);
			return re.test(str) ? true : false;
		},
		isHaveChinese: function(str) {
			// 含有中文返回 true;
			var re = new RegExp(haveChinese);
			return re.test(str) ? true : false;
		},
		isIdCard: function(str) {
			// 身份证号正确 返回 true;
			var re1 = new RegExp(idCardNum1);
			var re2 = new RegExp(idCardNum2);
			return re1.test(str) || re2.test(str) ? true : false;
		},
		isSpecial: function(str) {
			// 含有特殊字符返回 true;
			str = str.toLowerCase();
			for (var i = 0; i < special.length; i++) {
				if (str.indexOf(special[i]) >= 0) {
					return false;
				}
			}
			return true;
		},
		isUrl: function(str) {
			// URL 格式正确返回 true;
			var re = new RegExp(_url);
			return re.test(str) ? true : false;
		},
		isEmail: function(str) {
			// Email 格式正确返回 true;
			var re = new RegExp(emall);
			return re.test(str) ? true : false;
		},
	}
});
services.factory('download', function() {
	var downloadDoc = function(_url) {
		var elemIF = document.createElement("iframe");
		elemIF.src = _url;
		elemIF.style.display = "none";
		document.body.appendChild(elemIF);
	};
	var downloadImage = function(url) {
		window.open(url);
	};
	return {
		doc: downloadDoc,
		image: downloadImage,
	}
});
services.factory('user', function(Api) {
	return {
		login: function(data, success, error) {
			Api.request.post({
				url: '/api/Crm/PoliceLogon',
				data: data,
				success: function(data) {
					if (data.status == 0) {
						Api.Storage.set('manageUser', data.resultObj);
						success(data.resultObj);
					} else {
						error(data.message);
					}
				}
			});
		},
		getUserMessage: function() {
			return Api.Storage.get('manageUser');
		}
	}
});
services.factory('checkType', function() {
	var checkVarType = function(something) {
		var gettype = Object.prototype.toString.call(something);
		var type = false;
		switch (gettype) {
			case '[object String]':
				type = 'string';
				break;
			case '[object Number]':
				type = 'number';
				break;
			case '[object Boolean]':
				type = 'boolean';
				break;
			case '[object Undefined]':
				type = 'undefined';
				break;
			case '[object Null]':
				type = 'null';
				break;
			case '[object Object]':
				type = 'object';
				break;
			case '[object Array]':
				type = 'array';
				break;
			case '[object Function]':
				type = 'function';
				break;
		}
		return type;
	};
	return checkVarType;
});