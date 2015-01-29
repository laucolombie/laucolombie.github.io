/**
 * @module KonbiniAd
 **/
(function (window, document, Math) {

	"use strict";

	var rAF = window.requestAnimationFrame	||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function (callback) { window.setTimeout(callback, 1000 / 60); };

	var _self, adIsInViewport = false;

	var utils = (function () {

		var utility = {};

		utility.extend = function (target, obj) {
			for ( var i in obj ) {
				target[i] = obj[i];
			}
		};
		//add event
		utility.addEvent = function (el, type, fn, capture) {
			//document.attachEvent
			el.addEventListener(type, fn, !!capture);
		};
		//remove event
		utility.removeEvent = function (el, type, fn, capture) {
			el.removeEventListener(type, fn, !!capture);
		};
		//create a new custom event 
		utility.createCustomEvent = function(el,type,fn,capture) {
			var evt = new Event(type);
			el.addEventListener(type, fn, !!capture);
			return evt;
		};
		utility.addStyleSheet = function() {
			var style = document.createElement("style");
			// WebKit hack :(
			style.appendChild(document.createTextNode(""));
			// Add the <style> element to the page
			document.head.appendChild(style);
			return style.sheet;
		};
		utility.addCSSRule = function(sheet, selector, rules, index) {
			if("insertRule" in sheet) {
				sheet.insertRule(selector + "{" + rules + "}", index);
			}
			else if("addRule" in sheet) {
				sheet.addRule(selector, rules, index);
			}
		};
		utility.extend(utility, {
			hasTouch: 'ontouchstart' in window,
			hasPointer: window.PointerEvent || window.MSPointerEvent, // IE10 is prefixed,
			isPortrait: window.matchMedia("(orientation:portrait)"),
			hasModernizr: window.Modernizr ? true : false,
			hasJQuery: window.jQuery ? true : false
		});
		utility.viewport = function() {

			var e = window,
				a = 'inner';
			if (!('innerWidth' in window)) {
				a = 'client';
				e = document.documentElement || document.body;
			}

			return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }

		};
		utility.getNodePosition = function(elm) {

			var xPos = 0,
				yPos = 0;

			    while(elm) {
			        xPos += (elm.offsetLeft - elm.scrollLeft + elm.clientLeft);
			        yPos += (elm.offsetTop - elm.scrollTop + elm.clientTop);
			        elm = elm.offsetParent;
    			}
    		
    		return { x: xPos, y: yPos };

		};

		return utility;

	})();

	function KonbiniAd(name,parentNode,options,clicktag) {

		_self = this,
				this.ticking = false;

		this.imgWrapper = document.createElement('div');
		this.openAreaCloseButton = document.createElement('div');
		this.openAreaOpenButton = document.createElement('div');

		this.imgWrapper.setAttribute('id','ad_image');

		//style sheet 
		this.styleSheet = utils.addStyleSheet();

		if (clicktag) this.clicktag = clicktag;

		this.options = {
			openWindow: document.getElementById('billboard'),
			openWindowH: 250,
			enableTick: false
		};

		//overwrite options
		for ( var i in options ) {
			this.options[i] = options[i];
		}

		// public function
		this.getParentNode = function () {
			return parentNode;
		};

	}

	KonbiniAd.prototype = {

		init: function () {	

			//init events
			this.initEvents();

			this.resize();

			//append ad wrapper to parent node
			this.getParentNode().appendChild(this.imgWrapper);

			//make sure that the parent container is displayed 
			this.getParentNode().style.display = 'inline';

			this.options.openWindow.style.height = this.options.openWindowH + 'px';
			this.options.openWindow.style.width = '100%';
			this.options.openWindow.style.position = 'relative';
			this.options.openWindow.setAttribute('id','openArea');

			//ADD CLOSE AND OPEN BUTTON
			this.addCloseButton();
			this.addOpenButton();

			//ADAPT LAYOUT TO PAGE
			document.getElementById('wrapper').style.background = 'transparent';
		    document.getElementById('wrapper').style.display = 'block';
		    document.getElementById('wrapper').style.overflow = 'hidden';
		    document.getElementById('wrapper').style.width = '100%';

		    //////////////// CHANGE PLEASE
		    //check if the ad is visible (can be used for tracking and optimisation)
		    var openWposY = utils.getNodePosition(this.options.openWindow).y,
			//hardcoded - please change it really
			elm = document.getElementById('ad_image');
			//here you need to ad another condition // maybe do a function at best
			if (openWposY <= - this.options.openWindowH) {
				adIsInViewport = false;
			} else {
				adIsInViewport = true;
			}

			window.dispatchEvent(this.readyEvent);
			
		},

		setWallpaperImage: function(images) {

			this.images = images;
			this.applyImage();
			utils.addCSSRule(this.styleSheet,"#ad_image","position:fixed; background-color:transparent; display:block; overflow: hidden");
			
	  		this.imgWrapper.style.width =  "100%";
	  		this.imgWrapper.style.backgroundSize = "cover";
	  		this.imgWrapper.style.height = "100%";
	  		this.imgWrapper.style.left = '0px';
	  		this.imgWrapper.style.top = '0px';
		  	this.imgWrapper.style.backgroundPosition = '0px 0px';
		  	this.imgWrapper.style.backgroundRepeat = 'no-repeat no-repeat';
		  	this.imgWrapper.style.backgroundAttachment = 'scroll';
		  	
		},

		initEvents:function(remove) {

			var eventType = remove ? utils.removeEvent : utils.addEvent;

			this.readyEvent = utils.createCustomEvent(window,'ready',this.handleEvent);
			this.tickEvent = utils.createCustomEvent(window,'tick',this.handleEvent);

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			eventType(this.options.openWindow, 'click', this, true);

			eventType(this.openAreaCloseButton, 'click', this, true);
			eventType(this.openAreaOpenButton, 'click', this, true);


			var update = function() {
				
				var openWposY = utils.getNodePosition(_self.options.openWindow).y,
					//hardcoded - please change it really
					elm = document.getElementById('ad_image');
				
				if (openWposY <= - _self.options.openWindowH + 10) {

					// _self.ticking = true

					elm.style.opacity = '0';
					elm.style.display = 'none';
					adIsInViewport = false;

				} else if (openWposY < - _self.options.openWindowH && openWposY >= - _self.options.openWindowH - 10) {
					_self.ticking = false;
				} else {
					if (!adIsInViewport) {
						elm.style.display = 'block';
						jQuery(elm).animate({
							opacity: "1",
						},500, "linear", function() {
		 					
						});
						adIsInViewport = true;
					}
				}

				requestTick();
				
			};

			var requestTick = function() {

				if (!_self.ticking) {
					rAF(update);
					//_self.ticking = true;
				}
			};

			if (utils.hasTouch && this.options.enableTick) {
				requestTick();
			}

		},
		resize: function() {	

			this.applyImage();
			//get the width and height of the viewport:
			if (utils.hasJQuery) {
				//var viewportWidth = jQuery(window).width();
				//var viewportHeight = jQuery(window).height();
				//console.log(viewportWidth);
				//console.log(viewportHeight);
			}
		},
		applyImage: function() {
			//console.log('apply');
			if (utils.isPortrait.matches) {
				this.imgWrapper.style.backgroundImage = 'url("' + this.images.urlmp + '")';
			} else {
				this.imgWrapper.style.backgroundImage = 'url("' + this.images.urlml + '")';
			}
		},
		handleEvent: function (e) {
			switch ( e.type ) {
				case 'ready':
					//window.setTimeout(function(){ 
					// 	jQuery('.entry-shares')[0].style.background = '#fff';
					// 	jQuery('.addthis_toolbox')[0].style.background = '#fff !important';
					//}, 500);
				break;
				case 'orientationchange':
				case 'resize':
					this.resize();
				break;
				case 'click':
					if ( !e._constructed ) {
						e.preventDefault();
						e.stopPropagation();	
						if (e.target === this.openAreaCloseButton) {
							this.animate("close");
						} else if (e.target === this.openAreaOpenButton) {
							this.animate("open");
						} else {
							if (this.clicktag) window.open(this.clicktag,'_blank');
						}
					}
				break;
			}
		},
		//think of one parameter to choose the close button color
		addCloseButton: function() {

			this.options.openWindow.appendChild(this.openAreaCloseButton);

			this.openAreaCloseButton.setAttribute('class','ad-close');
			
			utils.addCSSRule(this.styleSheet,".ad-close","width:40px; height:30px; background-color:#484848; position:absolute; top:5px; right:5px; display:block; cursor:pointer");
			utils.addCSSRule(this.styleSheet,".ad-close::before", "-moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);");
			utils.addCSSRule(this.styleSheet,".ad-close::after", "-moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -webkit-transform: rotate(135deg); transform: rotate(135deg);");
			utils.addCSSRule(this.styleSheet,".ad-close::before, .ad-close::after", "content: ''; position: absolute; top: 14px; left: 10px; display: inline-block; width: 22px; height: 3px; background-color: #fff; -moz-transition: -moz-transform 250ms; -webkit-transition: -webkit-transform 250ms; transition: transform 250ms;");

		},
		addOpenButton: function() {
			if (utils.hasJQuery) { 
				jQuery(this.options.openWindow).after(this.openAreaOpenButton);
				this.openAreaOpenButton.setAttribute('class','ad-open');
				utils.addCSSRule(this.styleSheet,".ad-open","width:100%; height:0px;background-color:#fff; opacity:0; line-height: 40px; font-size: 16px; text-align:right; padding-right:10px; cursor:pointer; border-bottom: 1px solid #ccc");
				this.openAreaOpenButton.innerHTML = 'Afficher la pub';
			} else {

			}
		},
		animate: function(status) {
			switch (status) {
				case "close":
					if (utils.hasJQuery) {
						//close open area window
						jQuery(this.options.openWindow).animate({
							height: "0px",
						},300, "linear", function() {
		 
						});
						//hide close button
						jQuery(".ad-close").animate({
							opacity: "0",
						},300, "linear", function() {
		 					this.style.display = 'none';
						});
						//show open button
						jQuery(".ad-open").animate({
							height: "40px",
							opacity: "1"
						},300, "linear", function() {
		 					
						});
					}
				break;
				case "open":
					if (utils.hasJQuery) {
						//show open area window
						jQuery(this.options.openWindow).animate({
							height: this.options.openWindowH + 'px',
						},300, "linear", function() {
		 
						});
						//show close button
						jQuery(".ad-close")[0].style.display = 'block';
						jQuery(".ad-close").animate({
							opacity: "1",
						},300, "linear", function() {
		 					
						});
						//hide open button
						jQuery(".ad-open").animate({
							height: "0px",
							opacity: "0"
						},300, "linear", function() {
		 					
						});
					}
				break;
			}
		}
	};

	window.KonbiniAd = KonbiniAd;

})(window, document, Math);





