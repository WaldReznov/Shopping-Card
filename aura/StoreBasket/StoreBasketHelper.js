/**
 * Created by vershov on 31.01.2020.
 */

({

    getOpportunityProducts : function(component, event, helper){
        console.log('INIT BASKET');
        let action = component.get('c.getOpportunityProducts');
        
        action.setParams({accountId : component.get('v.accountId')});

        action.setCallback(this,$A.getCallback(function (response) {
            let state = response.getState();
            if (state === 'SUCCESS') {
                let products = (response.getReturnValue() === '') ? [] : JSON.parse(response.getReturnValue());
                         
                component.set('v.products', products);
                component.set('v.totalPrice', helper.getTotalPrice(products));
                component.set('v.totalQuantity', helper.getTotalQuantity(products));
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
            console.log('EndBasket');
        }));

        $A.enqueueAction(action);
    },

    changeAmountAndPriceHelper : function(component, event, helper) {

        let products = component.get('v.products');
        component.set('v.totalPrice', helper.countTotalPrice(products));
        component.set('v.totalQuantity', helper.getTotalQuantity(products));
            
    },

    getTotalPrice : function(elements) {
        const totalPrice = elements.reduce((accumulator, currentValue) => {
              return accumulator + currentValue.totalPrice;
        }, 0);

        return totalPrice;
    },

    countTotalPrice : function(elements) {
        const totalPrice = elements.reduce((accumulator, currentValue) => {
            return accumulator + (currentValue.unitPrice * currentValue.quantity);
        }, 0);

        return totalPrice;
    },

    getTotalQuantity : function(elements) {
        let totalQuantity = 0;

        for(let i = 0; i < elements.length; i++) {
            totalQuantity += elements[i].quantity;
        }

        return totalQuantity;
    },

    addProductHelper : function(component, event, helper){
        let products = component.get('v.products');

        let product = {
            name : event.getParam("name"),
            productId : event.getParam("productId"),
            quantity : event.getParam("quantity"),
            totalPrice : event.getParam("totalPrice"),
            unitPrice : event.getParam("unitPrice"),
            url : event.getParam("url"),
            opportunityProductId : event.getParam("opportunityProductId")
        };
        console.log('PRODUCT', product);

        component.set('v.products', helper.addProductToProducts(products, product));
        helper.changeAmountAndPriceHelper(component, event, helper);
    },

    addProductToProducts: function (products, product) {   
        let isValid = true;

        for(let i = 0; i < products.length; i++) {
            if(products[i].productId === product.productId){
                products[i].quantity += product.quantity;
                products[i].totalPrice = product.quantity * product.unitPrice;
                isValid = false;
            }
        }
        
        console.log('IS VALID: ', isValid);

        if(isValid === true) {
            products.push(product);
        }
        
        return products;
    }

});