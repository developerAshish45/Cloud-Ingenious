@isTest
public class CreditFormControllerTest {
    @isTest
    static void testCreateCompanyInformation() {
        // Test data
        Account ac =new Account();
        ac.Name = 'Test';
        insert ac;
        String accountDomain = 'example.com';
        String recordId = ac.Id;
        String businessName = 'Test Business';
        String yearStarted = '2022';
        String parentCompany = 'Parent Company';
        String radioGroup = 'Yes';
        String groupName = 'Group Name';
        String phone = '1234567890';
        String physicalAddress = '123 Main St';
        String physicalCity = 'City';
        String physicalState = 'State';
        String physicalZip = '12345';
        String mailingAddress = '456 Park Ave';
        String mailingCity = 'City';
        String mailingState = 'State';
        Integer mailingZip = 54321;
        String billingAddress = '789 Elm St';
        String billingCity = 'City';
        String billingState = 'State';
        String billingZip = '67890';
        String apName = 'AP Name';
        String contact = 'Contact Name';
        String email = 'test@example.com';
        String invoiceEmail = 'invoice@example.com';
        String orderEmail = 'order@example.com';
        String timeZone = 'UTC';
        String resaleNumber = '123456789';
        Integer duns = 987654321;
        String website = 'http://www.example.com';
        
        // Start test execution
        Test.startTest();
        // Call the method
        Id accountId = CreditFormController.createCompanyInformation(
            accountDomain, recordId, businessName, yearStarted, parentCompany, radioGroup, groupName, phone, physicalAddress,
            physicalCity, physicalState, physicalZip, mailingAddress, mailingCity, mailingState, mailingZip,
            billingAddress, billingCity, billingState, billingZip, apName, contact, email, invoiceEmail, orderEmail,
            timeZone, resaleNumber, duns, website
        );
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, accountId, 'Account Id should not be null');
        // Add more assertions as needed
    }
    @isTest
    static void testCreateCreditRecord() {
        // Test data
        List<Credit__c> creditData = new List<Credit__c>();
        Credit__c credit1 = new Credit__c(
            // Populate fields as needed
        );
        Credit__c credit2 = new Credit__c(
            // Populate fields as needed
        );
        creditData.add(credit1);
        creditData.add(credit2);
        
        // Start test execution
        Test.startTest();
        // Call the method
        List<Credit__c> result = CreditFormController.createCreditRecord(creditData);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, result, 'Result should not be null');
        System.assertEquals(2, result.size(), 'Result size should be 2');
        // Add more assertions as needed
    }
    
    @isTest
    public static void testUpdateContactRecord() {
        // Test data setup
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        Contact testContact = new Contact(
            LastName = 'Test',
            AccountId = testAccount.Id
        );
        insert testContact;
        
        Date updatedDate = Date.today();
        String conId = testContact.Id;
        String lastName = 'TestLastName';
        String firstName = 'TestFirstName';
        String title = 'TestTitle';
        String phoneNumber = '1234567890';
        
        // Start test execution
        Test.startTest();
        // Call the method to be tested
        Contact updatedContact = CreditFormController.updateContactRecord(
            testContact.Email, updatedDate, conId, testAccount.Id, lastName, firstName, title, phoneNumber
        );
        Test.stopTest();
        
        // Verify the updated contact fields
        System.assertEquals(updatedDate, updatedContact.Updated_Date__c);
        System.assertEquals(lastName, updatedContact.LastName);
        System.assertEquals(firstName, updatedContact.FirstName);
        System.assertEquals(title, updatedContact.Title);
        System.assertEquals(phoneNumber, updatedContact.Phone);
        // Verify that the AccountId is not changed
        System.assertEquals(testAccount.Id, updatedContact.AccountId);
    }
    
    @isTest
    static void testUpdateContactRecordNew() {
        // Test data
        Contact con =new Contact();
        con.LastName = 'Test';
        insert con;
        Date updatedDate = Date.today();
        String conId = con.Id; // Replace with valid Contact Id
        String lastName = 'TestLastName';
        String firstName = 'TestFirstName';
        String title = 'TestTitle';
        String phoneNumber = '1234567890';
        
        // Start test execution
        Test.startTest();
        // Call the method
        Contact updatedContact = CreditFormController.updateContactRecordNew(updatedDate, conId, lastName, firstName, title, phoneNumber);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, updatedContact, 'Updated contact should not be null');
        System.assertEquals(updatedDate, updatedContact.Updated_Date__c, 'Updated date should be set correctly');
        System.assertEquals(lastName, updatedContact.LastName, 'Last name should be set correctly');
        System.assertEquals(firstName, updatedContact.FirstName, 'First name should be set correctly');
        System.assertEquals(title, updatedContact.Title, 'Title should be set correctly');
        System.assertEquals(phoneNumber, updatedContact.Phone, 'Phone number should be set correctly');
        // Add more assertions as needed
    }
    @isTest
    static void testGetAccountInfo() {
        // Test data
        String accountDomain = 'example.com';
        String logInEmail = 'test@example.com';
        
        // Create test records
        Account testAccount = new Account(
            Account_Domain__c = accountDomain,
            Name = 'Test Account'
            // Add other required fields
        );
        insert testAccount;
        
        Contact testContact = new Contact(
            Email = logInEmail,
            AccountId = testAccount.Id,
            LastName = 'Test'
            // Add other required fields
        );
        insert testContact;
        
        // Start test execution
        Test.startTest();
        // Call the method
        List<Account> returnedAccounts = CreditFormController.getAccountInfo(accountDomain, logInEmail);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedAccounts, 'Returned account list should not be null');
        
    }    @isTest
    static void testGetAccountInfoFromCreditId() {
        String accountDomain = 'example.com';
        Account testAccount = new Account(
            Account_Domain__c = accountDomain,
            Name = 'Test Account'
            // Add other required fields
        );
        insert testAccount;
        Credit__c testCredit = new Credit__c(
            Account_Id__c = testAccount.Id // Replace with a valid Account Id
            // Add other required fields
        );
        insert testCredit;
        
        // Start test execution
        Test.startTest();
        // Call the method
        List<Account> returnedAccounts = CreditFormController.getAccountInfoFromCreditId(testCredit.Id);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedAccounts, 'Returned account list should not be null');
    }
    
    @isTest
    static void testGetCreditInfo() {
        // Test data
        Credit__c testCredit = new Credit__c(
            Bank_Name__c = 'Test'
        );
        insert testCredit;
        
        // Start test execution
        Test.startTest();
        // Call the method 
        Credit__c returnedCredit = CreditFormController.getCreditInfo(testCredit.Id);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedCredit, 'Returned credit record should not be null');
        // Add more specific assertions based on the fields you expect to be queried and returned
    }
    
    @isTest
    static void testGetCreditInfoForExisting() {
        // Test data
        String testContactEmail = 'test@example.com';
        Contact testContact = new Contact(
            Email = testContactEmail,
            LastName = 'Test'
        );
        insert testContact;
        
        // Start test execution
        Test.startTest();
        // Call the method
        List<Credit__c> returnedCreditList = CreditFormController.getCreditInfoForExisting(testContactEmail);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedCreditList, 'Returned credit list should not be null');
        // Add more specific assertions based on the expected behavior of the method
        // For example, you can check if the returned list contains the expected Credit records
    }
    @isTest
    static void testGetContactId() {
        // Test data
        String testLoginEmail = 'test@example.com';
        Contact testContact = new Contact(
            Email = testLoginEmail,
            LastName = 'Test'
        );
        insert testContact;
        
        // Start test execution
        Test.startTest();
        // Call the method
        Id returnedContactId = CreditFormController.getContactId(testLoginEmail);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedContactId, 'Returned Contact Id should not be null');
        // Add more specific assertions based on the expected behavior of the method
    }
    
    @isTest
    static void testGetContactByEmail() {
        // Test data
        String testEmail = 'test@example.com';
        Contact testContact = new Contact(
            Email = testEmail,
            LastName = 'Test'
        );
        insert testContact;
        
        // Start test execution
        Test.startTest();
        // Call the method
        Contact returnedContact = CreditFormController.getContactByEmail(testEmail);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedContact, 'Returned Contact should not be null');
        // Add more specific assertions based on the expected behavior of the method
    }
    
    @isTest
    static void testGetContactByCreditId() {
        // Test data
        String testEmail = 'test@example.com';
        Contact testContact = new Contact(
            Email = testEmail,
            LastName = 'Test'
        );
        insert testContact;
        Credit__c testCredit = new Credit__c(
            Contact_Id__c = testContact.Id
            // Add other required fields for the Credit__c record if needed
        );
        insert testCredit;
        
        // Start test execution
        Test.startTest();
        // Call the method
        Contact returnedContact = CreditFormController.getContactByCreditId(testCredit.Id);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedContact, 'Returned Contact should not be null');
        // Add more specific assertions based on the expected behavior of the method
    }
    
