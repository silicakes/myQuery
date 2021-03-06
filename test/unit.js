(function($) {
	//helpers

	//tries to add the same class twice
	function setMultipleClasses($el, targetClass) {
		for(i = 0;i < 2;i++) {
			$el.addClass(targetClass)
		}

		var classArray = $el.element.className.split(" ");
		var counter = {};
		for(var i = 0;i < classArray.length;i++) {
			typeof counter[classArray[i]] === 'undefined' ? counter[classArray[i]] = 0 : counter[classArray[i]]++;
		}

		//iterating again to prevent test failure if someone adds mutiple same name classes,
		//without using the addClass method
		for(x in counter) {
			if(counter[x] > 0)
				return true;
		}

		return false;
	}

	var element = document.createElement("div")
	element.className = "test-class";
	var $el = $(element);

		test("$ equals myQuery", function() {
			ok($ === myQuery, "$ isn't equal to the myQuery object");
		});

	test("$ creates an instance of myQuery", function() {
		ok($el instanceof myQuery, "$(element) failed to create a myQuery instance");
	});

	test("myQuery.element property creation", function() {
		ok(typeof $el.element === "object", "element property was not cerated");
	});

	test("hasClass method", function() {
		ok($el.hasClass("test-class"));
		ok(!$el.hasClass("test-"), "exact match regex failed");
		ok(!$el.hasClass("test-classs"), "exact match regex failed");
	});

	test("addClass method", function() {
		$el.addClass("dude")
		ok($el.hasClass("dude"), "addClass() failed");
		$el.addClass("dude2");
		ok($el.hasClass("dude2"), "similar class addition failed");
		ok(!setMultipleClasses($el, "who"),"adding multiple same name classes was successful");
	});

	test("removeClass method", function() {
		$el.addClass("what");
		ok($el.hasClass("what"), "test class was not added");
		$el.addClass("what2");
		ok($el.hasClass("what2"), "test class was not added");
		$el.removeClass("what");
		ok($el.hasClass("what2"), "exact match regex failed");
		ok(!$el.hasClass("what"), "removeClass() failed");
	});

	test("toggleClass method", function() {
		$el.toggleClass("car");
		ok($el.hasClass("car"), "toggleClass failed adding a class");
		$el.toggleClass("car");
		ok(!$el.hasClass("car"), "toggleClass failed removing a class");
	});

	test("css method", function() {
		// $el.css()
		var cssElement = $el.css();
		ok(cssElement instanceof CSSStyleDeclaration, "the empty css() method does not return the elements style object");

		//$el.css(prop);
		$el.element.style.height = "500px";
		//TODO change the test to work with cssText: http://www.quirksmode.org/dom/w3c_css.html
		equal($el.css("height"), window.getComputedStyle($el.element).height, "getting a specific css value failed");	
		
		//$el.css(prop, val);
		$el.css("background-color", "black");
		equal($el.element.style.backgroundColor, "black", "single style assignment failed");

		//$el.css({prop: value});
		$el.css({
			"background-color": "blue",
			cursor: "pointer",
			"font-size": "20px"
		});

		equal($el.element.style.backgroundColor, "blue", "Assignment of object css failed [background-color]");
		equal($el.element.style.cursor, "pointer", "Assignment of object css failed [cursor]");
		equal($el.element.style.fontSize, "20px", "Assignment of object css failed [cursor]");
	})

	test("index", function() {
		var state = true;
		for(i = 0;i < 5;i++) {
			var a = document.createElement('a');
			a.index = i;
			element.appendChild(a);
			if(!($(a).index() === a.index)) 
				state = false;
		}
		ok(state, "index() failed");
	});

}(myQuery));