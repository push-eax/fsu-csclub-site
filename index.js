function onmenubover(){
	document.getElementById("menubutton").src="beta-start-button-hover.png";
}
function onmenubout(){
	document.getElementById("menubutton").src="beta-start-button.png";
}
var menuopen = false;
function openmenu(){
	if(menuopen == false){
		document.getElementById("menu").style.display='block';
		document.getElementById("menubackground").style.display='block';
		menuopen = true
	}
	else{
		document.getElementById("menu").style.display='none';
		document.getElementById("menubackground").style.display='none';
		menuopen = false
	}
}
