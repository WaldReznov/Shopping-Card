/**
 * Created by vershov on 30.01.2020.
 */

public with sharing class StoreCatalogController {

    public class ProductWrapper {
        public String url { get; set; }
        public String name { get; set; }
        public String pricebookId { get; set; }
        public String id { get; set; }
        public String productId { get; set; }
        public String productType { get; set; }
        public Decimal unitPrice { get; set; }
    }

    @AuraEnabled
    public static String getAllProducts() {
        Id pricebook;
        if(Test.isRunningTest()) {
            pricebook = Test.getStandardPricebookId();
        } else {
            pricebook = [SELECT Id FROM Pricebook2 WHERE isStandard = true].Id;
        }
        List<PricebookEntry> pricebookEntries = [
                SELECT
                        Id,
                        Name,
                        UnitPrice,
                        Pricebook2.Id,
                        Product2.Type__c,
                        Product2.Id
                FROM    
                        PricebookEntry
                WHERE   
                        Product2.Type__c != null
                            AND
                        Pricebook2Id =:pricebook
                LIMIT   
                        10000
        ];

        List<ContentVersion> picturesUrl = Store.getPicturesUrl(getProductsId(pricebookEntries));

        return JSON.serialize(getProductWrapperItems(pricebookEntries, picturesUrl));
    }

    public static List<String> getProductsId(List<PricebookEntry> pricebookEntries) {
        List<String> products = new List<String>();

        for(PricebookEntry pricebookEntryItem : pricebookEntries){
            if(pricebookEntryItem.Product2.Id != null) {
                products.add(pricebookEntryItem.Product2.Id);
            }
        }

        return products;
    }

    public static List<ProductWrapper> getProductWrapperItems(List<PricebookEntry> pricebookEntries, List<ContentVersion> contents) {
        List<ProductWrapper> productWrapperItems = new List<ProductWrapper>();

        for(PricebookEntry pricebookEntryItem : pricebookEntries){
            ProductWrapper productWrapperItem = new ProductWrapper();

            productWrapperItem.id = pricebookEntryItem.Id;
            productWrapperItem.pricebookId = pricebookEntryItem.Pricebook2.Id;
            productWrapperItem.name = pricebookEntryItem.Name;
            productWrapperItem.unitPrice = pricebookEntryItem.UnitPrice;
            productWrapperItem.productId = pricebookEntryItem.Product2.Id;
            productWrapperItem.productType = pricebookEntryItem.Product2.Type__c;

            for (ContentVersion contentItem : contents) {
                if (pricebookEntryItem.Product2.Id == contentItem.FirstPublishLocationId) {
                    productWrapperItem.url = Url.getSalesforceBaseUrl().toExternalForm() + '/sfc/servlet.shepherd/version/renditionDownload?rendition=ORIGINAL_Png&versionId=' + contentItem.Id;
                }
            }

            productWrapperItems.add(productWrapperItem);
        }

        return productWrapperItems;
    }

}