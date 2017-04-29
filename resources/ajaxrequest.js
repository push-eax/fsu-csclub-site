function getBlogList(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=searchblog//", true);
	xhttp.send();
	return xhttp
}

function getBlogById(idnum){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			return JSON.parse(this.responseText);
		}
	};
	xhttp.open("GET", "backend.php?request=getblog//"+idnum, false);
	xhttp.send();
}
