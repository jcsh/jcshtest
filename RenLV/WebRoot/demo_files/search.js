define('common/ui/search/search', ["common/ui/popup_base/popup_base", "css!common/ui/search/search.css", "css!common/ui/list/list.css"], function(popup_base) {
    
    var para;
    var isSearch, inputTimer, resultCache={};
    var $input, $clear, $cnt, $el = {};

    var _requestInterval = 700,
        _requestDelay = 300;


    var _render = {
        baseHTML : function () {
            return [
                    '<div class="qui-search_bar"><form id="qui-search_form">'
                ,       '<a class="qui-search_backBtn"><span class="qui-icon _back"></span></a>'
                ,       '<input class="qui-search_input" type="text" placeholder="搜索" />'
                ,       '<a class="qui-search_goBtn">搜索</a>'
                ,       '<a class="qui-search_clear"><span class="qui-icon _close"></span></a>'
                ,   '</form></div>'
                ,   '<div class="qui-search_content"></div>'
                ].join("");
        },

        baseEvent : function () {
            var c = $(popup_base.getContent());
            
            $input = c.find('input.qui-search_input');
            $clear = c.find('.qui-search_clear');
            $cnt = c.find('.qui-search_content');

            c.find('.qui-search_backBtn').on(qyerUtil.EVENT.CLICK, function() {
                _public.hide();
            })

            if (isSearch && typeof para.doSearch == 'function') {
                c.find('.qui-search_goBtn').on(qyerUtil.EVENT.CLICK, function() {
                    para.doSearch($input.val());
                    _public.hide();
                })
            }

            $input.on('input', function() {
                if ($(this).val() != '') {
                    $clear.show();
                
                    clearTimeout(inputTimer);
                    var t = (new Date()).getTime();
                    var v = $(this).val();

                    if (t - window.qyerUtil.latestSearchRequest < _requestInterval) {
                        inputTimer = setTimeout(function(){
                            _private.getResult(t, v, 'true');
                        }, _requestDelay);
                    }
                    else {
                        _private.getResult(t, v, 'false');
                    }
                }
                else {
                    $clear.hide();
                }
                
            });

            $clear.on(qyerUtil.EVENT.CLICK, function() {
                _private.reset();
            });

            c.find('#qui-search_form').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();

                if (isSearch) {
                    para.doSearch($input.val());
                    _public.hide();    
                }
                else {
                    $input.blur();
                }
            });
        },

        listHTML : function (pack) {
            var prefix = [
                    '<ul class="qui-list qui-list_default'
                ,       (!pack.html && !pack.template)
                            ? ' qui-list_'+(pack.listType || 'default_li') : ""
                ,   '">'
                ].join("");

            var surfix = '</ul>';

            var li = [];

            for (var i=0, len=pack.data.length; i<len; i++) {
                var pre = [
                        '<li data-quilistkey="', (pack.data[i].key || i) , '"'
                    ,   ' data-quilistindex="' , i , '"'
                    ,   (pack.data[i].ipg ? ' data-bn-ipg="'+pack.data[i].ipg+'"' : "")
                    ,   '>'
                    ].join(""),
                    inner,
                    sur = '</li>';

                try {
                    inner = pack.html
                            ? pack.data[i].val
                            : (pack.template)
                                ? window.qyerUtil.renderTemplate(pack.template, pack.data[i])
                                : pack.data[i].val;
                }
                catch (err) {}

                li.push([ pre, inner || "", sur ].join(""));
            }

            $cnt.html([ prefix, li.join(""), surfix ].join(""));

        },

        listEvent : function (pack) {
            $cnt.find('.qui-list').delegate('li', qyerUtil.EVENT.CLICK, function() {
                if (typeof pack.onSelect == 'function') {
                    var k = $(this).attr('data-quilistkey');
                    pack.onSelect({
                        key : $(this).attr('data-quilistkey'),
                        index : $(this).attr('data-quilistindex'),
                        data : pack.data[$(this).attr('data-quilistindex')],
                        el : $(this),
                        default : function () {
                            para.doSearch(k);
                        }
                    });
                    _public.hide();
                }
                else {
                    para.doSearch($(this).attr('data-quilistkey'));
                    _public.hide();
                }
            });
        },

        afterList : function (pack) {
            if (!pack)
                return;

            if (pack.afterListHTML) {
                $cnt.append('<div class="qui-search_afterList"></div>');
                $cnt.find('.qui-search_afterList').append(                
                    (typeof pack.afterListHTML === 'function')
                        ? pack.afterListHTML($input.val())
                        : window.qyerUtil.renderTemplate(pack.afterListHTML, { 'val' : $input.val() })
                );
            }
            if (typeof pack.onSelect === 'function') {
                $cnt.find('.qui-search_afterList').on(window.qyerUtil.EVENT.CLICK, function(){
                    pack.onSelect($input.val());
                    _public.hide();   
                });
            }
        },

        msg : function (msg) {
            var m;

            if (typeof msg == 'object' && 'xhr' in msg && 'type' in msg) {
                switch (msg.type) {
                    case 'error' :
                    case 'parseerror' :
                        m = this.msgText.serverError;
                        break;

                    case 'timeout' :
                    case 'abort' :
                    default :
                        m = this.msgText.connectionError;
                }
            }
            else {
                m = msg.toString();
            }
            $cnt.html([ '<p class="qui-search_msg">', m, '</p>' ].join(""));
        },
        msgText : {
            noResult : '没有匹配的结果',
            serverError : '未能获得结果',
            connectionError : '网络或服务器连接错误'
        }
    };

    var _private = {
        reset : function () {
            $input.val('');
            $clear.hide();

            if (para.standbyList) {
                _render.listHTML(para.standbyList);
                _render.listEvent(para.standbyList);
            }
            else {
                $cnt.html('');
            }
        },

        setOption : function(options) {
            para.resultList = options.resultList || {};
            para.doSearch = (typeof options.doSearch == 'function')
                ? options.doSearch
                : function (val) {};
            para.noResultText = _render.msgText.noResult;

            var _setOption = {
                type : function () {
                    if (isSearch) {
                        $('.qui-search_bar').addClass('qui-search_isSearch');
                        $('.qui-search_input').attr('type', 'search');
                        $('.qui-search_clear').addClass('isSearch');
                        $('.qui-search_goBtn').show();
                    }
                },
                backBtnIpg : function () {
                    $('a.qui-search_backBtn').attr('data-bn-ipg', options.backBtnIpg);
                },
                goBtnText : function () {
                    $('.qui-search_goBtn').html(options.goBtnText);
                },
                goBtnIpg : function () {
                    $('.qui-search_goBtn').attr('data-bn-ipg', options.goBtnIpg);
                },
                noResultText : function () {
                    para.noResultText = options.noResultText
                }
            }
            for (prop in options) {
                if (_setOption[prop])
                    _setOption[prop]();
            }

            if (!isSearch) {
                $('.qui-search_goBtn').hide();
            }

        },

        presentResult : function (data) {
            var _data = (typeof para.mountData === 'function') ? para.mountData(data) : data;

            if (_data.result=='ok') {
                if (_data.data.length == 0) {
                        _render.msg(para.noResultText);
                }
                else {
                    var pack = para.resultList;
                    pack.data = _data.data;

                    _render.listHTML(pack);
                    _render.listEvent(pack);
                }
                _render.afterList(para.afterList);
            }
            else { // server report error
                _render.msg(_data.data);
            }
        },

        getResult : function (t, val, timeout) {
            window.qyerUtil.latestSearchRequest = t;

            if (val in resultCache) {
                // use cache result
                _private.presentResult( resultCache[val] );
                return true;
            }

            if (para.getAjaxData) {
                try {
                    // use ajax connect to get result and callback update list
                    $.getJSON(
                        typeof para.getAjaxData === 'function'
                            ? para.getAjaxData(val)
                            : qyerUtil.renderTemplate(para.getAjaxData, { 'val' : val })
                        , function (data, status, xhr) {
                            // deal or discard ajax
                            if (window.qyerUtil.latestSearchRequest != t) {
                                return 'timeout';
                            }
                            else {
                                window.qyerUtil.activeSearchAjax = -1;
                            }

                            if (data) { // have server feedback
                                resultCache[val] = data;
                                _private.presentResult( data );
                            }
                            else { // no result from server, or false feedback
                                _render.msg({ 'xhr' : xhr, 'type' : status });
                            }
                        });
                }
                catch(err) {
                    console.log(err);
                    _render.msg(_render.msgText.connectionError);
                }
                return true;
            }
            else if (typeof para.getLocalData == 'function') {
                // use function to get instant result and update list
                var data = para.getLocalData.call(this, val);
                resultCache[val] = data;

                _private.presentResult(data);
                return true;
            }
        }
    };


    var _public = {
        show : function (options) {
            para = options;
            isSearch = ('type' in para) && para.type=='search';
            
            popup_base.show({
                type : 1,
                //enableBodyScroll: true,
                contentHTML : _render.baseHTML(),
                immediateEvent : function(content){
                    $(content).find('input.qui-search_input').focus();
                },
                onShow : function () {
                    _private.setOption(options);
                    _render.baseEvent();

                    _private.reset();

                    if (typeof options.onShow === 'function') {
                        options.onShow();
                    }
                },
                onHide : para.onHide
            });
        },

        hide : function () {
            resultCache = {};
            clearTimeout(inputTimer);
            popup_base.hide();
        },

        getQuery : function () {
            return $input.val();
        }
    }

    return _public;
});