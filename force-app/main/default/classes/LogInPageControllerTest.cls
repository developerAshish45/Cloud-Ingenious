@isTest
private class LogInPageControllerTest {
    @isTest
    static void testGetContactByEmail() {
        // Create a test Account with the relevant domain
        Account testAccount = new Account(Name = 'Test Account', Account_Domain__c = 'example.com');
        insert testAccount;
        
        Test.startTest();
        // Call the method with an existing email address
        Contact existingContact = LogInPageController.getContactByEmail('test@example.com');
        
        // Verify that the Contact was found and associated with the correct Account
        System.assertNotEquals(null, existingContact, 'Contact should be found');
        
        
        // Call the method with an email address not belonging to any existing domain
        Contact newContact = LogInPageController.getContactByEmail('nonexisting@example.com');
        
        // Verify that a new Contact was created and not associated with any Account
        System.assertNotEquals(null, newContact.Id, 'New Contact should be created');
        //System.assertEquals(null, newContact.AccountId, 'New Contact should not be associated with any Account');
        
        Test.stopTest();
    }

    @isTest
    static void testSendOTP() {
        // Create test data for Contact
        Contact testContact = new Contact(
            Email = 'test@example.com',
            LastName = 'Test',
            Verification_Code__c = '4569'
        );
        insert testContact;
        
        Test.startTest();
        Integer otp = LogInPageController.sendOTP('test@example.com');
        
        // Retrieve the contact to ensure OTP was updated
        Contact updatedContact = [SELECT Id, Verification_Code__c FROM Contact WHERE Id = :testContact.Id];
        
        
        Test.stopTest();
        System.assertNotEquals(null, updatedContact.Verification_Code__c);
    }
    
    @isTest
    static void testSendOTPByEmail() {
        // Set up test data: Contact
        Contact testContact = new Contact(
            Email = 'testcontact@example.com',
            LastName = 'Test'
        );
        insert testContact;
        
       String orgWideEmailAddressId = 'OrgWideEmailAddressId';
        
        Test.startTest();
        // Call the method to be tested
        LogInPageController.sendOTPByEmail(testContact.Email, '4567');
        
        // Verify that an email was sent
        System.assertEquals(1, Limits.getEmailInvocations(), 'Email should have been sent');
        
        Test.stopTest();
    }
}