@IsTest
public with sharing class StoreBasketItemControllerTest {
    
    @TestSetup
    static void makeData(){
        Test.startTest();

        Account acc = new Account(
            Name = 'test', 
            Email__c = 'email@mail.ru', 
            Phone = '123123'
        );
        insert acc;

        Id pricebookId = Test.getStandardPricebookId();

        Opportunity opp = new Opportunity(
            Name = 'test', 
            Pricebook2Id = pricebookId, 
            AccountId = acc.Id, 
            StageName = 'Order not paid', 
            CloseDate = Date.today().addMonths(2)
        );
        insert opp;

        Product2 product = new Product2(
            Name = 'test', 
            Type__c = 'Liquids', 
            IsActive = true
        );
        insert product;

        PricebookEntry pricebookEntry = new PricebookEntry(
            IsActive=true, 
            UnitPrice=12, 
            Pricebook2Id=pricebookId,
            Product2Id=product.Id
        );
        insert pricebookEntry;

        OpportunityLineItem opportunityLineItem = new OpportunityLineItem(
            UnitPrice = 12, 
            Quantity = 1, 
            OpportunityId = opp.Id, 
            Product2Id = product.Id
        );
        insert opportunityLineItem;
        
        ContentVersion testContVer = new ContentVersion();
        ContentDocumentLink testContDocLink = new ContentDocumentLink(); 

        testContVer.Title = 'Test Document 2';
        testContVer.PathOnClient = 'SF_ELO_Code.txt';
        testContVer.VersionData = Blob.valueOf('Test Content');   
        testContVer.IsMajorVersion = true;
        insert testContVer;

        String id1 = testContVer.Id;
        ContentVersion testContent = [
            SELECT 
                    id, 
                    ContentDocumentId 
            FROM 
                    ContentVersion 
            WHERE 
                    Id =:id1 
            LIMIT 
                    1
        ];

        testContDocLink.LinkedEntityId = product.Id;
        testContDocLink.ContentDocumentId = testContent.ContentDocumentId;
        insert testContDocLink;

        Test.stopTest();
    }

    @IsTest
    static void deleteOpportunityLineItem(){
        
        String opportunityLineItemId = [SELECT Id FROM OpportunityLineItem LIMIT 1].Id;
        StoreBasketItemController.removeOpportunityProduct(opportunityLineItemId);
        List<OpportunityLineItem> opportunityLineItems = [SELECT Id FROM OpportunityLineItem LIMIT 1];
        System.assert(opportunityLineItems.size() == 0);
        
    }

    @IsTest
    static void updateOpportunityLineItem(){
        
        String opportunityLineItemId = [SELECT Id FROM OpportunityLineItem LIMIT 1].Id;
        StoreBasketItemController.updateOpportunityProduct(opportunityLineItemId, 2);
        List<OpportunityLineItem> opportunityLineItems = [SELECT Quantity FROM OpportunityLineItem LIMIT 1];
        System.assert(opportunityLineItems[0].Quantity == 2);
        
    }

}