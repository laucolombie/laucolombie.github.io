
var KONBINIMOBILEAD = (function () {

	//if element is an image
	var image = document.createElement('img'),
		articles = $("article.item");
		
		for ( var i = 0; i < articles.length; i++ ) {
			var article = articles[i];
			//remove bottom margin
			article.style.marginBottom = "0px";
			
		}

	return {
		insertImageBefore:function(node) {

			//console.log($("article.item").length);

			var targetedContainer = document.getElementById('sectionMobileAd');
			targetedContainer.style.backgroundColor = "white";

			node.insertBefore(image,targetedContainer);
		},
		setImageAttributes:function(imgPath,imgTitle) {
			image.setAttribute('src',imgPath);
			image.setAttribute('title',imgTitle);
			image.style.position = 'fixed';
			image.style.top = '200px';
		}
 	};

})();


KONBINIMOBILEAD.insertImageBefore(document.getElementById('testMobileAd'));
KONBINIMOBILEAD.setImageAttributes('test.jpg','test image');