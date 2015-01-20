/**
 * @module KonbiniAd
 **/
function KonbiniAd(name,width,height) {

	var _nodeParent;

	// public function
	this.getName = function () {
		return name;
	};

	// public function
	this.getWidth = function () {
		return width;
	};

	// public function
	this.getHeight = function () {
		return height;
	};
}

KonbiniAd.prototype = (function () {

	var _container1 = document.createElement('div'),
		_container2 = document.createElement('div'),
		_container1Style = _container1.style;

  	//public
  	var appendAdTo = function (node) {

  		_nodeParent = node;
  		_nodeParent.appendChild(_container1);

  		//make sure that the parent container is displayed 
  		if(_nodeParent.getAttribute('id') === 'wallpaper') {
  			//default value 
  			_nodeParent.style.display = 'inline';
  		}
 
  	};

  	//public
  	var setBgImage = function(path,width,height) {

  		_container1Style.backgroundImage = 'url("' + path + '")';
  		_container1Style.width = _container1Style.backgroundSize = width;
  		_container1Style.height = height;
  		_container1Style.left = -200 + 'px';
  		_container1Style.top = '0px';

  	}

  	//public
  	var setStyles = function (node) {

  		if(node) {
  			node.style.background = 'transparent';
  		} else {
  			console.log('no node');
	  		//mobile device
	  		_container1Style.position = 'fixed';
	  		_container1Style.backgroundPosition = '0px 0px';
	  		_container1Style.backgroundRepeat = 'no-repeat no-repeat';
	  		_container1Style.backgroundAttachment = 'scroll';
	  		_container1Style.backgroundColor = 'transparent';
  		}

  	};

  	//public
  	var insertAdBefore = function (node) {
  		//add it after header tag
  	};

  	//public
  	var modifyNode = function (node) {
  		

  	};

  	return {
    	appendAdTo: appendAdTo,
    	setStyles: setStyles,
    	setBgImage: setBgImage,
    	insertAdBefore: insertAdBefore,
    	modifyNode: modifyNode
    }
}());

//close button
//style='text-align: center; position: absolute; top: 0px; width: 100%; height: 100%; z-index: 100; background-color: transparent; background-position: initial initial; background-repeat: initial initial'
//use media queries?

