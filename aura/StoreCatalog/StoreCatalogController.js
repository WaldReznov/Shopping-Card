/**
 * Created by vershov on 30.01.2020.
 */

({

    doInit : function(component, event, helper) {
        helper.doInitHelper(component, event, helper);
    },

    paginationPrev : function(component, event, helper) {
        helper.paginationPrevHelper(component, event, helper);
    },

    paginationNext : function(component, event, helper) {
        helper.paginationNextHelper(component, event, helper);
    },

    changePagination : function(component, event, helper) {
        helper.changePaginationHelper(component, event, helper);
    },

    changeSearch : function(component, event, helper) {
      helper.changeSearchHelper(component, event, helper);
    },

    setType : function(component, event, helper) {
        helper.setTypeHelper(component, event, helper);
    },

    changeType : function(component, event, helper) {
        component.set('v.currentData', component.get('v.data')[component.get('v.currentType')]);
        component.set('v.currentProducts', component.get('v.currentData')[0]);
    },

    changeRecordPerPage : function(component, event, helper) {
        helper.changeRecordPerPage(component, event, helper);
    },

    alerta : function(component, event, helper) {
        console.log('scroll');
    },

    onTop : function(component, event, helper) {
        var scrollOptions = {
            left: 0,
            top: 0,
            behavior: 'smooth'
        }
        window.scrollTo(scrollOptions);
    }
    

});