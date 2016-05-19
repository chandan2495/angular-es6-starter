class JWT {
	constructor(AppConstants, $window) {
		'ngInject';

		this._AppConstants = AppConstants;
		this._$window = $window;
	}

	save(token) {
		this._$window.localStorage[this._AppConstants.jwtkey] = token;
	}
	get() {
		return this._$window.localStorage[this._AppConstants.jwtkey];
	}
	destroy(token) {
		this._$window.localStorage.removeItem(this._AppConstants.jwtkey);
	}
}

export default JWT;