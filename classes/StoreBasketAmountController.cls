public with sharing class StoreBasketAmountController {
    
    @AuraEnabled
    public static void changeTypeOppotunity(String accountId){
        Opportunity opp = [
            SELECT 
                    StageName,
                    Account.Id,
                    Account.Email__c
            FROM   
                    Opportunity
            WHERE
                    StageName = 'Order not paid'
                        AND
                    AccountId =:accountId
            LIMIT
                    1
        ];
        
        opp.StageName = 'Order paid';

        update opp;
        // sendEmail(opp.Id, opp.Account.Id, opp.Account.Email__c);
    }

    public static void sendEmail(String opportunityId, String accountId, String accountEmail) {

        EmailTemplate emailTemplate = [SELECT Id, Subject, Body FROM EmailTemplate WHERE Name='Customers'];
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] { accountEmail };
        message.setTemplateId(emailTemplate.Id);
        message.setTreatTargetObjectAsRecipient(false);
        message.setTargetObjectId(UserInfo.getUserId());
        message.setWhatId(opportunityId);
        message.setSaveAsActivity(false);

        Messaging.SendEmailResult[] r = Messaging.sendEmail(new Messaging.SingleEmailMessage[] {message});

    }


}