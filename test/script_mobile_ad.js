
var KONBINIMOBILEAD = (function () {

	var ad_container = document.getElementById('5196125');
	
	ad_container.style.width = '100%';
	ad_container.style.height = '200px';
	ad_container.style.backgroundImage = 'url(test.jpg)';

	//if element is an image
	// var image = document.createElement('img'),
	// 	articles = $("article.item");
		
	// 	for ( var i = 0; i < articles.length; i++ ) {
	// 		var article = articles[i];
	// 		//remove bottom margin
	// 		article.style.marginBottom = "0px";
			
	// 	}

	return {
		appendImage:function(node) {
			node.appendChild(image);
		},
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
			image.style.top = '0px';
		}
 	};

})();


//KONBINIMOBILEAD.appendImage(document.getElementById('wrapper'));
//KONBINIMOBILEAD.insertImageBefore(document.getElementById('testMobileAd'));
//KONBINIMOBILEAD.setImageAttributes('test.jpg','test image');