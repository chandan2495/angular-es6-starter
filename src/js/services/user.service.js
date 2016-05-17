class User {
	constructor(AppConstants, $http){
		'ngInject';
		this._AppConstants = AppConstants;
		this._$http = $http;
		this.current = null;
	}

	attemptAuth(type, credentials) {
		let route = (type === 'login') ? '/login' : '';	// similar to var but with block scoping http://stackoverflow.com/questions/762011/let-keyword-vs-var-keyword
		return this._$http({
			url: this._AppConstants.api + '/users' + route,
			method: 'POST',
			data: {
				user: credentials
			}
		}).then(
			(res) => {		// es6 arrow function
				this.current = res.data.user;
				return res;
			}
		);
	}
}

export default User;