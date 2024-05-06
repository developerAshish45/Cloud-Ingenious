public with sharing class CaseController {
    @AuraEnabled(cacheable=true)
    public static List<Case> getAllCases() {
        return [SELECT Id, CaseNumber, Subject, Status, CreatedDate, Equipment_SO__c, Install_PO_Amount__c, Install_SO__c FROM Case Where RecordType.DeveloperName = 'Install' LIMIT 50000];
    }

    @AuraEnabled
    public static Contact doLogin(String userName, String password) {
        List<Contact> lstContact = [SELECT Name FROM Contact Where email =: userName and Password__c =: password LIMIT 1];
        return lstContact.size() > 0 ? lstContact[0] : null;
    }


/*
    @AuraEnabled
    public static List<Case> doLogin(String userName, String password) {
        List<Contact> lstContact = [SELECT Name FROM Contact Where email =: userName and Password__c =: password LIMIT 1];
        List<Case> lstCases;
        String contactId  = lstContact.size() > 0 ? lstContact[0].Id : null;
        if(contactId != null) {
            lstCases  = [SELECT Id, CaseNumber, Subject, Status, ContactId, Contact.Name, CreatedDate, Equipment_SO__c, Install_PO_Amount__c, Install_SO__c
                                 FROM Case Where RecordType.DeveloperName = 'Install' and AccountId =: contactId LIMIT 50000];
        }
        return lstCases;
    }*/
}