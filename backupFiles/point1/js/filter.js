app.filter('idCardNum', function(judes) {
	var myDate = new Date();
	var month = myDate.getMonth() + 1;
	var day = myDate.getDate();
	var year = myDate.getFullYear();
	return function(input, type) {
		if (type == 'age') {
			var age = '';
			if (input.length == 18) {
				age = year - parseInt(input.substring(6, 10)) - 1;
				if (input.substring(10, 12) < month || input.substring(10, 12) == month && input.substring(12, 14) <= day) {
					age++;
				};
			};
			if (input.length == 15) {
				age = year - parseInt(input.substring(6, 8)) + 1900 - 1;
				if (input.substring(8, 10) < month || input.substring(8, 10) == month && input.substring(10, 12) <= day) {
					age++;
				};
			}
			input = age;
		};
		if (type == 'sex') {
			var sex = '';
			if (input.length == 18) {
				sex = input.substring(16, 17) % 2 ? "1" : "2";
			};
			if (input.length == 15) {
				sex = input.substring(14, 15) % 2 ? "1" : "2";
			};
			input = sex;
		};
		if (type == 'birth') {
			var birth = '';
			if (input.length == 18) {
				birth = input.substring(6, 10) + "-" + input.substring(10, 12) + "-" + input.substring(12, 14);
			};
			if (input.length == 15) {
				birth = parseInt(input.substring(6, 8)) + 1900 + "-" + input.substring(8, 10) + "-" + input.substring(10, 12);
			}
			input = birth;
		};
		return input;
	};
});
services.directive('formWarning', function(judes) {
	return {
		restrict: "E",
		replace: true,
		scope: {
			value: '=',
			checkModel : '=',
		},
		template: "<div class='warning cl'></div>",
		link: function(scope, element, attrs) {
			var judesArray = attrs.type.split(';');
			var name = attrs.name;
			scope.$watch('value', function(newValue, oldValue, scope) {
				var isComplete = true;
				var canUsedType = '';
				for (var i = 0; i < judesArray.length; i++) {
					var item = judesArray[i];
					if (!judes[item](scope.value)) {
						isComplete = false;
						canUsedType = item;
						break;
					}
				};
				if (isComplete) {
					element.text('');
					element.css('display','none');
				} else {
					var text = '';
					switch (canUsedType) {
						case 'isNull':
							text = '不能为空';
							break;
						case 'isSpecial':
							text = '不能包含特殊字符';
							break;
						case 'isHaveChinese':
							text = '不能含有中文';
							break;
						case 'isHaveChinese':
							text = '不能含有中文';
							break;
						case 'isAllChinese':
							text = '必须全部为中文';
							break;
						default:
							text = '输入有误';
							break;
					}
					element.text(name + text);
					element.css('display','block');
				}

			}, true);
		}
	};
});
app.filter('judeValue', function(judes) {
	return function(input, type) {
		if (type == 'isIdCard') {
			return !judes.isIdCard(input);
		}
		if (type == 'isPhone') {
			return !judes.isPhone(input);
		}
	}
});