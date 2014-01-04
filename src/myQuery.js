/*
* myQuery -  a jQuery architecture POC, 
* Michael Katz, 2014,
* http://github.com/michaelkatz/myQuery
*/

/*
* The MIT License (MIT)
*
* Copyright (c) 2014 MichaelKatz
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of
* this software and associated documentation files (the "Software"), to deal in
* the Software without restriction, including without limitation the rights to
* use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
* the Software, and to permit persons to whom the Software is furnished to do so,
* subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
* FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
* IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
* CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

//letting jshint know that window is defined elsewhere
//http://www.jshint.com/docs/ -> Inline configuration

/*global window */

(function(window) {

	/*
	* The main $ function which in jQuery invokes the sizzle engine, which helps
	* - finding the element that will be passed into the constructur. The newly constructed
	* element will be reuturned so that its methods could be run directly via $().method({params})
	* Here it's used as a simple delegate for binding the $ to myQuery
	*/


	window.myQuery = window.$ = window.myQuery || myQuery;


	/*utils
	* Various helper methods for the main myQuery functions
	*/

	// basic constructor for the elements essential for a proper class testing and parsing
	function cssClass(classes, targetClass) {
		//This is how you should pass regex variables into .replace()
		this.classRegex = new RegExp("^"+targetClass+"$","g");
		this.classArray = classes.split(" ");
	}

	// converts stylesheet syntaxed css into a js one,
	// ie: background-color -> backgrouncColor
	function convertCSStoJS(str) {
		var arr = str.split("-"), i;
		for(i = 1;i < arr.length; i++) {
			//http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript#answer-1026087
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		}
		return arr.join("");
	}


	/***Abstraction layer***/

	/* 
	*  These are the functions that will be added to the $() wrapped element
	*  Some will return the object itself, and others won't return anything.
	*  These functions are kept separate for the sake of readability 
	*/

	function hasClass(el, targetClass) {
		var i,
		classObject = new cssClass(el.className, targetClass);
		for(i = 0; i < classObject.classArray.length; i++) {
			if(!!classObject.classArray[i].match(classObject.classRegex)) {
				return true;
			}
		}
		return false;
	}

	function addClass(el, targetClass) {
		if(el.className.indexOf(targetClass) !== -1) { return; }

		var arr = el.className.split(" ");
		arr.push(targetClass);

		el.className =	el.className.length === 0 ||
										(el.className.indexOf(" ") !== -1 && el.className.length === 1) ||
										arr.length === 1 ? arr.join("") : arr.join(" ");
	}

	function removeClass(el, targetClass) {
		var i,
		classObject = new cssClass(el.className, targetClass);
		
		for(i = 0; i < classObject.classArray.length; i++) {
			if(!!classObject.classArray[i].match(classObject.classRegex)) {
				classObject.classArray.splice(i, 1);
				break;
			}
		}

		//trimming the last whitespace if there is one
		if(classObject.classArray[classObject.classArray.length - 1] === "") {
			el.className = classObject.classArray.pop().join(" ");
		}

		el.className = classObject.classArray.join(" ");
	}

	function toggleClass(el, targetClass) {
		hasClass(el, targetClass) ? removeClass(el, targetClass) : addClass(el, targetClass);
	}

	function css(el) {
		var x, convertedProperty;
		//	$el.css();
		if(arguments[1].length === 0) {
			return window.getComputedStyle(el);
		} else if(arguments[1].length === 1) {

			//	$el.css("param");
			if(typeof arguments[1][0] === "string") {
					return window.getComputedStyle(el)[arguments[1][0]];

			//	$el.css({
			//	param: value, 
			//	anotherParam: anotherValue});
			} else if(typeof arguments[1][0] === "object") {
				for(x in arguments[1][0]) {
					convertedProperty = x;
					if(convertedProperty.indexOf("-") !== -1) {
						convertedProperty = convertCSStoJS(convertedProperty);
					}
					el.style[convertedProperty] = arguments[1][0][x];
				}
				return this;
			}

			//	$el.css(param, value);
		} else if(arguments[1].length === 2 && typeof arguments[1][0] === "string" && typeof arguments[1][1] === "string"){
				convertedProperty = arguments[1][0];
				if(convertedProperty.indexOf("-") !== -1) {
					convertedProperty = convertCSStoJS(arguments[1][0]);
				}
				el.style[convertedProperty] = arguments[1][1];
				return this;
			}
	}

	function index(el) {
		var parent = el.parentNode, children, i;
		//  splitting for readability: making the childNodes pseudo array into a real one:
		//  http://stackoverflow.com/questions/7056925/how-does-array-prototype-slice-call-work#answer-7057090
		children = Array.prototype.slice.call(parent.childNodes);
		
		// filtering out the textNodes, although filter is now a part of ECMAscript 5.1,
		// there's much to learn from: 
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#Compatibility
		children = children.filter(function(el) { return el.nodeName !== "#text"; });
		for(i = 0;i < children.length;i++) {
			if(children[i] === el) {
				return i;
			}
		}
	}

	/*
	*  This is the myQuery constructor which wraps the element with various helper methods.
	*  These methods are delegated from the functions specified above. since they are boolean,
	*  there's no need to return the object after calling it (for now)
	*/

	function myQuery(el) {
		if(arguments.length < 1) { return []; }

		// if the first parameter isn't an instance of the constructur,
		// we'll recursively make it one
		// Here's a more generic pattern:
		//
		// if (!(this instanceof arguments.callee)){
		//	return new arguments.callee(el);
		// }
		//
		// source: http://stackoverflow.com/questions/1889014/can-i-construct-a-javascript-object-without-using-the-new-keyword#answer-1889738
		if (!(this instanceof myQuery)){
			return new myQuery(el);
		}
			
		this.element = el;
		// notice that we pass the expected params from the $().method(params) into the wrapping function
		// arguments which the user shouldn't be aware of, are passed by default
		this.hasClass =  function(targetClass) {
			return hasClass(this.element, targetClass);
		};
		this.addClass = function(targetClass) {
			addClass(this.element, targetClass);
		};
		this.removeClass = function(targetClass) {
			removeClass(this.element, targetClass);
		};
		this.toggleClass = function(targetClass) {
			toggleClass(this.element, targetClass);
		};
		this.css = function() {
			return css.call(this,this.element, arguments);
		};
		this.index = function() {
			return index(this.element);
		};
	}

	/***End of abstraction layer***/
}(window));