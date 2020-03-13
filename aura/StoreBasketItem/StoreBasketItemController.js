/**
 * Created by vershov on 31.01.2020.
 */

({

    decrease : function(component, event, helper) {
        helper.decreaseHelper(component, event, helper);
    },

    increase : function(component, event, helper) {
        helper.increaseHelper(component, event, helper);
    },

    removeProduct : function(component, event, helper) {
        helper.removeProductHelper(component, event, helper);
    }

});