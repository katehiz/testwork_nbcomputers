import $ from 'jquery';

export const Accordion = (function (document) {
	function init() {
		let toggleButtons = document.querySelectorAll(".toggle-btn");
		if (!toggleButtons) return;
		[...toggleButtons].forEach(function (button) {
			let optionGroupBody = $(button).parents('.option-group__head').next();
			if (!optionGroupBody.length) return;
			button.addEventListener("click", function () {
				optionGroupBody.slideToggle(300, () => {
					this.classList.toggle('toggled');
				});
			});
		});
	}
	return {
		init: init
	};
}(window.document));
