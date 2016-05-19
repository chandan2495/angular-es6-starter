function authInterceptor(JWT, AppConstants, $window, $q) {
	'ngInject';

	return {
		// automatically attach Authorization header
		request: function(config) {
			if(config.url.indexOf(AppConstants.api) === 0 && JWT.get()) {
				config.headers.Authorization = 'Token ' + JWT.get();
			}
			return config;
		},

		// handler 401 (unauthorized error)
		responseError: function(rejection) {
			if(rejection.status === 401) {
				JWT.destroy();
				// hard page refresh
				$window.location.reload();
			}
			return $q.reject(rejection);
		}
	};
}

export default authInterceptor;