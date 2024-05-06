@isTest
private class ProjectTriggerHandlerTest {
    
    @isTest
    static void testCreateRelatedInstall() {
        Account acc = new Account();
        acc.name = 'test';
       	acc.RecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByName().get('Installer/Surveyor').getRecordTypeId();
        acc.Type = 'Installer';
        insert acc;
        Project__c testProject1 = new Project__c(
            Name = 'Test Project1',
            Installation_Type__c = 'Reactive',
            Installer_Name__c = acc.Id
        );
        insert testProject1;
        List<Project__c> testProject = [Select Id, Name, Installation_Type__c, Customer_Name__c, Installer_Name__c, Site_Number__c,Site_Address__StateCode__s,
                                        Site_Address__Street__s, Site_Address__City__s, Site_Address__CountryCode__s, Site_Address__PostalCode__s From Project__c];
        Test.startTest();
        ProjectTriggerHandler.createRelatedInstall(testProject);
        Test.stopTest();
    }
}