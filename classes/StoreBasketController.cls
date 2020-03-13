/**
 * Created by vershov on 31.01.2020.
 */

public with sharing class StoreBasketController {

    public class ProductWrapper {
        public String url { get; set; }
        public String name { get; set; }
        public String opportunityProductId { get; set; }
        public Decimal quantity { get; set; }
        public Decimal totalPrice { get; set; }
        public Decimal unitPrice { get; set; }
        public String productId { get; set; }
    }

    @AuraEnabled
    public static String getOpportunityProducts(String accountId) {
        
        String pricebook;

        if(Test.isRunningTest()) {
            pricebook = Test.getStandardPricebookId();
        } else {
            pricebook = [SELECT Id FROM Pricebook2 WHERE isStandard = true].Id;
        }
        
        if(isHaveOpportunity(accountId) == false) {
            createOpportunity(accountId, pricebook);
            
            return '';
        }

        List<OpportunityLineItem> opportunityLineItems = [
                SELECT
                        Id,
                        Name,
                        Quantity,
                        TotalPrice,
                        UnitPrice,
                        Product2.Id,
                        Product2.Name
                FROM    
                        OpportunityLineItem
                WHERE
                        Opportunity.StageName = 'Order not paid'
                            AND
                        Opportunity.AccountId =:accountId
                            AND
                        PricebookEntry.Pricebook2Id =:pricebook 
                LIMIT   
                        10000
        ];
        
        if(opportunityLineItems.size() != 0) {            
            List<ContentVersion> contents = Store.getPicturesUrl(getProductsId(opportunityLineItems));

            return JSON.serialize(getProductWrapperItems(opportunityLineItems, contents));
        }

        return '';

    }

    public static List<String> getProductsId(List<OpportunityLineItem> opportunityLineItems) {
        List<String> products = new List<String>();

        for(OpportunityLineItem opportunityLineItem : opportunityLineItems){
            if(opportunityLineItem.Product2.Id != null) {
                products.add(opportunityLineItem.Product2.Id);
            }
        }

        return products;
    }

    public static List<ProductWrapper> getProductWrapperItems(List<OpportunityLineItem> opportunityLineItems, List<ContentVersion> contents) {
        List<ProductWrapper> productWrapperItems = new List<ProductWrapper>();

        for(OpportunityLineItem opportunityLineItem : opportunityLineItems){
            ProductWrapper productWrapperItem = new ProductWrapper();

            productWrapperItem.name = opportunityLineItem.Product2.Name;
            productWrapperItem.productId = opportunityLineItem.Product2.Id;
            productWrapperItem.quantity = opportunityLineItem.Quantity;
            productWrapperItem.opportunityProductId = opportunityLineItem.Id;
            productWrapperItem.totalPrice = opportunityLineItem.TotalPrice;
            productWrapperItem.unitPrice = opportunityLineItem.UnitPrice;

            for (ContentVersion contentItem : contents) {
                if (opportunityLineItem.Product2.Id == contentItem.FirstPublishLocationId) {
                    productWrapperItem.url = Url.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Png&versionId=' + contentItem.Id;
                }
            }

            productWrapperItems.add(productWrapperItem);
        }

        return productWrapperItems;
    }

    public static Boolean isHaveOpportunity(String accountId) {
        List<Opportunity> opportunities = [
                SELECT  
                        Id
                FROM   
                        Opportunity
                WHERE
                        StageName = 'Order not paid'
                            AND
                        AccountId =:accountId
                LIMIT 
                        1
        ];

        return opportunities.size() != 0;
    }

    public static void createOpportunity(String accountId, String pricebookId) {
        insert new Opportunity(
            Name = 'Opportunity №' +  Datetime.now(),
            CloseDate = Date.today().addMonths(2), 
            StageName = 'Order not paid', 
            Pricebook2Id = pricebookId,
            AccountId = accountId
        );
    }


}