/**
 * @module KonbiniAd
 **/
(function (window, document, Math) {

	var utils = (function () {

		var utility = {};

		utility.extend = function (target, obj) {
			for ( var i in obj ) {
				target[i] = obj[i];
			}
		};
		//add event
		utility.addEvent = function (el, type, fn, capture) {
			el.addEventListener(type, fn, !!capture);
		};
		//remove event
		utility.removeEvent = function (el, type, fn, capture) {
			el.removeEventListener(type, fn, !!capture);
		};

		utility.extend(utility, {
			hasTouch: 'ontouchstart' in window,
			hasPointer: window.PointerEvent || window.MSPointerEvent // IE10 is prefixed
		});

		return utility;

	})();

	function KonbiniAd(name,parentNode,options) {

		this.wrapper = document.createElement('div');
		this.openArea = document.createElement('div');

		this.options = {
			openAreaNode: document.getElementById('billboard'),
			openAreaNodeHeight: '200px'
		};
		//overwrite options
		for ( var i in options ) {
			this.options[i] = options[i];
		}

		// public function
		this.getParentNode = function () {
			return parentNode;
		};

		this.init();
	}

	KonbiniAd.prototype = {

		init: function () {
			//append ad wrapper to parent node
			this.getParentNode().appendChild(this.wrapper);
			//make sure that the parent container is displayed 
			this.getParentNode().style.display = 'inline';

			this.options.openAreaNode.style.height = this.options.openAreaNodeHeight;
			
		},
		setWallpaperImage: function(path,width,height) {
			this.wrapper.style.backgroundImage = 'url("' + path + '")';
	  		this.wrapper.style.width =  width;
	  		this.wrapper.style.backgroundSize = width;
	  		this.wrapper.style.height = height;
	  		this.wrapper.style.left = '0px';
	  		this.wrapper.style.top = '0px';
	  		this.wrapper.style.position = 'fixed';
		  	this.wrapper.style.backgroundPosition = '0px 0px';
		  	this.wrapper.style.backgroundRepeat = 'no-repeat no-repeat';
		  	this.wrapper.style.backgroundAttachment = 'scroll';
		  	this.wrapper.style.backgroundColor = 'transparent';
		},
		initEvents:function(remove) {

			var eventType = remove ? utils.removeEvent : utils.addEvent;

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			eventType(this.options.openAreaNode, 'click', this, true);

		},
		resize: function(e) {	
			console.log(window.alert('e'));
		},
		handleEvent: function (e) {
			switch ( e.type ) {
				case 'orientationchange':
				case 'resize':
					this.resize(e);
				break;
				case 'click':
					if ( !e._constructed ) {
						e.preventDefault();
						e.stopPropagation();
						
					}
				break;
			}
		}

	};

	window.KonbiniAd = KonbiniAd;

})(window, document, Math);

//close button
//clickable area
//style='text-align: center; position: absolute; top: 0px; width: 100%; height: 100%; z-index: 100; background-color: transparent; background-position: initial initial; background-repeat: initial initial'
//use media queries?

