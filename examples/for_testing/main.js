window.addEventListener("DOMContentLoaded", function() {

	function video(vid) {
		var res = {};
		res.self = vid;
		res.greet =  function() {
				return "hello "+this.self;
		}
		res.greetp = function() {
			return this.greet() + " i missed you";
		}
		return res;
	}
	var a = video("Tryggvi");
	console.log(a.greet());
	console.log(a.greet());
	console.log(a.greetp());
	console.log(a.greetp());

	var b = video("Other");
	console.log(b.greet());
	console.log(b.greet());
	console.log(b.greetp());
	console.log(b.greetp());

}, false);
