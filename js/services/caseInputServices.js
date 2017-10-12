services.directive("caseMap", function($compile, Api) {
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

                Api.checked('是否选择以下地址?<br/>' + str, function() {
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
                        icon: "/police_web/img/mark_b.png",
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
services.factory('caseInputServers', function(Api, user) {
    var createCrm = function(data, success) {
        Api.POST({
            url: "/crm/Entities",
            data: {
                "name": "ds_case",
                "attributes": data.attributes
            },
            success: function(result) {
                var resultValue = Api.format.CRMValue(result.value);
                console.log(resultValue)
                success(resultValue);
            }
        });
    };


    return {
        "createCrm": createCrm // 信息研判-->案件录入
    }
});