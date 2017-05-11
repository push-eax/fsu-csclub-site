/*
   libcookie.js

   a simple cookie management library

   Initially this looked like a much more daunting task, so this library was created. It
   now serves as a quick way to take care of basic cookie tasks without rewriting code
   over and over again.
*/

/*
 * storecookie(key, value)
 * 
 * A simple cookie storage function. Takes the key and value, assigns them to the
 * document.cookie variable with the correct path. Does not store an expiration date.
 * TODO: add this.
 * 
 * Arguments:
 * 	key (string)
 * 		The cookie key
 * 	value (string)
 * 		the value to store in the cookie
 */
function storecookie(key, value){
	var ck = key+"="+value+";path=/;";
	document.cookie = ck;
}

/*
 * deletecookie(key)
 * 
 * Deletes the cookie specified by the string key by setting its expiration date to the
 * UNIX epoch
 * 
 * Arguments:
 * 	key (string)
 * 		the key of the cookie to delete
 */
function deletecookie(key){
	var date = new Date();
	d.setTime(d.getTime() + (daystoexpire*24*60*60*1000));
	var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
	document.cookie = key+";"+expires;
}

/*
 * grabcookievalue(key)
 * 
 * gets the value of the specified cookie.
 * 
 * arguments:
 * 	key (string)
 * 		the key of the cookie to get.
 * 
 * returns:
 * 	value (string)
 * 		the value assigned to the key specified.
 */
function grabcookievalue(key){
	var ck = document.cookie;
	var cks = ck.split(';');
	for(var i = 0; i<cks.length; i++){
		var ckss = cks[i].split("=");
		if(ckss[0] == key) {return ckss[1];}
	}
	return null;
}
