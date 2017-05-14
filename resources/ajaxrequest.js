function getBlogList(){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=searchblog//", true);
	xhttp.send();
	return xhttp
}

function getBlogById(idnum){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "backend.php?request=getblog//"+idnum, true);
	xhttp.send();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			return this.responseText;
		}
	};
}


