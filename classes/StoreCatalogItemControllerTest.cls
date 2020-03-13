@isTest
public with sharing class StoreCatalogItemControllerTest {
   
    @TestSetup
    static void makeData(){
        Account acc = new Account(Name='test', Email__c='email@mail.ru', Phone='123123');
        insert acc;
        Id pricebookId = Test.getStandardPricebookId();

        Opportunity opp = new Opportunity(Name='test', Pricebook2Id=pricebookId, AccountId=acc.Id, StageName='Order not paid', CloseDate = Date.today().addMonths(2));
        insert opp;
        Product2 product = new Product2(Name='test', Type__c='Liquids', IsActive=true);
        insert product;
        PricebookEntry pricebookEntry = new PricebookEntry(
            IsActive=true, 
            UnitPrice=12, 
            Pricebook2Id=pricebookId,
            Product2Id=product.Id
        );
        insert pricebookEntry;
        OpportunityLineItem opportunityLineItem = new OpportunityLineItem(UnitPrice=12, Quantity=1, OpportunityId = opp.Id, Product2Id = product.Id);
        insert opportunityLineItem;
    }

    @IsTest
    static void updateOpportunityLineItem(){
        
        String accountId = [SELECT Id FROM Account LIMIT 1].Id;
        String productId = [SELECT Id FROM Product2 LIMIT 1].Id;
        StoreCatalogItemController.addOpportunityProduct(productId, 123, 12, accountId);
        System.assertEquals(124, [SELECT Quantity FROM OpportunityLineItem].Quantity);

    }

    @IsTest
    static void createOpportunityLineItem(){
        
        String accountId = [SELECT Id FROM Account LIMIT 1].Id;
        String productId = [SELECT Id FROM Product2 LIMIT 1].Id;
        delete [SELECT Id FROM OpportunityLineItem];
        StoreCatalogItemController.addOpportunityProduct(productId, 123, 12, accountId);
        System.assertEquals(123, [SELECT Quantity FROM OpportunityLineItem].Quantity);

    }

}