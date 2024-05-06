public with sharing class QuotePDFController1 {
    public Quote quote { get; private set; }
    public List<QuoteLineItem> quoteLineItems { get; private set; }
    public List<QuoteLineItem> accessories { get; private set; }
    public static Decimal totalPrice { get; private set; }
    public QuotePDFController1(ApexPages.StandardController stdController) {
        quote = (Quote)stdController.getRecord();
        quoteLineItems = [SELECT Id,QuoteId,Discount,TotalPrice,Product2.Name,Ship_Weight__c,Sci_Net__c,Temperature__c,WxL__c,Height__c,Floor_Application__c,Cap_Pak_HP__c,Control_Panel__c,Cap_Pak_Model__c,Floor_Finish__c,
							PricebookEntry.product2.Accessory__c, PricebookEntry.Net_Price__c
                          from QuoteLineItem where QuoteId = :quote.Id AND PricebookEntry.product2.Accessory__c = false ];
        totalPrice=0;
        for(quoteLineItem QLI : quoteLineItems){
            if(QLI.TotalPrice!=NULL){
                totalPrice=totalPrice + QLI.TotalPrice;
            }
        }
        
        accessories = [SELECT Id,QuoteId,Discount,TotalPrice,Product2.Name,Ship_Weight__c,Sci_Net__c,Temperature__c,WxL__c,Height__c,Floor_Application__c,Cap_Pak_HP__c,Control_Panel__c,Cap_Pak_Model__c,Floor_Finish__c,
							PricebookEntry.product2.Accessory__c, PricebookEntry.Net_Price__c
                          from QuoteLineItem where QuoteId = :quote.Id AND PricebookEntry.product2.Accessory__c = true];
        for(quoteLineItem acc : accessories){
            if(acc.TotalPrice!=NULL){
                totalPrice=totalPrice + acc.TotalPrice;
            }
        }        
    }
    @AuraEnabled
    public static void savePDF(Id quoteId) {
        PageReference pref = new PageReference('/apex/QuotePDF');
        pref.getParameters().put('Id',quoteId);
        pref.setRedirect(true);
        Blob bdata;
        if(Test.isRunningTest()) { 
          bdata = blob.valueOf('Unit.Test');
        } else {
          bdata=pref.getContent();
        }

        QuoteDocument qd = new QuoteDocument();
        qd.QuoteId = quoteId; 
        qd.Document = bdata;

        insert qd;
        
        system.debug('result--'+qd);
    }
}