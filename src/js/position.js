/**
 * EUI: position.js v1.3.0
 * 位置插件，可以根据某个元素快速定位另一个元素的位置
 *
 * https://github.com/cjhgit/eui
 */
;(function($) {
    'use strict';

	var elems = new Array();

	// observe window resize
	$(window).on('resize', function(e) {

		// reset position for all
		$.each(elems, function(i, elem) {
			$(elem).css({
				'position': 'absolute',
				left: 0,
				top: 0
			});
		});

		// cycle through all visible handlers and use their position to update position
		$.each(elems, function(i) {
			var elem = $(this),
                elemData = elem.data('placeOptions');

			// update element (by calling init)
			pub.init.apply(elem, [elemData]);
		});

	});

	var pvt = {
		/* Calculates the specified elements' boundary and dimensions.
		 *
		 * @param		includeMargin	If true, element's margins are included in calculation.
		 * @param		addScroll		If true, scroll position is added to the viewport height/width calculation.
		 *
		 * @return		object			Boundary and dimensions of the selected HTML element.
		 */
		calcBounds: function(includeMargin, addScroll) {
			var elem = this, elemOffset = $(elem).offset();

			includeMargin = (null == includeMargin) ? false : includeMargin;
			addScroll = (null == addScroll) ? false : addScroll;

			// visible (viewport) document area
			var viewport = {
				width: $(window).width(),
				height: $(window).height()
			};

			// visible+unscolled document area
			var htmlDoc = {
				width: $(document).width(),
				height: $(document).height()
			};

			var innerWidth = (elem === window) ? viewport.width : ((elem === document) ? htmlDoc.width : $(elem).width());
			var innerHeight = (elem === window) ? viewport.height : ((elem === document) ? htmlDoc.height : $(elem).height());

			var outerWidth = (elem === window) ? viewport.width : ((elem === document) ? htmlDoc.width : $(elem).outerWidth(includeMargin));
			var outerHeight = (elem === window) ? viewport.height : ((elem === document) ? htmlDoc.height : $(elem).outerHeight(includeMargin));

			return {
				width: innerWidth,
				height: innerHeight,

				outerWidth: outerWidth,
				outerHeight: outerHeight,

				// addScroll; to position the element according to the current scrolled (or visible) viewport area
				topEdge: (elem === window) ? ((addScroll) ? $(window).scrollTop() : 0) : ((elem === document) ? 0 : elemOffset.top),
				leftEdge: (elem === window) ? ((addScroll) ? $(window).scrollLeft() : 0) : ((elem === document) ? 0 : elemOffset.left)
			};
		},


		/* Determine whether the specified value is inside or outside the bounding box.
		 *
		 * @param		thisValue		Value to check.
		 * @param		boundingBox		Boundary box; bounds of which the "value" shouldn't exceed.
		 * @param		plane			Horizontal or vertical plane.
		 *
		 * @return		number			Amount the selected HTML element goes off the bounding box or -1 if it doesn't.
		 */
		inBound: function(thisValue, boundingBox, plane) {
			var selected = $(this), selectedData = selected.data('placeOptions');

			// validate
			if(!selectedData) {
				throw new Error('The element you\'ve selected does not have the required data set on it!');
			}

			// calculate bounds
			boundingBox = pvt.calcBounds.apply(boundingBox, [false, ((selectedData.relativeTo === window && selectedData.position === 'absolute') ? true : false)]);
			var selectedBox = pvt.calcBounds.apply(selected, [selectedData.includeMargin, ((selectedData.relativeTo === window && selectedData.position === 'absolute') ? true : false)]);

			// prevent x-plane clipping
			if(plane === 'x') {
				// leftValue goes beyond left edge
				if(thisValue < boundingBox.leftEdge) {
					return boundingBox.leftEdge;
				}
				// thisValue goes beyond right edge
				else if((thisValue+selectedBox.outerWidth) >= (boundingBox.leftEdge+boundingBox.outerWidth)) {
					return ((boundingBox.leftEdge+boundingBox.outerWidth)-selectedBox.outerWidth);
				}

				return -1;
			}
			// prevent y-plane clipping
			else if(plane === 'y') {
				// topValue goes beyond top edge
				if(thisValue < boundingBox.topEdge) {
					return boundingBox.topEdge;
				}
				// thisValue goes beyond bottom edge
				else if((thisValue+selectedBox.outerHeight) >= (boundingBox.topEdge+boundingBox.outerHeight)) {
					return ((boundingBox.topEdge+boundingBox.outerHeight)-selectedBox.outerHeight);
				}

				return -1;
			}
		},


		/* Applies a value to a single property.
		 *
		 * @param		property		Property to apply value to.
		 * @param		value			Value to set for the specified property.
		 *
		 * @return		mixed			The value of the specified property.
		 */
		apply: function(property, value) {
			var selected = $(this), selectedData = selected.data('placeOptions');

			// get
			if(value === undefined) {
				// validate
				if(!selectedData) {
					throw new Error('The element you\'ve selected does not have the required data set on it!');
				}

				// return property
				return selectedData[property];
			}

			// if data not set...
			if(!selectedData) {
				// set property
				selectedData = {};
				selectedData[property] = value;

				// set default data
				pub.init.apply(selected, [selectedData]);

				// retrieve newly set data...
				selectedData = selected.data('placeOptions');
			}

			// adjust width according to specified offsets...
			if(property === 'offsetX' && selectedData.inBoundX === true) {
				if(selectedData.x === 'right' && value < 0) {
					// subtract width from calculation
					value -= selected.outerWidth();
				}
				else if(selectedData.x === 'left' && value > 0) {
					// add width to calculation
					value += selected.outerWidth();
				}
			}
			// adjust height according to specified offsets...
			if(property === 'offsetY' && selectedData.inBoundY === true) {
				if(selectedData.y === 'bottom' && value < 0) {
					// subtract height from calculation
					value -= selected.outerHeight();
				}
				else if(selectedData.y === 'top' && value > 0) {
					// add height to calculation
					value += selected.outerHeight();
				}
			}

			// overwrite existing value for property
			selectedData[property] = value;
			// save it
			selected.data('placeOptions', selectedData);

			// apply
			pub.init.apply(selected);
		}
	};

	var pub = {
		/*
		 * Initializes the selected HTML element.
		 *
		 * @param		options			(object, optional) Popup options.
		 */
		init: function(options) {
			// take element out of the normal flow of document
			$(this).css('position', 'absolute');

			return this.each(function() {
				var selected = $(this),
                    selectedData = selected.data('placeOptions');

				// if no options specified
				if(null == options) {
					// default
					options = {};
				}

                // 默认
                var DEFAULTS = {
                    position: 'absolute',
                    relativeTo: window,
                    x: 'left',
                    y: 'top',
                    z: false, // 默认不设置
                    offsetX: 0,
                    offsetY: 0,
                    inBoundX: true,
                    inBoundY: true,
                    boundingBox: window,
                    includeMargin: false
                };

				// if data has been set
				if (selectedData) {
					// retrieve options from stored data and merge specified options with it
					options = $.extend({}, DEFAULTS, selectedData, options);
				} else {
                    options = $.extend({}, DEFAULTS, options);
                }

				// set defaults
				var relativeTo = options.relativeTo;

				var position = options.position;

				var x = options.x;
				var y = options.y;

				var offsetX = options.offsetX;
				var offsetY = options.offsetY;

				var inBoundX = options.inBoundX;
				var inBoundY = options.inBoundY;
				var boundingBox = options.boundingBox;

				var includeMargin = options.includeMargin;

				if(null == relativeTo || $.type(relativeTo) !== 'object') {
					throw new Error('The object to position an element relative to must either be an HTML element, window or document!');
				}
				if(!/\b(?:absolute|fixed)\b/.test(position)) {
					throw new Error('"' + position + '" is not a valid CSS position property value!');
				}
				if(null == boundingBox || $.type(boundingBox) !== 'object') {
					throw new Error('The bounding box should either be an HTML element, window or document!');
				}

				// data not set; means position is called for the first time on element
				if(!selectedData) {
					// add to elements array
					elems.push(selected);
				}

				// backup position for repositioning
				selected.data('placeOptions', {
					relativeTo: relativeTo,
					position: position,
					x: x,
					y: y,
					z: options.z,
					offsetX: offsetX,
					offsetY: offsetY,
					inBoundX: inBoundX,
					inBoundY: inBoundY,
					boundingBox: boundingBox,
					includeMargin: includeMargin
				});

				// set CSS position property
				if(selected.css('position') != position) {
					selected.css('position', position);
				}

				var documentBox = pvt.calcBounds.apply(document);

				// reset coordinates
				selected.css({
					'width': '',
					'height': '',
					// relativeTo window? make scrollbars appear by going off the document edges
					// otherwise scrollbar width/height won't be calculated
					'left': (relativeTo === window && x === 'right' && !inBoundX) ? documentBox.outerWidth : '',
					'top': (relativeTo === window && y === 'bottom' && !inBoundY) ? documentBox.outerHeight : ''
				});


				var selectedBox = pvt.calcBounds.apply(selected, [false, ((relativeTo === window && position === 'absolute') ? true : false)]);
				var relativeBox = pvt.calcBounds.apply(relativeTo, [includeMargin, ((relativeTo === window && position === 'absolute') ? true : false)]);

				var widthValue = selectedBox.outerWidth,
                    heightValue = selectedBox.outerHeight;
				var leftValue = 0,
                    topValue = 0;

				// x-plane position (from left)
				switch(x) {
					case 'left':
						leftValue = relativeBox.leftEdge-selectedBox.outerWidth;
					break;
					case 'leftEdge':
						leftValue = relativeBox.leftEdge;
					break;
					case 'right':
						leftValue = relativeBox.leftEdge+relativeBox.outerWidth;
					break;
					case 'rightEdge':
						leftValue = (relativeBox.leftEdge+relativeBox.outerWidth)-selectedBox.outerWidth;
					break;
					case 'center':
						leftValue = relativeBox.leftEdge-(selectedBox.outerWidth/2)+(relativeBox.outerWidth/2);
					break;
					case 'overlay':
						leftValue = relativeBox.leftEdge;
						widthValue = relativeBox.outerWidth;
					break;
				}

				// y-plane position (from top)
				switch(y) {
					case 'top':
						topValue = relativeBox.topEdge-selectedBox.outerHeight;
					break;
					case 'topEdge':
						topValue = relativeBox.topEdge;
					break;
					case 'bottom':
						topValue = relativeBox.topEdge+relativeBox.outerHeight;
					break;
					case 'bottomEdge':
						topValue = (relativeBox.topEdge+relativeBox.outerHeight)-selectedBox.outerHeight;
					break;
					case 'center':
						topValue = relativeBox.topEdge-(selectedBox.outerHeight/2)+(relativeBox.outerHeight/2);
					break;
					case 'overlay':
						topValue = relativeBox.topEdge;
						heightValue = relativeBox.outerHeight;
					break;
				}

				// add x-plane offset; only case not to add it would be when overlaying window/doc whilst remaining inbound!
				if(null != leftValue && !((relativeTo === window || relativeTo === document) && x === 'overlay' && inBoundX)) {
					leftValue += offsetX;
				}

				// prevent x-plane clipping
				if(inBoundX) {
					var val = pvt.inBound.apply(selected, [leftValue, boundingBox, 'x']);

					leftValue = ((val !== -1) ? val : leftValue);
				}

				// add y-plane offset; only case not to add it would be when overlaying window/doc whilst remaining inbound!
				if(null != topValue && !((relativeTo === window || relativeTo === document) && y === 'overlay' && inBoundY)) {
					topValue += offsetY;
				}

				// prevent y-plane clipping
				if(inBoundY) {
					var val = pvt.inBound.apply(selected, [topValue, boundingBox, 'y']);

					topValue = ((val !== -1) ? val : topValue);
				}

				// IE Fix: in IE Ready event seems to fire early at times rendering width and height values < 0
				// which results in a logical error!
				if(widthValue < 0) {
					widthValue = 'auto';
				}
				if(heightValue < 0) {
					heightValue = 'auto';
				}

				// apply
				selected.css({
					//width: widthValue,
					//height: heightValue,
					left: leftValue,
					top: topValue,
				});

                options.z && selected.css('zIndex', options.z);

                if (x === 'overlay') {
                    selected.css('width', widthValue);
                }
                if (y === 'overlay') {
                    selected.css('height', heightValue);
                }


			});

		},

		/* Resets any previously set element place data. */
		reset: function() {
			return this.each(function() {
				var selected = $(this), selectedData = selected.data('placeOptions');

				if(selectedData) {
					selected.removeData('placeOptions');
				}
			});
		}
	};

	/*
	 * Positions selected HTML element(s).
	 *
	 * @param		method			(string) Name of the method to call on the selected popup element.
	 * @param		options			(mixed) Argument(s) for the specified method.
	 *
	 * @return		mixed			The value of the specified property.
	 */
	$.fn.pot = function(method) {
		// Method calling logic
		if(/\b(?:relativeTo|position|x|y|z|offsetX|offsetY|inBoundX|inBoundY|boundingBox|includeMargin)\b/.test(method)) {
			return pvt['apply'].apply(this, arguments);
		} else if(pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if(typeof method === 'object' || !method) {
			return pub.init.apply(this, arguments);
		} else {
			throw new Error('Method ' +  method + ' does not exist on jQuery.place');
		}
	};

})(jQuery);
