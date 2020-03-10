import $ from 'jquery';
export const Accordion = (function (document) {
	function init() {
		let toggleButtons = document.querySelectorAll(".toggle-btn");
		if (!toggleButtons) return;
		[...toggleButtons].forEach(function (element) {
			let optionGroupBody = $(element).parents('.option-group__head').next();
			if (!optionGroupBody.length) return;
			element.addEventListener("click", function () {
				if ( this.classList.contains('toggled') ) {
					optionGroupBody.fadeOut();
				} else {
					optionGroupBody.fadeIn();
				}
				this.classList.toggle('toggled');
				//optionGroup.classList.toggle("show");
			});
		});
	}

	return {
		init: init
	};
}(window.document));

/*
export const Accordion = (function (document) {
	function init() {
		let toggleButtons = document.querySelectorAll(".toggle-btn");
		if (!toggleButtons) return;
		[...toggleButtons].forEach(function (element) {
			let optionGroup = element.closest(".option-group");
			if (!optionGroup) return;
			element.addEventListener("click", function () {
				this.classList.toggle('toggled');
				optionGroup.classList.toggle("show");
			});
		});
	}

	return {
		init: init
	};
}(window.document));*/
