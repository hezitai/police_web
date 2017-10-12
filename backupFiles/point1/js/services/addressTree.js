services.directive("addressTreeBox", function(addressTree, $compile) {
	return {
		restrict: "E",
		replace: true,
		template: "<div class='TreeBox'></div>",
		link: function(scope, element, attrs) {
			var Html = '';
			Html = $compile("<select ng-model=\"value1\" ng-change=\"changeAddressTree('0',value1,$event)\"><option value=\"1\" selected>-请选择-</option><option ng-repeat=\"item in treeMessage[0]\" value=\"{{item.id}}\" ng-bind=\"item.ds_name\"></option></select>")(scope);
			element.append(Html);
			Html = $compile("<select ng-model=\"value2\" ng-change=\"changeAddressTree('1',value2,$event)\"><option value=\"1\" selected>-请选择-</option><option ng-repeat=\"item in treeMessage[1]\" value=\"{{item.id}}\" ng-bind=\"item.ds_name\"></option></select>")(scope);
			element.append(Html);
			Html = $compile("<select ng-model=\"value3\" ng-change=\"changeAddressTree('2',value3,$event)\"><option value=\"1\" selected>-请选择-</option><option ng-repeat=\"item in treeMessage[2]\" value=\"{{item.id}}\" ng-bind=\"item.ds_name\"></option></select>")(scope);
			element.append(Html);
			Html = $compile("<select ng-model=\"value4\" ng-change=\"changeAddressTree('3',value4,$event)\"><option value=\"1\" selected>-请选择-</option><option ng-repeat=\"item in treeMessage[3]\" value=\"{{item.id}}\" ng-bind=\"item.ds_name\"></option></select>")(scope);
			element.append(Html);
			if (scope.treeMessage == null) {
				scope.value1 = '1';
				scope.value2 = '1';
				scope.value3 = '1';
				scope.value4 = '1';
				scope.treeMessage = [
					[],
					[],
					[],
					[]
				];
				addressTree.getParent(function(data) {
					scope.treeMessage[0] = data;
				});
			}

			console.log(attrs);

			scope.changeAddressTree = function(index, id, event) {
				if (id != '1') {
					switch (index) {
						case '0':
							addressTree.getSecond(id, function(data) {
								scope.treeMessage[1] = data;
								scope.value2 = '1';
								scope.treeMessage[2] = [];
								scope.value3 = '1';
								scope.treeMessage[3] = [];
								scope.value4 = '1';
							});
							break;
						case '1':
							addressTree.getThird(id, function(data) {
								scope.treeMessage[2] = data;
								scope.treeMessage[3] = [];
								scope.value3 = '1';
								scope.value4 = '1';
							});
							break;
						case '2':
							addressTree.getFourth(id, function(data) {
								scope.treeMessage[3] = data;
								scope.value4 = '1';
							});
							break;
						case '3':

							break;
					}
				} else {
					switch (index) {
						case '0':
							scope.value2 = '1';
							scope.value3 = '1';
							scope.value4 = '1';
							scope.treeMessage[1] = [];
							scope.treeMessage[2] = [];
							scope.treeMessage[3] = [];
							break;
						case '1':
							scope.value3 = '1';
							scope.value4 = '1';
							scope.treeMessage[2] = [];
							scope.treeMessage[3] = [];
							break;
						case '2':
							scope.value4 = '1';
							scope.treeMessage[3] = [];
							break;
						case '3':
							break;
					}
				}
			};
		}
	};
});
services.factory('addressTree', function(Api) {
	return {
		getParent: function(success, error) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name')&$filter=name eq 'ds_address_l1' and query eq 'statecode eq @code/0'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到地址树信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		getSecond: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name')&$filter=name eq 'ds_address_l2' and query eq 'ds_l1_ref eq " + id + "'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到地址树信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		getThird: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name')&$filter=name eq 'ds_address_l3' and query eq 'ds_l2_ref eq " + id + "'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到地址树信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
		getFourth: function(id, success) {
			Api.request.get({
				url: "/crm/Entities?$expand=attributes($filter=name eq 'ds_name')&$filter=name eq 'ds_address_l4' and query eq 'ds_l3_ref eq " + id + "'",
				success: function(result) {
					var resultValue = Api.formatting.CRMList(result.value);
					if (resultValue.length == 0) {
						Api.popUp.alert('未找到地址树信息');
					} else {
						success(resultValue);
					}
				}
			});
		},
	}
});





