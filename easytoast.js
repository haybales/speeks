function toast(style, msg){
  	$("#toast").addClass("notification");
  	if(style==="sucess"){
  		var styleclass="sucess"
  		$("#toast").addClass(styleclass);
  	}
  	if(style==="error"){
  		var styleclass="error"
  		$("#toast").addClass(styleclass);
  	}
  	$("#toast").removeClass("hidden");
  	$("#toast").html(msg);
  	$("#toast").on(
    "webkitAnimationEnd oanimationend msAnimationEnd animationend",
    function() {
        $(this).removeClass("notification");
        $(this).removeClass(styleclass);
        $(this).addClass("hidden");
    }
    );
  }

$.fn.greenify = function() {
  this.each(function() {
    $(this).html( 
      $(this).html().replace(/(^|\s)&gt;(.*?)(<br( )*(\/)?( )*>|\n|$)/g,'$1<span class=\'imply\'>>$2</span>$3')       
    );
  });
  return $(this);
};