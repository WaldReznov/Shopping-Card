/**
 * Created by vershov on 31.01.2020.
 */

({
    doInit : function(component, event, helper) {
        helper.getOpportunityProducts(component, event, helper);
    },

    rerenderBasket : function(component, event, helper) {
        helper.getOpportunityProducts(component, event, helper);
    },

    changeAmountAndPrice : function(component, event, helper) {
        helper.changeAmountAndPriceHelper(component, event, helper);
    },

    addProduct : function(component, event, helper) {
        helper.addProductHelper(component, event, helper);
    }
});