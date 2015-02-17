/*
 * FBBox jQuery Plugin
 * Description: A box which appears at the bottom of the page to attract new followers
 * Copyright (c) 2015
 * Licensed under the MIT license.
 */
(function($) {

	$.FBBox = {
		styleSheet: null
	};

	$.FBBox.defaults = {
		useScrollEvent:false,
		FBBoxInView:false,
		FBBoxSize: {width:320, height:320},
		appendBoxTo: 'body',
		FBBoxIsVisible: true,
		container: document.createElement('div'),
		FBpluginURL: 'http://www.facebook.com/plugins/likebox.php?href=https%3A%2F%2Fwww.facebook.com%2Fkonbini&width=300&height=258&colorscheme=light&show_faces=true&header=false&stream=false&show_border=false',
		FBHeaderText: 'Like us on FB for more awesome posts!'
	};

	$.FBBox.addStyleSheet = function() {
		var style = document.createElement("style");
		// WebKit hack :(
		style.appendChild(document.createTextNode(""));
		// Add the <style> element to the page
		document.head.appendChild(style);
		return style.sheet;
	};

	$.FBBox.addCSSRule = function(sheet, selector, rules, index) {
		if("insertRule" in sheet) {
			sheet.insertRule(selector + "{" + rules + "}", index);
		}
		else if("addRule" in sheet) {
			sheet.addRule(selector, rules, index);
		}
	};

	$.FBBox.isElmInDocument = function(elm) {
		while (elm = elm.parentNode) {
            if (elm == document) {
                return true;
            }
        }
        return false;
	};

	/**
	 * Function to get the value of a css property of a DOM element
	 */
	$.FBBox.getElmStyle = function(elm,property) {
		if (window.getComputedStyle) {
            return document.defaultView.getComputedStyle(elm,null)[property];
        }
        if (elm.currentStyle) {
            return elm.currentStyle[property];
        }
	};

	/**
	 * Function to detect if an element of the DOM is visible (in view)
	 */
	$.FBBox.isElmInView = function(elm) {
		
		//make sure there is only one element to detect!
		if ($(elm).length === 1) {

			var rect = $(elm)[0].getBoundingClientRect(),
				vWidth = window.innerWidth || document.documentElement.clientWidth,
				vHeight = window.innerHeight || document.documentElement.clientHeight,
				//very specific to the article page
				arrowLeft = $('.arrow-left')[0],
				efp = function (x, y) { 

					var val = document.elementFromPoint(x, y);
					
					if (val === null) {
						val = $(elm)[0];
					}
					
					if (val) {
						if (val.parentNode === arrowLeft) {
							val = $(elm)[0];
						}
					}
					
					return val
				 };

			//return false if it's not in the view 
    		if (rect.right < 0 || rect.bottom < 0 || rect.left > vWidth || rect.top > vHeight) return false;
    		//return true if any of its four corners are visible
    		return ($(elm)[0].contains(efp(rect.left,  rect.top)) ||  $(elm)[0].contains(efp(rect.right, rect.top)) ||  $(elm)[0].contains(efp(rect.right, rect.bottom)) ||  $(elm)[0].contains(efp(rect.left,  rect.bottom)));

		} else {
			//console.log('there are more than one element');
		}

	};

	$.fn.FBBox = function(options) {

		var settings = $.extend({
			callback: function() {}
		}, $.FBBox.defaults, options);
		

		function initScrolling() {

			$(window).scroll(function () {

				handleBox();	
				
			});
		};

		function createBox() {

			settings.container.setAttribute('id','FBBox');
			settings.container.style.width = settings.FBBoxSize.width + 'px';
			settings.container.style.height = settings.FBBoxSize.height + 'px';
			settings.container.style.position = 'fixed';
			settings.container.style.bottom = '0px';
			settings.container.style.right = '-340px';
			settings.container.style.backgroundColor = '#fff';
			settings.container.style.border = '1px solid #ccc';
			settings.container.style.zIndex = 100;
			settings.container.style.overflow = "hidden";
			settings.container.style.margin = "10px";
			settings.container.style.paddingLeft = "10px";

			var top_container = document.createElement('div');
			top_container.style.width = '100%';
			top_container.style.height = '30px';
			top_container.style.lineHeight = '30px';
			top_container.style.paddingLeft = '10px';
			top_container.style.marginTop = '10px';
			//top_container.style.backgroundColor = '#f5f5f5';
			//top_container.style.borderBottom = '1px solid #ccc';

			var fb_container = document.createElement('div');
			fb_container.setAttribute('id','fb_iframe_container');
			fb_container.style.width = '100%';
			fb_container.style.height = '240px';
			

			//var fb_div = '<div class="fb-like-box" data-href="https://www.facebook.com/konbini" data-width="300" data-height="240" data-colorscheme="light" data-show-faces="true" data-header="false" data-stream="false" data-show-border="false"></div>';
			
			var FB_iframe = document.createElement('iframe');
			//FB_iframe.style.height = (settings.FBBoxSize.height - 40) + 'px';
			FB_iframe.setAttribute('src',settings.FBpluginURL);

			$($.FBBox.defaults.appendBoxTo).append(settings.container);

			$(top_container).html( "<p style='margin: 10px 0px 0px 0px'>" + settings.FBHeaderText + "</p>" );

			console.log(fb_container);

			$(settings.container).append(top_container);
			$(settings.container).append(fb_container);
			$(fb_container).append(FB_iframe);

			//$(settings.container).append(FB_iframe);

			addBoxCloseBtn(top_container);

			addBoxFooter();

		}

		function addBoxCloseBtn(parent) {

			var closeBtn = document.createElement('div');
			closeBtn.setAttribute('class','ad-close');
			parent.appendChild(closeBtn);

			$.FBBox.addCSSRule($.FBBox.styleSheet,".ad-close","width:30px; height:20px; background-color:transparent; position:absolute; top:0px; right:0px; display:block; cursor:pointer");
			$.FBBox.addCSSRule($.FBBox.styleSheet,".ad-close::before", "-moz-transform: rotate(45deg); -ms-transform: rotate(45deg); -webkit-transform: rotate(45deg); transform: rotate(45deg);");
			$.FBBox.addCSSRule($.FBBox.styleSheet,".ad-close::after", "-moz-transform: rotate(135deg); -ms-transform: rotate(135deg); -webkit-transform: rotate(135deg); transform: rotate(135deg);");
			$.FBBox.addCSSRule($.FBBox.styleSheet,".ad-close::before, .ad-close::after", "content: ''; position: absolute; top: 14px; left: 9px; display: inline-block; width: 12px; height: 2px; background-color: #333; -moz-transition: -moz-transform 250ms; -webkit-transition: -webkit-transform 250ms; transition: transform 250ms;");

			$(closeBtn).click(function() {
				settings.FBBoxIsVisible = false;
  				settings.container.style.right = '-340px';
  				settings.container.display = 'none';
			});
		}

		function addBoxFooter() {

			var footer_container = document.createElement('div');
			var footer = document.createElement('a');
			footer_container.appendChild(footer);
			footer_container.setAttribute('class','fb-box-footer');
			$.FBBox.addCSSRule($.FBBox.styleSheet,".fb-box-footer","position:absolute; bottom:15px;");
			$.FBBox.addCSSRule($.FBBox.styleSheet,".fb-box-footer a","color:#000; padding-left:10px; text-decoration:none; cursor: pointer");
			$(settings.container).append(footer_container);
			$(footer).html("<span style='text-decoration: underline;'>Don't show this</span> - I already like Konbini");
		
			$(footer).click(function() { 
				localStorage.setItem('showFBBox', false);
				settings.FBBoxIsVisible = false;
  				settings.container.style.right = '-340px';
  				settings.container.display = 'none';
			});
		}

		function showBox() {
			$(settings.container).animate({right: '0px'}, "slow" );
		}

		function hideBox() {

			setTimeout(function() { 
				$(settings.container).animate({right: '-340px'}, "slow" );
			}, 1000);
			
		}

		function handleBox() {

			if(settings.FBBoxIsVisible) {

				if ($.FBBox.isElmInView(settings.elmToDetect)) {
						
					if (!$.FBBox.defaults.FBBoxInView) {
						$.FBBox.defaults.FBBoxInView = true;
						showBox();
					}

				} else {

					if ($.FBBox.defaults.FBBoxInView) {
						$.FBBox.defaults.FBBoxInView = false;
						hideBox();
					}
				}
			}

		}

		//add style sheet
		if (!$.FBBox.styleSheet) {
			$.FBBox.styleSheet = $.FBBox.addStyleSheet();
		}

		//create the box
		createBox();

		if (settings.useScrollEvent) {

			if (localStorage.getItem('showFBBox') !== 'false') {
				initScrolling();
				setTimeout(function() { 
					handleBox();
				}, 5000);

			} 			
		}
	};
})(jQuery);