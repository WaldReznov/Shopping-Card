public with sharing class Store {

    public static List<ContentVersion> getPicturesUrl(List<String> products){
        Set<Id> uniqProducts = new Set<Id>((List<Id>)products);
        List<ContentDocumentLink> contentDocumentLinks = [SELECT ContentDocumentId FROM ContentDocumentLink WHERE LinkedEntityId IN:uniqProducts];

        Set<Id> contentIds = new Set<Id>();
        for (ContentDocumentLink item : contentDocumentLinks) {
            contentIds.add(item.ContentDocumentId);
        }

        List<ContentVersion> contents = [
                SELECT 
                            Id, 
                            Description, 
                            FirstPublishLocationId, 
                            ContentDocumentId
                FROM    
                            ContentVersion
                WHERE
                            Description = 'Preview'
                                AND
                            ContentDocumentId IN :contentIds
                ORDER BY 
                            LastModifiedDate DESC
                LIMIT   
                            10000
        ];

        return contents;
    }

}