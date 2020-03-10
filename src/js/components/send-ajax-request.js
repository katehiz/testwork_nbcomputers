export const SendAjaxRequest = function(method = "GET", url, data) {
	let xhr = new XMLHttpRequest();
	return new Promise(function (resolve, reject) {
		xhr.open(method, url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				resolve(xhr.response);
			} else {
				reject(new Error(`Ошибка получения данных: ${this.statusText}`));
			}
		};
		xhr.onerror = function () {
			reject(new Error(`Ошибка получения данных: ${this.statusText}`));
		};
		xhr.send(data);
	});
};