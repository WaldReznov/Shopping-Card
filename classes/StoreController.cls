public with sharing class StoreController {

    @AuraEnabled
    public static String getAccountId(){
        List<Account> accounts = [SELECT Id FROM Account WHERE OwnerId =:UserInfo.getUserId() LIMIT 1];
        System.debug('accccc');
        System.debug(accounts);
        if(accounts.size() == 0) {
            User user = [SELECT Id, FirstName, LastName, Phone, Email FROM User WHERE Id =:UserInfo.getUserId() LIMIT 1];
            System.debug(user);
            Account acc = new Account(
                Name = user.FirstName + '-' + user.LastName,
                Email__c = user.Email,
                Phone = String.valueOf(user.Phone)
            );
            System.debug(acc);
            insert acc;
            System.debug('accccc2222');
            System.debug(acc);
            return acc.Id;
        }
        
        return accounts[0].Id;
        
    }

}