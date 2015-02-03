var bookingtrack=new function(){
    var DOMAIN = "qyer.com";
    function createCookie(name,value,mins) {
        if (mins) {
          var date = new Date();
          date.setTime(date.getTime()+(mins*60*1000));
          var expires = "; expires="+date.toGMTString();
        }
        else var expires = "";
        document.cookie = name+"="+value+expires+"; path=/; domain=" + DOMAIN;
    }
    
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
    
    function guidGenerator() {
        var S4 = function() {
          return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }
    
    this.getguid=function(){
        createCookie( "_guid", readCookie( "_guid" ) || guidGenerator(), 365*2*24*60 );
        var guid = readCookie( "_guid" );
        return guid;
    }
    
}

var guid = bookingtrack.getguid();

var city_booking_url=$("#city_booking_url").attr("href");
var bookinggetuid_num=0;

function uidisready(){
    bookinggetuid_num++;
    if(typeof QYER.uid == 'undefined' && bookinggetuid_num<10){
        setTimeout(uidisready(),200);
    }else{
        
        setbookingtrack();        
    }
}

function setbookingtrack(){
    
    if(typeof QYER.uid != 'undefined' && QYER.uid){
        
        //酒店页搜索框
        $("#hotel_bookings_form_label").val("uid_"+QYER.uid);
        
        //酒店页下方
        $(".column_hotCity_list").find("a").each(function(){
            var src_y=$(this).attr("href");
            $(this).attr("href",src_y+";label=uid_"+QYER.uid);
        });
        
        //poi搜索
        $("#poi_bookings_form_label").val("uid_"+QYER.uid);
        //全站首页
        $("#index_bookings_form_label").val("uid_"+QYER.uid);
        
        //城市首页
        if(typeof city_booking_url!='undefined' && city_booking_url){
            city_booking_url = city_booking_url.replace("label=mainupbutten","label=uid_"+QYER.uid);
            $("#city_booking_url").attr("href",city_booking_url);
        }
        
        
    }else{
        
        $("#hotel_bookings_form_label").val("guid_"+guid);
        
        
        $(".column_hotCity_list").find("a").each(function(){
            var src_y=$(this).attr("href");
            $(this).attr("href",src_y+";label=guid_"+guid);
        });
        
        
        $("#poi_bookings_form_label").val("guid_"+guid);
        $("#index_bookings_form_label").val("guid_"+guid);
        
        if(typeof city_booking_url!='undefined' && city_booking_url){
            city_booking_url = city_booking_url.replace("label=mainupbutten","label=guid_"+guid);
            $("#city_booking_url").attr("href",city_booking_url);
        }
        
    }
}

uidisready()






