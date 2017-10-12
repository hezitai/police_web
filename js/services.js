var services = angular.module('manage.services', []);
services.factory('navList', function() {
    var navList = [{
            name: '信息研判',
            stateName: 'index.judge',
            isUsed: true,
        },
        //	 {
        //	 	name: '工作日志',
        //	 	stateName: 'index.jobs',
        //	 	isUsed: true,
        //	 }, 
        {
            name: '行业场所',
            stateName: 'index.place',
            isUsed: true,
        }, {
            name: '重点人口',
            stateName: 'index.point',
            isUsed: true,
        }, {
            name: '出租房屋管理',
            stateName: 'index.house',
            isUsed: true,
        }, {
            name: '消息中心',
            stateName: 'index.message',
            isUsed: true,
        }, {
            name: '发送消息',
            stateName: 'index.send',
            isUsed: true,
        }, {
            name: '警员管理',
            stateName: 'index.policeManagement',
            isUsed: true,
        }, {
            name: '警务排班',
            stateName: 'index.duty',
            isUsed: true,
        }, {
            name: '查询记录',
            stateName: 'index.queryLog',
            isUsed: true,
        },{
            name: '信息查询',
            stateName: 'index.search',
            isUsed: true,
        }, {
            name: '一键审核',
            stateName: 'index.collect',
            isUsed: false,
        }, {
            name: '不稳定信息库',
            stateName: 'index.unsteadinessMessage',
            isUsed: true,
        }, {
            name: '合成作战平台',
            stateName: 'index.SyntheticCombatPlatform',
            isUsed: true,
        },



        // {
        //     name: '危爆物品管理',
        //     stateName: 'index.dangerous',
        //     isUsed: true,
        // },
        //  {
        //     name: '发布任务',
        //     stateName: 'index.releaseTask',
        //     isUsed: true,
        // },
        // {
        //     name: '历史任务',
        //     stateName: 'index.historyTask',
        //     isUsed: true,
        // }, {
        //     name: '工作审批',
        //     stateName: 'index.workApproval',
        //     isUsed: true,
        // },
        // {
        //     name: '民警定位',
        //     stateName: 'index.policeLocation',
        //     isUsed: true,
        // },
        //  {
        //     name: '社会帮扶',
        //     stateName: 'index.SocialSupport',
        //     isUsed: true,
        // },
        //  {
        //     name: '警情信息',
        //     stateName: 'index.policeInfo',
        //     isUsed: true,
        // },
        //	{
        //		name: '巡逻防控',
        //		stateName: 'index.patrol',
        //		isUsed: true,
        //	}, 
        // {
        //     name: '信息采集',
        //     stateName: 'index.collect',
        //     isUsed: true,
        // }, {
        //     name: '工作任务',
        //     stateName: 'index.mission',
        //     isUsed: true,
        // },
        // {
        //     name: '报表',
        //     stateName: 'index.reportForms',
        //     isUsed: true,
        // }, 
        {
            name: 'demo',
            stateName: 'index.demo',
            isUsed: true,
        }, {
            name: '地图Demos',
            stateName: 'index.mapDemo',
            isUsed: true,
        }, {
            name: '通讯录Demo',
            stateName: 'index.chooseBox',
            isUsed: true,
        }
    ];
    return navList;
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
    var _url = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/;
    var emall = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    var haveChinese = "[\\u4E00-\\u9FFF]+";
    var _isNull = "^[ ]+$";
    var _isNumber = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    var _isInteger = /^[0-9]*$/;
    var _telephone = /^(0\\d{2}-\\d{8}(-\\d{1,4})?)|(0\\d{3}-\\d{7,8}(-\\d{1,4})?)$/;
    var _logistics = /^([A-Za-z]*|[0-9]*)[0-9]*$/;
    var _EnglishWord = /^[A-Za-z]{1}/;
    return {
        isEnglishWord: function(str) {
            //验证英文字母
            var re = new RegExp(_EnglishWord);
            return re.test(str) ? true : false;
        },
        isNumber: function(str) {
            // 验证为数字,返回true
            var re = new RegExp(_isNumber);
            return re.test(str) ? true : false;
        },
        isLogistics: function(str) {
            var re = new RegExp(_logistics);
            return re.test(str) ? true : false;
        },
        isInteger: function(str) {
            // 验证为正整数,返回true
            var re = new RegExp(_isInteger);
            return re.test(str) ? true : false;
        },
        isTelephone: function(str) {
            // 固定电话格式正确返回true
            var re = new RegExp(_telephone);
            return re.test(str) ? true : false;
        },
        isNull: function(str) {
            // 如果全是空返回false
            if (str == "" || str == undefined || str == null) return false;
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
        isDate: function(str) {
            if (str == "") return false;
            str = str.replace(/-/g, "/").replace(/日/g, "/").replace(/月/g, "/").replace(/年/g, "/");
            var d = new Date(str);
            if (isNaN(d)) return false;
            var arr = str.split("/");
            return ((parseInt(arr[0], 10) == d.getFullYear()) && (parseInt(arr[1], 10) == (d.getMonth() + 1)) && (parseInt(arr[2], 10) == d.getDate()));
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
services.factory('Api', function($resource, $rootScope) {

    //////////////////
    // Api 文档总汇 //
    //////////////////


    // Loading 方法. 分为 show 和 hide 四个方法,

    // Loading.show();  	显示Loading,
    // Loading.hide();  	隐藏Loading,
    // 
    // ↓ 待弃用 : 在AJAX中 新参数 unloading 可以做到放弃loading显示隐藏
    // Loading.usedShow();  忽略AJAX方法中的Loading方法, 对Loading进行显示,
    // Loading.usedHide();  隐藏Loading, 并重新启用AJAX的loading方法
    // ////////////////////////////////////////////////////////////////////////
    // alert 方法 用于显示弹出提示窗口
    // 
    // alert('字符串',回调函数);
    // 示例
    // alert('弹出框中显示的文字',function () {
    // 		console.log('调试框中显示的文字');
    // });
    // //////////////////////////////////////////////////////////////////////////
    // checked 方法 用于弹出确认窗口
    // 
    // checked('字符串',确认后回调, 取消后回调);
    // 示例
    // alert('弹出框中显示的文字',function () {
    // 		console.log('成功后回调');
    // },function(){
    // 		console.log('失败后回调');
    // });
    // /////////////////////////////////////////////////////////////////
    // Storage 方法 用于增删改 localStorage 的方法封装
    // 
    // 存储方法
    // Storage.set('键值名称','存储的值或对象');
    // 
    // 获取方法 
    // Storage.get('键值名称');
    // 
    // 删除方法
    // Storage.remove('键值名称');
    // 
    // //////////////////////////////////////////////////////////////////////
    // formatDate 方法, 用于各个类型日期格式化
    // 
    // 基于 ExDate()
    // 更新于2017年5月7日,
    // 
    // 使用方法, formatDate(format, str);
    // ---------------------------------------------
    // 参数 str 需要格式化的字符串 默认为空,返回当前时间  
    // ---------------------------------------------
    // 参数 format , 期望的格式化类型
    // 默认类型 : 
    // zh 中文日期格式, 不带0占位;
    // ZH 中文日期格式, 带0占位
    // zh: 或 ZH: 带时分秒
    // - 链接符号为 '-' 的日期格式
    // / 链接符号为 '/' 的日期格式
    // Z 返回当前时间戳
    // z 返回今天0点时间戳
    // 非默认类型
    // 以字符串形式组合 自由日期格式
    // 规则
    // YY 或 yy 年份后两位
    // YYYY 或 yyyy 完整年份
    // M 当前月份 , 不带0占位
    // MM 当前月份 , 带0占位
    // D 或 d 当前日期, 不带0占位
    // DD 或 dd 当前日期, 带0占位 
    // h 当前 小时数, 12小时制 ,不带0占位
    // hh 当前 小时数, 12小时制 ,带0占位
    // H 当前 小时数, 24小时制 ,不带0占位
    // HH 当前 小时数, 24小时制 ,带0占位
    // m 当前分钟数 ,不带0占位
    // mm 当前分钟数 ,带0占位
    // s 当前秒数 ,不带0占位
    // ss 当前秒数 ,带0占位 
    // tt  am / pm
    // TT  AM / PM
    // T 上午 / 下午
    // Z 返回时间戳(单独使用)
    // 示例   YY年M月D日 T h点m分s秒  17年5月7日 下午 9点5分6秒
    // 		  YYYY年MM月DD日 HH点mm分ss秒  2017年05月07日 21点05分06秒
    // 可自由组合
    // ////////////////////////////////////////////////////////////////////////
    // AJAX 方法
    // 
    // 以下方法统一使用error方法,有需要的可单独调用
    // 以下方法均可通过 unloading : true 参数关闭 Loading 显示及隐藏
    // 注 : 非CRM接口类型,在返回success时可能包含错误信息,调试时请注意
    // 
    // GET 方法
    // Api.GET({
    // 	url : 'XXXX',
    // 	success : function (result) {}
    // })
    // 
    // 
    // POST 方法
    // Api.POST({
    // 	url : 'XXXX',
    // 	data : data,
    // 	success : function (result) {}
    // })
    // 
    // 
    // PUT 方法
    // Api.PUT({
    // 	url : 'XXXX',
    // 	data : data,
    // 	success : function (result) {}
    // })
    // 
    // 
    // DELETE 方法
    // Api.DELETE({
    // 	url : 'XXXX',
    // 	success : function (result) {}
    // })
    // ////////////////////////////////////////////////////
    // format 方法 用于格式化CRM数据类型
    // 
    // 格式化期望值为列表的CRM数据
    // formatting.CRMList(result.value);
    // 
    // 格式化期望值为对象的CRM数据
    // formatting.CRMValue(result.value);
    // 
    // 格式化期望值为选项的CRM数据
    // formatting.CRMOptions(result.value);
    // 
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
    var popUp = {
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
                if (cancelCallback) {
                    cancelCallback();
                }
            };
            document.getElementById("alert-close").onclick = function() {
                removeAlert();
                if (cancelCallback) {
                    cancelCallback();
                }
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
    var Storage = {
        set: function(key, data) {
            return window.localStorage.setItem(key, window.JSON.stringify(data));
        },
        get: function(key) {
            return eval('(' + window.localStorage.getItem(key) + ')');
        },
        remove: function(key) {
            return window.localStorage.removeItem(key);
        }
    };
    var ExDate = function(format, str) {
        _myBrowser = function() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
            var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
            var isSafari = userAgent.indexOf("Safari") > -1; //判断是否Safari浏览器
            var isChrome = userAgent.indexOf("Chrome") > -1; // 判断是否为谷歌浏览器
            if (isIE) {
                var IE5 = IE55 = IE6 = IE7 = IE8 = false;
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                IE55 = fIEVersion == 5.5;
                IE6 = fIEVersion == 6.0;
                IE7 = fIEVersion == 7.0;
                IE8 = fIEVersion == 8.0;
                if (IE55) {
                    return "IE55";
                }
                if (IE6) {
                    return "IE6";
                }
                if (IE7) {
                    return "IE7";
                }
                if (IE8) {
                    return "IE8";
                }
            } //isIE end
            if (isFF) {
                return "FF";
            }
            if (isOpera) {
                return "Opera";
            };
            if (isChrome) {
                return "Chrome";
            }
        };

        var errorEvent = function() {
            console.error('ExDate : The string is not a valid time');
            return 'error';
        };
        var formatStr = format || 'yyyy-MM-DD';
        if (format == '中' || format == 'zh') {
            formatStr = 'yyyy年M月D日';
        } else if (format == 'ZH') {
            formatStr = 'yyyy年MM月DD日';
        } else if (format == 'ZH:') {
            formatStr = 'yyyy年MM月DD日 HH时mm分ss秒';
        } else if (format == 'zh:') {
            formatStr = 'yyyy年M月D日 H时m分s秒';
        } else if (format == '-') {
            formatStr = 'yyyy-MM-DD';
        } else if (format == '/') {
            formatStr = 'yyyy/MM/DD';
        };

        if (str instanceof Date) {
            var date = str;
        } else {
            if (str) {
                if (!isNaN(str)) {
                    var date = new Date(str);
                } else {
                    str = str.replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, '').replace(/时/g, ':').replace(/分/g, ':').replace(/秒/g, '');
                    if (_myBrowser() == 'Chrome') {
                        str = str.replace(/\//g, '-');
                    };
                    var date = new Date(str);
                }
            } else {
                if (formatStr == 'z') {
                    var cancelData = new Date();
                    var date = new Date(cancelData.getFullYear() + '/' + (cancelData.getMonth() + 1) + '/' + cancelData.getDate());
                    formatStr = 'Z';
                } else {
                    var date = new Date();
                }
            };
        };

        if (date == 'Invalid Date') {
            errorEvent();
            return 'error';
        };
        var zeroize = function(value, length) {
            if (!length) length = 2;
            value = String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                zeros += '0';
            }
            return zeros + value;
        };
        return formatStr.replace(/d{1,2}|D{1,2}|m{1,2}|yy(?:yy)|YY(?:YY)|([hHMstTZ]){1,2}/g, function($0) {
            switch ($0) {
                case 'd':
                    return date.getDate();
                case 'dd':
                    return zeroize(date.getDate());
                case 'D':
                    return date.getDate();
                case 'DD':
                    return zeroize(date.getDate());
                case 'M':
                    return date.getMonth() + 1;
                case 'MM':
                    return zeroize(date.getMonth() + 1);
                case 'yy':
                    return String(date.getFullYear()).substr(2);
                case 'yyyy':
                    return date.getFullYear();
                case 'YY':
                    return String(date.getFullYear()).substr(2);
                case 'YYYY':
                    return date.getFullYear();
                case 'h':
                    return date.getHours() % 12 || 12;
                case 'hh':
                    return zeroize(date.getHours() % 12 || 12);
                case 'H':
                    return date.getHours();
                case 'HH':
                    return zeroize(date.getHours());
                case 'm':
                    return date.getMinutes();
                case 'mm':
                    return zeroize(date.getMinutes());
                case 's':
                    return date.getSeconds();
                case 'ss':
                    return zeroize(date.getSeconds());
                case 'tt':
                    return date.getHours() < 12 ? 'am' : 'pm';
                case 'TT':
                    return date.getHours() < 12 ? 'AM' : 'PM';
                case 'T':
                    return date.getHours() < 12 ? '上午' : '下午';
                case 'Z':
                    return date.getTime();
                default:
                    return $0.substr(1, $0.length - 2);
            }
        })
    };
    var checkLoginTime = function() {
        var loginTime = Storage.get('loginTime');
        if (!loginTime) {
            return 'none';
        };
        var time = ExDate('Z');
        if ((loginTime + (1000 * 60 * 60 * 24 * 7)) > time) {
            Storage.set('loginTime', time);
            return true;
        } else {
            return false;
        };
    };
    var Ajax = function(data, type) {
        var getLoginTimeType = checkLoginTime();

        function timeout() {
            Storage.remove('loginTime');
            Storage.remove('policeUser');
            popUp.alert.show('登录过期\n请重新登录');
            $state.go('login');
        }

        if (!getLoginTimeType) {
            timeout();
            return;
        };

        if (!data.unloading) {
            Loading.show();
        };

        // var testUrl = 'http://211.137.214.12';
        var testUrl = 'http://192.168.1.102:8090';
        //var testUrl = '';

        var resource = $resource(testUrl + data.url, {}, {
            get: {
                timeout: 15000
            },
            post: {
                method: 'POST',
            },
            put: {
                method: 'PUT',
            },
            delete: {
                method: 'DELETE',
                timeout: 15000
            }
        });
        if (type == 'get' || type == 'delete') {
            resource[type](function(result) {
                if (!data.unloading) {
                    Loading.hide();
                }
                data.success(result);
            }, function(result) {
                if (!data.unloading) {
                    Loading.hide();
                };
                if (data.error) {
                    data.error(result);
                };
                popUp.alert('网络连接失败\n请检查网络');
            });
        } else {
            resource[type](data.data, function(result) {
                if (!data.unloading) {
                    Loading.hide();
                }
                data.success(result);
            }, function(result) {
                if (!data.unloading) {
                    Loading.hide();
                };
                if (data.error) {
                    data.error(result);
                };
                popUp.alert('网络连接失败\n请检查网络');
            });
        }
    };
    var formatting = {
        CRMList: function(value) {
            var data = [];
            for (var i = 0; i < value.length; i++) {
                var itemValue = value[i];
                var itemData = {};
                itemData.id = itemValue.id;
                for (var d = 0; d < itemValue.attributes.length; d++) {
                    var item = itemValue.attributes[d];
                    if (item.type == "DateTime") {
                        itemData[item.name] = ExDate('yyyy/MM/DD HH:mm:ss', parseInt(ExDate('Z', item.value)) + (1000 * 60 * 60 * 8));
                    } else {
                        itemData[item.name] = item.value;
                    };
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
                if (item.type == "DateTime") {
                    data[item.name] = ExDate('yyyy/MM/DD HH:mm:ss', parseInt(ExDate('Z', item.value)) + (1000 * 60 * 60 * 8));
                } else {
                    data[item.name] = item.value;
                };
            }
            return data;
        },
        CRMOptions: function(value) {
            var data = [];
            for (var i = 0; i < value.options.length; i++) {
                var item = value.options[i];
                item = {
                        "name": item.split(':')[1],
                        "value": item.split(':')[0],
                    },
                    data.push(item);
            };
            return data;
        },
        date: ExDate
    };
    return {
        GET: function(data) {
            Ajax(data, 'get');
        },
        POST: function(data) {
            Ajax(data, 'post');
        },
        PUT: function(data) {
            Ajax(data, 'put');
        },
        DELETE: function(data) {
            Ajax(data, 'delete');
        },
        format: formatting,
        formatDate: ExDate,
        Loading: {
            show: function() {
                if (isShowLoading) {
                    Loading.show();
                };
            },
            hide: function() {
                if (isShowLoading) {
                    Loading.hide();
                }
            },
            usedShow: function() {
                isShowLoading = false;
                Loading.show();
            },
            usedHide: function() {
                isShowLoading = true;
                Loading.hide();
            },
        },
        alert: popUp.alert,
        checked: popUp.checked,
        Storage: Storage,
    };
});
services.factory('getBase64ByFile', function(Api) {
    // 对象实例
    /*	data = {
    		fileType : // 预期格式,
    		elementId : // 文件元素id,
    		success : // 成功回调事件,
    		error : // 失败回调事件,
    	};*/
    var getBase64 = function(data) {
        var file = angular.element('#' + data.elementId)[0].files[0];
        if (!file) {
            data.error('上传文件信息未空');
            $('#' + data.elementId).clearFields();
            return;
        };
        var fileType = ['.doc', '.docx', '.jpg', '.jpeg', '.png'];
        var index1 = file.name.lastIndexOf(".");
        // alert(index1);
        var index2 = file.name.length;
        // alert(index2);
        var postf = file.name.substring(index1, index2).toLowerCase(); //后缀名  
        console.log(postf);
        if ($.inArray(postf, fileType) == -1) {
            data.error('文件格式错误');
            $('#' + data.elementId).clearFields();
            return;
        };
        if (data.fileType == 'image' && (postf != '.jpg' && postf != '.jpeg' && postf != '.png')) {
            data.error('预期格式错误');
            $('#' + data.elementId).clearFields();
            return;
        } else if (data.fileType == 'doc' && (postf != '.doc' && postf != '.docx')) {
            data.error('预期格式错误');
            $('#' + data.elementId).clearFields();
            return;
        };
        var oReader = new FileReader();
        oReader.onload = function(e) {
            if (data.fileType == 'image') {
                var _image = document.createElement('img');
                _image.src = e.target.result;
                _image.onload = function() {
                    var that = _image;
                    var w = that.width,
                        h = that.height,
                        scale = w / h;
                    w = 640;
                    h = w / scale;
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    $(canvas).attr({
                        width: w,
                        height: h
                    });
                    ctx.drawImage(that, 0, 0, w, h);
                    var base64 = canvas.toDataURL('image/jpeg', 0.6);
                    data.success(base64);
                    $('#' + data.elementId).clearFields();
                };
            } else if (data.fileType == 'doc') {
                data.success(e.target.result);
                $('#' + data.elementId).clearFields();
            };
        };
        oReader.readAsDataURL(file);
    };
    return getBase64;
});
services.factory('user', function(Api) {
    return {
        login: function(data, success, error) {
            Api.POST({
                url: '/api/Crm/PoliceLogon',
                data: data,
                success: function(data) {
                    if (data.status == 0) {
                        Api.Storage.set('manageUser', data.resultObj);
                        // console.log(data.resultObj);
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