define("common/ui/textArea/textArea",function(){var a=jQuery;var b=[".qui-textArea { display: inline-block; *display: inline; zoom: 1; }",".qui-textArea .red { color: red; }",".qui-textArea textarea,",".qui-textArea input { word-break:break-all; transition: height 0.2s; -webkit-transition: height 0.2s; -moz-transition: height 0.2s; -ms-transition: height 0.2s; box-sizing: border-box; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; -ms-box-sizing: border-box; }",".qui-textArea .autoHeight { overflow: hidden; }"].join("");window.qyerUtil.insertStyle(b);function c(a){this.$obj=a.$obj;this.timer=null;this.option=a.option;this.init()}c.prototype={$obj:null,$textarea:null,$cloneTextarea:null,initHeight:null,maxHeight:null,timer:null,option:null,init:function(){this.$textarea=this.$obj.find("textarea").size()?this.$obj.find("textarea"):this.$obj.find("input");if(this.$obj.attr("data-width")){this.$textarea.css("width",this.$obj.attr("data-width"));this.initHeight=this.$obj.attr("data-height")||this.$textarea.outerHeight()}if(this.$obj.attr("data-height")){this.$textarea.css("height",this.$obj.attr("data-height"));this.initWidth=this.$obj.attr("data-width")||this.$textarea.outerWidth()}if(this.option&&this.option.autoIncreaseHeight===true){this.$cloneTextarea=this.createClone(this.$textarea)}this.updateUI();this.bindEvent()},createClone:function(a){if(!a)return;var b=this.$textarea.clone(true);b.css({position:"absolute",left:"-9999em",overflow:"auto"});b.insertAfter(a);return b},bindEvent:function(){var a=this;this.$obj.keyup(function(b){a.registEvent()})},registEvent:function(){var a=this;window.clearTimeout(this.timer);this.timer=window.setTimeout(function(){a.updateUI(true)},100)},updateUI:function(b){var c=this.$textarea,d=this.$cloneTextarea,e=this.$obj.find(".max"),f=this.$obj.find(".min"),g=this.$obj.find(".current"),h=this.$obj.find(".exceed"),i=this.option.max,j=this.option.min,k=c.val().length;if(d){var l,m;d[0].value=c.val();l=parseInt(d[0].scrollHeight,10);m=a.isNumeric(this.$obj.attr("data-max-height"))?this.$obj.attr("data-max-height"):99999;if(l>this.initHeight){c.addClass("autoHeight");if(l>=m){l=m;c.removeClass("autoHeight")}}else{l=this.initHeight}c.css("height",l);l=m=null}if(i==-1){if(k<j){g.addClass("red");if(k==0){g.removeClass("red")}}else{g.removeClass("red")}}else{if(k<j||k>i){g.addClass("red");if(k==0){g.removeClass("red")}}else{g.removeClass("red")}}g.html(k);e.html(i);f.html(j);$aTextArea=d=e=g=$left=i=j=k=left=null},isValidate:function(){var a=this.$obj.find("textarea").val().length;return this.option.max==-1?a>=this.option.min:a>=this.option.min&&a<=this.option.max},getTextArea:function(){return this.$obj.find("textarea")[0]},unload:function(){this.$cloneTextarea.remove()}};a.fn.extend({qyerTextArea:function(b){var d,e;d={isValidate:function(a){return a.data("_qyerTextArea").isValidate()},getValue:function(a){return a.data("_qyerTextArea").getTextArea().value},unload:function(a){return a.data("_qyerTextArea").unload()}};e=a.type(b);if(e=="object"||e=="undefined"){a.each(this,function(d,e){var f,g;f=a(e);g=a.extend({},b);g.max=typeof g.max!="undefined"?g.max:-1;g.min=typeof g.min!="undefined"?g.min:0;g.width=a.isNumeric(f.attr("data-width"))==true?f.attr("data-width"):null;g.height=a.isNumeric(f.attr("data-height"))==true?f.attr("data-height"):null;if(!f.data("_qyerTextArea")){f.data("_qyerTextArea",new c({$obj:f,option:g}))}f=g=null})}else if(e=="string"){var f,g,h=[];g=arguments;a.each(this,function(c,e){f=a(e);if(d[b]){var i=qyerUtil.sliceArguments(g,1);i.unshift(f);h.push(d[b].apply(f,i));i=null}});f=g=null;if(h.length){return h.length==1?h[0]:h}}d=e=null;return this}})});