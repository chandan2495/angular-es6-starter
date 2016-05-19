class AuthCtrl {
	constructor($state ,User) {
		'ngInject';

		this.title = $state.current.title;
		this.authType = $state.current.name.replace('app.','');
		this._User = User;
	}

	submitForm() {
		this.isSubmitting = true;
		console.log(this.formData);

		this._User.attemptAuth(this.authType, this.formData).then(
			// callback for success
			(res) => {
				this.isSubmitting = false;
				console.log(res);
				this._$state.go('app.home');
			},
			(err) => {
				this.isSubmitting = false;
				console.log(err.data.errors);
				this.errors = err.data.erros;
			}
		);
	}
}

export default AuthCtrl;