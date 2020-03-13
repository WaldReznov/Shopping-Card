/**
 * Created by vershov on 31.01.2020.
 */

({

    decrease: function (component, event, helper) {
        helper.decreaseHelper(component, event, helper);
    },

    increase: function (component, event, helper) {
        helper.increaseHelper(component, event, helper);
    },

    addProduct: function (component, event, helper) {
        helper.addProductHelper(component, event, helper);
    }

});