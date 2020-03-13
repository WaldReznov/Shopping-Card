public with sharing class StoreCatalogItemController {
    
    @AuraEnabled
    public static String addOpportunityProduct(String productId, Decimal quantity, Decimal unitPrice, String accountId){
        Opportunity opp = [
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

        List<OpportunityLineItem> opportunityProducts = [
            SELECT 
                    Id, 
                    Quantity, 
                    UnitPrice 
            FROM 
                    OpportunityLineItem 
            WHERE 
                    OpportunityId =: opp.Id
                        AND
                    Product2Id =:productId
            LIMIT 
                    1
        ];
        
        if(opportunityProducts.size() != 0) {
            opportunityProducts[0].Quantity += quantity;
            opportunityProducts[0].UnitPrice = unitPrice;

            update opportunityProducts;
            return opportunityProducts[0].Id;
        } else {
            OpportunityLineItem opportunityItem = new OpportunityLineItem(
                OpportunityId = opp.Id, 
                Product2Id = productId, 
                Quantity = quantity, 
                UnitPrice = unitPrice
            );
            
            insert opportunityItem;
            return opportunityItem.Id;
        }        
    }

}