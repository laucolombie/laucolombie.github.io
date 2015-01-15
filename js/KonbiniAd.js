//SVG
var KONBINIAD = (function () {

	var container = document.createElement('svg');

	return {
		appendAdContent:function(node) {
			node.appendChild(container);
		}
 	};

	console.log('hello konbini ad');

})();

KONBINIAD.appendAdContent(document.getElementById('ad'));

