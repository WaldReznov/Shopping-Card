/**
 * Created by vershov on 30.01.2020.
 */

({

	doInitHelper: function (component, event, helper) {
		console.log('session: ', sessionStorage.getItem('accountId'));

		if (sessionStorage.getItem('accountId') === null) {
			let action = component.get('c.getAccountId');

			action.setCallback(this, $A.getCallback(function (response) {
				let state = response.getState();
				if (state === 'SUCCESS') {
					component.set('v.accountId', response.getReturnValue());
					let appEvent = $A.get("e.c:StoreInitializeComponent");

					appEvent.fire();
				} else if (state === "ERROR") {
					let errors = response.getError();
					if (errors) {
						if (errors[0] && errors[0].message) {
							console.log("Error message: " + errors[0].message);
						}
					} else {
						console.log("Unknown error");
					}
				}

				console.log(response.getReturnValue());
			}));

			$A.enqueueAction(action);
		} else {
			component.set("v.isAvailableCallCenter", true);
			component.set("v.url", sessionStorage.getItem('url'));
			component.set('v.accountId', sessionStorage.getItem('accountId'));
			let appEvent = $A.get("e.c:StoreInitializeComponent");
			appEvent.fire();
		}
	},

});