testwindow = document.getElementById("testwindow");
function movewindow(windowid, increasex, increasey){
	currentwindow = document.getElementById(windowid);
	cwbounds = currentwindow.getBoundingClientRect()
	newx = cwbounds.left + increasex
	newy = cwbounds.top + increasey
	console.log(newx, newy, cwbounds.left, cwbounds.top);
	currentwindow.style.left = newx + "px"
	currentwindow.style.top = newy + "px"
}
