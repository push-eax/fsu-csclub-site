function onmenubover(){
	document.getElementById("menubutton").src="beta-start-button-hover.png";
}
function onmenubout(){
	document.getElementById("menubutton").src="beta-start-button.png";
}
var menuopen = false;
function openmenu(){
	if(menuopen == false){
		document.getElementById("menubackground").style.display='block';
		document.getElementById("menu").style.height='80%';
		menuopen = true
		document.getElementById("menubutton").style.transform='rotate(180deg)';
	}
	else{
		document.getElementById("menubackground").style.display='none';
		menuopen = false
		document.getElementById("menu").style.height='0px';
		document.getElementById("menubutton").style.transform='rotate(0deg)';
	}
}
