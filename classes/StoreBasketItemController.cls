public with sharing class StoreBasketItemController {
    
    @AuraEnabled
    public static void removeOpportunityProduct(String id){
        delete [SELECT Id FROM OpportunityLineItem WHERE Id =:id];
    }

    @AuraEnabled
    public static void updateOpportunityProduct(String id, Decimal quantity){
        OpportunityLineItem opportunityProduct = [
            SELECT 
                    Id, 
                    Quantity, 
                    UnitPrice, 
                    TotalPrice 
            FROM    
                    OpportunityLineItem 
            WHERE 
                    Id =:id 
            LIMIT   
                    1
        ];

        opportunityProduct.Quantity = quantity;
        opportunityProduct.TotalPrice = quantity * opportunityProduct.UnitPrice;

        update opportunityProduct;
    }

}