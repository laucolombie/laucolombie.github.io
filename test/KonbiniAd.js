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
			hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed,
			isPortrait: window.matchMedia("(orientation:portrait)")
		});


		return utility;

	})();

	function KonbiniAd(name,parentNode,options,clicktag) {

		this.wrapper = document.createElement('div');
		this.openArea = document.createElement('div');
		this.openAreaCloseButton = document.createElement('div');

		if (clicktag) this.clicktag = clicktag;

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
			this.options.openAreaNode.style.width = '100%';
			this.options.openAreaNode.style.position = 'relative';
			this.options.openAreaNode.setAttribute('id','openArea');

			this.addCloseButton();


			//ADAPT LAYOUT TO PAGE
			document.getElementById('wrapper').style.background = 'transparent';
		    document.getElementById('wrapper').style.display = 'block';
		    document.getElementById('wrapper').style.overflow = 'hidden';
		    document.getElementById('wrapper').style.width = '100%';

		    jQuery('.wrapper-inner')[0].style.background = 'transparent';
		    jQuery('.wrapper-inner')[0].style.padding = '0';
		    jQuery('.entry-content')[0].style.background = '#fff';

		    //apply padding
		    //console.log(jQuery('.entry-content p'));
		    //jQuery('.entry-content p').style.padding = '10px';
		    jQuery('.container-header')[0].style.marginBottom = '0px';
		    jQuery('.entry-header')[0].style.background = '#fff';

			//adapt layout for the ad
			//doesn't work 
			jQuery('.entry-shares')[0].style.backgroundColor = '#fff !important';
			console.log(jQuery('.entry-shares')[0].style.backgroundColor);
			jQuery('.mobile')[0].style.backgroundColor = '#fff';
			document.getElementById('author-bio-box').style.backgroundColor = '#fff !important';
			
		},

		setWallpaperImage: function(images) {
			this.images = images;
			this.applyImage();
	  		this.wrapper.style.width =  "100%";
	  		this.wrapper.style.backgroundSize = "100%";
	  		this.wrapper.style.height = "100%";
	  		this.wrapper.style.left = '0px';
	  		this.wrapper.style.top = '0px';
	  		this.wrapper.style.position = 'fixed';
		  	this.wrapper.style.backgroundPosition = '0px 0px';
		  	this.wrapper.style.backgroundRepeat = 'no-repeat no-repeat';
		  	this.wrapper.style.backgroundAttachment = 'scroll';
		  	this.wrapper.style.backgroundColor = 'transparent';
		  	this.wrapper.style.display ='block';
		  	this.wrapper.style.overflow = 'hidden';
		},

		initEvents:function(remove) {

			var eventType = remove ? utils.removeEvent : utils.addEvent;

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			eventType(this.options.openAreaNode, 'click', this, true);

			eventType(this.openAreaCloseButton, 'click', this, true);

		},
		resize: function(e) {	
			this.applyImage();
		},
		applyImage: function() {
			if (utils.isPortrait.matches) {
				this.wrapper.style.backgroundImage = 'url("' + this.images.path1 + '")';
			} else {
				this.wrapper.style.backgroundImage = 'url("' + this.images.path2 + '")';
			}
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
						if (e.target === this.openAreaCloseButton) {
							this.options.openAreaNode.style.height = '0px';
							this.wrapper.style.display = this.openAreaCloseButton.style.display = 'none';
						} else {
							if (this.clicktag) window.open(this.clicktag,'_blank');
						}
						
					}
				break;
			}
		},

		addCloseButton: function() {

			this.options.openAreaNode.appendChild(this.openAreaCloseButton);
			this.openAreaCloseButton.style.width = '40px';
			this.openAreaCloseButton.style.height = '30px';
			this.openAreaCloseButton.style.backgroundColor = '#484848';
			this.openAreaCloseButton.style.position = 'absolute';
			this.openAreaCloseButton.style.top = '-10px';
			this.openAreaCloseButton.style.right = '0px';
			this.openAreaCloseButton.style.display = 'block';
			this.openAreaCloseButton.setAttribute('class','ad-close');


			


		}

	};

	window.KonbiniAd = KonbiniAd;

})(window, document, Math);

//close button
//clickable area
//style='text-align: center; position: absolute; top: 0px; width: 100%; height: 100%; z-index: 100; background-color: transparent; background-position: initial initial; background-repeat: initial initial'
//use media queries?

