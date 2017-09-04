/*
  libcookie.js

  a simple cookie management library

  Takes care of deleting cookies by setting expiration dates, and store/delete
  functions.
*/

function storecookie(
    key,
    value,
    daystoexpire)
{
    var date = new Date();
    date.setTime(
        date.getTime() +
            (daystoexpire *
             24 *
             60 *
             60 *
             1000));
    var cookie =
        key +
        "=" +
        value +
        ";expires=" +
        date.toString() +
        ";path=/;";
    document.cookie = cookie;
}

function deletecookie(key)
{
    var date = new Date();
    date.setTime(date.getTime() + (daystoexpire*24*60*60*1000));
    var expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = key+";"+expires;
}

function readCookie(key)
{
    var name = cookieName + "=";
    var allCookies = decodeURIComponent(document.cookie).split(';');
    for(
        var cookieIndex = 0;
        cookieIndex < allCookies.length;
        cookieIndex++)
    {
	var currentCookie = allCookies[cookieIndex];
	while (currentCookie.charAt(0) == ' ')
        {
	    currentCookie = currentCookie.substring(1);
	}
	if (currentCookie.indexOf(name) == 0)
        {
	    return currentCookie.substring(
                name.length,
                currentCookie.length);
	}
    }
    return null;
}
