class _Fetch {
	constructor() {
	}

	isJSON(data) {
		let isJson = false;
		try {
			let json = JSON.parse(data);
			isJson = typeof json === 'object';
		} catch (ex) {

		}
		return isJson;
	}

	f_get(xhr, params) {
		let
				data = params['data'],
				paramsString = '';
		if (data) {
			for (let param in data) {
				paramsString += `${param}=${data[param]}&`;
			}
			xhr.open('GET', params['path'] + '?' + paramsString, true);
		} else {
			xhr.open("GET", params['path'], true);
		}
		xhr.send(null);
		return;
	}

	f_post(xhr, params) {
		let data = params['data'], params_string = '';
		if (data) {
			for (let param in data) {
				params_string+= `${param}=${encodeURIComponent(data[param])}&`;
			}
			xhr.open('POST', params['path'], true);
		} else {
			xhr.open('POST', params['path'], true);
		}
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(params_string);
	}

	f_json(xhr, params) {
		let data = params['data'], params_string = '';
		xhr.open('POST', params['path'], true);
		xhr.send(JSON.stringify(data));
	}

	statusHandler(status) {
		if (status === 404) {
			throw  new Error(`Не найден файл запроса: ${params['path']}`);
		}
		return true;
	}

	fetch(method, params) {
		const _ = this;
		return new Promise((resolve) => {
			const xhr = new XMLHttpRequest();
			let data = params['data'];
			xhr.onload = function (e) {
				let
						receivedText = xhr.responseText,
						outData = receivedText;
				if (_.isJSON(receivedText)) {
					outData = JSON.parse(receivedText);
				}
				resolve(outData);
			}
			switch (method.toUpperCase()) {
				case "GET": {
					_.f_get(xhr, params);
				}
					break;
				case "POST": {
					_.f_post(xhr, params);
				}
					break;
				case "JSON": {
					_.f_json(xhr, params);
				}
					break;
			}

		});
	}
}

export {_Fetch}