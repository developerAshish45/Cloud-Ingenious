@isTest
public class LeadConvertControllerTest {

    @isTest
    static void testLeadConvert() {
        // Create test data, e.g., a Lead with related Tasks
        Lead testLead = new Lead(FirstName = 'Test', LastName = 'Lead',Status = 'New', Company = 'Test Company', Email = 'test@email.com',Project_Name__c='Test Project',Product_Interest__c='Mini Room Controlled Temperature Chambers');
        insert testLead;
        
        Account testAccount = new Account(Name='Test Company',Active__c=true);
        insert testAccount;
        
        Contact testContact = new Contact(LastName = 'Test Contact',Email ='test@email.com');
        insert testContact;
        
        Product2 testProduct = new Product2(Name='Test Product', ProductCode='Mini Room Controlled Temperature Chambers');
        insert testProduct;
        
        Id pricebookId = Test.getStandardPricebookId();
        Pricebook2 standardPricebook = new Pricebook2(    Id = pricebookId,    IsActive = true);
        update standardPricebook;

        PricebookEntry pricebookEntry = new PricebookEntry(Pricebook2Id=standardPricebook.Id ,UnitPrice = 10,product2Id=testProduct.Id,isActive=True);
        insert pricebookEntry;
        
		Opportunity testOpportunity = new Opportunity(
            Name = 'Test Opportunity',
            StageName = 'Prospecting',
            CloseDate = Date.today() + 30, // Set close date to 30 days from today
            AccountId = testAccount.Id
            // Add any other required fields for the Opportunity
        );
        insert testOpportunity;
        
        Quote testQuote = new Quote(OpportunityId=testOpportunity.Id , Pricebook2Id= pricebookId,Name=testLead.Company,Email=testLead.Email);
        insert testQuote;
        
        Task testTask = new Task(WhoId = testLead.Id, Status = 'Completed');
        insert testTask;

        // Call the leadConvert method
        String result = LeadConvertController.leadConvert(testLead.Id);
 			//System.assertEquals('Success', result);
    }
    
     @isTest
    static void testLeadConvertFail() {
        // Create test data, e.g., a Lead with related Tasks
        Lead testLead = new Lead(FirstName = 'Test', LastName = 'Lead',Status = 'New', Company = 'Test Company', Email = 'test@email.com',Project_Name__c='Test Project',Product_Interest__c='Mini Room Controlled Temperature Chambers');
        insert testLead;
        
        Account testAccount = new Account(Name='Test Company',Active__c=true);
        insert testAccount;
        
        Contact testContact = new Contact(LastName = 'Test Contact',Email ='test@email.com');
        insert testContact;
        
        Product2 testProduct = new Product2(Name='Test Product', ProductCode='Mini Room Controlled Temperature Chambers');
        insert testProduct;
        
        Id pricebookId = Test.getStandardPricebookId();
        Pricebook2 standardPricebook = new Pricebook2(    Id = pricebookId,    IsActive = true);
        update standardPricebook;
        
        PricebookEntry pricebookEntry = new PricebookEntry(Pricebook2Id = standardPricebook.Id,UnitPrice = 10,product2Id = testProduct.Id, isActive=True);
        insert pricebookEntry;

        Task testTask = new Task(WhoId = testLead.Id, Status = 'Open');
        insert testTask;

        // Call the leadConvert method
        String result = LeadConvertController.leadConvert(testLead.Id);
		System.assertEquals('Please complete all task', result);
    }
}