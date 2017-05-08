/*
   libcookie.js

   a simple cookie management library

   templates to start with:
   	storecookie("key", "value");
	deletecookie("key");
	commitcookies();
*/

function storecookie(key, value){
	var ck = key+"="+value+";path=/;";
	document.cookie = ck;
}

function deletecookie(key){
	var date = new Date();
	d.setTime(d.getTime() + (daystoexpire*24*60*60*1000));
	var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = key+";"+expires;
}

function grabcookievalue(key){
	var ck = document.cookie;
	var cks = ck.split(';');
	for(var i = 0; i<cks.length; i++){
		var ckss = cks[i].split("=");
		if(ckss[0] == key) {return ckss[1];}
	}
	return null;
}
