services.directive("appMap", function($compile, $state) {
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
                heatmap.setDataSet({
                    data: heatmapData,
                    max: 10
                });


                // 随机函数 待加入API
                function GetRandomNum(Min, Max) {
                    var Range = Max - Min;
                    var Rand = Math.random();
                    return (Min + Math.round(Rand * Range));
                }

                // 随机点标注
                scope.addPoint = function() {
                    for (var i = 0; i < 20; i++) {
                        var data = {
                            "lng": '125.6' + GetRandomNum(0, 99999),
                            "lat": '43.5' + GetRandomNum(0, 99999),
                            "count": GetRandomNum(1, 10)
                        }
                        heatmapData.push(data);
                    }

                    heatmap.setDataSet({
                        data: heatmapData,
                        max: 10
                    });
                }

                var Html = $compile("<div class='btn btn-red' ng-click='addPoint()' style='position:absolute; bottom:0px; right:0px;'>add point</div>")(scope);
                element.append(Html);



                // 自定义点标注


                /*var clickEventListener = map.on('click', function(e) {
                	console.log(e.lnglat.getLng() + ',' + e.lnglat.getLat());
                });*/


                var inofContent = [{
                    position: [125.657906, 43.529844],
                    title: '懒猫睡吧精品店',
                    owenr: '法人姓名',
                    phone: '13630985996',
                }, {
                    position: [125.653701, 43.524741],
                    title: '跃海物流',
                    owenr: '啦啦啦',
                    phone: '13630985996',
                }, {
                    position: [125.661571, 43.527497],
                    title: '凯悦时尚宾馆',
                    owenr: 'SSS',
                    phone: '13630985996',
                }];

                // var infoWindow = new AMap.InfoWindow({
                // 	isCustom: true, //使用自定义窗体
                // 	offset: new AMap.Pixel(16, -45)
                // });

                for (var i = 0, marker; i < inofContent.length; i++) {
                    var marker = new AMap.Marker({
                        icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                        position: inofContent[i].position,
                        map: map
                    });
                    marker.setMap(map);

                    marker.setLabel({ //label默认蓝框白底左上角显示，样式className为：amap-marker-label
                        offset: new AMap.Pixel(-90, 35), //修改label相对于maker的位置
                        content: '<div>' + inofContent[i].title + '</div>'
                    });

                    marker.content = inofContent[i];
                    marker.on('click', markerClick);
                };

                function markerClick(e) {

                    var info = document.createElement("div");
                    info.className = "info";

                    //可以通过下面的方式修改自定义窗体的宽高
                    //info.style.width = "400px";
                    // 定义顶部标题
                    var top = document.createElement("div");
                    var titleD = document.createElement("div");
                    var closeX = document.createElement("img");
                    top.className = "info-top";
                    titleD.innerHTML = e.target.content.title;
                    closeX.src = "http://webapi.amap.com/images/close2.gif";
                    closeX.onclick = closeInfoWindow;

                    top.appendChild(titleD);
                    top.appendChild(closeX);
                    info.appendChild(top);

                    var spanGo = document.createElement("sapn");
                    spanGo.innerHTML = '查看详情 >';
                    spanGo.onclick = function() {
                        $state.go('index.place');
                    };
                    // 定义中部内容
                    var middle = document.createElement("div");
                    middle.className = "info-middle";
                    middle.style.backgroundColor = 'white';
                    middle.innerHTML = '法人姓名 :' + e.target.content.owenr + '<br>' + '联系电话 :' + e.target.content.phone + '<br>';

                    middle.appendChild(spanGo);
                    info.appendChild(middle);

                    // 定义底部内容
                    var bottom = document.createElement("div");
                    bottom.className = "info-bottom";
                    bottom.style.position = 'relative';
                    bottom.style.top = '0px';
                    bottom.style.margin = '0 auto';
                    var sharp = document.createElement("img");
                    sharp.src = "http://webapi.amap.com/images/sharp.png";
                    bottom.appendChild(sharp);
                    info.appendChild(bottom);

                    infoWindow.setContent(info);
                    infoWindow.open(map, e.target.getPosition());
                }

                function closeInfoWindow() {
                    map.clearInfoWindow();
                }

                // map.setFitView();
            } catch (error) {
                element.append('地图模块加载失败,请刷新页面或检查网络连接');
            }
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
            } else if (tAttrs.usedlocalstorage == 'list') {
                var _html = '';
                _html += '<div class="crumbs">';
                _html += '	<i class="icon"></i>';
                var list = angular.fromJson(tAttrs.list);
                console.log(list);
                for (var i = 0; i < list.length; i++) {
                    _html += (i == 0 ? '' : '<span> \></span>') + ' <a href="' + list[i].status + '"><span>' + list[i].startName + '</span></a>';
                };
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
services.directive('chooseBox', function(Api, $compile) {
    return {
        restrict: "E",
        replace: true,
        template: "<div class='chooseBox'></div>",
        link: function(scope, element, attrs) {
            scope.chooseBoxData = [{
                name: '0001',
                id: '0001',
                list: [{
                    name: '0002',
                    id: '0002',
                    list: [{
                        name: '0003',
                        id: '0003',
                    }, {
                        name: '0004',
                        id: '0004',
                    }, {
                        name: '0005',
                        id: '0005',
                    }],
                }, {
                    name: '0006',
                    id: '0006',
                    list: [{
                        name: '0007',
                        id: '0007',
                    }, {
                        name: '0008',
                        id: '0008',
                    }, {
                        name: '0009',
                        id: '0009',
                    }],
                }, {
                    name: '0010',
                    id: '0010',
                    list: [{
                        name: '0011',
                        id: '0011',
                    }, {
                        name: '0012',
                        id: '0012',
                    }, {
                        name: '0013',
                        id: '0013',
                    }],
                }],
            }, {
                name: '0016',
                id: '0016',
                list: [{
                    name: '0017',
                    id: '0017',
                    list: [{
                        name: '0018',
                        id: '0018',
                    }, {
                        name: '0019',
                        id: '0019',
                    }, {
                        name: '0020',
                        id: '0020',
                    }],
                }, {
                    name: '0021',
                    id: '0021',
                    list: [{
                        name: '0022',
                        id: '0022',
                    }, {
                        name: '0023',
                        id: '0023',
                    }, {
                        name: '0024',
                        id: '0024',
                    }],
                }, {
                    name: '0026',
                    id: '0026',
                    list: [{
                        name: '0027',
                        id: '0027',
                    }, {
                        name: '0028',
                        id: '0028',
                    }, {
                        name: '0029',
                        id: '0029',
                    }],
                }],
            }]

            scope.inputList = [];
            // 转换对象到输入框列表
            for (var i = 0; i < scope.chooseBoxData.length; i++) {
                var item = scope.chooseBoxData[i];
                var data = {};
                data.name = item.name;
                data.id = item.id;
                scope.inputList.push(data);

                for (var d = 0; d < item.list.length; d++) {
                    var infoItem = item.list[d];
                    var _data = {};
                    _data.name = infoItem.name;
                    _data.id = infoItem.id;
                    scope.inputList.push(_data);

                    for (var y = 0; y < infoItem.list.length; y++) {
                        var _infoItem = infoItem.list[y];
                        var __data = {};
                        __data.name = _infoItem.name;
                        __data.id = _infoItem.id;
                        scope.inputList.push(__data);
                    }
                }
            }
            scope.showChoose = function(item) {
                var data = {}
                data.name = item.name;
                data.id = item.id;
                console.log(data);
            }

            function initPage() {
                element.empty();
                var html = '';
                html += '<div class="search">';
                html += '<i></i>';
                html += '<input type="text" ng-init="chooseInputSearch" ng-model="chooseInputSearch">';
                html += '</div>';
                // 输入框绑定
                html += '<div class="chooseInputSearch" ng-if="chooseInputSearch">';
                html += '<div class="item" ng-repeat="item in inputList | filter:{\'name\':chooseInputSearch}">';
                html += '	<div class="item-btn cl"  ng-init="item.isShow = false;item.isChoose = false">';
                html += '		<div class="name" ng-bind="item.name" ng-click="showChoose(item)"></div>';
                html += '		<div class="isChoose" ng-class="item.isChoose ? \'show\' : \'\'" ng-click="item.isChoose = !item.isChoose"></div>';
                html += '	</div>';
                html += '</div>';
                html += '</div>';

                // 下拉框绑定
                html += '<div class="chooseInputSearch" style="z-index:66">';

                html += '<div class="item" ng-repeat="item in chooseBoxData">';
                html += '<div class="item-btn cl" ng-init="item.isShow = false;item.isChoose = false">';
                html += '<div class="fold" ng-class="item.isShow ? \'show\' : \'\'" ng-click="item.isShow = !item.isShow"></div>';
                html += '<div class="name" ng-bind="item.name"></div>';
                html += '<div class="isChoose" ng-class="item.isChoose ? \'show\' : \'\'" ng-click="showChoose(item)"></div>';
                html += '</div>';
                html += '<div class="list" ng-if="item.isShow">';

                html += '<div class="item" ng-repeat="item in item.list">';
                html += '<div class="item-btn cl" ng-init="item.isShow = false">';
                html += '<div class="fold" ng-class="item.isShow ? \'show\' : \'\'" ng-click="item.isShow = !item.isShow"></div>';
                html += '<div class="name" ng-bind="item.name"></div>';
                html += '<div class="isChoose" ng-class="item.isChoose ? \'show\' : \'\'" ng-click="showChoose(item)"></div>';
                html += '</div>';
                html += '<div class="list" ng-if="item.isShow">';

                html += '<div class="item" ng-repeat="item in item.list">';
                html += '<div class="item-btn cl" ng-init="item.isShow = false">';
                html += '	<div class="fold" style="opacity:{{item.list ? 1 : 0}}" ng-class="item.isShow ? \'show\' : \'\'" ng-click="item.isShow = !item.isShow"></div>';
                html += '	<div class="name" ng-bind="item.name"></div>';
                html += '<div class="isChoose" ng-class="item.isChoose ? \'show\' : \'\'" ng-click="showChoose(item)"></div>';
                html += '</div>';
                html += '</div>';

                html += '</div>';
                html += '</div>';

                html += '</div>';
                html += '</div>';

                html += '</div>';
                html = $compile(html)(scope);
                element.append(html);
            };



            // scope.chooseBox(item);
        },
    };
});