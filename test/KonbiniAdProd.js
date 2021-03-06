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

	var _self, 
		_device;

	var SIZES = {
		desktop: 1024,
		tablet: 1024,
		mobile: 736
	};

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
				
				if (elm) {
				    while(elm) {
				        xPos += (elm.offsetLeft - elm.scrollLeft + elm.clientLeft);
				        yPos += (elm.offsetTop - elm.scrollTop + elm.clientTop);
				        elm = elm.offsetParent;
	    			}
    			}	
    		
    		return { x: xPos, y: yPos };

		};
		/**
		 *Get the raw value of the css property 'width' and not the computed value
		 *@param {String} - value of the class, id etc to get the node in jQuery - here the condition is to use the jQuery
		 */
		utility.rawCssWidth = function(elm) {

			var	width =  jQuery(elm).width();
			var parentWidth = jQuery(elm).offsetParent().width();
			var percent = Math.round(100*width/parentWidth);

			return percent + '%';
				
		};
		utility.isNodeVisible = function(elm,margin) {

			var elmPosY = utils.getNodePosition(elm).y,
				elmHeight = elm.clientHeight;

			if (elmPosY < - elmHeight - margin) return false;									
			else if (elmPosY > utility.viewport().height) return false;
			else return true;

		};

		utility.isNodeInTheDom = function(target) {
			if (this.hasJQuery) {
				var hasElm = (jQuery(target).length>0) ? true : false;
				return hasElm
			}
		};

		window.KonbiniUtils = utility;

		return utility;

	})();

	//function KonbiniAd(name,parentNode,options,clicktag) {
	function KonbiniAd(options) {

		_self = this,
				this.ticking = false;

		//device detection
		_device = (utils.hasTouch) ? _device = 'mobile' : _device = 'desktop';

		//per default I create a container for the image asset
		this.imgWrapper = document.createElement('div');
		this.imgWrapper.setAttribute('id','ad_image');

		//per default I create a container for the close button area
		this.openAreaCloseButton = document.createElement('div');

		//per default I create a container for the open button area
		this.openAreaOpenButton = document.createElement('div');

		//style sheet 
		this.styleSheet = utils.addStyleSheet();

		//if (clicktag) this.clicktag = clicktag;

		this.options = {
			openWindow: null,
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

			//console.log(_device);

			//init events
			this.initEvents();

			this.resize();

			//append ad wrapper to parent node
			//this.getParentNode().appendChild(this.imgWrapper);

			//make sure that the parent container is displayed 
			// this.getParentNode().style.display = 'inline';

			// this.options.openWindow.style.height = this.options.openWindowH + 'px';
			// this.options.openWindow.style.width = '100%';
			// this.options.openWindow.style.position = 'relative';
			// this.options.openWindow.setAttribute('id','openArea');

			//ADD CLOSE AND OPEN BUTTON
			this.addCloseButton();
			this.addOpenButton();

			// //ADAPT LAYOUT TO PAGE
			// document.getElementById('wrapper').style.background = 'transparent';
		 	// document.getElementById('wrapper').style.display = 'block';
		 	// document.getElementById('wrapper').style.overflow = 'hidden';
		 	// document.getElementById('wrapper').style.width = '100%';

			window.dispatchEvent(this.readyEvent);
			
		},
		/**
		 * Add an image asset 
		 *@param {object} images - hold the paths of the images according to the platform
		 */
		addImage: function(images) {

			this.images = images;

			//set image using the css property background-image
			this.addCSSBgImage();
			this.addCssPropsToImgContainer();
		  	
		},
		/**
		 * Add a window (node) 
		 *@param {object} target - node which will be used to append the window node to the dom
		 *@param {String} height - value in pixels for the height of the window node
		 *@param {String} where - indicates where to add the new window node in the dom. It can be 'after' or 'before'
		 */
		addAdWindow: function(target,where,height) {
			//maybe here further detection will be needed to make sure that the window is not next to an image or video in the article page
			switch(where) {
				case 'before':
					jQuery(target).before('<div id="ad_window"></div>');
					jQuery('#ad_window').append(this.imgWrapper);
					utils.addCSSRule(this.styleSheet,'#ad_window','width: 100%; margin: 10px 0px; display:block; overflow:hidden; position:relative');
				break;
				case 'after':
				console.log('spooky');
					jQuery(target).after('<div id="ad_window"></div>');
					jQuery('#ad_window').append(this.imgWrapper);
					utils.addCSSRule(this.styleSheet,'#ad_window','width: 100%; margin: 10px 0px; display:block; overflow:hidden; position:relative');
				break;
			}
		},
		/**
		 * Add an image using background-image css property
		 */
		addCSSBgImage: function() {
			if (_device !== 'desktop') {
				if (this.images.urlmp && this.images.urlml) {
					this.imgWrapper.style.backgroundImage = (utils.isPortrait.matches) ? 'url("' + this.images.urlmp + '")' : 'url("' + this.images.urlml + '")';
				}
			} else {
				if (this.images.urld) this.imgWrapper.style.backgroundImage = 'url("' + this.images.urld + '")';
			}
		},
		/**
		 * Add css properties for the container holding the image
		 */
		addCssPropsToImgContainer: function() {

			var cssProps;

			if (_device !== 'desktop') {
				
				cssProps =  'width:100%;'
							+ 'height: 100%;'
							+ 'position:fixed;'
							+ 'display:block;'
							+ 'overflow: hidden;'
							+ 'left: 0px;'
							+ 'top:0px;'
							+ 'background-color:transparent;'
							+ 'background-size: 100%;'
							+ 'background-position: 0px 0xp;'
							+ 'background-repeat: no-repeat no-repeat;'
							+ 'background-attachment: scroll;';
				
				utils.addCSSRule(this.styleSheet,'#ad_image',cssProps);

			} else {

				cssProps =  'height: 0;'
							+ 'width: 100%;'
							+ 'max-width: ' + SIZES.desktop + 'px;'
							+ 'padding-top:50%;'
							+ 'position: relative;'
							+ 'cursor:pointer;'
							+ 'background-attachment: fixed;'
							+ 'background-repeat: no-repeat;'
							+ 'background-position: 50% 50%;';

				utils.addCSSRule(this.styleSheet,'#ad_image',cssProps);

				this.updateBgCssProps();
			}
		},
		/**
		 * Update bg css properties 
		 * Responsive solution to get the width to be appled to background size of the image
		 */
		updateBgCssProps: function() {

			var ratio,
				new_width_picture,
				window_width,
				window_xPos,
				middle,
				window_diff,
				width = utils.rawCssWidth('.entry');
			
			window_width =  this.imgWrapper.clientWidth;

			ratio = (utils.viewport().height / SIZES.desktop);
			
			new_width_picture = Math.round(SIZES.desktop*ratio);

			window_diff = window_width - new_width_picture;
			
			middle =  Math.round(window_diff/2);

			window_xPos = middle + utils.getNodePosition(this.imgWrapper).x + 'px 0px';

			//background-position we need to calculate the position when width is set to 60%

			(width === '100%') ?  jQuery('#ad_image').css('background-size','cover') : jQuery('#ad_image').css('background-size','auto 100%');
			(width === '100%') ?  jQuery('#ad_image').css('background-position','50% 50%') : jQuery('#ad_image').css('background-position',window_xPos);
			jQuery('#ad_window').css('background-color','#f4f4f4');

		},
		/**
		 * Add a close button
		 * Maybe add a parameter to choose the color of the button
		 */
		addCloseButton: function() {

			if (_device === 'desktop') jQuery('#ad_window').append(this.openAreaCloseButton);
			//mobile experience
			//this.options.openWindow.appendChild(this.openAreaCloseButton);

			this.openAreaCloseButton.setAttribute('class','ad-close');
			
			utils.addCSSRule(this.styleSheet,".ad-close","width:40px; height:30px; background-color:#484848; position:absolute; top:5px; right:5px; display:block; cursor:pointer");
			utils.addCSSRule(this.styleSheet,".ad-close::before", "-moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);");
			utils.addCSSRule(this.styleSheet,".ad-close::after", "-moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -webkit-transform: rotate(135deg); transform: rotate(135deg);");
			utils.addCSSRule(this.styleSheet,".ad-close::before, .ad-close::after", "content: ''; position: absolute; top: 14px; left: 9px; display: inline-block; width: 22px; height: 3px; background-color: #fff; -moz-transition: -moz-transform 250ms; -webkit-transition: -webkit-transform 250ms; transition: transform 250ms;");

		},
		/**
		 * Add an open button
		 */
		addOpenButton: function() {

			if (utils.hasJQuery) { 

				//mobile experience
				//jQuery(this.options.openWindow).after(this.openAreaOpenButton);

				if (_device === 'desktop') jQuery('#ad_window').after(this.openAreaOpenButton);
				this.openAreaOpenButton.setAttribute('class','ad-open');
				//mobile experience
				//utils.addCSSRule(this.styleSheet,".ad-open","width:100%; height:0px;background-color:#fff; opacity:0; line-height: 40px; font-size: 16px; text-align:right; padding-right:10px; cursor:pointer; border-bottom: 1px solid #ccc");
				utils.addCSSRule(this.styleSheet,".ad-open","width:100%; height:0px;background-color:#fff; opacity:0; line-height: 40px; font-size: 16px; text-align:right; padding-right:10px; cursor:pointer; border-bottom: 1px solid #ccc; border-top: 1px solid #ccc; margin-bottom:10px;");
				this.openAreaOpenButton.innerHTML = 'Afficher la pub';
			} else {
				
			}
		},
		initEvents:function(remove) {

			var eventType = remove ? utils.removeEvent : utils.addEvent;

			this.readyEvent = utils.createCustomEvent(window,'ready',this.handleEvent);
			//this.tickEvent = utils.createCustomEvent(window,'tick',this.handleEvent);

			eventType(window, 'orientationchange', this);
			eventType(window, 'resize', this);

			(_device === 'desktop') ? eventType(this.imgWrapper, 'click', this, true) : eventType(this.options.openWindow, 'click', this, true);

			eventType(this.openAreaCloseButton, 'click', this, true);
			eventType(this.openAreaOpenButton, 'click', this, true);


			// var update = function() {
				
			// 	var openWposY = utils.getNodePosition(_self.options.openWindow).y,
			// 		//hardcoded - please change it really
			// 		//elm = document.getElementById('ad_image'),
			// 		h = - _self.options.openWindowH - 30;
				
			// 	if (openWposY < h) {

			// 		//elm.style.display = 'none';
			// 		adIsInViewport = false;
			// 		console.log('hide 2');

			// 	} else {

			// 		if (!adIsInViewport) {
			// 			console.log('show');
			// 			//elm.style.display = 'inline-block';
			// 			adIsInViewport = true;
			// 		}
			// 	}

			// 	requestTick();
				
			//};

			var requestTick = function() {

				if (_self.ticking) {
					rAF(update);
					//_self.ticking = false;
				}
			};

			if (utils.hasTouch && this.options.enableTick) {
				eventType(window, 'touchstart', this);
				eventType(window, 'touchmove', this);
				eventType(window, 'touchend', this);
				this.ticking = true;
				//requestTick();
			}

		},
		resize: function() {	
			
			//check device orientation to apply portrait or landscape image
			if (_device !== 'desktop') {
				this.addCSSBgImage();
			} else {
				//for the desktop we apply a responsive image solution
				this.updateBgCssProps();
			}
		
			//get the width and height of the viewport:
			if (utils.hasJQuery) {
				//var viewportWidth = jQuery(window).width();
				//var viewportHeight = jQuery(window).height();
			}
		},
		handleEvent: function (e) {
			switch ( e.type ) {
				case 'ready':
					
				break;
				case 'touchstart':
					e.stopPropagation();
					//MAKE SURE THAT THE AD IS READY BEFORE 
					//PLEASE PUT

					//style property
					//value
					
					if (!utils.isNodeVisible(this.options.openWindow,30)) {
						if (this.imgWrapper.style.width == '100%') {

							//elm.style.display = 'none';
							//console.log('width');
							this.imgWrapper.style.width = '1px';
						}
					} else {
						if (this.imgWrapper.style.width == '1px') {
							this.imgWrapper.style.width = '100%';
						}
					}
				break;
				case 'touchmove':
					e.stopPropagation();
					if (!utils.isNodeVisible(this.options.openWindow,30)) {
						//console.log('m');
						//this.toggleStyle(_self.imgWrapper,'width',{val1:'100%',val2:'1px'});
						if (this.imgWrapper.style.width == '100%') {
							this.imgWrapper.style.width = '1px';
						}
					} else {
						if (this.imgWrapper.style.width == '1px') {
							this.imgWrapper.style.width = '100%';
						}
					}
				break;
				case 'touchend':
					e.stopPropagation();
					
					if (!utils.isNodeVisible(this.options.openWindow,30)) {
						if (this.imgWrapper.style.width == '100%') {
							
							this.imgWrapper.style.width = '1px';
						}
					} else {
						if (this.imgWrapper.style.width == '1px') {
							
							this.imgWrapper.style.width = '100%';
						}
					}
					setTimeout(function(){ 
						console.log('set time out');
						
							
						
						if (!utils.isNodeVisible(_self.options.openWindow,30)) {
							if (_self.imgWrapper.style.width == '100%') {

								_self.imgWrapper.style.width = '1px';
							}
						} else {
							if (_self.imgWrapper.style.width == '1px') {
								_self.imgWrapper.style.width = '100%';
							}
						}
					}, 1000);
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
							this.selectAnimState("close");
						} else if (e.target === this.openAreaOpenButton) {
							this.selectAnimState("open");
						} else {
							console.log('click');
							if (this.options.clicktag1) window.open(this.options.clicktag1,'_blank');
						}
					}
				break;
			}
		},
		/**
		 *toggleStyle
		 *@param object - a tag
		 *@param string or object - a style property
		 *@param object - first value is the normal value, second value is the one to set according to the situation
		 **/
		toggleStyle: function(elm,prop,values) {

			var currentVal = elm.style[prop];
			
			elm.style[prop] = (currentVal === values.val1) ? values.val2 : values.val1

			console.log(elm.style[prop]);

			// if (this.imgWrapper.style.width == '100%') {

			// 				this.toggleStyle(this.imgWrapper,'width',{val1:'100%',val2:'1px'});
			// 				//elm.style.display = 'none';
			// 				//console.log('width');
			// 				this.imgWrapper.style.width = '1px';
			// 			}

		},
		/**
		 * Animate an element of the DOM using jQuery animate
		 *@param {String} elm - node which will be animated
		 *@param {object} value - css properties and values targeted
		 *@param {Number} duration 
		 *@param {object} endValue - css property to change at the end of the animation
		 */
		anim: function(elm,value,duration,endValue) {
			jQuery(elm).animate(value,duration, "linear", function() {
				if (endValue) {
					jQuery(this).css(endValue.cssProp,endValue.cssValue);
				}
			});
		},
		/**
		 *Animate an element of the DOM using jQuery animate
		 *@param {String} status - open or close
		 */
		selectAnimState: function(status) {
			switch (status) {
				case "close":
					if (utils.hasJQuery) {
						//close area window 
						(_device === 'desktop') ? this.anim(this.imgWrapper,{paddingTop:'0%'},300) : this.anim(this.options.openWindow,{height:'0px'},300);
						//hide close button
						this.anim(".ad-close",{opacity:'0'},300,{cssProp:'display',cssValue:'none'});
						//show open button
						this.anim(".ad-open",{height:'40px',opacity:'1'},300);
					}
				break;
				case "open":
					if (utils.hasJQuery) {
						//open area window 
						(_device === 'desktop') ? this.anim(this.imgWrapper,{paddingTop:'50%'},300) : this.anim(this.options.openWindow,{height:this.options.openWindowH + 'px'},300); 
						//show close button
						jQuery(".ad-close").css('display','block');
						this.anim(".ad-close",{opacity:'1'},300);
						//hide open button
						this.anim(".ad-open",{height:'0px',opacity:'0'},300);
					}
				break;
			}
		}
	};

	window.KonbiniAd = KonbiniAd;


})(window, document, Math);










