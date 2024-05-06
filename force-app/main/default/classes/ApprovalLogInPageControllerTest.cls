@isTest
private class ApprovalLogInPageControllerTest {
    @isTest
    static void testGetContactByEmail() {
        // Load Custom Metadata Type records for testing
        Credit_App_Email__mdt objMdt = new Credit_App_Email__mdt();
       
        Test.startTest();
        // Test with non-existing email
       String contactEmail = ApprovalLogInPageController.getContactByEmail('nonexisting@example.com');
        System.assertEquals(null, contactEmail, 'Contact email should not be found');
        Test.stopTest();
    }
    
    @isTest
    static void testSendOTP() {
        // Test with existing email
        // Create a mock contact for the existing email
        Contact mockContact = new Contact(LastName = 'Test Contact', Email = 'test2@example.com');
        insert mockContact;
        
        Test.startTest();
       Integer generatedOTP = ApprovalLogInPageController.sendOTP('nonexisting@example.com');
        System.assertEquals(null, generatedOTP, 'No OTP should be generated for non-existing email');
        Test.stopTest();
    }
    
    
    @isTest
    static void testValidateOTP() {
        
        // Test with non-existing email
        Test.startTest();
      String contactEmail = ApprovalLogInPageController.validateOTP('nonexisting@example.com');
        System.assertEquals(null, contactEmail, 'No contact email should be found for validation');
        Test.stopTest();
    }
    
    @isTest
    static void testSendOTPByEmail() {
        // Set up test data: Contact
        Contact testContact = new Contact();
        testContact.FirstName = 'Test';
        testContact.LastName = 'Contact';
        testContact.Email = 'testcontact@example.com';
        insert testContact;
        
        // Call the method to be tested
        Test.startTest();
        ApprovalLogInPageController.sendOTPByEmail(testContact.Email, '4567');
        
        
        System.assertEquals(1, Limits.getEmailInvocations(), 'Email should have been sent');
        Test.stopTest();
    }
}