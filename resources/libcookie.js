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

function grabcookievalue(key)
{
    var ck = document.cookie;
    var cks = ck.split(';');
    for(
        var i = 0;
        i<cks.length;
        i++)
    {
	var ckss = cks[i].split("=");
	if(ckss[0] == key) {return ckss[1];}
    }
    return null;
}
