@isTest
public class QuotePDFController1Test {
    @isTest
    public static void testSavePDF() {
        // Create a test Opportunity record
        Opportunity opportunity = new Opportunity(Name = 'Test Opportunity', StageName = 'Closed Won', CloseDate = Date.today());
        insert opportunity;
        
        Product2 product = new Product2(Name = 'Test Product');
        insert product;
        
        // Create test data: Quote and related QuoteLineItems
        
        
        Id StandardPBId = Test.getStandardPricebookId();
        
        PricebookEntry pricebookEntry = new PricebookEntry();
	    pricebookEntry.pricebook2Id = StandardPBId;
	    pricebookEntry.product2id = product.id;
	    pricebookEntry.unitprice = 1249.0;
	    pricebookEntry.isactive = true;
	    insert pricebookEntry;
        
        Quote testQuote = new Quote(
            Name = 'Test Quote',
            OpportunityId = opportunity.Id,
            Pricebook2Id = StandardPBId
        );
        insert testQuote;
        
        // Create QuoteLineItems related to the Quote
        QuoteLineItem testQuoteLineItem = new QuoteLineItem(
            QuoteId = testQuote.Id,
            PricebookEntryId = pricebookEntry.Id, 
            Quantity = 1,
            UnitPrice = 10,
            Product2Id = product.Id
        );
        insert testQuoteLineItem;
        
        Test.startTest();
        PageReference pageRef = Page.QuotePDF; 
        Test.setCurrentPage(pageRef);
        ApexPages.StandardController stdController = new ApexPages.StandardController(testQuote);
        //QuotePDFController1.QuotePDFController1(stdController);
        QuotePDFController1 controller = new QuotePDFController1(stdController);
        QuotePDFController1.savePDF(testQuote.Id);
        Test.stopTest();
    }
}