//     @isTest
//     static void testGetAccountStatus() {
//           // Test data setup
//     Account testAccount = new Account(
//         Status__c = 'In Progress',
//         Name = 'Test'
//     );
//     insert testAccount;
    
//     // Start test execution
//     Test.startTest();
//     // Call the method
//     Account returnedAccount = CreditFormController.getAccountStatus(testAccount.Id, 'In Progress');
//     Test.stopTest();
    
//     // Assertions
//    System.assertEquals(null, returnedAccount, 'Returned Account should not be null');
//    // System.assertEquals('In Progress', returnedAccount.Status__c, 'Account status should be updated to the specified value');
    
//     // Verify that the Account status has been updated in the database
//     List<Account> updatedAccounts = [SELECT Status__c FROM Account WHERE Id = :testAccount.Id];
//     System.assertNotEquals(0, updatedAccounts.size(), 'No Account record found for update');
//     }
    
    @isTest
    static void testGetCreditRecords() {
        // Test data
        String testContactEmail = 'test@example.com';
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        Contact testContact = new Contact(Email = testContactEmail, LastName = 'Test',AccountId = testAccount.Id);
        insert testContact;
        Credit__c testCredit = new Credit__c();
        testCredit.Account_Id__c = testAccount.Id;
        testCredit.Contact_Id__c = testContact.Id;
        insert testCredit;
        
        // Start test execution
        Test.startTest();
        // Call the method
        List<Credit__c> returnedCreditList = CreditFormController.getCreditRecords(testContactEmail);
        Test.stopTest();
        
        // Assertions
        System.assertNotEquals(null, returnedCreditList, 'Returned Credit List should not be null');
        System.assertEquals(1, returnedCreditList.size(), 'Expected only one Credit record');
        
        Credit__c returnedCredit = returnedCreditList[0];
        System.assertEquals(testCredit.Account_Id__c, returnedCredit.Account_Id__c, 'Account Id (Custom Field) should match');
        System.assertEquals(testCredit.Contact_Id__c, returnedCredit.Contact_Id__c, 'Contact Id should match');
    }
    @isTest
    static void testGetCreditStatus() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Status__c = 'In Progress');
        insert testCredit;
        
        // Call the method
        Test.startTest();
        String returnedStatus = CreditFormController.getCreditStatus(testCredit.Id);
        Test.stopTest();
        
        // Assertion
        System.assertEquals('In Progress', returnedStatus, 'Returned credit status should match');
    }
    
    @isTest
    static void testChangeCreditStatus() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Status__c = 'In Progress');
        insert testCredit;
        
        // Call the method
        Test.startTest();
        String updatedStatus = CreditFormController.changeCreditStatus(testCredit.Id);
        Test.stopTest();
        
        // Retrieve the updated record
        Credit__c updatedCredit = [SELECT Id, Status__c FROM Credit__c WHERE Id = :testCredit.Id LIMIT 1];
        
        // Assertion
        System.assertEquals('Rejected', updatedStatus, 'Returned updated status should be "Rejected"');
        System.assertEquals('Rejected', updatedCredit.Status__c, 'Credit status should be "Rejected" after change');
    }
    
    @isTest
    static void testUpdateCreditStatus() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Status__c = 'In Progress', Applicant_Signature__c = 'Test Sign');
        insert testCredit;
        System.debug('Credit Id 403 => ' +testCredit.Id);
        // Call the method
        Test.startTest();
        Credit__c updatedCredit = CreditFormController.updateCreditStatus(testCredit.Id, 'Approved', 'Test Signature');
        Test.stopTest();
        
        // Assertion
        System.assertEquals('Approved', updatedCredit.Status__c, 'Credit status should be updated to "Approved"');
        System.assertEquals('Test Signature', updatedCredit.Applicant_Signature__c, 'Signature should be updated');
    }
    
    @isTest
    static void testUpdateCreditStatusForApprover() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Status__c = 'In Progress', Approver_Comment__c = 'Test Comment',Approved_Credit_Amount__c = 10000);
        insert testCredit;
        
        // Call the method
        Test.startTest();
        Credit__c updatedCredit = CreditFormController.updateCreditStatusForApprover(testCredit.Id, 'Test Comment', 'In Progress',100000);
        Test.stopTest();
        
        // Assertion
        // System.assertEquals('Approved', updatedCredit.Status__c, 'Credit status should be updated to "Approved"');
        System.assertEquals('Test Comment', updatedCredit.Approver_Comment__c, 'Approver comment should be updated');
    }
    
    @isTest
    static void testUpdateCreditApprovalEmailForApprover() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Status__c = 'In Progress');
        insert testCredit;
        
        // Call the method
        Test.startTest();
        Credit__c updatedCredit = CreditFormController.updateCreditApprovalEmailForApprover(testCredit.Id, 'test@example.com');
        Test.stopTest();
        
        // Assertion
        System.assertEquals('test@example.com', updatedCredit.Approver_Email__c, 'Approver email should be updated');
    }
    
    @isTest
    static void testSaveSignature() {
        // Test data setup
        Credit__c testCredit = new Credit__c();
        insert testCredit;
        
        // Call the method
        Test.startTest();
        List<Credit__c> updatedCredits = CreditFormController.saveSignature(testCredit.Id, 'Test Signature');
        Test.stopTest();
        
        // Retrieve the updated record
        Credit__c updatedCredit = [SELECT Id, Applicant_Signature__c FROM Credit__c WHERE Id = :testCredit.Id LIMIT 1];
        
        // Assertion
        System.assertEquals('Test Signature', updatedCredit.Applicant_Signature__c, 'Signature should be saved');
    }
    
    @isTest
    static void testGetCreditSignature() {
        // Test data setup
        Credit__c testCredit = new Credit__c(Applicant_Signature__c = 'Test Signature');
        insert testCredit;
        
        // Call the method
        Test.startTest();
        Credit__c retrievedCredit = CreditFormController.getCreditSignature(testCredit.Id);
        Test.stopTest();
        
        // Assertion
        System.assertEquals('Test Signature', retrievedCredit.Applicant_Signature__c, 'Retrieved signature should match');
    }
    @isTest
    static void testReparentFileAttachment_NoContentDocumentLink() {
        // Test data setup
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
        
        ContentVersion testContentVersion = new ContentVersion(
            Title = 'Test Document',
            PathOnClient = 'test.txt',
            VersionData = Blob.valueOf('Test content')
        );
        insert testContentVersion;
        
        // Call the method
        Test.startTest();
        try {
            CreditFormController.reparentFileAttachment(testContentVersion.ContentDocumentId, testAccount.Id);
        } catch (Exception e) {
            System.assert(e.getMessage().contains('List has no rows for assignment to SObject'), 'Exception message should indicate no ContentDocumentLink records');
        }
        Test.stopTest();
    }
    
}