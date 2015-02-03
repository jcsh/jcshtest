define('common/ui/popup_base/popup_base', ["css!common/ui/popup_base/popup_base.css"], function() {
    var para, status, type;
    var _private = {
        $popup: null,
        $head: null,
        $title: null,
        $okBtn: null,
        $cancelBtn: null,
        $content: null,
        init: function() {
            this.$popup = $('<div class="qui-popup-base"><div class="qui-popup-header"><input type="button" name="" value="cancel" class="lbtn"><p class="title">title</p><input type="button" name="" value="ok" class="rbtn"></div><div class="qui-popup-base_content"></div></div>');
            this.$popup.appendTo(document.body);
            this.$content = this.$popup.children(".qui-popup-base_content");
            this.$head = this.$popup.children(".qui-popup-header");
            this.$okBtn = this.$head.children(".rbtn");
            this.$cancelBtn = this.$head.children(".lbtn");
            this.$title = this.$head.children(".title");

            this.$cover = $('<div class="qui-popup-cover"></div>');
            this.$cover.appendTo(document.body);
            this.bindEvent();
        },
        bindEvent: function() {
/* -- blur effect discarded for render efficiency considerations.
            this.$popup[0].addEventListener("transitionend", window.qyerUtil.runOneInPeriodOfTime(function() {
                if (status == "hide") {
                    d.$content.html("");
                    $("body > .qui-page").removeClass("qui-page-blur")
                } else if (status == "show") {
                    $("body > .qui-page").addClass("qui-page-blur")
                }
            }, 10), false);
*/
            this.$okBtn.on(qyerUtil.EVENT.CLICK, function() {
                if (para.onOK) {
                    if (para.onOK() !== false) {
                        _public.hide()
                    }
                }
            });
            this.$cancelBtn.on(qyerUtil.EVENT.CLICK, function() {
                if (para.onCancel) {
                    para.onCancel()
                }
                _public.hide()
            })
        },
        reset: function() {
            this.$popup[0].className = "qui-popup-base";
            this.$cover[0].className = "qui-popup-cover";
            this.$content.html("");
            this.$okBtn.prop("disabled", false).val("确定").removeAttr("data-bn-ipg");
            this.$cancelBtn.prop("disabled", false).val("取消").removeAttr("data-bn-ipg");
            this.$head.hide();

            this.setOption(para);
        },
        setOption: function(options) {

            var _setOption = {
                contentHTML: function() {
                    _private.$content.html(options.contentHTML)
                },
                okBtnText: function() {
                    _private.$okBtn.val(options.okBtnText)
                },
                okBtnIpg: function() {
                    _private.$okBtn.attr('data-bn-ipg', options.okBtnIpg)
                },
                okBtnDisabled: function() {
                    _private.$okBtn.prop("disabled", options.okBtnDisabled)
                },
                cancelBtnDisabled: function() {
                    _private.$cancelBtn.prop("disabled", options.cancelBtnDisabled)
                },
                cancelBtnText: function() {
                    _private.$cancelBtn.val(options.cancelBtnText)
                },
                cancelBtnIpg: function() {
                    _private.$cancelBtn.attr('data-bn-ipg', options.cancelBtnIpg)
                },
                title: function() {
                    _private.$title.html(options.title || "")
                },
                hasHead: function() {
                    //_private.$head[options.hasHead ? "show": "hide"]()
                    if(options.hasHead){
                        _private.$head.show();
                        _private.$content.css("padding-top","44px");
                    }else{
                        _private.$head.hide();
                        _private.$content.css("padding-top","");
                    }

                }
            };
            for (var prop in options) {
                if (_setOption[prop]) {
                    _setOption[prop]()
                }
            }
        }
    };

    _private.init();

    var _public = {
        show: function(options) {
            status = "show";
            para = options;
            
            _private.reset();

        /*
            if (!e.enableBodyScroll) {
                window.qyerUtil.disableBodyScroll();
            }
        */
            var f = ["qui-popup-base_show"];
            if (!para.type || para.type == 1) {
                f.push("qui-popup-base_type1");
                type = 1
            } else if (para.type == 2) {
                f.push("qui-popup-base_type2");
                type = 2
            }

            _private.$popup.show();
            _private.$cover.show();
            //$("body > .qui-page").addClass("qui-page-blur");

            if (typeof options.immediateEvent === 'function') {
                options.immediateEvent(_private.$content[0]);
            }

            setTimeout(function() {
                _private.$popup.addClass(f.join(" "));
                _private.$cover.addClass("qui-popup-cover_show")
                    .css('height', $(document).height());

                f.length = 0;
                f = null;
                if (typeof para.onShow === 'function') {
                    setTimeout(function() {
                        para.onShow()
                    }, 400)
                }
            }, 0);
        },
        hide: function() {
            status = "hide";

            _private.$popup.removeClass("qui-popup-base_show");
            _private.$cover.removeClass("qui-popup-cover_show");
            _private.$content.html("");
            //$("body > .qui-page").removeClass("qui-page-blur");

            if (para&&!para.enableBodyScroll) {
                window.qyerUtil.enableBodyScroll()
            }
            //setTimeout(function() {
                if (para&&typeof para.onHide == 'function') {
                    para.onHide();
                }
                _private.$popup.hide();
                _private.$cover.hide();
                para = null;
            //}, 400);
        },
        getContent: function() {
            return _private.$content[0]
        },
        setOption: function(options) {
            _private.setOption(options)
        }
    };
    return _public
});
