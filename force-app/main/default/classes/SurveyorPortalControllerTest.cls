/**
 * @description       : 
 * @author            : 
 * @group             : 
 * @last modified on  : 03-18-2024
 * @last modified by  : 
**/
@isTest
private class SurveyorPortalControllerTest {
    @isTest
    static void testGetVersionFiles() {
        // Create test data
        Site_Survey__c surveyRecord = new Site_Survey__c(
           Manufacturer_MediumTemp__c = 'Test Medium Temp'
        );
        insert surveyRecord;
        
        // Create test ContentVersion records related to the survey record
        ContentVersion testContentVersion1 = new ContentVersion(
            Title = 'Test File 1',
            PathOnClient = 'Test_File_1.txt',
            VersionData = Blob.valueOf('Test File 1 Content'),
            IsMajorVersion = true,
            ContentDocumentId = null, 
            FirstPublishLocationId = surveyRecord.Id,
            Guest_Record_fileupload__c = 'Test1RecordId:' + surveyRecord.Id
        );
        insert testContentVersion1;
        
        ContentVersion testContentVersion2 = new ContentVersion(
            Title = 'Test File 2',
            PathOnClient = 'Test_File_2.txt',
            VersionData = Blob.valueOf('Test File 2 Content'),
            IsMajorVersion = true,
            ContentDocumentId = null, // You can set this if needed
            FirstPublishLocationId = surveyRecord.Id,
            Guest_Record_fileupload__c = 'TestRecordId:' + surveyRecord.Id
        );
        insert testContentVersion2;
        
        Test.startTest();
        // Call the method to test
        List<ContentVersion> files = SurveyorPortalController.getVersionFiles(surveyRecord.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, files);
        System.assertNotEquals(0, files.size());
    }
    
    @isTest
    static void testGetSurveyRecord() {
        // Create test data
        Site_Survey__c surveyRecord = new Site_Survey__c(
            Manufacturer_MediumTemp__c = 'Test Medium Temp'
        );
        insert surveyRecord;
        
        Test.startTest();
        // Call the method to test
        Site_Survey__c retrievedRecord = SurveyorPortalController.getSurveyRecord(surveyRecord.Id);
        Test.stopTest();
        
        System.assertNotEquals(null, retrievedRecord);
    }
    
    @isTest
    static void testUpdateSurveyRecord() {
        // Create test data
        Site_Survey__c surveyRecord = new Site_Survey__c(
            Survey_Status__c = 'In Progress'
        );
        insert surveyRecord;
        
        Test.startTest();
        surveyRecord.Survey_Status__c = 'Submitted';
        Site_Survey__c updatedSurveyRecord = SurveyorPortalController.updateSurveyRecord(surveyRecord);
        Test.stopTest();
        
        updatedSurveyRecord = [SELECT Id, Survey_Status__c FROM Site_Survey__c WHERE Id = :surveyRecord.Id];
        System.assertEquals('Submitted', updatedSurveyRecord.Survey_Status__c, 'Survey status should be "Submitted"');
    
    }
    
    
    @isTest
    static void testCreateNote() {
        // Create test data
        Site_Survey__c surveyRecord = new Site_Survey__c(
            Manufacturer_MediumTemp__c = 'Test Medium Temp'
        );
        insert surveyRecord;
        Test.startTest();
        // Call the method to test
        String result = SurveyorPortalController.createNote('Test Note', 'Test Body', surveyRecord.Id);
        Test.stopTest();
        
        System.assertEquals('Success', result);
    }
    
    @isTest
    static void testGetNote() {
        // Create test data
        Site_Survey__c surveyRecord = new Site_Survey__c(
            // Set other required fields here
        );
        insert surveyRecord;
        
        // Create a test note
        ContentNote testNote = new ContentNote(
            Title = 'Test Note',
            Content = Blob.valueOf('Test Body')
        );
        insert testNote;
        
        // Create a ContentDocumentLink to associate the note with the survey record
        ContentDocumentLink docLink = new ContentDocumentLink(
            LinkedEntityId = surveyRecord.Id,
            ContentDocumentId = testNote.Id,
            ShareType = 'V'
        );
        insert docLink;
        
        Test.startTest();
        // Call the method to test
        String noteContent = SurveyorPortalController.getNote(surveyRecord.Id, 'Test Note');
        Test.stopTest();
        
        System.assertEquals('Test Body', noteContent);
    }
    
    @isTest
    static void testGetProjectRecord() {
        // Test data setup
        Project__c testProject = new Project__c(Name = 'Test Project');
        insert testProject;
        
        // Call the method
        Test.startTest();
        Project__c returnedProject = SurveyorPortalController.getProjectRecord(testProject.Id);
        Test.stopTest();
        
        // Assertions
        System.assertEquals(testProject.Id, returnedProject.Id, 'Returned project Id should match expected Id');
        System.assertEquals(testProject.Name, returnedProject.Name, 'Returned project Name should match expected Name');
    }
    
    @isTest
    static void testSendEmailWithSurveyId() {
        // Set up test data: Contact
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.Email = 'testcontact@example.com';
        insert testContact;
        
         String userId = UserInfo.getUserId();
        Project__c objProj = new Project__c();
        objProj.Name = 'Test Project';
        objProj.OwnerId = userId;
        insert objProj;
        
        // Set up test data: Survey record
        Site_Survey__c testSurvey = new Site_Survey__c(Contact__c = testContact.Id, Project__c = objProj.Id);
        insert testSurvey;
        
       
        
        // Call the method to be tested
        Test.startTest();
        SurveyorPortalController.sendEmailWithSurveyId(testSurvey.Id);
       
        
        System.assertEquals(1, Limits.getEmailInvocations(), 'Email should have been sent');
         Test.stopTest();
    }
    
}