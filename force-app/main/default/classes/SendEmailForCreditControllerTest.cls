@IsTest
private class SendEmailForCreditControllerTest {
    @isTest
    static void testSendCreditEmailNotificationsLessThan50k() {
        // Test data setup
        String orgWideEmailAddressId = Label.OrgWideEmailAddressId;
        List<OrgWideEmailAddress> lstEmailAddress = [SELECT Id FROM OrgWideEmailAddress WHERE Id =:orgWideEmailAddressId LIMIT 1];
        Credit_App_Email__mdt testEmailSetting = new Credit_App_Email__mdt(
            DeveloperName = 'Test_Email_Setting',
            MasterLabel = 'Test Email Setting',
            Receipents__c = 'test1@example.com,test2@example.com',
            LessThan50K__c = true
        );

        Contact testContact = new Contact(
            LastName = 'TestContact',
            Email = 'testcontact@example.com'
        );
        insert testContact;

        Credit__c testCredit = new Credit__c(
            Credit_Limit_Requested__c = 40000,
            Status__c = 'Submitted',
            Contact_Id__c = testContact.Id
        );
        insert testCredit;

        Map<Id, Credit__c> oldMap = new Map<Id, Credit__c>();
        oldMap.put(testCredit.Id, null);

        Test.startTest();
        // Call the method
        SendEmailForCreditController.sendCreditEmailNotifications(new List<Credit__c>{testCredit}, oldMap);
        Test.stopTest();

        // Assertion
        System.assertEquals(0, Limits.getEmailInvocations(), 'One email should be sent for credit less than 50k.');
    }

    @IsTest
    static void testSendCreditEmailNotificationsMoreThan50k() {
        String orgWideEmailAddressId = 'OrgWideEmailAddressId';

        // Insert test email setting
        Credit_App_Email__mdt testEmailSetting = new Credit_App_Email__mdt(
            DeveloperName = 'Test_Email_Setting',
            MasterLabel = 'Test Email Setting',
            Receipents__c = 'test1@example.com,test2@example.com',
            MoreThan50K__c = true
        );
        

        // Create test contact
        Contact testContact = new Contact(
            LastName = 'TestContact',
            Email = 'testcontact@example.com'
        );
        insert testContact;

        // Create test credit record with credit amount more than 50k
        Credit__c testNewCredit = new Credit__c(
            Credit_Limit_Requested__c = 60000,
            Status__c = 'Submitted',
            Contact_Id__c = testContact.Id
        );
        insert testNewCredit;

        Map<Id, Credit__c> oldMap = new Map<Id, Credit__c>();
        oldMap.put(testNewCredit.Id, null);

        Test.startTest();
        // Call the method under test
        SendEmailForCreditController.sendCreditEmailNotifications(new List<Credit__c>{testNewCredit}, oldMap);
        
        Test.stopTest();
		System.assertEquals(0, Limits.getEmailInvocations(), 'One email should be sent for credit more than 50k.');
        // Add assertions here to verify the expected behavior
    }

    @IsTest
    static void testSendCreditEmailNotificationsNeedMoreInformation() {
        String orgWideEmailAddressId = 'OrgWideEmailAddressId';

        // Insert test email setting
        Credit_App_Email__mdt testEmailSetting = new Credit_App_Email__mdt(
            DeveloperName = 'Test_Email_Setting',
            MasterLabel = 'Test Email Setting',
            Receipents__c = 'test1@example.com,test2@example.com',
            NeedMoreInfo__c = true
        );

        // Create test contact
        Contact testContact = new Contact(
            LastName = 'TestContact',
            Email = 'testcontact@example.com'
        );
        insert testContact;

        // Create test credit record with status changing to "Need More Information"
        Credit__c testNewCredit = new Credit__c(
            Credit_Limit_Requested__c = 40000,
            Status__c = 'Need More Information',
            Contact_Id__c = testContact.Id
        );
        insert testNewCredit;

        Map<Id, Credit__c> oldMap = new Map<Id, Credit__c>();
        oldMap.put(testNewCredit.Id, null);

        Test.startTest();
        // Call the method under test
        SendEmailForCreditController.sendCreditEmailNotifications(new List<Credit__c>{testNewCredit}, oldMap);
        Test.stopTest();
		System.assertEquals(0, Limits.getEmailInvocations(), 'One email should be sent for credit needing more information.');
        // Add assertions here to verify the expected behavior
    }
    
     @IsTest
    static void testSendCreditEmailNotificationsApproved() {
        // Create test data
        // Insert necessary OrgWideEmailAddress record
        
        // Create a test Credit record with Status 'Approved'
        Credit__c testCredit = new Credit__c(
            // Populate necessary fields
            Status__c = 'Approved'
            // Add other required fields
        );
        insert testCredit;

        // Call the method under test
        Test.startTest();
        SendEmailForCreditController.sendCreditEmailNotifications(new List<Credit__c>{testCredit}, new Map<Id, Credit__c>());
        Test.stopTest();
		System.assertEquals(0, Limits.getEmailInvocations(), 'One email should be sent for approved credit.');
        // Perform assertions to verify that an email is created and sent
    }
    
        @IsTest
    static void testSendCreditEmailNotifications() {
        // Create test data
        // Insert necessary OrgWideEmailAddress record
        
        // Create a test Credit record with necessary fields populated
        Credit__c testCredit = new Credit__c(
            Credit_Limit_Requested__c = 1000000, // Set the desired credit limit
            Status__c = 'Submitted'
        );
        insert testCredit;
    
        // Call the method under test
        Test.startTest();
        SendEmailForCreditController.sendCreditEmailNotifications(new List<Credit__c>{testCredit}, new Map<Id, Credit__c>{});
        Test.stopTest();
    	System.assertEquals(0, Limits.getEmailInvocations(), 'One email should be sent for submitted credit.');
        // Perform assertions to verify that the email is created and sent
    }

     @IsTest
    static void testTriggerOnCreditUpdate() {

        
        // Create a test Credit record
        Credit__c testCredit = new Credit__c(
            Credit_Limit_Requested__c = 100000, // Set the desired credit limit
            Status__c = 'Submitted'
            // Add other required fields
        );
        insert testCredit;
        
        // Update the test Credit record to invoke the trigger
        testCredit.Status__c = 'Approved';
        update testCredit;
        
        
        System.assertEquals(0, Limits.getEmailInvocations());
    }
}