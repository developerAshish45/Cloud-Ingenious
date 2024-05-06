@isTest
public class DealerPortalControllerTest {
    @isTest
    static void testGetAllCases() {
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            Email = 'test.contact@example.com'
        );
        insert testContact;
        
        Account testAccount = new Account(
            Name = 'Test Account'
        );
        insert testAccount;
        
        testContact.AccountId = testAccount.Id;
        update testContact;
        List<Case> cases = DealerPortalController.getAllCases(testContact.Id);
        System.assertNotEquals(null, cases, 'List of cases should not be null');
        System.assertEquals(0, cases.size(), 'Number of cases should be 0');
    }
    
    @isTest
    static void testDoLogin() {
        String testUsername = 'test@example.com';
        String testPassword = 'testPassword';
        String testUsernameNew = 'test1@example.com';
        String testPasswordNew = 'testPassword1';
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'User',
            Email = 'test@example.com',
            Password__c = 'testPassword'
        );
        insert testContact;
            Dealer_Login_Session__c testNewContact = new Dealer_Login_Session__c(
            IsLoggedIn__c = true,
            Contact__c = testContact.id,
            User_Email__c = testContact.Email
        );

        insert testNewContact;


        
        Test.startTest();
        Contact loggedInContactNew = DealerPortalController.doLogin(testUsernameNew, testPasswordNew);
        Contact loggedInContact = DealerPortalController.doLogin(testUsername, testPassword);
        Test.stopTest();
        System.assertNotEquals(null, loggedInContact, 'Logged-in contact should not be null');
        List<Dealer_Login_Session__c> dealerLoginSessions = [SELECT Id, IsLoggedIn__c, Contact__c, User_Email__c FROM Dealer_Login_Session__c WHERE User_Email__c = :testUsername LIMIT 1];
        System.assertEquals(1, dealerLoginSessions.size(), 'Dealer_Login_Session__c record should be created or updated');
        System.assertEquals(true, dealerLoginSessions[0].IsLoggedIn__c, 'IsLoggedIn__c field should be true');
    }
    @isTest
    public static void testCheckLoginStatus(){
        Contact testContact = new Contact(
            FirstName = 'Test',
            LastName = 'Contact',
            Email = 'test.contact@example.com'
        );
        insert testContact;
        
        Dealer_Login_Session__c logInSession = new Dealer_Login_Session__c();
        logInSession.IsLoggedIn__c = true;
        logInSession.Contact__c = testContact.Id;
        insert logInSession;
        Dealer_Login_Session__c logInSessionNew = new Dealer_Login_Session__c();
        logInSessionNew.IsLoggedIn__c = false;
        logInSessionNew.Contact__c = testContact.Id;
        insert logInSessionNew;
        String result = DealerPortalController.checkLoginStatus();
        System.assertNotEquals(null, result, 'Result should not be null');
    }
    
@isTest
    static void testFetchFilteredAccounts_WithSearchKey() {
        // Test when search key is provided
        String searchKey = 'Test';
        List<Account> expectedAccounts = new List<Account>();
        expectedAccounts.add(new Account(Name = 'Test Account 1', Industry = 'Technology', Phone = '123456789'));
        expectedAccounts.add(new Account(Name = 'Test Account 2', Industry = 'Manufacturing', Phone = '987654321'));
        insert expectedAccounts;

        Test.startTest();
        List<Account> fetchedAccounts = DealerPortalController.fetchFilteredAccounts(searchKey);
        Test.stopTest();

        System.assertEquals(expectedAccounts.size(), fetchedAccounts.size(), 'Number of fetched accounts should match the expected');
    }

    @isTest
    static void testFetchFilteredAccounts_WithoutSearchKey() {
        // Test when search key is not provided
        List<Account> expectedAccounts = new List<Account>();
        expectedAccounts.add(new Account(Name = 'Test Account 1', Industry = 'Technology', Phone = '123456789'));
        expectedAccounts.add(new Account(Name = 'Test Account 2', Industry = 'Manufacturing', Phone = '987654321'));
        insert expectedAccounts;

        Test.startTest();
        List<Account> fetchedAccounts = DealerPortalController.fetchFilteredAccounts(null);
        Test.stopTest();

        System.assertEquals(expectedAccounts.size(), fetchedAccounts.size(), 'Number of fetched accounts should match the expected');
    }
    

    @isTest
    static void testWithSearchKey() {
        // Test with a non-blank search key
        String searchKey = 'John';
        List<Contact> contacts = new List<Contact>{
            new Contact(FirstName = 'John', LastName = 'Doe', Phone = '1234567890', Email = 'john.doe@example.com'),
            new Contact(FirstName = 'Jane', LastName = 'Smith', Phone = '9876543210', Email = 'jane.smith@example.com')
        };
        insert contacts;

        Test.startTest();
        List<Contact> result = DealerPortalController.fetchFilteredContacts(searchKey);
        Test.stopTest();

        System.assertEquals(1, result.size(), 'Expected one contact');
        System.assertEquals('John', result[0].FirstName, 'Contact first name should match search key');
    }

    @isTest
    static void testWithoutSearchKey() {
        // Test without a search key
        List<Contact> contacts = new List<Contact>{
            new Contact(FirstName = 'John', LastName = 'Doe', Phone = '1234567890', Email = 'john.doe@example.com'),
            new Contact(FirstName = 'Jane', LastName = 'Smith', Phone = '9876543210', Email = 'jane.smith@example.com')
        };
        insert contacts;

        Test.startTest();
        List<Contact> result = DealerPortalController.fetchFilteredContacts(null);
        Test.stopTest();

        System.assertEquals(2, result.size(), 'Expected all contacts');
    }


    
    @isTest
    static void testUpdateDealerSession() {
        Dealer_Login_Session__c testLoginSession = new Dealer_Login_Session__c(
            IsLoggedIn__c = true
        );
        insert testLoginSession;
        Boolean isExceptionThrown = false;
        Test.startTest();
        try {
            DealerPortalController.updateDealerSession();
        } catch (Exception e) {
            isExceptionThrown = true;
        }
        Test.stopTest();
        Dealer_Login_Session__c updatedLoginSession = [SELECT Id, IsLoggedIn__c FROM Dealer_Login_Session__c WHERE Id = :testLoginSession.Id LIMIT 1];
        System.assertEquals(false, updatedLoginSession.IsLoggedIn__c, 'IsLoggedIn__c should be false');
    }
}