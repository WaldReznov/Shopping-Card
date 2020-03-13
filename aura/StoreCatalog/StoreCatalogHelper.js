/**
 * Created by vershov on 31.01.2020.
 */

({
    doInitHelper : function(component, event, helper) {
        let action = component.get('c.getAllProducts');
        var pageSize = component.get("v.pageSize");

        action.setCallback(this,$A.getCallback(function (response){
            let state = response.getState();
            if(state === 'SUCCESS') {
                let data = JSON.parse(response.getReturnValue());
                component.set('v.data', JSON.parse(response.getReturnValue()));

                let menuTypes = helper.getMenuTypes(data);

                component.set('v.menu', helper.createMenu(component, helper, menuTypes));

                component.set('v.data', helper.sortByProperty(data, component, helper));
                component.set('v.currentData', component.get('v.data')[component.get('v.currentType')]);
                if(component.get('v.search') !== '') {
                    component.set('v.currentData', helper.searchProducts(component.get('v.currentData'), component.get('v.search')));
                }
                component.set('v.currentProducts', component.get('v.currentData')[0]);
                //pagination
                component.set('v.currentEndNumber', component.get('v.currentStartNumber') + component.get('v.pageSize') - 1);
                component.set('v.currentDataSize', component.get('v.data')[component.get('v.currentType')].length);
                component.set('v.numberOfPages', component.get('v.currentData').length);

                helper.changePaginationHelper(component, event, helper);
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
        }));

        $A.enqueueAction(action);
    },

    getMenuTypes : function(data){
        let menu = new Set();

        for(let i = 0; i < data.length; i++){
            menu.add(data[i].productType);
        }

        menu = Array.from(menu);
        return menu;
    },

    sortByProperty: function (elements, component, helper) {
        let sortedElements = {};

        for (let i = 0; i < elements.length; i++) {
            if (!sortedElements.hasOwnProperty(elements[i]["productType"])) {
                sortedElements[elements[i]["productType"]] = [];
                sortedElements[elements[i]["productType"]].push(elements[i]);
            } else {
                sortedElements[elements[i]["productType"]].push(elements[i]);
            }

        }

        for(let prop in sortedElements) {
            sortedElements[prop] = helper.splitArrayToSubarray(sortedElements[prop], +component.get('v.pageSize'));
        }

        return sortedElements;
    },

    splitArrayToSubarray : function(elements, size) {
        let array = [];
        let subArray = [];
        let count = 0;
        for(let i = 0; i < elements.length; i++) {
            if(size === count){
                    array.push(subArray);
                subArray = [];
                count = 0;
               }
            subArray.push(elements[i]);
            if(i === elements.length -1){
               array.push(subArray);         
            }
            count++;
        }
        
        return array;
    },

    searchProducts : function(currentData, search) {
        search = search.toLowerCase();
        let arr = [];

        for(let i = 0; i < currentData.length; i++){
            for(let j = 0; j < currentData[i].length; j++){
                if(currentData[i][j]['name'].toLowerCase().indexOf(search) !== -1) {
                   arr.push(currentData[i][j]) ;
                }
            }
        }

        return arr;
    },

    changeSearchHelper : function(component, event, helper) {
        var querySearch = component.find('enter-search').get('v.value');
        let data = component.get('v.data')[component.get('v.currentType')];
        let size = component.get('v.pageSize');
        component.set('v.currentData', data);

        if(querySearch !== '') {
            data = helper.searchProducts(data, querySearch);
            data = helper.splitArrayToSubarray(data, +size);
        }

        component.set('v.currentData', data);
        component.set('v.currentProducts', data[0]);
        component.set('v.numberOfPages', component.get('v.currentData').length);

        if(component.get('v.currentData').length === 0) {
            component.set('v.numberOfPages', 1);
        } else {
            component.set('v.numberOfPages', component.get('v.currentData').length);
        }
        helper.changePaginationHelper(component, event, helper);
    },

    paginationPrevHelper : function(component, event, helper) {
        if(component.get('v.indexOfData') !== 0) {
            component.set('v.indexOfData', component.get('v.indexOfData') - 1);
            component.set('v.currentProducts', component.get('v.currentData')[component.get('v.indexOfData')]);
            
            helper.changePaginationHelper(component, event, helper);
        }
    },

    paginationNextHelper : function(component, event, helper) {
        if(component.get('v.indexOfData') + 1 !== component.get('v.currentData').length) {
            component.set('v.indexOfData', component.get('v.indexOfData') + 1);
            component.set('v.currentProducts', component.get('v.currentData')[component.get('v.indexOfData')]);

            helper.changePaginationHelper(component, event, helper);
        }
    },

    changePaginationHelper : function(component, event, helper) {
        let size;

        if (component.get('v.numberOfPages') === 1){
            if(component.get('v.currentProducts') !== undefined) {
                size = component.get('v.currentProducts').length;
            } else {
                size = 0;
            }
        } else if(component.get('v.numberOfPages') === component.get('v.indexOfData') + 1) {
            size = component.get('v.currentData').flat().length;
        } else {
            size = component.get('v.pageSize') * (component.get('v.indexOfData') + 1);
        }

        component.set('v.currentEndNumber', size);

        if(component.get('v.currentEndNumber') === 0) {
            component.set('v.currentStartNumber', 0);
            component.set('v.productsSize', 0);
        } else {
            component.set('v.productsSize', component.get('v.currentData').flat().length);
            component.set('v.currentStartNumber', component.get('v.pageSize') * component.get('v.indexOfData') + 1);
        }
        
        component.set('v.currentPage', component.get('v.indexOfData') + 1);

    },

    setTypeHelper : function(component, event, helper) {
        component.set('v.indexOfData', 0);
        let params = event.getParam('arguments');
        let type = params.type; 

        component.set('v.currentType', type);

        helper.changeRecordPerPage(component, event, helper);
    },

    changeRecordPerPage : function(component, event, helper) {
        component.set('v.pageSize', component.find('recordPerPage').get('v.value'));
        component.set('v.currentPage', 1);
        component.set('v.indexOfData', 0);

        let data = JSON.parse(JSON.stringify(component.get('v.data')));
        let size = component.get('v.pageSize');

        for(let prop in data) {
            let item = data[prop].flat();
            data[prop] = helper.splitArrayToSubarray(item, +size);
        }

        component.set('v.data', data);
        component.set('v.numberOfPages', component.get('v.currentData').length);
        helper.changeSearchHelper(component, event, helper);
        component.set('v.currentDataSize', component.get('v.data')[component.get('v.currentType')].length);
    },

    createMenu : function(component, helper, menuNames) {
        let menu = [];
        let randomInt = helper.getRandomInt(menuNames.length - 1);
        for(let i = 0; i < menuNames.length; i++){
            if(randomInt === i) {
                menu.push({name : menuNames[i], selected: true});
                component.set('v.currentType', menuNames[i]);
                
            } else {
                menu.push({name : menuNames[i]});
            }
        }

        return menu;
    },

    getRandomInt : function(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }


});