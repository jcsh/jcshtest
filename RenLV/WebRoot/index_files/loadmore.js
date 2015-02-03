define('common/ui/loadmore/loadmore', function(popup) {

// ====================================================

function LoadMore(a$div,aOption){
    this.$div = a$div;
    this.option = aOption;
    _pageNum = 1;//默认初始页码
    this.init();
}

LoadMore.prototype={
    $div:null,
    $loadBtn:null,
    option:null,

    init:function(){
        this.createBtn();
        this.bindEvt();
    },

    createBtn:function(){
        var data_bn_ipg = this.option.ipg ? 'data-bn-ipg="' + this.option.ipg + '"':'';
        this.$loadBtn = $('<p class="qui-paginationLoad"><a href="javascript:void(0)" ' + data_bn_ipg + '><span>'+(this.option.normalText||'加载更多')+'</span></a></p>');
        this.$div.append(this.$loadBtn);
    },

    bindEvt:function(){
        var _this = this;
        this.$loadBtn.on(qyerUtil.EVENT.CLICK,function(e){
            e.stopPropagation();
            if(_this.option.ipg){
                window.qyerUtil && window.qyerUtil.doTrackCode(_this.option.ipg);
            }
            if( _this._state == 0 || _this._state == 2 ){
                _this.setState(1);
                if(_this.option.onLoadMore){
                    _this.option.onLoadMore.call(_this.$div[0],++_this._pageNumber);
                }
            }
        });

        if(this.option.autoLoadMore){
            /*
            this.$div.on('scroll',qyerUtil.runOneInPeriodOfTime(function(){
                if( (_this.$div[0].scrollTop + _this.$div.height() ) >= ( _this.$div[0].scrollHeight - _this.$loadBtn.height() ) ) {
                    _this.$loadBtn.trigger(qyerUtil.EVENT.CLICK);
                }
            },500));
            */
            $(window).on('scroll',qyerUtil.runOneInPeriodOfTime(function(){
                if($(window).scrollTop() + $(window).height() >= _this.$div.find("p.qui-paginationLoad").offset().top) {
                    _this.$loadBtn.trigger(qyerUtil.EVENT.CLICK);
                }
            },500));
        }

    },

    _state:0,   // 0 正常，1 加载中， 2，错误，请重试
    setState:function( aState ){
        var s = ['qui-paginationLoad', 'loading', 'error'];
        this.$loadBtn[0].className = s[0];
        if(aState==0){
            this.$loadBtn.find('span').html(this.option.normalText||'加载更多');
        }
        else if(aState==1){
            this.$loadBtn.find('span').html(this.option.loadingText||'正在加载');
            this.$loadBtn.addClass(s[1]);
        }
        if(aState==2){
            this.$loadBtn.find('span').html(this.option.errorText||'加载失败，点击重新加载');
            this.$loadBtn.addClass(s[2]);
        }
        this._state = aState;
    },

    pushHTML:function(aHTML){
        if(this.option.el && this.$div.find(this.option.el).size() > 0){
            this.$div.find(this.option.el).append(aHTML);
        }else{            
            $(aHTML).insertBefore(this.$loadBtn);
        }
        this.setState(0);
    },

    removeBtn:function(){
        this.$loadBtn.hide();
    },

    addBtn:function(){
        this.$loadBtn.show();
    },

    _pageNumber:1,
    setPageNumber:function(pageNum){
        this._pageNumber = typeof pageNum === 'number' ? pageNum : 1;
    },
    pageNumber:function(num){
        if(typeof num !== 'undefined'){
            this.setPageNumber(num);
        }            
        return this._pageNumber;          
    },
    trigger:function(callback){
        this.$loadBtn.trigger(qyerUtil.EVENT.CLICK);
        if(typeof callback == 'function'){
            callback();
        }
    }
};

// ====================================================
Zepto.extend(Zepto.fn,{
    qyerLoadMore:function(aOption,aPram1,aPram2){
        var optionType = $.type(aOption);
        var $this;
        if( optionType== 'object' || optionType== 'undefined' ){
            $.each(this,function(){
                $this = $(this);
                if( !this.__loadMore__ ){
                    this.__loadMore__ = new LoadMore($this,aOption);
                }
            });
        }
        else if( optionType == 'string' ){
            var cmds = ['pushHTML','setState','removeBtn','addBtn','pageNumber','trigger'],pageNumber=[];
            if( cmds.indexOf(aOption) != -1 ){
                $.each(this,function(){
                    $this = $(this);
                    pageNumber.push(this.__loadMore__[aOption](aPram1,aPram2));
                });
                switch (aOption){
                case 'pageNumber':
                    return pageNumber;
                default:
                    return this;
                }
            }
        }
    }
});
// ====================================================

});