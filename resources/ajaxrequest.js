function getBlogList(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			//process the request return
			return JSON.parse(this.responseText);
		}
	};
	xhttp.open("GET", "backend.php?request=searchblog//", false);
	xhttp.send();
	if(xhttp.readyState == 4 && xhttp.status == 200)
		return JSON.parse(xhttp.responseText);
	else
		return [["1","error"],["2","reload"],["3","page"]];
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
