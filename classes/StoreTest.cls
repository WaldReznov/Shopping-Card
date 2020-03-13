@isTest(SeeAllData=true)
public with sharing class StoreTest {
    @isTest
    static void methodName2(){
        
        System.assertNotEquals('', StoreCatalogController.getAllProducts());
        
    }
}