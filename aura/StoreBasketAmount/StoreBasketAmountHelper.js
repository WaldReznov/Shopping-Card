/**
 * Created by vershov on 04.02.2020.
 */

({

  changeStatusHelper: function (component, event, helper) {
    let action = component.get('c.changeTypeOppotunity');

    action.setParams({accountId : component.get('v.accountId')});

    action.setCallback(this, $A.getCallback(function (response) {
      let state = response.getState();
      if (state === 'SUCCESS') {
        console.log('SUCCESS');
        helper.fireEvent();
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

  fireEvent : function(){
    var appEvent = $A.get("e.c:StoreEvent");
    appEvent.fire();
  }

})