/**
 * Created by vershov on 30.01.2020.
 */

({

	doInit: function (component, event, helper) {
		helper.doInitHelper(component, event, helper);
	},

	clickStore: function (component, event, helper) {
		console.log('clickStore');
		var cmpTarget = component.find('store__basket__container');
		console.log('delete');
		$A.util.removeClass(cmpTarget, 'active');
		document.body.removeAttribute('style', 'overflow: hidden;');
		console.log('delete');
	},

	showShoppingCart: function (component, event, helper) {
		document.body.setAttribute('style', 'overflow: hidden;');
		var cmpTarget = component.find('store__basket__container');
		$A.util.addClass(cmpTarget, 'active');
	},

	onTop: function (component, event, helper) {
		var scrollOptions = {
			left: 0,
			top: 0,
			behavior: 'smooth'
		}

		window.scrollTo(scrollOptions);
	}

});