class User {
	constructor(JWT, AppConstants, $http, $state, $q){
		'ngInject';

		this._JWT = JWT;
		this._AppConstants = AppConstants;
		this._$http = $http;
		this._$state = $state;
		this._$q  = $q;
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

				// set the JWT token
				this._JWT.save(res.data.user.token);
				this.current = res.data.user;
				return res;
			}
		);
	}

	logout() {
		this.current = null;
		this._JWT.destroy();
		// Do a hard reload of current state to ensure all data is flushed
		this.$state.go(this._$state.$current, null, {reload: true});
	}

	verifyAuth() {
		let deferred = this._$q.defer();
		 // Check for JWT token first
		if (!this._JWT.get()) {
			deferred.resolve(false);
			return deferred.promise;
		}

		// If there's a JWT & user is already set
		if (this.current)
			deferred.resolve(true);
		// If current user isn't set, get it from the server.
		// If server doesn't 401, set current user & resolve promise.
		else {
			this._$http({
				url: this._AppConstants.api + '/user',
				method: 'GET',
				// headers: {
				// 	Authorization: 'Token ' + this._JWT.get() 
				// }
			}).then(
				(res) => {
					this.current = res.data.user;
					deferred.resolve(true);
				},
				(err) => {
					this._JWT.destroy();
					deferred.resolve(false);
				}
				// Reject automatically handled by auth interceptor
				// Will boot them to homepage
			);
		}
		return deferred.promise;
	}

	// This method will be used by UI-Router resolves
	ensureAuthIs(bool) {
		let deferred = this._$q.defer();

		this.verifyAuth().then(
			(auth) => {
				if (authValid !== bool) {
					this._$state.go('app.home');
					deferred.resolve(false);
				} else {
					deferred.resolve(true);
				}				
			}
		)
		return deferred.promise();
	}
}

export default User;