/**
 * Created by vershov on 31.01.2020.
 */

({

    decreaseHelper : function(component, event, helper) {
        let count = component.get('v.count');

        if(count > 1) {
            component.set('v.count', count - 1);
        }
    },

    increaseHelper : function(component, event, helper) {
        let count = component.get('v.count');
        component.set('v.count', count + 1);
    },

    addProductHelper : function(component, event, helper){
        let opportunityProductId = component.get('v.opportunityProductId');
        let action = component.get('c.addOpportunityProduct');

        action.setParams({
            productId: component.get("v.productId"),
            quantity: component.get("v.count"),
            unitPrice: component.get("v.price"),
            accountId: component.get("v.accountId")
        });

        if(opportunityProductId !== undefined) {
            helper.fireAddProductEvent(component, event, helper);
        }

        action.setCallback(this, $A.getCallback(function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                component.set('v.opportunityProductId', response.getReturnValue());
                if(opportunityProductId === undefined) {
                    helper.fireAddProductEvent(component, event, helper);
                }
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        }));

        $A.enqueueAction(action);
        
        console.log('add product');
    },

    fireAddProductEvent : function(component, event, helper){
        var appEvent = $A.get("e.c:AddProduct");

        appEvent.setParams({
            name: component.get('v.name'),
            productId: component.get('v.productId'),
            quantity: component.get('v.count'),
            totalPrice: component.get('v.price') * component.get('v.count'),
            unitPrice: component.get('v.price'),
            url: component.get('v.pictureUrl'),
            opportunityProductId: component.get('v.opportunityProductId')
        });

        appEvent.fire();
        console.log('FIRE ADD PRODUCT EVENT');
    }

});