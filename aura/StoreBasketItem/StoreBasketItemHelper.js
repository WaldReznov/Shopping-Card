/**
 * Created by vershov on 31.01.2020.
 */

({

    decreaseHelper : function(component, event, helper) {
        let count = component.get('v.quantity');

        if(count > 1) {
            component.set('v.quantity', count - 1);
            helper.updateProduct(component, event, helper);
        }
    },

    increaseHelper : function(component, event, helper) {
        let count = component.get('v.quantity');
        component.set('v.quantity', count + 1);
        helper.updateProduct(component, event, helper);
    },

    removeProductHelper : function(component, event, helper) {
        let opportunityId = component.get('v.opportunityProductId');

        component.set('v.opportunityProductId', undefined);
        component.set('v.unitPrice', 0);
        component.set('v.totalPrice', 0);
        component.set('v.quantity', 0);

        helper.fireUpdateProductEvent();

        let action = component.get('c.removeOpportunityProduct');
        
        action.setParams({id : opportunityId});

        action.setCallback(this, $A.getCallback(function (responce){
            let state = responce.getState();
            if(state === 'SUCCESS') {
                console.log('SUCCESS');
            }
        }));

        $A.enqueueAction(action);
    },

    updateProduct : function(component, event, helper) {
        helper.fireUpdateProductEvent();
        let action = component.get('c.updateOpportunityProduct');
        
        action.setParams({
            id : component.get('v.opportunityProductId'),
            quantity : component.get('v.quantity')
        });

        action.setCallback(this, $A.getCallback(function (responce){
            let state = responce.getState();
            if(state === 'SUCCESS') {
                console.log('SUCCESS');
            }
        }));

        $A.enqueueAction(action);
    },

    fireUpdateProductEvent : function(){
        var appEvent = $A.get("e.c:changeAmount");
        appEvent.fire();
    },

    fireDeleteProductEvent : function(){
        var appEvent = $A.get("e.c:StoreEvent");
        appEvent.fire();
    }

});