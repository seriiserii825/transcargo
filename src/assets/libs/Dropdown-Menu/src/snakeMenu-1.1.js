;
(function (global, jquery, factory) {

	//checking if jQuery is linked before snakeMenu
	if (!jquery) {
		throw new Error("jQuery is not definded. Please add the jQuery file before snakeMenu.js!");
	} else {
		factory(global, jquery);
	}
}(typeof window !== "undefined" ? window : this, typeof jQuery !== "undefined" ? jQuery : false, function (window, $) {

	//create snakeMenu object
	function SnakeMenu(element, options) {

		//Current options set by the caller including defaults.
		this.options = $.extend({}, SnakeMenu.getDefaults(), options);

		//jQuery Plugin element.
		this.$element = $(element);

		//snakeMenu events
		this.snakeEvents = {
			hoverSnakeBox: false,
			hoverSnakeMenu: false,
			snakeBoxOpen: false,
			openBoxWhenMouseStopped: false,
			noActiveElemHover: false,
			hoverMenuItemTemp: null,
			hoverMenuItemId: 'snakeMenuItemId', //data-item html
			cssAnimation: false,
			animationStart: 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart',
			animationEnd: 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend'
		}
	}


	//default options for snakeMenu
	SnakeMenu.Defaults = {
		menuCont: '.snakeMenu',
		menuItem: '.snakeMenuItem',
		menuItemData: 'menuitem',
		boxCont: '.snakeBox',
		boxItem: '.snakeBoxItem',
		boxItemData: 'boxitem',
		noActiveMenuItem: 'snakeItemNoActive',
		cssMenuItemActive: 'snm-item-active', //css Class need to mark the active menuItem
		destroySnakeRes: 767, //disabled snakeMenu when window resolution smaller than this
		mouseDelay: 250, //time need to invoke method that check if mouse wait on menuItem
		boxOffsetTop: 0,
		boxOffsetBottom: 0,
		boxOffsetLeft: 0,
		boxOffsetRight: 0,
		animOpen: null, //animation used to open menuCont
		animClose: null, //animation used to close menuCont
	};


	//function set default animations and return SnakeMenu.Defaults
	SnakeMenu.getDefaults = function () {
		SnakeMenu.Defaults.animOpen = function () {
			$(this.boxCont).slideDown(300);
		}
		SnakeMenu.Defaults.animClose = function () {
			$(this.boxCont).slideUp(200);
		}
		return SnakeMenu.Defaults;
	}


	//invoke snakeMenu methods
	SnakeMenu.prototype.initialize = function () {
		this.initSnakeMenuElems();
		this.setMenuContentOnHover();
		this.checkMousePos();
		this.checkAnimation();
		this.windowResize();
	};


	//initialize snakeMenu
	SnakeMenu.prototype.initSnakeMenuElems = function () {
		var self = this;

		//set boxItem classes with appropriate id
		$(self.options.boxItem).each(function () {
			var nr = $(this).data(self.options.boxItemData);
			$(this).addClass(self.options.boxItem.substr(1) + nr);
		});

		//set menuItem classes with appropriate id + add noActiveMenuItem class (to mark no active element)
		$(self.options.menuItem).each(function () {
			var nr = $(this).data(self.options.menuItemData);
			$(this).addClass(self.options.menuItem.substr(1) + nr);

			if ($(self.options.boxItem + nr).length) {
				if (!($(self.options.boxItem + nr).text())) {
					$(this).addClass(self.options.noActiveMenuItem);
				}
			}
			//when boxItem doesn't exist
			else {
				$(this).addClass(self.options.noActiveMenuItem);
			}
		});

		//hide boxCont element
		$(self.options.boxCont).hide();

		//hide boxItem elements and show only the first one
		$(self.options.boxItem).hide();
		$(self.options.boxItem).first().show();
	};


	//set temporary id when mouse enter or move on the menu element
	SnakeMenu.prototype.setMenuContentOnHover = function () {
		var self = this;
		var element = this.options.menuItem;
		$(element).each(function () {
			$(this).mouseenter(function () {
				self.snakeEvents.hoverMenuItemTemp = $(this).data(self.options.menuItemData);
			});
			$(this).mousemove(function () {
				self.snakeEvents.hoverMenuItemTemp = $(this).data(self.options.menuItemData);
			});
		});
	};

	//set animationStart flag when css animation started or ended
	SnakeMenu.prototype.checkAnimation = function () {
		var self = this;
		$(self.options.boxCont).on(self.snakeEvents.animationStart, function () {
			self.snakeEvents.cssAnimation = true;
		});

		$(self.options.boxCont).on(self.snakeEvents.animationEnd, function () {
			self.snakeEvents.cssAnimation = false;
		});
	};


	//check mouse position
	SnakeMenu.prototype.checkMousePos = function () {
		var self = this;

		//trigger that check if mouse move in the menuCont
		$(document).mousemove(function (event) {

			//disable snakeMenu when snakeCont is not visible
			var menuContVisible = $(self.options.menuCont).css('display') === 'block' ? true : false;

			//disable snakeMenu when resolution is smaller than destroySnakeRes
			if ($(window).width() > self.options.destroySnakeRes) {
				if (menuContVisible) {

					//mouse screen coordinates
					var mouseX = event.pageX;
					var mouseY = event.pageY;

					//menuCont location params
					var snakeMenuTop = $(self.options.menuCont).offset().top;
					var snakeMenuLeft = $(self.options.menuCont).offset().left;
					var snakeMenuBottom = snakeMenuTop + $(self.options.menuCont).height();
					var snakeMenuRight = snakeMenuLeft + $(self.options.menuCont).width();

					//set appropriate snakeEvents when mouse on menuCont
					if ((mouseX >= snakeMenuLeft) && (mouseX <= snakeMenuRight) && (mouseY >= snakeMenuTop) && (mouseY <= snakeMenuBottom)) {
						self.snakeEvents.hoverSnakeMenu = true;

						//invoke method that check if mouse wait on menuItem or is moving
						self.checkMousePousePosition();
					} else {
						self.snakeEvents.hoverSnakeMenu = false;
						self.snakeEvents.hoverMenuItemTemp = 'false';
					}

					//boxCont location params
					var boxOffsetTop = $(self.options.boxCont).offset().top - self.options.boxOffsetTop;
					var boxOffsetLeft = $(self.options.boxCont).offset().left - self.options.boxOffsetLeft;
					var boxEndTop = boxOffsetTop + $(self.options.boxCont).height() + self.options.boxOffsetBottom;
					var boxEndLeft = boxOffsetLeft + $(self.options.boxCont).width() + self.options.boxOffsetRight;

					//set appropriate snakeEvents when mouse on boxCont
					if ((mouseX >= boxOffsetLeft) && (mouseX <= boxEndLeft) && (mouseY >= boxOffsetTop) && (mouseY <= boxEndTop)) {
						self.snakeEvents.hoverSnakeBox = true;
					} else {
						self.snakeEvents.hoverSnakeBox = false;
					}

					//invoke method that decide when open or close boxCont
					if (!self.snakeEvents.cssAnimation) {
						self.menuModalToggle();
					}
				}
			}
		});
	};

	//method set timeout function which check if hoverMenuItemTemp is equal to passed param
	SnakeMenu.prototype.checkMousePousePosition = function () {
		var self = this;

		//The temporary hover menu item id in this moment
		var tempFocusMenuItem = self.snakeEvents.hoverMenuItemTemp;
		setTimeout(function () {
			self.checkTempHoverId(tempFocusMenuItem);
		}, self.options.mouseDelay);
	};

	//check if hoverMenuItemTemp is equal to passed param and if cssAnimation is not in progress
	SnakeMenu.prototype.checkTempHoverId = function (tempFocusMenuItem) {
		var self = this;

		if (tempFocusMenuItem === self.snakeEvents.hoverMenuItemTemp && !self.snakeEvents.cssAnimation) {

			//check if hover menuItem is not active
			if ($(self.options.menuItem + tempFocusMenuItem).hasClass(self.options.noActiveMenuItem)) {
				self.snakeEvents.noActiveElemHover = true;
			} else {
				self.snakeEvents.noActiveElemHover = false;
			}

			//change boxCont content when mouse on different active menuItem
			if (self.snakeEvents.hoverMenuItemId !== tempFocusMenuItem && tempFocusMenuItem !== 'false' && (!self.snakeEvents.noActiveElemHover)) {
				self.snakeEvents.hoverMenuItemId = tempFocusMenuItem;

				//hide all boxItems
				$(self.options.boxItem).each(function () {
					$(this).hide();
				});

				//remove css class from each menuItem
				$(self.options.menuItem).each(function () {
					$(this).removeClass(self.options.cssMenuItemActive);
				});

				//show focus boxItem
				$(self.options.boxItem + tempFocusMenuItem).show();
			}

			//add css class to active element
			if (!self.snakeEvents.noActiveElemHover) {
				$(self.options.menuItem + tempFocusMenuItem).addClass(self.options.cssMenuItemActive);
			}

			self.snakeEvents.openBoxWhenMouseStopped = true;

			//invoke method that toggle the boxCont
			self.menuModalToggle();
		}
	};


	//method invoke open or close animation
	SnakeMenu.prototype.menuModalToggle = function () {
		var self = this;
		if (self.snakeEvents.hoverSnakeMenu && (!self.snakeEvents.snakeBoxOpen) && self.snakeEvents.openBoxWhenMouseStopped && (!self.snakeEvents.noActiveElemHover)) {
			self.animateMenuOpen();
		} else if ((!self.snakeEvents.hoverSnakeMenu) && (!self.snakeEvents.hoverSnakeBox) && self.snakeEvents.snakeBoxOpen) {
			self.animateMenuClose();
		} else if (self.snakeEvents.noActiveElemHover && self.snakeEvents.snakeBoxOpen) {
			self.animateMenuClose();
		}
	};

	//method invoke animation to open boxCont
	SnakeMenu.prototype.animateMenuOpen = function () {
		var self = this;
		self.options.animOpen();

		//set snakeBoxOpen var true -> snakeBox is open
		self.snakeEvents.snakeBoxOpen = true;
	};


	//method invoke animation to close boxCont
	SnakeMenu.prototype.animateMenuClose = function () {
		var self = this;
		self.options.animClose();

		//remove css class for each menuItems that mark active menuItem
		$(self.options.menuItem).each(function () {
			$(this).removeClass(self.options.cssMenuItemActive);
		});

		//set snakeBoxOpen var false -> snakeBox is closed
		self.snakeEvents.snakeBoxOpen = false;

		//set var only if mouse stopped on menuCont
		self.snakeEvents.openBoxWhenMouseStopped = false;
	};


	//method invoked when window is resizing
	SnakeMenu.prototype.windowResize = function () {
		var self = this;
		$(window).resize(function () {

			//close boxCont
			if (self.snakeEvents.snakeBoxOpen) {
				self.animateMenuClose();
			}
		});
	};


	//The jQuery Plugin for the snakeMenu
	$.fn.snakeMenu = function (options) {
		var snakeMenu = new SnakeMenu(this, options !== "undefined" ? options : {});
		snakeMenu.initialize();
		return this;
	}


	//The constructor for the jQuery Plugin
	$.fn.snakeMenu.Constructor = SnakeMenu;
}));
