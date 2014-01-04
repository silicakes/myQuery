//a small example of some of the implemented methods.
var mqDemo = (function($) {
	var overlay = document.getElementById("overlay");
	overlay.addEventListener("click", function(e) {
		var $el = $(e.target);
		// preventing the event logic running on the children
		// using the && syntax, the right side will only be evaluated if the left side returns true,
		// same as
		// if(e.target === e.currentTarget) {
		//	$el.toggleClass("overlay");	
		// }
		e.target === e.currentTarget && $el.toggleClass("overlay");
	});
}(myQuery))
