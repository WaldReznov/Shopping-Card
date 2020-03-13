/**
 * Created by vershov on 04.02.2020.
 */

({

  sendToParentHelper : function(component, event, helper) {
    component.changeCatalog(component.find('menu').get('v.value'));
  }

});